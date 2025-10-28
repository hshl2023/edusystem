<template>
  <div class="student-dashboard">
    <header class="dashboard-header">
      <h1>Student Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <div class="dashboard-content">
      <section class="dashboard-section">
        <h2>My Profile</h2>
        <div v-if="authStore.user" class="profile-card">
          <p><strong>Name:</strong> {{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
          <p><strong>Email:</strong> {{ authStore.user.email }}</p>
          <p><strong>Role:</strong> {{ authStore.user.role }}</p>
        </div>
      </section>

      <section class="dashboard-section">
        <h2>My Courses</h2>
        
        <div v-if="isLoadingCourses" class="loading">Loading courses...</div>
        <div v-else-if="courses.length === 0" class="empty">No courses enrolled</div>
        <div v-else class="courses-grid">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <h3>{{ course.code }} - {{ course.name }}</h3>
            <p>{{ course.description }}</p>
            <p><strong>Credits:</strong> {{ course.credits }}</p>
            <p><strong>Teacher:</strong> {{ course.teacher?.user?.firstName }} {{ course.teacher?.user?.lastName }}</p>
            <p><strong>Semester:</strong> {{ course.semester }}</p>
          </div>
        </div>
      </section>

      <section class="dashboard-section">
        <h2>My Grades</h2>
        
        <div v-if="isLoadingGrades" class="loading">Loading grades...</div>
        <div v-else-if="grades.length === 0" class="empty">No grades available</div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Score</th>
              <th>Letter Grade</th>
              <th>Comments</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in grades" :key="grade.id">
              <td>{{ grade.course?.code }}</td>
              <td>{{ grade.course?.name }}</td>
              <td>{{ grade.score }}</td>
              <td>{{ grade.letterGrade }}</td>
              <td>{{ grade.comments || '-' }}</td>
              <td>{{ formatDate(grade.submittedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="dashboard-section">
        <h2>Academic Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Courses</h3>
            <p class="summary-value">{{ courses.length }}</p>
          </div>
          <div class="summary-card">
            <h3>Completed Grades</h3>
            <p class="summary-value">{{ grades.length }}</p>
          </div>
          <div class="summary-card">
            <h3>Average Score</h3>
            <p class="summary-value">{{ averageScore.toFixed(2) }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { studentsApi } from '@/api'
import type { Course, Grade } from '@/types/models'

const router = useRouter()
const authStore = useAuthStore()

const courses = ref<Course[]>([])
const grades = ref<Grade[]>([])
const isLoadingCourses = ref(false)
const isLoadingGrades = ref(false)

const averageScore = computed(() => {
  if (grades.value.length === 0) return 0
  const sum = grades.value.reduce((acc, grade) => acc + grade.score, 0)
  return sum / grades.value.length
})

async function loadCourses() {
  if (!authStore.user) return
  
  isLoadingCourses.value = true
  try {
    const studentId = authStore.user.id
    courses.value = await studentsApi.getCourses(studentId)
  } finally {
    isLoadingCourses.value = false
  }
}

async function loadGrades() {
  if (!authStore.user) return
  
  isLoadingGrades.value = true
  try {
    const studentId = authStore.user.id
    grades.value = await studentsApi.getGrades(studentId)
  } finally {
    isLoadingGrades.value = false
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadCourses()
  loadGrades()
})
</script>

<style scoped>
.student-dashboard {
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

.profile-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-card p {
  margin-bottom: 0.5rem;
  color: #666;
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.summary-card h3 {
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
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
