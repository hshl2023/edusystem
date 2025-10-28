# School Management System - Frontend

A modern, type-safe Vue 3 + TypeScript frontend application with comprehensive API integration, error handling, and state management.

## Features

- ✅ **Type-Safe API Layer**: Fully typed Axios client with TypeScript interfaces
- ✅ **Global Error Handling**: Automatic handling of 401, 403, 404, and 500 errors
- ✅ **Role-Based Access**: Separate dashboards for Admin, Teacher, and Student roles
- ✅ **State Management**: Pinia stores for auth, loading, and application state
- ✅ **Loading States**: Global and per-component loading management
- ✅ **Optimistic Updates**: Immediate UI feedback with rollback on failure
- ✅ **Query Invalidation**: Smart cache management for data freshness
- ✅ **Comprehensive Tests**: Unit and integration tests with Vitest
- ✅ **Modern Stack**: Vue 3 Composition API, TypeScript, Vite

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Router**: Vue Router
- **Testing**: Vitest + @vue/test-utils
- **Mock Service**: MSW (optional)

## Project Structure

```
src/
├── api/                    # API layer
│   ├── client.ts          # Axios client with interceptors
│   ├── auth.ts            # Authentication API
│   ├── students.ts        # Students API
│   ├── teachers.ts        # Teachers API
│   ├── courses.ts         # Courses API
│   ├── grades.ts          # Grades API
│   └── index.ts           # API exports
├── stores/                 # Pinia stores
│   ├── auth.ts            # Authentication state
│   └── loading.ts         # Loading state
├── composables/            # Reusable composition functions
│   ├── useApi.ts          # API call wrapper
│   ├── useOptimistic.ts   # Optimistic updates
│   └── useQueryInvalidation.ts  # Cache management
├── types/                  # TypeScript types
│   ├── models.ts          # Data models
│   └── api.ts             # API request/response types
├── views/                  # Page components
│   ├── LoginView.vue
│   ├── AdminDashboard.vue
│   ├── TeacherDashboard.vue
│   └── StudentDashboard.vue
├── components/             # Reusable components
│   └── LoadingSpinner.vue
├── router/                 # Vue Router configuration
│   └── index.ts
├── App.vue                 # Root component
└── main.ts                 # Application entry point

tests/
├── api/                    # API tests
├── stores/                 # Store tests
├── composables/            # Composable tests
└── setup.ts               # Test setup
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (default: http://localhost:3000/api)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration Guide

### 1. Using API Services

All API calls should go through the centralized API modules:

```typescript
import { studentsApi, coursesApi, gradesApi } from '@/api'

// Fetch students with pagination
const students = await studentsApi.getAll({ page: 1, pageSize: 20 })

// Create a new student
const newStudent = await studentsApi.create({
  email: 'student@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  studentNumber: 'STU001',
  enrollmentDate: '2024-01-01'
})

// Update student
const updated = await studentsApi.update(1, { status: 'inactive' })
```

### 2. Using the useApi Composable

For better loading and error handling:

```typescript
import { useApi } from '@/composables/useApi'
import { studentsApi } from '@/api'

const { data, error, isLoading, execute } = useApi(
  () => studentsApi.getAll(),
  {
    loadingTaskId: 'fetch-students',
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
    immediate: true  // Execute on mount
  }
)
```

### 3. Optimistic Updates

For instant UI feedback:

```typescript
import { useOptimistic } from '@/composables/useOptimistic'
import { studentsApi } from '@/api'

const { data, optimisticUpdate } = useOptimistic(initialStudentData)

function updateStudent(newData) {
  optimisticUpdate(
    newData,
    () => studentsApi.update(student.id, newData),
    {
      onSuccess: () => console.log('Updated!'),
      onError: (error) => console.error('Failed, rolled back')
    }
  )
}
```

### 4. Query Invalidation

Keep data fresh after mutations:

```typescript
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'

const { invalidateQueries, setQueryData, getQueryData } = useQueryInvalidation()

// After creating a student
await studentsApi.create(newStudent)
invalidateQueries('students')  // Invalidate all student-related queries

// Cache data
setQueryData('students-list', studentsData)

// Retrieve cached data
const cached = getQueryData('students-list')
```

## Error Handling

The API client automatically handles errors:

- **401 Unauthorized**: Automatically logs out and redirects to login
- **403 Forbidden**: Displays permission error message
- **404 Not Found**: Displays resource not found message
- **500 Server Error**: Displays generic error message
- **Network Errors**: Displays connection error message

Custom error handling in components:

```typescript
try {
  await studentsApi.create(data)
} catch (error) {
  if (error.response?.status === 409) {
    // Handle conflict (e.g., duplicate email)
  }
}
```

## Authentication Flow

1. User logs in via `LoginView`
2. Credentials sent to `/auth/login`
3. Token stored in `authStore` and `localStorage`
4. Token automatically attached to all API requests
5. On 401 error, user is logged out and redirected
6. Router guards protect role-specific routes

## Adding New API Endpoints

### 1. Define Types

```typescript
// src/types/api.ts
export interface CreateResourceRequest {
  name: string
  description: string
}

export interface UpdateResourceRequest {
  name?: string
  description?: string
}
```

### 2. Create API Service

```typescript
// src/api/resources.ts
import { apiClient } from './client'
import type { ApiResponse, CreateResourceRequest } from '@/types/api'
import type { Resource } from '@/types/models'

export const resourcesApi = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Resource>> {
    const response = await apiClient.get<PaginatedResponse<Resource>>(
      '/resources',
      { params }
    )
    return response.data
  },

  async create(data: CreateResourceRequest): Promise<Resource> {
    const response = await apiClient.post<ApiResponse<Resource>>(
      '/resources',
      data
    )
    return response.data.data
  }
}
```

### 3. Export from Index

```typescript
// src/api/index.ts
export { resourcesApi } from './resources'
```

### 4. Use in Components

```typescript
import { resourcesApi } from '@/api'

const resources = await resourcesApi.getAll()
```

## Testing

### Unit Tests

```bash
npm test
```

### Test Example

```typescript
import { describe, it, expect, vi } from 'vitest'
import { studentsApi } from '@/api/students'

describe('studentsApi', () => {
  it('should fetch all students', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'John' }],
      pagination: { page: 1, pageSize: 10, totalPages: 1, totalItems: 1 }
    }
    
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse })
    
    const result = await studentsApi.getAll()
    
    expect(result).toEqual(mockResponse)
  })
})
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Deployment

```bash
# Build for production
npm run build

# Output directory: dist/
```

Deploy the `dist/` folder to your hosting provider (Vercel, Netlify, etc.).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use the existing API patterns
4. Update documentation

## License

MIT
