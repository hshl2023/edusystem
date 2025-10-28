# API Integration Examples

This document provides practical examples of common API integration patterns used in the application.

## Example 1: Admin Creating a Student

```vue
<template>
  <div>
    <button @click="showModal = true">Create Student</button>
    
    <div v-if="showModal" class="modal">
      <form @submit.prevent="handleSubmit">
        <input v-model="form.email" type="email" required />
        <input v-model="form.password" type="password" required />
        <input v-model="form.firstName" type="text" required />
        <input v-model="form.lastName" type="text" required />
        <input v-model="form.studentNumber" type="text" required />
        <input v-model="form.enrollmentDate" type="date" required />
        
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating...' : 'Create' }}
        </button>
      </form>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { studentsApi } from '@/api'
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'
import type { CreateStudentRequest } from '@/types/api'

const { invalidateQueries } = useQueryInvalidation()

const showModal = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const form = ref<CreateStudentRequest>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  studentNumber: '',
  enrollmentDate: ''
})

async function handleSubmit() {
  try {
    isSubmitting.value = true
    error.value = ''
    
    // Create the student
    const newStudent = await studentsApi.create(form.value)
    
    // Invalidate cached student queries so other components refetch
    invalidateQueries('students')
    
    // Show success message
    alert(`Student ${newStudent.user?.firstName} created successfully!`)
    
    // Close modal and reset form
    showModal.value = false
    form.value = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      studentNumber: '',
      enrollmentDate: ''
    }
  } catch (err: any) {
    // Global interceptor already showed error alert
    // But we can add custom handling here
    if (err.response?.status === 409) {
      error.value = 'A student with this email already exists'
    } else if (err.response?.status === 422) {
      error.value = 'Please check all fields are valid'
    } else {
      error.value = 'Failed to create student'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

## Example 2: Teacher Submitting Grades

```vue
<template>
  <div>
    <h2>Grade Submission - {{ course.name }}</h2>
    
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Score</th>
          <th>Grade</th>
          <th>Comments</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.user?.firstName }} {{ student.user?.lastName }}</td>
          <td>
            <input v-model.number="grades[student.id].score" type="number" />
          </td>
          <td>
            <input v-model="grades[student.id].letterGrade" type="text" />
          </td>
          <td>
            <input v-model="grades[student.id].comments" type="text" />
          </td>
          <td>
            <button
              @click="submitGrade(student.id)"
              :disabled="isSubmitting[student.id]"
            >
              Submit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { gradesApi, coursesApi } from '@/api'
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'
import type { Course, Student } from '@/types/models'
import type { CreateGradeRequest } from '@/types/api'

interface Props {
  courseId: number
}

const props = defineProps<Props>()
const { invalidateQueries } = useQueryInvalidation()

const course = ref<Course | null>(null)
const students = ref<Student[]>([])
const grades = reactive<Record<number, { score: number; letterGrade: string; comments: string }>>({})
const isSubmitting = reactive<Record<number, boolean>>({})

async function loadData() {
  course.value = await coursesApi.getById(props.courseId)
  students.value = await coursesApi.getStudents(props.courseId)
  
  // Initialize grade inputs
  students.value.forEach(student => {
    grades[student.id] = {
      score: 0,
      letterGrade: '',
      comments: ''
    }
  })
}

async function submitGrade(studentId: number) {
  try {
    isSubmitting[studentId] = true
    
    const gradeData: CreateGradeRequest = {
      studentId,
      courseId: props.courseId,
      score: grades[studentId].score,
      letterGrade: grades[studentId].letterGrade,
      comments: grades[studentId].comments
    }
    
    await gradesApi.submitGrade(gradeData)
    
    // Invalidate grade queries
    invalidateQueries('grades')
    invalidateQueries(`students/${studentId}/grades`)
    
    alert('Grade submitted successfully!')
  } finally {
    isSubmitting[studentId] = false
  }
}

onMounted(() => {
  loadData()
})
</script>
```

## Example 3: Student Viewing Data with Loading States

```vue
<template>
  <div>
    <h2>My Grades</h2>
    
    <div v-if="isLoading" class="loading">
      <LoadingSpinner />
      <p>Loading your grades...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>Failed to load grades: {{ error.message }}</p>
      <button @click="refetch">Retry</button>
    </div>
    
    <div v-else-if="grades.length === 0" class="empty">
      <p>No grades available yet</p>
    </div>
    
    <table v-else>
      <thead>
        <tr>
          <th>Course</th>
          <th>Score</th>
          <th>Grade</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in grades" :key="grade.id">
          <td>{{ grade.course?.code }} - {{ grade.course?.name }}</td>
          <td>{{ grade.score }}/100</td>
          <td>{{ grade.letterGrade }}</td>
          <td>{{ formatDate(grade.submittedAt) }}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="summary">
      <p><strong>Average Score:</strong> {{ averageScore.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { studentsApi } from '@/api'
import { useApi } from '@/composables/useApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()

const {
  data: grades,
  error,
  isLoading,
  execute: refetch
} = useApi(
  () => studentsApi.getGrades(authStore.user!.id),
  {
    loadingTaskId: 'fetch-student-grades',
    immediate: true
  }
)

const averageScore = computed(() => {
  if (!grades.value || grades.value.length === 0) return 0
  const sum = grades.value.reduce((acc, grade) => acc + grade.score, 0)
  return sum / grades.value.length
})

function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}
</script>
```

## Example 4: Optimistic Update for Course Assignment

```vue
<template>
  <div>
    <h3>{{ course.name }}</h3>
    <p>Teacher: {{ course.teacher?.user?.firstName || 'Unassigned' }}</p>
    
    <select v-model="selectedTeacherId" @change="assignTeacher">
      <option :value="null">Select Teacher</option>
      <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
        {{ teacher.user?.firstName }} {{ teacher.user?.lastName }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { coursesApi, teachersApi } from '@/api'
import { useOptimistic } from '@/composables/useOptimistic'
import type { Course, Teacher } from '@/types/models'

interface Props {
  initialCourse: Course
}

const props = defineProps<Props>()
const teachers = ref<Teacher[]>([])
const selectedTeacherId = ref<number | null>(props.initialCourse.teacherId || null)

const { data: course, optimisticUpdate } = useOptimistic(props.initialCourse)

async function assignTeacher() {
  if (!selectedTeacherId.value) return
  
  const selectedTeacher = teachers.value.find(t => t.id === selectedTeacherId.value)
  if (!selectedTeacher) return
  
  // Optimistically update UI
  const updatedCourse = {
    ...course.value,
    teacherId: selectedTeacherId.value,
    teacher: selectedTeacher
  }
  
  optimisticUpdate(
    updatedCourse,
    () => coursesApi.assignTeacher(course.value.id, selectedTeacherId.value!),
    {
      onSuccess: () => {
        alert('Teacher assigned successfully!')
      },
      onError: (error, rollbackData) => {
        console.error('Failed to assign teacher:', error)
        // UI automatically shows rollbackData (previous teacher)
        selectedTeacherId.value = rollbackData.teacherId || null
      }
    }
  )
}

async function loadTeachers() {
  const response = await teachersApi.getAll({ pageSize: 100 })
  teachers.value = response.data
}

onMounted(() => {
  loadTeachers()
})
</script>
```

## Example 5: Search with Debouncing

```vue
<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search students..."
      @input="handleSearch"
    />
    
    <div v-if="isSearching" class="loading">Searching...</div>
    
    <ul v-else>
      <li v-for="student in searchResults" :key="student.id">
        {{ student.user?.firstName }} {{ student.user?.lastName }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { studentsApi } from '@/api'
import type { Student } from '@/types/models'

const searchQuery = ref('')
const searchResults = ref<Student[]>([])
const isSearching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

function handleSearch() {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Debounce search by 300ms
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = []
      return
    }
    
    try {
      isSearching.value = true
      const response = await studentsApi.getAll({
        search: searchQuery.value,
        pageSize: 10
      })
      searchResults.value = response.data
    } finally {
      isSearching.value = false
    }
  }, 300)
}
</script>
```

## Example 6: Bulk Operations

```vue
<template>
  <div>
    <h2>Bulk Grade Submission</h2>
    
    <div>
      <label>
        <input type="checkbox" @change="toggleSelectAll" />
        Select All
      </label>
    </div>
    
    <div v-for="student in students" :key="student.id">
      <label>
        <input
          type="checkbox"
          v-model="selectedStudents"
          :value="student.id"
        />
        {{ student.user?.firstName }} {{ student.user?.lastName }}
      </label>
      <input v-model.number="grades[student.id].score" type="number" />
      <input v-model="grades[student.id].letterGrade" type="text" />
    </div>
    
    <button
      @click="submitBulkGrades"
      :disabled="selectedStudents.length === 0 || isSubmitting"
    >
      Submit {{ selectedStudents.length }} Grades
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { gradesApi } from '@/api'
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'
import type { Student } from '@/types/models'
import type { CreateGradeRequest } from '@/types/api'

interface Props {
  courseId: number
  students: Student[]
}

const props = defineProps<Props>()
const { invalidateQueries } = useQueryInvalidation()

const selectedStudents = ref<number[]>([])
const grades = reactive<Record<number, { score: number; letterGrade: string }>>({})
const isSubmitting = ref(false)

// Initialize grades
props.students.forEach(student => {
  grades[student.id] = { score: 0, letterGrade: '' }
})

function toggleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedStudents.value = props.students.map(s => s.id)
  } else {
    selectedStudents.value = []
  }
}

async function submitBulkGrades() {
  try {
    isSubmitting.value = true
    
    const gradeSubmissions: CreateGradeRequest[] = selectedStudents.value.map(studentId => ({
      studentId,
      courseId: props.courseId,
      score: grades[studentId].score,
      letterGrade: grades[studentId].letterGrade
    }))
    
    await gradesApi.bulkSubmit(gradeSubmissions)
    
    invalidateQueries('grades')
    
    alert(`${gradeSubmissions.length} grades submitted successfully!`)
    selectedStudents.value = []
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

## Example 7: Error Handling with Retry

```vue
<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    
    <div v-else-if="error" class="error-container">
      <h3>Failed to load data</h3>
      <p>{{ error.message }}</p>
      
      <div v-if="retryCount < maxRetries">
        <p>Retrying in {{ countdown }} seconds...</p>
        <button @click="cancelRetry">Cancel</button>
      </div>
      
      <div v-else>
        <p>Maximum retry attempts reached</p>
        <button @click="manualRetry">Try Again</button>
      </div>
    </div>
    
    <div v-else>
      <!-- Display data -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { studentsApi } from '@/api'

const isLoading = ref(false)
const error = ref<Error | null>(null)
const retryCount = ref(0)
const maxRetries = 3
const countdown = ref(5)
let retryTimeout: ReturnType<typeof setTimeout> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null

async function loadData(isRetry = false) {
  try {
    isLoading.value = true
    error.value = null
    
    const data = await studentsApi.getAll()
    // Process data
    
    // Reset retry count on success
    retryCount.value = 0
  } catch (err: any) {
    error.value = err
    
    if (isRetry) {
      retryCount.value++
    }
    
    // Auto-retry if under max retries
    if (retryCount.value < maxRetries) {
      scheduleRetry()
    }
  } finally {
    isLoading.value = false
  }
}

function scheduleRetry() {
  countdown.value = 5
  
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownInterval) {
      clearInterval(countdownInterval)
    }
  }, 1000)
  
  retryTimeout = setTimeout(() => {
    loadData(true)
  }, 5000)
}

function cancelRetry() {
  if (retryTimeout) {
    clearTimeout(retryTimeout)
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  retryCount.value = maxRetries
}

function manualRetry() {
  retryCount.value = 0
  loadData()
}

onUnmounted(() => {
  if (retryTimeout) {
    clearTimeout(retryTimeout)
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

onMounted(() => {
  loadData()
})
</script>
```

## Example 8: Infinite Scroll Pagination

```vue
<template>
  <div>
    <div v-for="student in allStudents" :key="student.id">
      {{ student.user?.firstName }} {{ student.user?.lastName }}
    </div>
    
    <div ref="sentinel" class="sentinel"></div>
    
    <div v-if="isLoading">Loading more...</div>
    <div v-if="hasMore === false">No more students</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { studentsApi } from '@/api'
import type { Student } from '@/types/models'

const allStudents = ref<Student[]>([])
const page = ref(1)
const pageSize = 20
const isLoading = ref(false)
const hasMore = ref(true)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadMore() {
  if (isLoading.value || !hasMore.value) return
  
  try {
    isLoading.value = true
    
    const response = await studentsApi.getAll({
      page: page.value,
      pageSize
    })
    
    allStudents.value.push(...response.data)
    
    hasMore.value = page.value < response.pagination.totalPages
    page.value++
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Load first page
  loadMore()
  
  // Setup intersection observer
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    },
    { threshold: 0.5 }
  )
  
  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.sentinel {
  height: 20px;
}
</style>
```

## Summary

These examples demonstrate:

1. ✅ Basic CRUD operations
2. ✅ Loading state management
3. ✅ Error handling and retry logic
4. ✅ Optimistic updates
5. ✅ Query invalidation
6. ✅ Search with debouncing
7. ✅ Bulk operations
8. ✅ Infinite scroll pagination

All examples follow the established patterns and use the centralized API layer for consistency and maintainability.
