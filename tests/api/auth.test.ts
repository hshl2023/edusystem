import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authApi } from '@/api/auth'
import { apiClient } from '@/api/client'
import type { LoginRequest, RegisterRequest } from '@/types/api'

vi.mock('@/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            user: {
              id: 1,
              email: 'test@example.com',
              role: 'student',
              firstName: 'John',
              lastName: 'Doe',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            },
            token: 'mock-token',
            refreshToken: 'mock-refresh-token'
          }
        }
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await authApi.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse.data.data)
      expect(result.token).toBe('mock-token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials')
      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password'
      }

      await expect(authApi.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            email: 'newuser@example.com',
            role: 'student',
            firstName: 'Jane',
            lastName: 'Smith',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        }
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const registerData: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'student'
      }

      const result = await authApi.register(registerData)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData)
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('getCurrentUser', () => {
    it('should fetch current user', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            email: 'test@example.com',
            role: 'student',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await authApi.getCurrentUser()

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} })

      await authApi.logout()

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout')
    })
  })
})
