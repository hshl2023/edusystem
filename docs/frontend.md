# EduSystem Frontend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [State Management](#state-management)
5. [Routing](#routing)
6. [Component Architecture](#component-architecture)
7. [API Integration](#api-integration)
8. [Authentication Flow](#authentication-flow)
9. [UI Conventions](#ui-conventions)
10. [Forms and Validation](#forms-and-validation)
11. [Real-time Features](#real-time-features)
12. [Performance Optimization](#performance-optimization)
13. [Development Guidelines](#development-guidelines)

## Overview

The EduSystem frontend is a modern single-page application (SPA) built with React and TypeScript. It provides a responsive, accessible, and performant user interface for students, teachers, and administrators.

### Key Features
- Role-based UI rendering
- Real-time notifications
- Responsive design (mobile, tablet, desktop)
- Offline-capable with service workers
- Accessible (WCAG 2.1 AA compliant)
- Progressive Web App (PWA) capabilities

## Technology Stack

### Core Technologies

- **React 18+**: UI library with concurrent features
- **TypeScript 5+**: Type-safe JavaScript
- **Vite 5+**: Build tool and dev server

### UI & Styling

- **Tailwind CSS 3+**: Utility-first CSS framework
- **shadcn/ui**: Accessible component primitives
- **Radix UI**: Unstyled, accessible components
- **Lucide React**: Icon library
- **clsx/tailwind-merge**: Conditional class merging

### State Management

- **Zustand**: Lightweight global state
- **TanStack Query (React Query)**: Server state management
- **Zod**: Runtime type validation

### Routing & Navigation

- **React Router v6**: Client-side routing
- **React Router DOM**: DOM bindings

### Forms

- **React Hook Form**: Performant form handling
- **Zod**: Schema validation

### Real-time

- **Socket.IO Client**: WebSocket client

### Utilities

- **Axios**: HTTP client
- **date-fns**: Date manipulation
- **React Hot Toast**: Toast notifications

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing
- **Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

## Project Structure

```
frontend/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── manifest.json           # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── auth/               # Auth-related components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── courses/            # Course components
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseList.tsx
│   │   │   ├── CourseDetails.tsx
│   │   │   └── EnrollButton.tsx
│   │   │
│   │   ├── assignments/        # Assignment components
│   │   │   ├── AssignmentCard.tsx
│   │   │   ├── AssignmentForm.tsx
│   │   │   ├── SubmissionForm.tsx
│   │   │   └── GradingInterface.tsx
│   │   │
│   │   ├── grades/             # Grade components
│   │   │   ├── GradeTable.tsx
│   │   │   ├── GradeChart.tsx
│   │   │   └── GradeAnalytics.tsx
│   │   │
│   │   └── common/             # Common components
│   │       ├── DataTable.tsx
│   │       ├── Pagination.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FileUpload.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/                  # Page components (routes)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   │
│   │   ├── courses/
│   │   │   ├── CoursesPage.tsx
│   │   │   ├── CourseDetailPage.tsx
│   │   │   └── CreateCoursePage.tsx
│   │   │
│   │   ├── assignments/
│   │   │   ├── AssignmentsPage.tsx
│   │   │   ├── AssignmentDetailPage.tsx
│   │   │   ├── CreateAssignmentPage.tsx
│   │   │   └── SubmitAssignmentPage.tsx
│   │   │
│   │   ├── grades/
│   │   │   └── GradesPage.tsx
│   │   │
│   │   ├── profile/
│   │   │   └── ProfilePage.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── UsersPage.tsx
│   │   │   ├── SystemStatsPage.tsx
│   │   │   └── AuditLogsPage.tsx
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useAssignments.ts
│   │   ├── useGrades.ts
│   │   ├── useNotifications.ts
│   │   ├── useWebSocket.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── api/                    # API client
│   │   ├── client.ts           # Axios instance
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── courses.ts          # Course endpoints
│   │   ├── assignments.ts      # Assignment endpoints
│   │   ├── grades.ts           # Grade endpoints
│   │   ├── users.ts            # User endpoints
│   │   └── types.ts            # API types
│   │
│   ├── lib/                    # Utilities and helpers
│   │   ├── utils.ts            # General utilities
│   │   ├── validation.ts       # Zod schemas
│   │   ├── formatters.ts       # Data formatters
│   │   └── constants.ts        # App constants
│   │
│   ├── types/                  # TypeScript types
│   │   ├── auth.ts
│   │   ├── course.ts
│   │   ├── assignment.ts
│   │   ├── grade.ts
│   │   └── user.ts
│   │
│   ├── styles/                 # Global styles
│   │   ├── globals.css
│   │   └── themes.css
│   │
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── router.tsx              # Route configuration
│
├── tests/                      # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                # Environment variables template
├── .eslintrc.cjs              # ESLint configuration
├── .prettierrc                # Prettier configuration
├── index.html                 # HTML entry point
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind configuration
├── vite.config.ts             # Vite configuration
└── vitest.config.ts           # Vitest configuration
```

## State Management

EduSystem uses a hybrid state management approach:

### 1. Server State (TanStack Query)

For data that comes from the API:

```typescript
// hooks/useCourses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, createCourse } from '@/api/courses';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
```

**Benefits**:
- Automatic caching
- Background refetching
- Request deduplication
- Loading/error states
- Optimistic updates

### 2. Client State (Zustand)

For UI state and authentication:

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      login: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);
```

```typescript
// store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

### State Management Principles

1. **Server state in React Query** - API data, caching, synchronization
2. **Client state in Zustand** - UI state, user preferences, auth tokens
3. **Component state (useState)** - Local component state only
4. **URL state (React Router)** - Shareable state (filters, pagination)

## Routing

Routes are defined using React Router v6:

```typescript
// router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <ProtectedRoute><CoursesPage /></ProtectedRoute>,
          },
          {
            path: ':id',
            element: <ProtectedRoute><CourseDetailPage /></ProtectedRoute>,
          },
          {
            path: 'create',
            element: <ProtectedRoute roles={['teacher', 'admin']}><CreateCoursePage /></ProtectedRoute>,
          },
        ],
      },
      {
        path: 'assignments',
        children: [
          {
            index: true,
            element: <ProtectedRoute><AssignmentsPage /></ProtectedRoute>,
          },
          {
            path: ':id',
            element: <ProtectedRoute><AssignmentDetailPage /></ProtectedRoute>,
          },
          {
            path: ':id/submit',
            element: <ProtectedRoute roles={['student']}><SubmitAssignmentPage /></ProtectedRoute>,
          },
        ],
      },
      {
        path: 'grades',
        element: <ProtectedRoute><GradesPage /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: <ProtectedRoute roles={['admin']} />,
        children: [
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'stats',
            element: <SystemStatsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

### Protected Routes

```typescript
// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles 
}) => {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

## Component Architecture

### Component Categories

#### 1. Base UI Components (`components/ui/`)

Reusable, generic components from shadcn/ui:

```typescript
// components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### 2. Feature Components

Domain-specific components:

```typescript
// components/courses/CourseCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.code}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {course.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm">
            {course.enrollmentCount} / {course.maxEnrollment} students
          </span>
          {onEnroll && (
            <Button onClick={() => onEnroll(course.id)}>
              Enroll
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

#### 3. Page Components

Full page views that compose feature components:

```typescript
// pages/courses/CoursesPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/courses/CourseCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useCourses({ page, search });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      
      <SearchBar
        value={search}
        onChange={(value) => setSearchParams({ search: value, page: '1' })}
        placeholder="Search courses..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data?.data.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={data?.pagination.pages || 1}
        onPageChange={(newPage) => setSearchParams({ search, page: String(newPage) })}
      />
    </div>
  );
};
```

## API Integration

### Axios Client Setup

```typescript
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        useAuthStore.getState().login(useAuthStore.getState().user!, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### API Service Example

```typescript
// api/courses.ts
import { apiClient } from './client';
import { Course, CreateCourseDto } from '@/types/course';

export const getCourses = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { data } = await apiClient.get('/courses', { params });
  return data;
};

export const getCourse = async (id: string) => {
  const { data } = await apiClient.get(`/courses/${id}`);
  return data;
};

export const createCourse = async (courseData: CreateCourseDto) => {
  const { data } = await apiClient.post('/courses', courseData);
  return data;
};

export const enrollInCourse = async (courseId: string) => {
  const { data } = await apiClient.post(`/courses/${courseId}/enroll`);
  return data;
};
```

## Authentication Flow

### Login Flow

```typescript
// hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Login failed');
    },
  });
};
```

```typescript
// components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          error={errors.email?.message}
        />
      </div>
      <div>
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
```

## UI Conventions

### Design System

#### Colors

```css
/* styles/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}
```

#### Typography

- **Headings**: Bold, clear hierarchy
  - H1: 3xl (30px)
  - H2: 2xl (24px)
  - H3: xl (20px)
  - H4: lg (18px)
- **Body**: Base (16px)
- **Small**: sm (14px)
- **Tiny**: xs (12px)

#### Spacing

Consistent spacing using Tailwind's scale:
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)

### Component Patterns

#### Loading States

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}
```

#### Error States

```typescript
if (error) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-destructive mb-4">Failed to load data</p>
      <Button onClick={() => refetch()}>Try Again</Button>
    </div>
  );
}
```

#### Empty States

```typescript
if (data?.data.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">No courses found</p>
      <Button onClick={() => navigate('/courses/create')}>
        Create Course
      </Button>
    </div>
  );
}
```

## Forms and Validation

### Form Handling with React Hook Form + Zod

```typescript
// lib/validation.ts
import { z } from 'zod';

export const courseSchema = z.object({
  code: z.string().min(2).max(20),
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  maxEnrollment: z.number().min(1).max(500),
  startDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Start date must be in the future',
  }),
  endDate: z.string(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});
```

```typescript
// components/courses/CourseForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema } from '@/lib/validation';

export const CourseForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

## Real-time Features

### WebSocket Integration

```typescript
// hooks/useWebSocket.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

let socket: Socket | null = null;

export const useWebSocket = () => {
  const { accessToken } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!accessToken) return;

    socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token: accessToken },
    });

    socket.on('notification', (data) => {
      addNotification(data);
    });

    socket.on('grade_published', (data) => {
      // Handle grade notification
    });

    return () => {
      socket?.disconnect();
    };
  }, [accessToken]);

  return socket;
};
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load routes
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

<Route 
  path="/admin" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  } 
/>
```

### Memoization

```typescript
import { useMemo } from 'react';

const sortedCourses = useMemo(() => {
  return courses.sort((a, b) => a.title.localeCompare(b.title));
}, [courses]);
```

### Virtual Lists

For long lists, use virtualization:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// Render only visible items
```

## Development Guidelines

### Code Style

1. **Use TypeScript** - Always type your code
2. **Functional Components** - Use function components with hooks
3. **Named Exports** - Prefer named exports over default
4. **Props Interface** - Define props interface for all components
5. **Comments** - Only for complex logic, code should be self-documenting

### File Naming

- Components: PascalCase (`CourseCard.tsx`)
- Hooks: camelCase with `use` prefix (`useCourses.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: camelCase (`course.ts`)

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onSubmit }) => {
  // 4. Hooks
  const [value, setValue] = useState('');

  // 5. Handlers
  const handleClick = () => {
    onSubmit();
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Submit</Button>
    </div>
  );
};
```

### Testing

1. **Unit Tests** - Test utility functions and hooks
2. **Component Tests** - Test component rendering and interactions
3. **Integration Tests** - Test feature flows
4. **E2E Tests** - Test critical user journeys

### Accessibility

1. **Semantic HTML** - Use proper HTML elements
2. **ARIA Labels** - Add ARIA labels where needed
3. **Keyboard Navigation** - Ensure all interactive elements are keyboard accessible
4. **Focus Management** - Manage focus for modals and dynamic content
5. **Color Contrast** - Ensure WCAG AA compliance

### Performance

1. **Lazy Loading** - Code split routes and heavy components
2. **Image Optimization** - Use optimized images with proper sizing
3. **Debounce/Throttle** - Debounce search inputs, throttle scroll handlers
4. **Memoization** - Memoize expensive computations
5. **Virtual Scrolling** - Use for long lists
