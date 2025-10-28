import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  QueryParams
} from '@/types/api'
import type { Teacher, Course } from '@/types/models'

export const teachersApi = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Teacher>> {
    const response = await apiClient.get<PaginatedResponse<Teacher>>(
      '/teachers',
      { params }
    )
    return response.data
  },

  async getById(id: number): Promise<Teacher> {
    const response = await apiClient.get<ApiResponse<Teacher>>(`/teachers/${id}`)
    return response.data.data
  },

  async create(data: CreateTeacherRequest): Promise<Teacher> {
    const response = await apiClient.post<ApiResponse<Teacher>>('/teachers', data)
    return response.data.data
  },

  async update(id: number, data: UpdateTeacherRequest): Promise<Teacher> {
    const response = await apiClient.put<ApiResponse<Teacher>>(
      `/teachers/${id}`,
      data
    )
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/teachers/${id}`)
  },

  async getCourses(teacherId: number): Promise<Course[]> {
    const response = await apiClient.get<ApiResponse<Course[]>>(
      `/teachers/${teacherId}/courses`
    )
    return response.data.data
  }
}
