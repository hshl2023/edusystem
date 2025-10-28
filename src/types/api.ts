import type { User, Student, Teacher, Course, Grade, Enrollment } from './models'

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'teacher' | 'student'
}

export interface CreateStudentRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  studentNumber: string
  enrollmentDate: string
}

export interface UpdateStudentRequest {
  firstName?: string
  lastName?: string
  studentNumber?: string
  status?: 'active' | 'inactive' | 'graduated'
}

export interface CreateTeacherRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  employeeNumber: string
  department: string
  hireDate: string
}

export interface UpdateTeacherRequest {
  firstName?: string
  lastName?: string
  employeeNumber?: string
  department?: string
  status?: 'active' | 'inactive'
}

export interface CreateCourseRequest {
  code: string
  name: string
  description: string
  credits: number
  teacherId?: number
  semester: string
  academicYear: string
}

export interface UpdateCourseRequest {
  code?: string
  name?: string
  description?: string
  credits?: number
  teacherId?: number
  semester?: string
  academicYear?: string
  status?: 'active' | 'inactive' | 'completed'
}

export interface CreateGradeRequest {
  studentId: number
  courseId: number
  score: number
  letterGrade: string
  comments?: string
}

export interface UpdateGradeRequest {
  score?: number
  letterGrade?: string
  comments?: string
}

export interface EnrollStudentRequest {
  studentId: number
  courseId: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: any
}
