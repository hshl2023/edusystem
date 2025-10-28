import { http, HttpResponse } from 'msw'

const API_BASE_URL = 'http://localhost:3000/api'

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'admin@example.com' && body.password === 'password') {
      return HttpResponse.json({
        data: {
          user: {
            id: 1,
            email: 'admin@example.com',
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          token: 'mock-token',
          refreshToken: 'mock-refresh-token'
        }
      })
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.get(`${API_BASE_URL}/auth/me`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    })
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  // Students endpoints
  http.get(`${API_BASE_URL}/students`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          userId: 1,
          studentNumber: 'STU001',
          enrollmentDate: '2024-01-01',
          status: 'active',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          user: {
            id: 1,
            email: 'student@example.com',
            role: 'student',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        }
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 1
      }
    })
  }),

  http.post(`${API_BASE_URL}/students`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      data: {
        id: 2,
        userId: 2,
        ...body,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }, { status: 201 })
  }),

  // Courses endpoints
  http.get(`${API_BASE_URL}/courses`, () => {
    return HttpResponse.json({
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
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 1
      }
    })
  }),

  // Grades endpoints
  http.post(`${API_BASE_URL}/grades/submit`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      data: {
        id: 1,
        ...body,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }, { status: 201 })
  })
]
