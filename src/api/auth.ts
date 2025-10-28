import { apiClient } from './client'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ApiResponse 
} from '@/types/api'
import type { User } from '@/types/models'

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    )
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      '/auth/register',
      data
    )
    return response.data.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data.data
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword
    })
  }
}
