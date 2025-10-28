import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
  QueryParams
} from '@/types/api'
import type { Student, Course, Grade } from '@/types/models'

export const studentsApi = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Student>> {
    const response = await apiClient.get<PaginatedResponse<Student>>(
      '/students',
      { params }
    )
    return response.data
  },

  async getById(id: number): Promise<Student> {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`)
    return response.data.data
  },

  async create(data: CreateStudentRequest): Promise<Student> {
    const response = await apiClient.post<ApiResponse<Student>>('/students', data)
    return response.data.data
  },

  async update(id: number, data: UpdateStudentRequest): Promise<Student> {
    const response = await apiClient.put<ApiResponse<Student>>(
      `/students/${id}`,
      data
    )
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/students/${id}`)
  },

  async getCourses(studentId: number): Promise<Course[]> {
    const response = await apiClient.get<ApiResponse<Course[]>>(
      `/students/${studentId}/courses`
    )
    return response.data.data
  },

  async getGrades(studentId: number): Promise<Grade[]> {
    const response = await apiClient.get<ApiResponse<Grade[]>>(
      `/students/${studentId}/grades`
    )
    return response.data.data
  },

  async enrollCourse(studentId: number, courseId: number): Promise<void> {
    await apiClient.post(`/students/${studentId}/courses/${courseId}/enroll`)
  },

  async withdrawCourse(studentId: number, courseId: number): Promise<void> {
    await apiClient.post(`/students/${studentId}/courses/${courseId}/withdraw`)
  }
}
