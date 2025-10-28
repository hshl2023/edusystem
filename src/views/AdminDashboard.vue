<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <div class="dashboard-content">
      <section class="dashboard-section">
        <h2>Students</h2>
        <button @click="showCreateStudent = true" class="create-btn">Create Student</button>
        
        <div v-if="isLoadingStudents" class="loading">Loading students...</div>
        <div v-else-if="students.length === 0" class="empty">No students found</div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.studentNumber }}</td>
              <td>{{ student.user?.firstName }} {{ student.user?.lastName }}</td>
              <td>{{ student.user?.email }}</td>
              <td>{{ student.status }}</td>
              <td>
                <button @click="viewStudent(student.id)" class="action-btn">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="dashboard-section">
        <h2>Courses</h2>
        <button @click="showCreateCourse = true" class="create-btn">Create Course</button>
        
        <div v-if="isLoadingCourses" class="loading">Loading courses...</div>
        <div v-else-if="courses.length === 0" class="empty">No courses found</div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Credits</th>
              <th>Teacher</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id">
              <td>{{ course.code }}</td>
              <td>{{ course.name }}</td>
              <td>{{ course.credits }}</td>
              <td>{{ course.teacher?.user?.firstName }} {{ course.teacher?.user?.lastName }}</td>
              <td>{{ course.status }}</td>
              <td>
                <button @click="viewCourse(course.id)" class="action-btn">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div v-if="showCreateStudent" class="modal">
      <div class="modal-content">
        <h3>Create Student</h3>
        <form @submit.prevent="handleCreateStudent">
          <input v-model="newStudent.email" type="email" placeholder="Email" required />
          <input v-model="newStudent.password" type="password" placeholder="Password" required />
          <input v-model="newStudent.firstName" type="text" placeholder="First Name" required />
          <input v-model="newStudent.lastName" type="text" placeholder="Last Name" required />
          <input v-model="newStudent.studentNumber" type="text" placeholder="Student Number" required />
          <input v-model="newStudent.enrollmentDate" type="date" required />
          <div class="modal-actions">
            <button type="submit" :disabled="isCreatingStudent">Create</button>
            <button type="button" @click="showCreateStudent = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showCreateCourse" class="modal">
      <div class="modal-content">
        <h3>Create Course</h3>
        <form @submit.prevent="handleCreateCourse">
          <input v-model="newCourse.code" type="text" placeholder="Course Code" required />
          <input v-model="newCourse.name" type="text" placeholder="Course Name" required />
          <textarea v-model="newCourse.description" placeholder="Description" required></textarea>
          <input v-model.number="newCourse.credits" type="number" placeholder="Credits" required />
          <input v-model="newCourse.semester" type="text" placeholder="Semester" required />
          <input v-model="newCourse.academicYear" type="text" placeholder="Academic Year" required />
          <div class="modal-actions">
            <button type="submit" :disabled="isCreatingCourse">Create</button>
            <button type="button" @click="showCreateCourse = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { studentsApi, coursesApi } from '@/api'
import { useApi } from '@/composables/useApi'
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'
import type { Student, Course } from '@/types/models'
import type { CreateStudentRequest, CreateCourseRequest } from '@/types/api'

const router = useRouter()
const authStore = useAuthStore()
const { invalidateQueries } = useQueryInvalidation()

const students = ref<Student[]>([])
const courses = ref<Course[]>([])
const isLoadingStudents = ref(false)
const isLoadingCourses = ref(false)
const showCreateStudent = ref(false)
const showCreateCourse = ref(false)
const isCreatingStudent = ref(false)
const isCreatingCourse = ref(false)

const newStudent = ref<CreateStudentRequest>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  studentNumber: '',
  enrollmentDate: ''
})

const newCourse = ref<CreateCourseRequest>({
  code: '',
  name: '',
  description: '',
  credits: 0,
  semester: '',
  academicYear: ''
})

async function loadStudents() {
  isLoadingStudents.value = true
  try {
    const response = await studentsApi.getAll({ page: 1, pageSize: 50 })
    students.value = response.data
  } finally {
    isLoadingStudents.value = false
  }
}

async function loadCourses() {
  isLoadingCourses.value = true
  try {
    const response = await coursesApi.getAll({ page: 1, pageSize: 50 })
    courses.value = response.data
  } finally {
    isLoadingCourses.value = false
  }
}

async function handleCreateStudent() {
  isCreatingStudent.value = true
  try {
    await studentsApi.create(newStudent.value)
    showCreateStudent.value = false
    invalidateQueries('students')
    await loadStudents()
  } finally {
    isCreatingStudent.value = false
  }
}

async function handleCreateCourse() {
  isCreatingCourse.value = true
  try {
    await coursesApi.create(newCourse.value)
    showCreateCourse.value = false
    invalidateQueries('courses')
    await loadCourses()
  } finally {
    isCreatingCourse.value = false
  }
}

function viewStudent(id: number) {
  router.push(`/admin/students/${id}`)
}

function viewCourse(id: number) {
  router.push(`/admin/courses/${id}`)
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadStudents()
  loadCourses()
})
</script>

<style scoped>
.admin-dashboard {
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

.create-btn {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.action-btn {
  padding: 0.25rem 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: #888;
  background: white;
  border-radius: 4px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 400px;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-content textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button[type="submit"] {
  background: #27ae60;
  color: white;
}

.modal-actions button[type="button"] {
  background: #95a5a6;
  color: white;
}
</style>
