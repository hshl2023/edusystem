import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  CreateGradeRequest,
  UpdateGradeRequest,
  QueryParams
} from '@/types/api'
import type { Grade } from '@/types/models'

export const gradesApi = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Grade>> {
    const response = await apiClient.get<PaginatedResponse<Grade>>(
      '/grades',
      { params }
    )
    return response.data
  },

  async getById(id: number): Promise<Grade> {
    const response = await apiClient.get<ApiResponse<Grade>>(`/grades/${id}`)
    return response.data.data
  },

  async create(data: CreateGradeRequest): Promise<Grade> {
    const response = await apiClient.post<ApiResponse<Grade>>('/grades', data)
    return response.data.data
  },

  async update(id: number, data: UpdateGradeRequest): Promise<Grade> {
    const response = await apiClient.put<ApiResponse<Grade>>(
      `/grades/${id}`,
      data
    )
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/grades/${id}`)
  },

  async submitGrade(data: CreateGradeRequest): Promise<Grade> {
    const response = await apiClient.post<ApiResponse<Grade>>(
      '/grades/submit',
      data
    )
    return response.data.data
  },

  async bulkSubmit(grades: CreateGradeRequest[]): Promise<Grade[]> {
    const response = await apiClient.post<ApiResponse<Grade[]>>(
      '/grades/bulk-submit',
      { grades }
    )
    return response.data.data
  }
}
