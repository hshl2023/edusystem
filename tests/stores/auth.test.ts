import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'
import type { LoginRequest } from '@/types/api'

vi.mock('@/api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully and store data', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'student' as const,
          firstName: 'John',
          lastName: 'Doe',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        token: 'mock-token',
        refreshToken: 'mock-refresh-token'
      }

      vi.mocked(authApi.login).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await store.login(credentials)

      expect(authApi.login).toHaveBeenCalledWith(credentials)
      expect(store.user).toEqual(mockResponse.user)
      expect(store.token).toBe('mock-token')
      expect(store.refreshToken).toBe('mock-refresh-token')
      expect(store.isAuthenticated).toBe(true)
      expect(store.isStudent).toBe(true)
      expect(result).toEqual(mockResponse)
    })

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials')
      vi.mocked(authApi.login).mockRejectedValue(mockError)

      const store = useAuthStore()
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password'
      }

      await expect(store.login(credentials)).rejects.toThrow('Invalid credentials')
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should logout and clear data', async () => {
      vi.mocked(authApi.logout).mockResolvedValue(undefined)

      const store = useAuthStore()
      store.user = {
        id: 1,
        email: 'test@example.com',
        role: 'student',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
      store.token = 'mock-token'

      await store.logout()

      expect(authApi.logout).toHaveBeenCalled()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should clear data even if API call fails', async () => {
      vi.mocked(authApi.logout).mockRejectedValue(new Error('API error'))

      const store = useAuthStore()
      store.user = {
        id: 1,
        email: 'test@example.com',
        role: 'student',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
      store.token = 'mock-token'

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('role checks', () => {
    it('should correctly identify admin role', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
      store.token = 'mock-token'

      expect(store.isAdmin).toBe(true)
      expect(store.isTeacher).toBe(false)
      expect(store.isStudent).toBe(false)
    })

    it('should correctly identify teacher role', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        email: 'teacher@example.com',
        role: 'teacher',
        firstName: 'Teacher',
        lastName: 'User',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
      store.token = 'mock-token'

      expect(store.isAdmin).toBe(false)
      expect(store.isTeacher).toBe(true)
      expect(store.isStudent).toBe(false)
    })

    it('should correctly identify student role', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        email: 'student@example.com',
        role: 'student',
        firstName: 'Student',
        lastName: 'User',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
      store.token = 'mock-token'

      expect(store.isAdmin).toBe(false)
      expect(store.isTeacher).toBe(false)
      expect(store.isStudent).toBe(true)
    })
  })
})
