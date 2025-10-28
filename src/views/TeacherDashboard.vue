<template>
  <div class="teacher-dashboard">
    <header class="dashboard-header">
      <h1>Teacher Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <div class="dashboard-content">
      <section class="dashboard-section">
        <h2>My Courses</h2>
        
        <div v-if="isLoadingCourses" class="loading">Loading courses...</div>
        <div v-else-if="courses.length === 0" class="empty">No courses assigned</div>
        <div v-else class="courses-grid">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <h3>{{ course.code }} - {{ course.name }}</h3>
            <p>{{ course.description }}</p>
            <p><strong>Credits:</strong> {{ course.credits }}</p>
            <p><strong>Semester:</strong> {{ course.semester }}</p>
            <button @click="viewCourse(course.id)" class="view-btn">View Details</button>
          </div>
        </div>
      </section>

      <section v-if="selectedCourse" class="dashboard-section">
        <h2>Grade Submission - {{ selectedCourse.name }}</h2>
        
        <div v-if="isLoadingStudents" class="loading">Loading students...</div>
        <div v-else-if="courseStudents.length === 0" class="empty">No students enrolled</div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Name</th>
              <th>Score</th>
              <th>Letter Grade</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in courseStudents" :key="student.id">
              <td>{{ student.studentNumber }}</td>
              <td>{{ student.user?.firstName }} {{ student.user?.lastName }}</td>
              <td>
                <input
                  v-model.number="gradeInputs[student.id].score"
                  type="number"
                  min="0"
                  max="100"
                  class="grade-input"
                />
              </td>
              <td>
                <input
                  v-model="gradeInputs[student.id].letterGrade"
                  type="text"
                  class="grade-input"
                  maxlength="2"
                />
              </td>
              <td>
                <input
                  v-model="gradeInputs[student.id].comments"
                  type="text"
                  class="grade-input"
                />
              </td>
              <td>
                <button
                  @click="submitGrade(student.id)"
                  class="submit-btn"
                  :disabled="isSubmittingGrade[student.id]"
                >
                  {{ isSubmittingGrade[student.id] ? 'Submitting...' : 'Submit' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { teachersApi, coursesApi, gradesApi } from '@/api'
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'
import type { Course, Student } from '@/types/models'
import type { CreateGradeRequest } from '@/types/api'

const router = useRouter()
const authStore = useAuthStore()
const { invalidateQueries } = useQueryInvalidation()

const courses = ref<Course[]>([])
const selectedCourse = ref<Course | null>(null)
const courseStudents = ref<Student[]>([])
const isLoadingCourses = ref(false)
const isLoadingStudents = ref(false)
const gradeInputs = reactive<Record<number, { score: number; letterGrade: string; comments: string }>>({})
const isSubmittingGrade = reactive<Record<number, boolean>>({})

async function loadCourses() {
  if (!authStore.user) return
  
  isLoadingCourses.value = true
  try {
    const teacherId = authStore.user.id
    courses.value = await teachersApi.getCourses(teacherId)
  } finally {
    isLoadingCourses.value = false
  }
}

async function viewCourse(courseId: number) {
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return

  selectedCourse.value = course
  isLoadingStudents.value = true
  
  try {
    courseStudents.value = await coursesApi.getStudents(courseId)
    
    courseStudents.value.forEach(student => {
      if (!gradeInputs[student.id]) {
        gradeInputs[student.id] = {
          score: 0,
          letterGrade: '',
          comments: ''
        }
      }
    })
  } finally {
    isLoadingStudents.value = false
  }
}

async function submitGrade(studentId: number) {
  if (!selectedCourse.value) return

  const gradeData: CreateGradeRequest = {
    studentId,
    courseId: selectedCourse.value.id,
    score: gradeInputs[studentId].score,
    letterGrade: gradeInputs[studentId].letterGrade,
    comments: gradeInputs[studentId].comments
  }

  isSubmittingGrade[studentId] = true
  
  try {
    await gradesApi.submitGrade(gradeData)
    invalidateQueries('grades')
    alert('Grade submitted successfully!')
  } finally {
    isSubmittingGrade[studentId] = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.teacher-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #333;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dashboard-section {
  margin-bottom: 3rem;
}

.dashboard-section h2 {
  margin-bottom: 1rem;
  color: #555;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-card h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.course-card p {
  margin-bottom: 0.5rem;
  color: #666;
}

.view-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.grade-input {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  padding: 0.25rem 0.75rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.submit-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: #888;
  background: white;
  border-radius: 4px;
}
</style>
