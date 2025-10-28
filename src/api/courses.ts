import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  QueryParams,
  EnrollStudentRequest
} from '@/types/api'
import type { Course, Student, Grade } from '@/types/models'

export const coursesApi = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Course>> {
    const response = await apiClient.get<PaginatedResponse<Course>>(
      '/courses',
      { params }
    )
    return response.data
  },

  async getById(id: number): Promise<Course> {
    const response = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`)
    return response.data.data
  },

  async create(data: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post<ApiResponse<Course>>('/courses', data)
    return response.data.data
  },

  async update(id: number, data: UpdateCourseRequest): Promise<Course> {
    const response = await apiClient.put<ApiResponse<Course>>(
      `/courses/${id}`,
      data
    )
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/courses/${id}`)
  },

  async getStudents(courseId: number): Promise<Student[]> {
    const response = await apiClient.get<ApiResponse<Student[]>>(
      `/courses/${courseId}/students`
    )
    return response.data.data
  },

  async getGrades(courseId: number): Promise<Grade[]> {
    const response = await apiClient.get<ApiResponse<Grade[]>>(
      `/courses/${courseId}/grades`
    )
    return response.data.data
  },

  async enrollStudent(data: EnrollStudentRequest): Promise<void> {
    await apiClient.post('/courses/enroll', data)
  },

  async assignTeacher(courseId: number, teacherId: number): Promise<Course> {
    const response = await apiClient.put<ApiResponse<Course>>(
      `/courses/${courseId}/assign-teacher`,
      { teacherId }
    )
    return response.data.data
  }
}
