# EduSystem Testing Strategy

## Table of Contents
1. [Overview](#overview)
2. [Testing Philosophy](#testing-philosophy)
3. [Backend Testing](#backend-testing)
4. [Frontend Testing](#frontend-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Test Coverage](#test-coverage)
7. [Running Tests](#running-tests)
8. [CI/CD Integration](#cicd-integration)
9. [Best Practices](#best-practices)

## Overview

EduSystem employs a comprehensive testing strategy covering unit, integration, and end-to-end tests. The goal is to ensure code quality, prevent regressions, and enable confident deployment.

### Testing Pyramid

```
              ╱╲
             ╱  ╲
            ╱ E2E ╲           ~10% - Critical user flows
           ╱────────╲
          ╱          ╲
         ╱Integration ╲       ~30% - Feature tests
        ╱──────────────╲
       ╱                ╲
      ╱      Unit        ╲     ~60% - Component/function tests
     ╱────────────────────╲
```

### Testing Tools

**Backend**:
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library
- **ts-jest**: TypeScript support for Jest
- **@faker-js/faker**: Generate test data
- **docker-compose**: Test database

**Frontend**:
- **Vitest**: Fast unit test runner
- **Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing
- **@faker-js/faker**: Generate test data

## Testing Philosophy

### Guiding Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Tests should survive refactoring

2. **Write Tests First (TDD)**
   - Red → Green → Refactor
   - Better design, better coverage

3. **Arrange-Act-Assert (AAA) Pattern**
   ```typescript
   test('should enroll student in course', async () => {
     // Arrange
     const student = createTestStudent();
     const course = createTestCourse();
     
     // Act
     const result = await enrollStudent(student.id, course.id);
     
     // Assert
     expect(result.status).toBe('enrolled');
   });
   ```

4. **Isolation**
   - Each test should be independent
   - Use mocks for external dependencies
   - Clean up after each test

5. **Fast Feedback**
   - Unit tests should run in milliseconds
   - Integration tests in seconds
   - E2E tests in minutes

6. **Readable Tests**
   - Clear test names describing what's being tested
   - Use helper functions to reduce boilerplate
   - Avoid magic numbers/strings

## Backend Testing

### Project Structure

```
backend/
├── src/
└── tests/
    ├── unit/
    │   ├── services/
    │   │   ├── authService.test.ts
    │   │   ├── courseService.test.ts
    │   │   └── gradeService.test.ts
    │   ├── utils/
    │   │   └── validation.test.ts
    │   └── middleware/
    │       └── auth.test.ts
    │
    ├── integration/
    │   ├── auth.test.ts
    │   ├── courses.test.ts
    │   ├── assignments.test.ts
    │   └── grades.test.ts
    │
    ├── e2e/
    │   ├── student-workflow.test.ts
    │   ├── teacher-workflow.test.ts
    │   └── admin-workflow.test.ts
    │
    └── helpers/
        ├── testDb.ts
        ├── factories.ts
        └── fixtures.ts
```

### Unit Tests

Test individual functions and services in isolation.

#### Example: Service Test

```typescript
// tests/unit/services/courseService.test.ts
import { CourseService } from '@/services/courseService';
import { CourseRepository } from '@/repositories/courseRepository';
import { NotFoundException } from '@/exceptions';

jest.mock('@/repositories/courseRepository');

describe('CourseService', () => {
  let courseService: CourseService;
  let courseRepository: jest.Mocked<CourseRepository>;

  beforeEach(() => {
    courseRepository = new CourseRepository() as jest.Mocked<CourseRepository>;
    courseService = new CourseService(courseRepository);
  });

  describe('getCourseById', () => {
    it('should return course when found', async () => {
      // Arrange
      const mockCourse = {
        id: '123',
        title: 'CS101',
        code: 'INTRO-CS',
      };
      courseRepository.findById.mockResolvedValue(mockCourse);

      // Act
      const result = await courseService.getCourseById('123');

      // Assert
      expect(result).toEqual(mockCourse);
      expect(courseRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when course not found', async () => {
      // Arrange
      courseRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(courseService.getCourseById('123'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('createCourse', () => {
    it('should create course with valid data', async () => {
      // Arrange
      const courseData = {
        code: 'CS101',
        title: 'Introduction to CS',
        teacherId: 'teacher-123',
        startDate: '2024-01-15',
        endDate: '2024-05-15',
      };
      const mockCourse = { id: '123', ...courseData };
      courseRepository.create.mockResolvedValue(mockCourse);

      // Act
      const result = await courseService.createCourse(courseData);

      // Assert
      expect(result).toEqual(mockCourse);
      expect(courseRepository.create).toHaveBeenCalledWith(courseData);
    });

    it('should validate end date is after start date', async () => {
      // Arrange
      const courseData = {
        code: 'CS101',
        title: 'Introduction to CS',
        startDate: '2024-05-15',
        endDate: '2024-01-15', // Invalid
      };

      // Act & Assert
      await expect(courseService.createCourse(courseData))
        .rejects
        .toThrow('End date must be after start date');
    });
  });
});
```

#### Example: Utility Test

```typescript
// tests/unit/utils/validation.test.ts
import { validateEmail, validatePassword } from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for strong password', () => {
      expect(validatePassword('SecurePass123!')).toBe(true);
    });

    it('should return false for weak password', () => {
      expect(validatePassword('weak')).toBe(false); // Too short
      expect(validatePassword('alllowercase123')).toBe(false); // No uppercase
      expect(validatePassword('ALLUPPERCASE123')).toBe(false); // No lowercase
      expect(validatePassword('NoNumbers!')).toBe(false); // No numbers
    });
  });
});
```

### Integration Tests

Test API endpoints with database interactions.

#### Setup Test Database

```typescript
// tests/helpers/testDb.ts
import { DataSource } from 'typeorm';

let testDataSource: DataSource;

export const setupTestDb = async () => {
  testDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433, // Test database port
    username: 'test',
    password: 'test',
    database: 'edusystem_test',
    entities: ['src/models/**/*.ts'],
    synchronize: true,
    dropSchema: true, // Clean slate for each test run
  });

  await testDataSource.initialize();
  return testDataSource;
};

export const teardownTestDb = async () => {
  await testDataSource.destroy();
};

export const clearDatabase = async () => {
  const entities = testDataSource.entityMetadatas;
  
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.clear();
  }
};
```

#### Test Factories

```typescript
// tests/helpers/factories.ts
import { faker } from '@faker-js/faker';
import { User, Course, Assignment } from '@/models';

export const createTestUser = (overrides?: Partial<User>): Partial<User> => ({
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: 'TestPass123!',
  role: 'student',
  ...overrides,
});

export const createTestCourse = (overrides?: Partial<Course>): Partial<Course> => ({
  code: faker.string.alphanumeric(6).toUpperCase(),
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  maxEnrollment: 30,
  startDate: faker.date.future(),
  endDate: faker.date.future({ years: 1 }),
  status: 'published',
  ...overrides,
});

export const createTestAssignment = (overrides?: Partial<Assignment>): Partial<Assignment> => ({
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  type: 'homework',
  maxPoints: 100,
  dueDate: faker.date.future(),
  status: 'published',
  ...overrides,
});
```

#### Example: API Integration Test

```typescript
// tests/integration/courses.test.ts
import request from 'supertest';
import { app } from '@/app';
import { setupTestDb, teardownTestDb, clearDatabase } from '../helpers/testDb';
import { createTestUser, createTestCourse } from '../helpers/factories';
import { UserRepository } from '@/repositories/userRepository';

describe('Courses API', () => {
  let authToken: string;
  let teacherId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    // Create and authenticate a teacher
    const teacher = await UserRepository.create(
      createTestUser({ role: 'teacher' })
    );
    teacherId = teacher.id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: teacher.email,
        password: 'TestPass123!',
      });

    authToken = loginResponse.body.accessToken;
  });

  describe('POST /api/courses', () => {
    it('should create a course with valid data', async () => {
      // Arrange
      const courseData = createTestCourse();

      // Act
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(courseData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        code: courseData.code,
        title: courseData.title,
        teacherId,
      });
    });

    it('should return 400 for invalid course data', async () => {
      // Arrange
      const invalidData = {
        code: 'CS', // Too short
        title: 'Bad', // Too short
      };

      // Act
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      // Act
      const response = await request(app)
        .post('/api/courses')
        .send(createTestCourse());

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/courses', () => {
    it('should return paginated courses', async () => {
      // Arrange
      await Promise.all([
        request(app)
          .post('/api/courses')
          .set('Authorization', `Bearer ${authToken}`)
          .send(createTestCourse()),
        request(app)
          .post('/api/courses')
          .set('Authorization', `Bearer ${authToken}`)
          .send(createTestCourse()),
      ]);

      // Act
      const response = await request(app)
        .get('/api/courses?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
      });
    });

    it('should filter courses by search query', async () => {
      // Arrange
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTestCourse({ title: 'Introduction to Programming' }));

      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTestCourse({ title: 'Advanced Mathematics' }));

      // Act
      const response = await request(app)
        .get('/api/courses?search=Programming')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toContain('Programming');
    });
  });

  describe('POST /api/courses/:id/enroll', () => {
    it('should enroll student in course', async () => {
      // Arrange
      const student = await UserRepository.create(
        createTestUser({ role: 'student' })
      );

      const studentLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: student.email,
          password: 'TestPass123!',
        });

      const studentToken = studentLoginResponse.body.accessToken;

      const courseResponse = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTestCourse());

      const courseId = courseResponse.body.id;

      // Act
      const response = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.enrollment).toMatchObject({
        courseId,
        studentId: student.id,
        status: 'active',
      });
    });

    it('should return 409 if already enrolled', async () => {
      // Arrange
      const student = await UserRepository.create(
        createTestUser({ role: 'student' })
      );

      const studentLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: student.email,
          password: 'TestPass123!',
        });

      const studentToken = studentLoginResponse.body.accessToken;

      const courseResponse = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTestCourse());

      const courseId = courseResponse.body.id;

      // First enrollment
      await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      // Act - Second enrollment attempt
      const response = await request(app)
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      // Assert
      expect(response.status).toBe(409);
    });
  });
});
```

## Frontend Testing

### Unit Tests

Test individual components and hooks.

#### Example: Component Test

```typescript
// tests/unit/components/CourseCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseCard } from '@/components/courses/CourseCard';

describe('CourseCard', () => {
  const mockCourse = {
    id: '123',
    code: 'CS101',
    title: 'Introduction to CS',
    description: 'Learn the basics of computer science',
    enrollmentCount: 25,
    maxEnrollment: 30,
  };

  it('should render course information', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText('Introduction to CS')).toBeInTheDocument();
    expect(screen.getByText('CS101')).toBeInTheDocument();
    expect(screen.getByText(/Learn the basics/)).toBeInTheDocument();
    expect(screen.getByText('25 / 30 students')).toBeInTheDocument();
  });

  it('should call onEnroll when enroll button clicked', () => {
    const mockOnEnroll = vi.fn();
    
    render(<CourseCard course={mockCourse} onEnroll={mockOnEnroll} />);

    const enrollButton = screen.getByRole('button', { name: /enroll/i });
    fireEvent.click(enrollButton);

    expect(mockOnEnroll).toHaveBeenCalledWith('123');
  });

  it('should not show enroll button when onEnroll not provided', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });
});
```

#### Example: Hook Test

```typescript
// tests/unit/hooks/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useLogin } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as authApi from '@/api/auth';

vi.mock('@/api/auth');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useLogin', () => {
  it('should login successfully', async () => {
    // Arrange
    const mockUser = { id: '123', email: 'test@example.com', role: 'student' };
    const mockResponse = {
      user: mockUser,
      accessToken: 'token123',
    };
    
    vi.mocked(authApi.login).mockResolvedValue(mockResponse);

    // Act
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'test@example.com',
      password: 'password',
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle login error', async () => {
    // Arrange
    vi.mocked(authApi.login).mockRejectedValue(
      new Error('Invalid credentials')
    );

    // Act
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'test@example.com',
      password: 'wrong',
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('Invalid credentials'));
  });
});
```

### Integration Tests

Test feature flows with API mocking.

```typescript
// tests/integration/CourseEnrollment.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CoursesPage } from '@/pages/courses/CoursesPage';

const server = setupServer(
  rest.get('/api/courses', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: '1',
            code: 'CS101',
            title: 'Intro to CS',
            enrollmentCount: 20,
            maxEnrollment: 30,
          },
        ],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      })
    );
  }),

  rest.post('/api/courses/:id/enroll', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        enrollment: {
          id: 'enroll-1',
          courseId: req.params.id,
          status: 'active',
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Course Enrollment Flow', () => {
  it('should enroll in course successfully', async () => {
    // Arrange
    render(<CoursesPage />, { wrapper: createWrapper() });

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText('Intro to CS')).toBeInTheDocument();
    });

    // Act
    const enrollButton = screen.getByRole('button', { name: /enroll/i });
    fireEvent.click(enrollButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/enrolled successfully/i)).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

Test complete user workflows using Playwright.

### Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example: E2E Test

```typescript
// tests/e2e/student-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Student Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[name="email"]', 'student@test.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('should enroll in course and submit assignment', async ({ page }) => {
    // Navigate to courses
    await page.click('text=Courses');
    await expect(page).toHaveURL('/courses');

    // Find and enroll in a course
    await page.click('text=Introduction to CS');
    await page.click('button:has-text("Enroll")');
    
    await expect(page.locator('text=Enrolled successfully')).toBeVisible();

    // Go to assignments
    await page.click('text=Assignments');
    
    // Select an assignment
    await page.click('text=Homework 1');
    await expect(page).toHaveURL(/\/assignments\/[^/]+$/);

    // Submit assignment
    await page.click('button:has-text("Submit")');
    
    // Upload file
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/assignment.pdf');
    
    // Add text content
    await page.fill('textarea[name="text"]', 'This is my submission');
    
    // Submit
    await page.click('button[type="submit"]:has-text("Submit Assignment")');
    
    await expect(page.locator('text=Assignment submitted successfully')).toBeVisible();
    
    // Verify submission appears in list
    await page.click('text=My Submissions');
    await expect(page.locator('text=Homework 1')).toBeVisible();
    await expect(page.locator('text=Submitted')).toBeVisible();
  });

  test('should view grades', async ({ page }) => {
    // Navigate to grades
    await page.click('text=Grades');
    await expect(page).toHaveURL('/grades');

    // Should see course grades
    await expect(page.locator('text=Introduction to CS')).toBeVisible();
    
    // Click on course to see details
    await page.click('text=Introduction to CS');
    
    // Should see assignment grades
    await expect(page.locator('text=Homework 1')).toBeVisible();
    await expect(page.locator('text=85/100')).toBeVisible();
  });
});
```

## Test Coverage

### Coverage Goals

- **Overall**: 80%+
- **Critical paths**: 95%+
- **Services/Business Logic**: 90%+
- **Controllers**: 80%+
- **Utilities**: 90%+
- **Components**: 70%+

### Running Coverage Reports

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage
```

### Coverage Reports

Reports are generated in:
- Backend: `backend/coverage/`
- Frontend: `frontend/coverage/`

View HTML report: `coverage/lcov-report/index.html`

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- tests/unit/services/courseService.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run specific test file
npm test -- CourseCard.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test -- --ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e -- --headed

# Run E2E tests for specific browser
npm run test:e2e -- --project=firefox
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: edusystem_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5433:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run tests
        run: cd backend && npm run test:coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5433/edusystem_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: backend

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run tests
        run: cd frontend && npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Install Playwright
        run: cd frontend && npx playwright install --with-deps
      
      - name: Start services
        run: docker-compose -f docker-compose.test.yml up -d
      
      - name: Run E2E tests
        run: cd frontend && npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Best Practices

### General

1. **Write Descriptive Test Names**
   ```typescript
   // Good
   test('should return 404 when course not found', () => {});
   
   // Bad
   test('course test', () => {});
   ```

2. **One Assertion Per Test (When Possible)**
   - Easier to identify failures
   - More maintainable

3. **Use Test Data Builders/Factories**
   - Reduces boilerplate
   - Makes tests more readable

4. **Clean Up After Tests**
   - Clear database
   - Reset mocks
   - Close connections

5. **Test Edge Cases**
   - Empty inputs
   - Null/undefined
   - Boundary values
   - Error conditions

### Backend

1. **Mock External Dependencies**
   - Database calls in unit tests
   - Email services
   - Third-party APIs

2. **Use Test Database**
   - Separate from development DB
   - Reset between tests

3. **Test Security**
   - Authentication
   - Authorization
   - Input validation

### Frontend

1. **Test User Interactions**
   - Button clicks
   - Form submissions
   - Navigation

2. **Mock API Calls**
   - Use MSW for consistent mocking
   - Test loading/error states

3. **Test Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader compatibility

4. **Avoid Implementation Details**
   ```typescript
   // Good - tests behavior
   expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
   
   // Bad - tests implementation
   expect(component.state.isSubmitting).toBe(false);
   ```

### E2E

1. **Test Critical Paths**
   - User registration/login
   - Course enrollment
   - Assignment submission
   - Payment flows

2. **Keep Tests Independent**
   - Each test should run in isolation
   - Don't depend on previous test state

3. **Use Page Object Model**
   ```typescript
   class LoginPage {
     async login(email: string, password: string) {
       await this.page.fill('[name="email"]', email);
       await this.page.fill('[name="password"]', password);
       await this.page.click('button[type="submit"]');
     }
   }
   ```

4. **Handle Waits Properly**
   ```typescript
   // Good - wait for specific condition
   await expect(page.locator('text=Success')).toBeVisible();
   
   // Bad - arbitrary wait
   await page.waitForTimeout(5000);
   ```
