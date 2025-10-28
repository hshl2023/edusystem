# EduSystem API Reference

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.edusystem.example.com/api`

## Interactive Documentation

Swagger UI is available at `/api/docs` when the backend server is running.

## Authentication

Most endpoints require authentication via JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Common Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 204  | No Content (successful deletion) |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (missing or invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found |
| 409  | Conflict (duplicate resource) |
| 422  | Unprocessable Entity |
| 429  | Too Many Requests (rate limit) |
| 500  | Internal Server Error |

## Error Response Format

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Pagination

List endpoints support pagination via query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (prefix with `-` for descending)

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```

**Validation Rules**:
- `email`: Valid email format, unique
- `password`: Min 8 characters, must include uppercase, lowercase, number
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `role`: One of: `student`, `teacher`, `admin`

**Response**: `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login

Authenticate and receive access tokens.

**Endpoint**: `POST /auth/login`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response**: `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `401`: Invalid credentials

---

### Refresh Token

Get a new access token using a refresh token.

**Endpoint**: `POST /auth/refresh`

**Authentication**: Not required

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**: `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout

Invalidate current refresh token.

**Endpoint**: `POST /auth/logout`

**Authentication**: Required

**Response**: `204 No Content`

---

### Request Password Reset

Send password reset email.

**Endpoint**: `POST /auth/forgot-password`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "student@example.com"
}
```

**Response**: `200 OK`
```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

---

### Reset Password

Reset password using token from email.

**Endpoint**: `POST /auth/reset-password`

**Authentication**: Not required

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

**Response**: `200 OK`
```json
{
  "message": "Password reset successful"
}
```

---

## User Endpoints

### Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /users/me`

**Authentication**: Required

**Permissions**: All authenticated users

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "avatar": "https://cdn.example.com/avatars/uuid.jpg",
  "bio": "Computer Science student",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:22:00Z"
}
```

---

### Update Current User

Update authenticated user's profile.

**Endpoint**: `PATCH /users/me`

**Authentication**: Required

**Permissions**: All authenticated users

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "avatar": "base64-encoded-image-or-url"
}
```

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "avatar": "https://cdn.example.com/avatars/uuid.jpg"
}
```

---

### List Users

List all users (admin only).

**Endpoint**: `GET /users`

**Authentication**: Required

**Permissions**: Admin only

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `role`: Filter by role (`student`, `teacher`, `admin`)
- `search`: Search by name or email

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

### Get User by ID

Get specific user details.

**Endpoint**: `GET /users/:id`

**Authentication**: Required

**Permissions**: 
- Admin: Any user
- Teacher: Any user
- Student: Only themselves

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "avatar": "https://cdn.example.com/avatars/uuid.jpg",
  "bio": "Computer Science student",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Create User

Create a new user (admin only).

**Endpoint**: `POST /users`

**Authentication**: Required

**Permissions**: Admin only

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teacher"
}
```

**Response**: `201 Created`

---

### Update User

Update user details (admin only).

**Endpoint**: `PATCH /users/:id`

**Authentication**: Required

**Permissions**: Admin only

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teacher",
  "isActive": true
}
```

**Response**: `200 OK`

---

### Delete User

Soft delete a user (admin only).

**Endpoint**: `DELETE /users/:id`

**Authentication**: Required

**Permissions**: Admin only

**Response**: `204 No Content`

---

## Course Endpoints

### List Courses

Get all courses with optional filtering.

**Endpoint**: `GET /courses`

**Authentication**: Required

**Permissions**: All authenticated users

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `search`: Search by title or code
- `teacherId`: Filter by teacher
- `status`: Filter by status (`draft`, `published`, `archived`)
- `enrolled`: For students, show only enrolled courses (boolean)

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "CS101",
      "title": "Introduction to Computer Science",
      "description": "Foundational concepts in computer science",
      "status": "published",
      "teacher": {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "enrollmentCount": 45,
      "startDate": "2024-01-15",
      "endDate": "2024-05-15",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### Get Course Details

Get detailed course information.

**Endpoint**: `GET /courses/:id`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Any course
- Student: Only enrolled or published courses

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Foundational concepts in computer science",
  "status": "published",
  "teacher": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "teacher@example.com"
  },
  "syllabus": "Course syllabus content...",
  "schedule": "MWF 10:00-11:00 AM",
  "location": "Room 301",
  "maxEnrollment": 50,
  "enrollmentCount": 45,
  "startDate": "2024-01-15",
  "endDate": "2024-05-15",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-10T14:30:00Z"
}
```

---

### Create Course

Create a new course.

**Endpoint**: `POST /courses`

**Authentication**: Required

**Permissions**: Admin, Teacher

**Request Body**:
```json
{
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Foundational concepts in computer science",
  "syllabus": "Week 1: Introduction...",
  "schedule": "MWF 10:00-11:00 AM",
  "location": "Room 301",
  "maxEnrollment": 50,
  "startDate": "2024-01-15",
  "endDate": "2024-05-15",
  "status": "published"
}
```

**Validation Rules**:
- `code`: Required, unique, 2-20 characters
- `title`: Required, 5-200 characters
- `description`: Required
- `maxEnrollment`: Positive integer
- `startDate`: Required, ISO date
- `endDate`: Required, must be after startDate
- `status`: One of: `draft`, `published`, `archived`

**Response**: `201 Created`

---

### Update Course

Update course details.

**Endpoint**: `PATCH /courses/:id`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Request Body**: (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "published"
}
```

**Response**: `200 OK`

---

### Delete Course

Delete a course.

**Endpoint**: `DELETE /courses/:id`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses with no enrollments

**Response**: `204 No Content`

---

### Enroll in Course

Enroll student in a course.

**Endpoint**: `POST /courses/:id/enroll`

**Authentication**: Required

**Permissions**: Student only

**Response**: `201 Created`
```json
{
  "enrollment": {
    "id": "uuid",
    "courseId": "uuid",
    "studentId": "uuid",
    "enrolledAt": "2024-01-15T10:30:00Z",
    "status": "active"
  }
}
```

**Errors**:
- `409`: Already enrolled
- `422`: Course full or not accepting enrollments

---

### Unenroll from Course

Remove student enrollment.

**Endpoint**: `DELETE /courses/:id/enroll`

**Authentication**: Required

**Permissions**: 
- Student: Can unenroll themselves within grace period
- Admin: Can unenroll any student

**Response**: `204 No Content`

---

### Get Course Enrollments

List all enrollments for a course.

**Endpoint**: `GET /courses/:id/enrollments`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Query Parameters**:
- `status`: Filter by status (`active`, `dropped`, `completed`)

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "student": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "student@example.com"
      },
      "enrolledAt": "2024-01-15T10:30:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### Get Course Materials

List course materials and resources.

**Endpoint**: `GET /courses/:id/materials`

**Authentication**: Required

**Permissions**: 
- Admin, Teacher: Any course
- Student: Only enrolled courses

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Lecture 1 Slides",
      "description": "Introduction slides",
      "type": "slides",
      "fileUrl": "https://cdn.example.com/materials/uuid.pdf",
      "fileSize": 2048576,
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Upload Course Material

Upload a new course material.

**Endpoint**: `POST /courses/:id/materials`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: File to upload
- `title`: Material title
- `description`: Material description
- `type`: One of `slides`, `notes`, `reading`, `video`, `other`

**Response**: `201 Created`

---

## Assignment Endpoints

### List Assignments

Get assignments for a course.

**Endpoint**: `GET /courses/:courseId/assignments`

**Authentication**: Required

**Permissions**: 
- Admin, Teacher: Any course
- Student: Only enrolled courses

**Query Parameters**:
- `status`: Filter by status (`draft`, `published`, `closed`)
- `sort`: Sort field (e.g., `dueDate`, `-createdAt`)

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Homework 1",
      "description": "Complete exercises 1-5",
      "type": "homework",
      "maxPoints": 100,
      "dueDate": "2024-02-01T23:59:59Z",
      "status": "published",
      "allowLateSubmission": true,
      "latePenalty": 10,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Assignment Details

Get detailed assignment information.

**Endpoint**: `GET /assignments/:id`

**Authentication**: Required

**Permissions**: 
- Admin, Teacher: Any assignment
- Student: Only for enrolled courses

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": "Homework 1",
  "description": "Complete exercises 1-5",
  "instructions": "Detailed instructions...",
  "type": "homework",
  "maxPoints": 100,
  "dueDate": "2024-02-01T23:59:59Z",
  "status": "published",
  "allowLateSubmission": true,
  "latePenalty": 10,
  "attachments": [
    {
      "id": "uuid",
      "filename": "assignment-template.pdf",
      "url": "https://cdn.example.com/assignments/uuid.pdf"
    }
  ],
  "submissionStats": {
    "total": 45,
    "submitted": 30,
    "graded": 20,
    "pending": 10
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Create Assignment

Create a new assignment for a course.

**Endpoint**: `POST /courses/:courseId/assignments`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Request Body**:
```json
{
  "title": "Homework 1",
  "description": "Complete exercises 1-5",
  "instructions": "Detailed instructions...",
  "type": "homework",
  "maxPoints": 100,
  "dueDate": "2024-02-01T23:59:59Z",
  "allowLateSubmission": true,
  "latePenalty": 10,
  "status": "published"
}
```

**Validation Rules**:
- `title`: Required, 5-200 characters
- `description`: Required
- `type`: One of `homework`, `quiz`, `exam`, `project`, `essay`
- `maxPoints`: Positive number
- `dueDate`: Required, ISO datetime, must be in future
- `latePenalty`: 0-100 percentage
- `status`: One of `draft`, `published`, `closed`

**Response**: `201 Created`

---

### Update Assignment

Update assignment details.

**Endpoint**: `PATCH /assignments/:id`

**Authentication**: Required

**Permissions**: 
- Admin: Any assignment
- Teacher: Only own course assignments

**Request Body**: (all fields optional)
```json
{
  "title": "Updated Homework 1",
  "dueDate": "2024-02-03T23:59:59Z",
  "status": "published"
}
```

**Response**: `200 OK`

---

### Delete Assignment

Delete an assignment.

**Endpoint**: `DELETE /assignments/:id`

**Authentication**: Required

**Permissions**: 
- Admin: Any assignment
- Teacher: Only own assignments with no submissions

**Response**: `204 No Content`

---

### Submit Assignment

Submit an assignment solution.

**Endpoint**: `POST /assignments/:id/submit`

**Authentication**: Required

**Permissions**: Student only (enrolled in course)

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: Submission file (optional)
- `text`: Text submission (optional)
- `links`: JSON array of links (optional)

**Response**: `201 Created`
```json
{
  "submission": {
    "id": "uuid",
    "assignmentId": "uuid",
    "studentId": "uuid",
    "status": "submitted",
    "submittedAt": "2024-01-28T15:30:00Z",
    "isLate": false,
    "file": {
      "filename": "homework1.pdf",
      "url": "https://cdn.example.com/submissions/uuid.pdf",
      "size": 1024576
    }
  }
}
```

**Errors**:
- `400`: Assignment closed or not yet open
- `409`: Already submitted (must update existing submission)
- `422`: Invalid file type or size

---

### Update Submission

Update existing submission (before grading).

**Endpoint**: `PATCH /submissions/:id`

**Authentication**: Required

**Permissions**: Student only (own submission, before grading)

**Content-Type**: `multipart/form-data`

**Response**: `200 OK`

---

### Get Submission

Get submission details.

**Endpoint**: `GET /submissions/:id`

**Authentication**: Required

**Permissions**: 
- Admin, Teacher: Any submission in their courses
- Student: Only own submissions

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "assignmentId": "uuid",
  "student": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe"
  },
  "status": "graded",
  "submittedAt": "2024-01-28T15:30:00Z",
  "isLate": false,
  "file": {
    "filename": "homework1.pdf",
    "url": "https://cdn.example.com/submissions/uuid.pdf"
  },
  "grade": {
    "points": 85,
    "maxPoints": 100,
    "percentage": 85,
    "feedback": "Good work! Minor improvements needed...",
    "gradedBy": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "gradedAt": "2024-02-02T14:20:00Z"
  }
}
```

---

### List Assignment Submissions

Get all submissions for an assignment.

**Endpoint**: `GET /assignments/:id/submissions`

**Authentication**: Required

**Permissions**: 
- Admin: Any assignment
- Teacher: Only own course assignments

**Query Parameters**:
- `status`: Filter by status (`submitted`, `graded`, `late`)
- `sort`: Sort field

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "student": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "status": "graded",
      "submittedAt": "2024-01-28T15:30:00Z",
      "isLate": false,
      "grade": {
        "points": 85,
        "maxPoints": 100
      }
    }
  ]
}
```

---

### Grade Submission

Grade a student submission.

**Endpoint**: `POST /submissions/:id/grade`

**Authentication**: Required

**Permissions**: 
- Admin: Any submission
- Teacher: Only submissions in own courses

**Request Body**:
```json
{
  "points": 85,
  "feedback": "Good work! Minor improvements needed in section 3.",
  "rubricScores": [
    {
      "criteriaId": "uuid",
      "points": 20,
      "maxPoints": 25,
      "comment": "Good understanding but missing edge cases"
    }
  ]
}
```

**Validation Rules**:
- `points`: Required, 0 to assignment.maxPoints
- `feedback`: Optional, max 5000 characters

**Response**: `200 OK`
```json
{
  "grade": {
    "id": "uuid",
    "submissionId": "uuid",
    "points": 85,
    "maxPoints": 100,
    "percentage": 85,
    "feedback": "Good work!...",
    "gradedBy": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "gradedAt": "2024-02-02T14:20:00Z"
  }
}
```

---

## Grade Endpoints

### Get Course Gradebook

Get all grades for a course.

**Endpoint**: `GET /courses/:courseId/grades`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Response**: `200 OK`
```json
{
  "data": [
    {
      "student": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "assignments": [
        {
          "assignmentId": "uuid",
          "title": "Homework 1",
          "points": 85,
          "maxPoints": 100,
          "percentage": 85
        }
      ],
      "totalPoints": 340,
      "maxPoints": 400,
      "percentage": 85,
      "letterGrade": "B"
    }
  ]
}
```

---

### Get Student Grades

Get grades for a specific student.

**Endpoint**: `GET /users/:studentId/grades`

**Authentication**: Required

**Permissions**: 
- Admin: Any student
- Teacher: Students in own courses
- Student: Only themselves

**Query Parameters**:
- `courseId`: Filter by specific course

**Response**: `200 OK`
```json
{
  "data": [
    {
      "course": {
        "id": "uuid",
        "code": "CS101",
        "title": "Introduction to Computer Science"
      },
      "assignments": [
        {
          "id": "uuid",
          "title": "Homework 1",
          "points": 85,
          "maxPoints": 100,
          "percentage": 85,
          "gradedAt": "2024-02-02T14:20:00Z"
        }
      ],
      "totalPoints": 340,
      "maxPoints": 400,
      "percentage": 85,
      "letterGrade": "B"
    }
  ]
}
```

---

### Get Grade Analytics

Get grade distribution and analytics for a course.

**Endpoint**: `GET /courses/:courseId/analytics/grades`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Response**: `200 OK`
```json
{
  "distribution": {
    "A": 10,
    "B": 15,
    "C": 12,
    "D": 5,
    "F": 3
  },
  "statistics": {
    "mean": 78.5,
    "median": 82,
    "stdDev": 12.3,
    "min": 45,
    "max": 98
  },
  "assignmentStats": [
    {
      "assignmentId": "uuid",
      "title": "Homework 1",
      "mean": 85,
      "median": 87,
      "submissionRate": 95
    }
  ]
}
```

---

### Export Grades

Export course grades in CSV format.

**Endpoint**: `GET /courses/:courseId/grades/export`

**Authentication**: Required

**Permissions**: 
- Admin: Any course
- Teacher: Only own courses

**Query Parameters**:
- `format`: `csv` or `xlsx` (default: csv)

**Response**: `200 OK`
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Downloads file with grades

---

## Notification Endpoints

### Get User Notifications

Get notifications for authenticated user.

**Endpoint**: `GET /notifications`

**Authentication**: Required

**Permissions**: All authenticated users

**Query Parameters**:
- `unread`: Boolean, filter unread only
- `type`: Filter by type

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "assignment_posted",
      "title": "New Assignment Posted",
      "message": "Your teacher posted a new assignment in CS101",
      "read": false,
      "data": {
        "courseId": "uuid",
        "assignmentId": "uuid"
      },
      "createdAt": "2024-01-28T10:30:00Z"
    }
  ],
  "unreadCount": 5
}
```

---

### Mark Notification as Read

Mark a notification as read.

**Endpoint**: `PATCH /notifications/:id/read`

**Authentication**: Required

**Response**: `200 OK`

---

### Mark All as Read

Mark all notifications as read.

**Endpoint**: `POST /notifications/read-all`

**Authentication**: Required

**Response**: `200 OK`

---

## Admin Endpoints

### Get System Statistics

Get system-wide statistics.

**Endpoint**: `GET /admin/stats`

**Authentication**: Required

**Permissions**: Admin only

**Response**: `200 OK`
```json
{
  "users": {
    "total": 1500,
    "students": 1200,
    "teachers": 280,
    "admins": 20,
    "activeToday": 450
  },
  "courses": {
    "total": 150,
    "published": 120,
    "draft": 25,
    "archived": 5
  },
  "assignments": {
    "total": 850,
    "active": 320,
    "submissions": 12500
  },
  "storage": {
    "used": "45.2 GB",
    "limit": "100 GB"
  }
}
```

---

### Get Audit Logs

Get system audit logs.

**Endpoint**: `GET /admin/audit-logs`

**Authentication**: Required

**Permissions**: Admin only

**Query Parameters**:
- `userId`: Filter by user
- `action`: Filter by action type
- `startDate`: Start date
- `endDate`: End date

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "email": "user@example.com"
      },
      "action": "user.created",
      "details": {
        "targetUserId": "uuid",
        "role": "teacher"
      },
      "ipAddress": "192.168.1.1",
      "timestamp": "2024-01-28T10:30:00Z"
    }
  ]
}
```

---

## WebSocket Events

WebSocket connection at `ws://localhost:3000` (or WSS in production).

### Connection

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events to Listen

**`notification`**: New notification received
```javascript
socket.on('notification', (data) => {
  // data: { id, type, title, message, ... }
});
```

**`grade_published`**: New grade available
```javascript
socket.on('grade_published', (data) => {
  // data: { assignmentId, courseId, grade }
});
```

**`assignment_posted`**: New assignment in enrolled course
```javascript
socket.on('assignment_posted', (data) => {
  // data: { assignmentId, courseId, title }
});
```

**`message`**: New direct message
```javascript
socket.on('message', (data) => {
  // data: { from, message, timestamp }
});
```

### Events to Emit

**`join_course`**: Join course room for updates
```javascript
socket.emit('join_course', { courseId: 'uuid' });
```

**`leave_course`**: Leave course room
```javascript
socket.emit('leave_course', { courseId: 'uuid' });
```

---

## Rate Limits

| Endpoint Pattern | Limit |
|------------------|-------|
| `/auth/login` | 5 requests per 15 minutes |
| `/auth/register` | 3 requests per hour |
| `/api/*` (authenticated) | 100 requests per minute |
| `/api/*` (public) | 20 requests per minute |
| File uploads | 10 uploads per hour |

Rate limit information in response headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

---

## Swagger/OpenAPI Spec

Access interactive API documentation at `/api/docs` when running the backend server.

The OpenAPI specification file is available at `/docs/openapi.yaml` in the repository.
