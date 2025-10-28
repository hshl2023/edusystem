# API Integration Documentation

## Overview

This document describes the API integration patterns used in the School Management System frontend. All API calls are centralized, typed, and follow consistent patterns for error handling, loading states, and data caching.

## Architecture

### API Client (`src/api/client.ts`)

The core Axios client with:
- Automatic token injection
- Global error interceptors
- Request/response transformation
- Timeout handling

```typescript
import { apiClient } from '@/api/client'

// The client is pre-configured with:
// - Base URL from environment
// - Authorization headers
// - Error interceptors
// - 30-second timeout
```

### API Modules

Each domain has its own API module:

- `authApi` - Authentication (login, logout, register)
- `studentsApi` - Student management
- `teachersApi` - Teacher management
- `coursesApi` - Course management
- `gradesApi` - Grade management

## Error Handling Strategy

### Global Error Interceptor

All HTTP errors are handled automatically by the API client:

#### 401 Unauthorized
- **Action**: Automatic logout
- **Behavior**: Clears auth state and redirects to login
- **Use Case**: Expired tokens, invalid sessions

```typescript
case 401:
  console.error('Unauthorized access - logging out')
  await authStore.logout()
  window.location.href = '/login'
  break
```

#### 403 Forbidden
- **Action**: Display error message
- **Behavior**: Shows alert with permission error
- **Use Case**: Insufficient permissions for action

```typescript
case 403:
  console.error('Forbidden access')
  this.showErrorMessage(
    errorData?.message || 'You do not have permission to perform this action.'
  )
  break
```

#### 404 Not Found
- **Action**: Display error message
- **Behavior**: Shows alert with not found message
- **Use Case**: Resource doesn't exist

```typescript
case 404:
  console.error('Resource not found')
  this.showErrorMessage(
    errorData?.message || 'The requested resource was not found.'
  )
  break
```

#### 500 Server Error
- **Action**: Display generic error
- **Behavior**: Shows alert with server error message
- **Use Case**: Backend errors, crashes

```typescript
case 500:
  console.error('Server error')
  this.showErrorMessage(
    'An internal server error occurred. Please try again later.'
  )
  break
```

### Network Errors

Handled separately from HTTP errors:

```typescript
if (error.request && !error.response) {
  // No response received
  this.showErrorMessage(
    'Network error. Please check your connection and try again.'
  )
}
```

### Component-Level Error Handling

For specific error handling needs:

```typescript
try {
  await studentsApi.create(newStudent)
} catch (error) {
  if (error.response?.status === 409) {
    alert('Student with this email already exists')
  } else if (error.response?.status === 422) {
    // Handle validation errors
    const errors = error.response.data.errors
    displayValidationErrors(errors)
  }
}
```

## Request/Response Patterns

### Standard Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}
```

### Example API Calls

#### Fetch All with Pagination

```typescript
const response = await studentsApi.getAll({
  page: 1,
  pageSize: 20,
  search: 'john',
  sortBy: 'lastName',
  sortOrder: 'asc'
})

// response.data = Student[]
// response.pagination = { page: 1, ... }
```

#### Fetch Single Resource

```typescript
const student = await studentsApi.getById(1)
// Returns: Student object
```

#### Create Resource

```typescript
const newStudent = await studentsApi.create({
  email: 'student@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  studentNumber: 'STU001',
  enrollmentDate: '2024-01-01'
})
// Returns: Created Student object
```

#### Update Resource

```typescript
const updated = await studentsApi.update(1, {
  status: 'inactive'
})
// Returns: Updated Student object
```

#### Delete Resource

```typescript
await studentsApi.delete(1)
// Returns: void
```

## Loading State Management

### Global Loading Store

Tracks multiple loading tasks:

```typescript
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()

// Start loading
loadingStore.startLoading('fetch-students')

// Stop loading
loadingStore.stopLoading('fetch-students')

// Check if loading
if (loadingStore.isLoading) {
  // Show global spinner
}
```

### Component-Level Loading

```typescript
const isLoading = ref(false)

async function loadData() {
  isLoading.value = true
  try {
    const data = await studentsApi.getAll()
    // Process data
  } finally {
    isLoading.value = false
  }
}
```

### Using useApi Composable

Automatic loading state management:

```typescript
const { data, error, isLoading, execute } = useApi(
  () => studentsApi.getAll(),
  {
    loadingTaskId: 'fetch-students',  // Registers with loading store
    immediate: true
  }
)

// isLoading.value is automatically managed
```

## Data Freshness Strategies

### 1. Optimistic Updates

Immediate UI feedback with rollback on failure:

```typescript
import { useOptimistic } from '@/composables/useOptimistic'

const { data, optimisticUpdate, rollback } = useOptimistic(student)

function updateStatus(newStatus: string) {
  const updatedStudent = { ...data.value, status: newStatus }
  
  optimisticUpdate(
    updatedStudent,
    () => studentsApi.update(student.id, { status: newStatus }),
    {
      onSuccess: () => {
        console.log('Update confirmed')
      },
      onError: (error, rollbackData) => {
        console.error('Update failed, rolled back:', error)
        // UI automatically shows rollbackData
      }
    }
  )
}
```

### 2. Query Invalidation

Mark cached data as stale after mutations:

```typescript
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'

const { invalidateQueries, setQueryData, getQueryData } = useQueryInvalidation()

// After creating a student
await studentsApi.create(newStudent)
invalidateQueries('students')  // Invalidates all student queries

// After updating a specific student
await studentsApi.update(1, data)
invalidateQueries('students/1')

// Pattern matching
invalidateQueries('courses')  // Invalidates 'courses', 'courses/1', etc.
```

### 3. Cache Management

Store and retrieve query results:

```typescript
// Set cached data
const students = await studentsApi.getAll()
setQueryData('students-list', students)

// Get cached data
const cached = getQueryData('students-list')
if (cached && !cached.isStale) {
  // Use cached data
  return cached.data
} else {
  // Fetch fresh data
  const fresh = await studentsApi.getAll()
  setQueryData('students-list', fresh)
  return fresh
}

// Clear all cache
clearCache()
```

## Authentication Flow

### Login Process

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 1. User submits credentials
const response = await authStore.login({
  email: 'user@example.com',
  password: 'password123'
})

// 2. Token stored in:
//    - authStore.token (reactive state)
//    - localStorage (persistence)

// 3. Token automatically attached to requests
//    via request interceptor

// 4. User redirected based on role
if (response.user.role === 'admin') {
  router.push('/admin')
} else if (response.user.role === 'teacher') {
  router.push('/teacher')
} else {
  router.push('/student')
}
```

### Token Management

```typescript
// Request interceptor adds token
this.client.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.token
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})
```

### Logout Process

```typescript
// 1. Call logout API
await authApi.logout()

// 2. Clear state
authStore.user = null
authStore.token = null

// 3. Clear storage
localStorage.removeItem('auth_token')
localStorage.removeItem('user')

// 4. Redirect to login
router.push('/login')
```

### Token Refresh

```typescript
// When token expires
try {
  await authStore.refresh()
  // Retry failed request
} catch (error) {
  // Refresh failed, logout
  await authStore.logout()
}
```

## Best Practices

### 1. Always Use Centralized API

❌ **Don't:**
```typescript
import axios from 'axios'

// Ad-hoc API call
const response = await axios.get('http://localhost:3000/api/students')
```

✅ **Do:**
```typescript
import { studentsApi } from '@/api'

const students = await studentsApi.getAll()
```

### 2. Handle Loading States

❌ **Don't:**
```typescript
const students = await studentsApi.getAll()
// No loading indicator
```

✅ **Do:**
```typescript
const isLoading = ref(false)

async function loadStudents() {
  isLoading.value = true
  try {
    const students = await studentsApi.getAll()
  } finally {
    isLoading.value = false
  }
}
```

### 3. Use Type Safety

❌ **Don't:**
```typescript
const data = await apiClient.post('/students', {
  email: 'test',
  // Missing required fields
})
```

✅ **Do:**
```typescript
import type { CreateStudentRequest } from '@/types/api'

const data: CreateStudentRequest = {
  email: 'student@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  studentNumber: 'STU001',
  enrollmentDate: '2024-01-01'
}

await studentsApi.create(data)
```

### 4. Invalidate After Mutations

❌ **Don't:**
```typescript
await studentsApi.create(newStudent)
// Stale data in other components
```

✅ **Do:**
```typescript
await studentsApi.create(newStudent)
invalidateQueries('students')
// Other components will refetch fresh data
```

### 5. Graceful Error Handling

❌ **Don't:**
```typescript
try {
  await studentsApi.create(data)
} catch (error) {
  // Ignore error
}
```

✅ **Do:**
```typescript
try {
  await studentsApi.create(data)
  alert('Student created successfully')
} catch (error) {
  if (error.response?.status === 409) {
    alert('Student already exists')
  }
  // Global interceptor handles other errors
}
```

## Extending the API

### Adding a New API Module

1. **Define types** in `src/types/api.ts` and `src/types/models.ts`
2. **Create API module** in `src/api/[module].ts`
3. **Export** from `src/api/index.ts`
4. **Write tests** in `tests/api/[module].test.ts`

Example:

```typescript
// src/api/assignments.ts
import { apiClient } from './client'
import type { Assignment, CreateAssignmentRequest } from '@/types'

export const assignmentsApi = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Assignment>> {
    const response = await apiClient.get<PaginatedResponse<Assignment>>(
      '/assignments',
      { params }
    )
    return response.data
  },

  async create(data: CreateAssignmentRequest): Promise<Assignment> {
    const response = await apiClient.post<ApiResponse<Assignment>>(
      '/assignments',
      data
    )
    return response.data.data
  }
}
```

## Performance Optimization

### 1. Request Debouncing

```typescript
import { debounce } from 'lodash-es'

const debouncedSearch = debounce(async (query: string) => {
  const results = await studentsApi.getAll({ search: query })
  // Update UI
}, 300)
```

### 2. Request Cancellation

```typescript
let controller = new AbortController()

async function search(query: string) {
  controller.abort()  // Cancel previous request
  controller = new AbortController()
  
  const response = await apiClient.get('/students', {
    params: { search: query },
    signal: controller.signal
  })
}
```

### 3. Pagination

```typescript
const page = ref(1)
const pageSize = 20

async function loadMore() {
  page.value++
  const newStudents = await studentsApi.getAll({
    page: page.value,
    pageSize
  })
  students.value.push(...newStudents.data)
}
```

## Troubleshooting

### Issue: 401 errors loop
**Solution**: Ensure refresh token logic doesn't trigger additional 401s

### Issue: Multiple loading spinners
**Solution**: Use loading task IDs to track specific operations

### Issue: Stale data after mutations
**Solution**: Call `invalidateQueries()` after create/update/delete

### Issue: Type errors in API calls
**Solution**: Ensure request/response types match backend schema

## Summary

- ✅ All API calls centralized in `src/api/`
- ✅ Global error interceptor handles 401, 403, 404, 500
- ✅ Loading states managed via store or composables
- ✅ Optimistic updates for better UX
- ✅ Query invalidation keeps data fresh
- ✅ Full TypeScript type safety
- ✅ Consistent patterns across all modules
