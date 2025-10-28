# Testing Guide

This document explains the testing strategy and patterns used in the School Management System frontend.

## Testing Stack

- **Test Runner**: Vitest
- **Component Testing**: @vue/test-utils
- **API Mocking**: MSW (Mock Service Worker)
- **Coverage**: v8 provider

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test tests/api/auth.test.ts

# Run tests matching pattern
npm test -- --grep "login"
```

## Test Structure

```
tests/
├── setup.ts                 # Global test setup
├── api/                     # API service tests
│   ├── auth.test.ts
│   └── students.test.ts
├── stores/                  # Pinia store tests
│   ├── auth.test.ts
│   └── loading.test.ts
├── composables/             # Composable tests
│   ├── useApi.test.ts
│   ├── useOptimistic.test.ts
│   └── useQueryInvalidation.test.ts
└── mocks/                   # MSW mock handlers
    ├── handlers.ts
    └── server.ts
```

## Writing Tests

### Testing API Services

API services should be tested by mocking the Axios client:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { studentsApi } from '@/api/students'
import { apiClient } from '@/api/client'

vi.mock('@/api/client')

describe('studentsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch all students', async () => {
    const mockResponse = {
      data: {
        data: [{ id: 1, studentNumber: 'STU001' }],
        pagination: { page: 1, pageSize: 10, totalPages: 1, totalItems: 1 }
      }
    }

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

    const result = await studentsApi.getAll()

    expect(apiClient.get).toHaveBeenCalledWith('/students', { params: undefined })
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle errors', async () => {
    const mockError = new Error('API Error')
    vi.mocked(apiClient.get).mockRejectedValue(mockError)

    await expect(studentsApi.getAll()).rejects.toThrow('API Error')
  })
})
```

### Testing Pinia Stores

Stores should be tested with proper Pinia setup:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'

vi.mock('@/api')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should login successfully', async () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com', role: 'student' },
      token: 'mock-token'
    }

    vi.mocked(authApi.login).mockResolvedValue(mockResponse)

    const store = useAuthStore()
    await store.login({ email: 'test@example.com', password: 'password' })

    expect(store.user).toEqual(mockResponse.user)
    expect(store.token).toBe('mock-token')
    expect(store.isAuthenticated).toBe(true)
  })
})
```

### Testing Composables

Test composables in isolation:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { useApi } from '@/composables/useApi'

describe('useApi', () => {
  it('should execute API call successfully', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({ id: 1, name: 'Test' })

    const { data, error, isLoading, execute } = useApi(mockApiCall)

    expect(data.value).toBeNull()
    expect(isLoading.value).toBe(false)

    const result = await execute()

    expect(mockApiCall).toHaveBeenCalled()
    expect(data.value).toEqual({ id: 1, name: 'Test' })
    expect(error.value).toBeNull()
    expect(result).toEqual({ id: 1, name: 'Test' })
  })

  it('should handle errors', async () => {
    const mockError = new Error('API Error')
    const mockApiCall = vi.fn().mockRejectedValue(mockError)

    const { data, error, execute } = useApi(mockApiCall)

    await execute()

    expect(data.value).toBeNull()
    expect(error.value).toEqual(mockError)
  })
})
```

### Testing Vue Components

Test components with @vue/test-utils:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import LoginView from '@/views/LoginView.vue'

describe('LoginView', () => {
  it('should render login form', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should submit login form', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        mocks: {
          $router: {
            push: vi.fn()
          }
        }
      }
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit')

    // Assert login was called
  })
})
```

## Using MSW for API Mocking

MSW (Mock Service Worker) provides realistic API mocking:

### Setup MSW

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

const API_BASE_URL = 'http://localhost:3000/api'

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json()
    
    if (body.email === 'admin@example.com') {
      return HttpResponse.json({
        data: {
          user: { id: 1, email: 'admin@example.com', role: 'admin' },
          token: 'mock-token'
        }
      })
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  })
]
```

### Use MSW in Tests

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Login Flow', () => {
  it('should login with valid credentials', async () => {
    const response = await authApi.login({
      email: 'admin@example.com',
      password: 'password'
    })
    
    expect(response.user.role).toBe('admin')
    expect(response.token).toBe('mock-token')
  })
})
```

## Testing Patterns

### 1. Testing Loading States

```typescript
it('should show loading state', async () => {
  const mockApiCall = vi.fn().mockImplementation(() => 
    new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))
  )

  const { isLoading, execute } = useApi(mockApiCall)

  expect(isLoading.value).toBe(false)

  const promise = execute()
  expect(isLoading.value).toBe(true)

  await promise
  expect(isLoading.value).toBe(false)
})
```

### 2. Testing Error Handling

```typescript
it('should handle API errors', async () => {
  const mockError = new Error('Network error')
  const mockApiCall = vi.fn().mockRejectedValue(mockError)
  const onError = vi.fn()

  const { execute } = useApi(mockApiCall, { onError })

  await execute()

  expect(onError).toHaveBeenCalledWith(mockError)
})
```

### 3. Testing Optimistic Updates

```typescript
it('should update optimistically and rollback on error', async () => {
  const initialData = { id: 1, name: 'John' }
  const { data, optimisticUpdate } = useOptimistic(initialData)

  const newData = { id: 1, name: 'Jane' }
  const mockApiCall = vi.fn().mockRejectedValue(new Error('Failed'))

  optimisticUpdate(newData, mockApiCall)

  expect(data.value).toEqual(newData)

  await new Promise(resolve => setTimeout(resolve, 0))

  expect(data.value).toEqual(initialData)
})
```

### 4. Testing Query Invalidation

```typescript
it('should invalidate queries after mutation', async () => {
  const { setQueryData, getQueryData, invalidateQueries } = useQueryInvalidation()

  setQueryData('students-list', [{ id: 1 }])
  expect(getQueryData('students-list')?.isStale).toBe(false)

  invalidateQueries('students')

  expect(getQueryData('students-list')?.isStale).toBe(true)
})
```

### 5. Testing Authentication Flow

```typescript
it('should handle complete auth flow', async () => {
  const store = useAuthStore()

  // Login
  await store.login({ email: 'test@example.com', password: 'password' })
  expect(store.isAuthenticated).toBe(true)

  // Check user data
  expect(store.user?.email).toBe('test@example.com')

  // Logout
  await store.logout()
  expect(store.isAuthenticated).toBe(false)
  expect(store.user).toBeNull()
})
```

## Coverage Goals

Aim for these coverage targets:

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

Critical paths should have 100% coverage:
- Authentication flow
- Error handling
- Data mutation operations

## Best Practices

### 1. Use Descriptive Test Names

❌ **Don't:**
```typescript
it('works', () => { ... })
```

✅ **Do:**
```typescript
it('should fetch all students with pagination parameters', () => { ... })
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should update student status', async () => {
  // Arrange
  const studentId = 1
  const newStatus = 'inactive'
  
  // Act
  const result = await studentsApi.update(studentId, { status: newStatus })
  
  // Assert
  expect(result.status).toBe(newStatus)
})
```

### 3. Clean Up After Tests

```typescript
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

afterEach(() => {
  // Clean up any side effects
})
```

### 4. Test Edge Cases

```typescript
describe('pagination', () => {
  it('should handle first page', async () => { ... })
  it('should handle middle page', async () => { ... })
  it('should handle last page', async () => { ... })
  it('should handle empty results', async () => { ... })
})
```

### 5. Mock External Dependencies

```typescript
// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Mock window.alert
global.alert = vi.fn()

// Mock router
const mockRouter = {
  push: vi.fn()
}
```

### 6. Test User Interactions

```typescript
it('should submit form on button click', async () => {
  const wrapper = mount(MyComponent)
  
  await wrapper.find('input').setValue('test')
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.emitted('submit')).toBeTruthy()
})
```

### 7. Test Async Operations

```typescript
it('should load data on mount', async () => {
  const wrapper = mount(MyComponent)
  
  await wrapper.vm.$nextTick()
  await flushPromises()
  
  expect(wrapper.text()).toContain('Data loaded')
})
```

## Debugging Tests

### Run Single Test

```bash
npm test -- tests/api/auth.test.ts
```

### Run Tests Matching Pattern

```bash
npm test -- --grep "login"
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/vitest
```

### Use console.log in Tests

```typescript
it('should debug', () => {
  console.log('Debug value:', myValue)
  expect(myValue).toBe(expected)
})
```

### Check Coverage for Specific File

```bash
npm run test:coverage -- src/api/auth.ts
```

## CI/CD Integration

Tests should run in CI pipeline:

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Common Issues

### Issue: Tests timeout

**Solution**: Increase timeout or fix slow operations
```typescript
it('should complete', async () => {
  // Increase timeout for this test
}, { timeout: 10000 })
```

### Issue: Flaky tests

**Solution**: Ensure proper cleanup and deterministic behavior
```typescript
beforeEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()
})
```

### Issue: Mocks not working

**Solution**: Ensure mocks are set up before imports
```typescript
vi.mock('@/api/client')  // Must be before importing modules that use it
import { studentsApi } from '@/api/students'
```

## Summary

- ✅ Use Vitest for fast, ESM-native testing
- ✅ Mock API calls with MSW for realistic tests
- ✅ Test stores with proper Pinia setup
- ✅ Test composables in isolation
- ✅ Follow AAA pattern (Arrange-Act-Assert)
- ✅ Clean up after each test
- ✅ Aim for high coverage on critical paths
- ✅ Write descriptive test names
- ✅ Test edge cases and error scenarios
- ✅ Integrate tests into CI/CD pipeline

For more information, see:
- [Vitest Documentation](https://vitest.dev/)
- [@vue/test-utils Documentation](https://test-utils.vuejs.org/)
- [MSW Documentation](https://mswjs.io/)
