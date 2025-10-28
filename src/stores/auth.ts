import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import type { User } from '@/types/models'
import type { LoginRequest } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isStudent = computed(() => user.value?.role === 'student')

  function initializeFromStorage() {
    const storedToken = localStorage.getItem('auth_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      token.value = storedToken
    }
    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        clearStorage()
      }
    }
  }

  function saveToStorage() {
    if (token.value) {
      localStorage.setItem('auth_token', token.value)
    }
    if (refreshToken.value) {
      localStorage.setItem('refresh_token', refreshToken.value)
    }
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function clearStorage() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  async function login(credentials: LoginRequest) {
    try {
      isLoading.value = true
      const response = await authApi.login(credentials)
      
      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refreshToken || null
      
      saveToStorage()
      
      return response
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      isLoading.value = true
      if (token.value) {
        try {
          await authApi.logout()
        } catch (error) {
          console.error('Logout API call failed:', error)
        }
      }
    } finally {
      user.value = null
      token.value = null
      refreshToken.value = null
      clearStorage()
      isLoading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) {
      throw new Error('No token available')
    }

    try {
      isLoading.value = true
      const currentUser = await authApi.getCurrentUser()
      user.value = currentUser
      saveToStorage()
      return currentUser
    } finally {
      isLoading.value = false
    }
  }

  async function refresh() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      isLoading.value = true
      const response = await authApi.refreshToken(refreshToken.value)
      
      user.value = response.user
      token.value = response.token
      refreshToken.value = response.refreshToken || refreshToken.value
      
      saveToStorage()
      
      return response
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    initializeFromStorage,
    login,
    logout,
    fetchCurrentUser,
    refresh
  }
})
