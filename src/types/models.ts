export interface User {
  id: number
  email: string
  role: 'admin' | 'teacher' | 'student'
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: number
  userId: number
  user?: User
  studentNumber: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'graduated'
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: number
  userId: number
  user?: User
  employeeNumber: string
  department: string
  hireDate: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  code: string
  name: string
  description: string
  credits: number
  teacherId?: number
  teacher?: Teacher
  semester: string
  academicYear: string
  status: 'active' | 'inactive' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Grade {
  id: number
  studentId: number
  student?: Student
  courseId: number
  course?: Course
  score: number
  letterGrade: string
  comments?: string
  submittedAt?: string
  submittedBy?: number
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: number
  studentId: number
  student?: Student
  courseId: number
  course?: Course
  enrolledAt: string
  status: 'enrolled' | 'withdrawn' | 'completed'
  createdAt: string
  updatedAt: string
}
