import { describe, it, expect, vi, beforeEach } from 'vitest'
import { studentsApi } from '@/api/students'
import { apiClient } from '@/api/client'
import type { CreateStudentRequest, UpdateStudentRequest } from '@/types/api'

vi.mock('@/api/client')

describe('studentsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all students with pagination', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              userId: 1,
              studentNumber: 'STU001',
              enrollmentDate: '2024-01-01',
              status: 'active',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            }
          ],
          pagination: {
            page: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 1
          }
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await studentsApi.getAll({ page: 1, pageSize: 10 })

      expect(apiClient.get).toHaveBeenCalledWith('/students', {
        params: { page: 1, pageSize: 10 }
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('create', () => {
    it('should create a new student', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            userId: 1,
            studentNumber: 'STU001',
            enrollmentDate: '2024-01-01',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        }
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const studentData: CreateStudentRequest = {
        email: 'student@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        studentNumber: 'STU001',
        enrollmentDate: '2024-01-01'
      }

      const result = await studentsApi.create(studentData)

      expect(apiClient.post).toHaveBeenCalledWith('/students', studentData)
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('update', () => {
    it('should update a student', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 1,
            userId: 1,
            studentNumber: 'STU001',
            enrollmentDate: '2024-01-01',
            status: 'inactive',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02'
          }
        }
      }

      vi.mocked(apiClient.put).mockResolvedValue(mockResponse)

      const updateData: UpdateStudentRequest = {
        status: 'inactive'
      }

      const result = await studentsApi.update(1, updateData)

      expect(apiClient.put).toHaveBeenCalledWith('/students/1', updateData)
      expect(result.status).toBe('inactive')
    })
  })

  describe('getCourses', () => {
    it('should fetch courses for a student', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              code: 'CS101',
              name: 'Introduction to Computer Science',
              description: 'Basic CS course',
              credits: 3,
              semester: 'Fall',
              academicYear: '2024',
              status: 'active',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            }
          ]
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await studentsApi.getCourses(1)

      expect(apiClient.get).toHaveBeenCalledWith('/students/1/courses')
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('getGrades', () => {
    it('should fetch grades for a student', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              studentId: 1,
              courseId: 1,
              score: 95,
              letterGrade: 'A',
              comments: 'Excellent work',
              submittedAt: '2024-01-01',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            }
          ]
        }
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await studentsApi.getGrades(1)

      expect(apiClient.get).toHaveBeenCalledWith('/students/1/grades')
      expect(result).toEqual(mockResponse.data.data)
    })
  })
})
