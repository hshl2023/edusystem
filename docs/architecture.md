# EduSystem Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [System Components](#system-components)
4. [Request Flow](#request-flow)
5. [Authentication & Authorization](#authentication--authorization)
6. [Data Flow](#data-flow)
7. [Caching Strategy](#caching-strategy)
8. [Real-time Features](#real-time-features)
9. [File Storage](#file-storage)
10. [Deployment Architecture](#deployment-architecture)
11. [Security Considerations](#security-considerations)
12. [Scalability](#scalability)

## System Overview

EduSystem is built using a modern three-tier architecture with clear separation between presentation, business logic, and data layers. The system follows REST architectural principles for the API and uses WebSockets for real-time features.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │   Mobile     │  │   Desktop    │          │
│  │     SPA      │  │     App      │  │     App      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────┬────────────────────┬────────────────┬──────────────┘
             │                    │                │
             └────────────────────┴────────────────┘
                      HTTPS / WSS
┌────────────────────────────────────────────────────────────────┐
│                      API Gateway / Load Balancer                │
│                         (Nginx / AWS ALB)                       │
└────────────┬───────────────────────────────────────────────────┘
             │
             ├──────────────────────────────────────┐
             │                                      │
┌────────────▼──────────────┐         ┌────────────▼──────────────┐
│    Backend Instance 1     │         │    Backend Instance N     │
│  (Node.js + Express)      │         │  (Node.js + Express)      │
│                           │         │                           │
│  ┌─────────────────────┐  │         │  ┌─────────────────────┐  │
│  │   Controllers       │  │         │  │   Controllers       │  │
│  ├─────────────────────┤  │         │  ├─────────────────────┤  │
│  │   Services          │  │         │  │   Services          │  │
│  ├─────────────────────┤  │         │  ├─────────────────────┤  │
│  │   Middleware        │  │         │  │   Middleware        │  │
│  └─────────────────────┘  │         │  └─────────────────────┘  │
└────────────┬──────────────┘         └────────────┬──────────────┘
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                ┌───────────────┴────────────────┐
                │                                │
    ┌───────────▼──────────┐       ┌───────────▼──────────┐
    │   PostgreSQL         │       │      Redis           │
    │   (Primary DB)       │       │   (Cache/Session)    │
    └──────────────────────┘       └──────────────────────┘
```

## Architecture Patterns

### 1. Layered Architecture

The backend follows a strict layered architecture:

```
Routes → Controllers → Services → Repositories → Database
```

**Routes Layer**: Defines API endpoints and maps to controllers
- Handles routing configuration
- Applies route-level middleware
- Validates request structure

**Controller Layer**: Handles HTTP requests/responses
- Extracts data from requests
- Calls appropriate services
- Formats responses
- Handles HTTP-specific concerns

**Service Layer**: Contains business logic
- Implements business rules
- Coordinates between repositories
- Handles transactions
- Performs complex operations

**Repository Layer**: Data access abstraction
- TypeORM entities and repositories
- Database queries
- Data mapping

### 2. Frontend Component Architecture

```
┌─────────────────────────────────────────┐
│              App Router                  │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐           ┌────▼───┐
│ Layout │           │ Pages  │
└───┬────┘           └────┬───┘
    │                     │
    │     ┌───────────────┴────────────┐
    │     │                            │
┌───▼─────▼───┐                  ┌─────▼──────┐
│  Features    │                  │  Shared    │
│  Components  │                  │ Components │
└──────┬───────┘                  └─────┬──────┘
       │                                │
       └────────────┬───────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼─────┐         ┌─────▼────┐
    │  Hooks   │         │  Store   │
    └────┬─────┘         └─────┬────┘
         │                     │
         └──────────┬──────────┘
                    │
              ┌─────▼─────┐
              │  API      │
              │  Client   │
              └───────────┘
```

## System Components

### Backend Components

#### 1. API Server
- **Technology**: Node.js with Express
- **Responsibilities**:
  - Handle HTTP requests
  - Route management
  - Middleware execution
  - WebSocket connections
  - Response formatting

#### 2. Authentication Service
- **JWT-based authentication**
- Token generation and validation
- Password hashing and verification
- Refresh token management
- Session management

#### 3. User Management Service
- User CRUD operations
- Profile management
- Role assignment
- User search and filtering

#### 4. Course Management Service
- Course creation and updates
- Enrollment management
- Course materials handling
- Calendar management

#### 5. Assignment Service
- Assignment lifecycle management
- Submission handling
- File upload coordination
- Deadline enforcement

#### 6. Grading Service
- Grade calculation
- Rubric management
- Grade distribution analytics
- Export functionality

#### 7. Notification Service
- Real-time notifications
- Email notifications
- Notification preferences
- Announcement broadcasting

### Frontend Components

#### 1. Authentication Module
- Login/Logout flows
- Registration
- Password reset
- Token management

#### 2. Dashboard
- Role-specific landing pages
- Quick actions
- Recent activity
- Notifications panel

#### 3. Course Module
- Course listing and search
- Course details
- Enrollment interface
- Course materials viewer

#### 4. Assignment Module
- Assignment list
- Assignment creation (teachers)
- Submission interface (students)
- Grading interface (teachers)

#### 5. Grade Module
- Gradebook viewer
- Grade analytics
- Export functionality

#### 6. User Management Module (Admin)
- User listing and search
- User creation/editing
- Role management
- Bulk operations

## Request Flow

### Typical API Request Flow

```
1. Client Request
   │
   ├─→ [HTTPS/TLS]
   │
2. Load Balancer/API Gateway
   │
   ├─→ [Route to backend instance]
   │
3. Express Middleware Chain
   │
   ├─→ CORS Middleware
   ├─→ Request Logger
   ├─→ Body Parser
   ├─→ Rate Limiter
   ├─→ Authentication Middleware (if protected route)
   │   └─→ Verify JWT token
   │       └─→ Extract user info
   ├─→ Authorization Middleware
   │   └─→ Check user permissions
   └─→ Route Handler
       │
4. Controller
   │
   ├─→ Validate request data (Joi)
   ├─→ Call service method
   │
5. Service Layer
   │
   ├─→ Business logic execution
   ├─→ Multiple repository calls if needed
   ├─→ Transaction management
   │
6. Repository/TypeORM
   │
   ├─→ Query construction
   ├─→ Database query execution
   │
7. PostgreSQL
   │
   ├─→ Execute query
   ├─→ Return results
   │
8. Response Path (reverse)
   │
   ├─→ Service processes data
   ├─→ Controller formats response
   ├─→ Response middleware
   └─→ Send to client
```

### Example: Submit Assignment Request

```
POST /api/assignments/:id/submit

1. Frontend: User clicks "Submit Assignment"
   └─→ FormData with file + text

2. API Gateway: Route to available backend

3. Middleware Chain:
   ├─→ authenticate: Verify JWT, extract userId
   ├─→ authorize: Check if user is enrolled in course
   └─→ multer: Handle file upload

4. AssignmentController.submitAssignment()
   ├─→ Validate submission data
   └─→ Call assignmentService.submitAssignment()

5. AssignmentService.submitAssignment()
   ├─→ Check if assignment is still accepting submissions
   ├─→ Save file to storage
   ├─→ Create submission record (transaction)
   ├─→ Update enrollment submission count
   ├─→ Create notification for teacher
   └─→ Return submission object

6. Response:
   └─→ 201 Created + submission details
```

## Authentication & Authorization

### Authentication Mechanism

EduSystem uses JWT (JSON Web Tokens) for stateless authentication:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                           │
└─────────────────────────────────────────────────────────────────┘

1. Login Request
   │
   POST /api/auth/login
   Body: { email, password }
   │
   └─→ Backend verifies credentials
       │
       ├─→ Hash comparison (bcrypt)
       │
       └─→ Generate tokens:
           ├─→ Access Token (short-lived, 1 hour)
           └─→ Refresh Token (long-lived, 7 days)
   │
   Response:
   {
     accessToken: "eyJhbGc...",
     refreshToken: "eyJhbGc...",
     user: { id, email, role, ... }
   }

2. Authenticated Request
   │
   Authorization: Bearer <accessToken>
   │
   └─→ Middleware verifies token:
       ├─→ Check signature
       ├─→ Check expiration
       ├─→ Extract user info
       └─→ Attach to request.user

3. Token Refresh
   │
   POST /api/auth/refresh
   Body: { refreshToken }
   │
   └─→ Verify refresh token
       └─→ Issue new access token
```

### Authorization (RBAC)

Role-Based Access Control with three primary roles:

```typescript
enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

// Permission Matrix
const permissions = {
  admin: [
    'users:create', 'users:read', 'users:update', 'users:delete',
    'courses:create', 'courses:read', 'courses:update', 'courses:delete',
    'assignments:*', 'grades:*', 'system:*'
  ],
  teacher: [
    'courses:create', 'courses:read', 'courses:update',
    'courses:delete:own',
    'assignments:create', 'assignments:read', 'assignments:update',
    'assignments:delete:own',
    'grades:create', 'grades:read', 'grades:update',
    'submissions:read', 'submissions:grade'
  ],
  student: [
    'courses:read', 'courses:enroll',
    'assignments:read:enrolled', 'assignments:submit',
    'grades:read:own', 'submissions:read:own'
  ]
}
```

### Authorization Middleware

```typescript
// Example authorization middleware
const authorize = (...allowedRoles: UserRole[]) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage in routes
router.post('/courses', 
  authenticate, 
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  courseController.create
);
```

## Data Flow

### Read Operation Flow

```
Frontend Request
    ↓
API Call (axios/fetch)
    ↓
Backend Route Handler
    ↓
Authentication Middleware
    ↓
Authorization Check
    ↓
Controller
    ↓
Service Layer
    ↓
Check Redis Cache ──→ Cache Hit → Return Cached Data
    ↓ Cache Miss               ↓
TypeORM Repository            Format Response
    ↓                         ↓
PostgreSQL Query             Send to Client
    ↓                         ↓
Store in Redis Cache         Update UI State
    ↓
Return Data
```

### Write Operation Flow

```
Frontend Request
    ↓
Optimistic UI Update (optional)
    ↓
API Call with data
    ↓
Backend Route Handler
    ↓
Authentication Middleware
    ↓
Authorization Check
    ↓
Request Validation (Joi)
    ↓
Controller
    ↓
Service Layer
    ↓
Begin Transaction
    ↓
Multiple DB Operations
    ↓
Commit Transaction ──→ Success → Invalidate Cache
    ↓                            ↓
Rollback on Error              Create Notification
    ↓                            ↓
Return Response               WebSocket Broadcast
    ↓                            ↓
Update Frontend State        Real-time Update
```

## Caching Strategy

### Multi-Layer Caching

```
┌─────────────────────────────────────────┐
│         Browser Cache (TTL: varies)      │
│     (Static assets, API responses)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Redis Cache (TTL: 5-60 min)     │
│     (User sessions, frequent queries)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Database Query Cache             │
│         (PostgreSQL shared_buffers)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            Disk Storage                  │
└──────────────────────────────────────────┘
```

### Redis Cache Usage

```typescript
// Cache patterns
const cachePatterns = {
  user: 'user:{userId}',              // TTL: 30 min
  course: 'course:{courseId}',        // TTL: 60 min
  courseList: 'courses:list:{query}', // TTL: 5 min
  enrollment: 'enrollment:{userId}',  // TTL: 15 min
  grades: 'grades:{userId}:{courseId}' // TTL: 10 min
};

// Cache invalidation strategy
// - Write-through: Update cache on write
// - TTL-based expiration
// - Manual invalidation on updates
```

## Real-time Features

### WebSocket Architecture

```
┌─────────────────────────────────────────┐
│            Client (Socket.IO)            │
└──────────────┬──────────────────────────┘
               │ WebSocket Connection
┌──────────────▼──────────────────────────┐
│      Socket.IO Server (Backend)         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Connection Manager               │ │
│  │   - User socket mapping            │ │
│  │   - Room management                │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Event Handlers                   │ │
│  │   - notifications                  │ │
│  │   - messages                       │ │
│  │   - presence                       │ │
│  └────────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Redis Pub/Sub (Multi-instance)     │
└──────────────────────────────────────────┘
```

### Real-time Events

- **Notifications**: Assignment posted, grade published
- **Presence**: Online/offline status
- **Messages**: Direct messaging
- **Updates**: Live grade updates, course announcements

## File Storage

### Storage Architecture

```
┌─────────────────────────────────────────┐
│           File Upload Request            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Multer Middleware                 │
│        - Size validation                 │
│        - Type validation                 │
│        - Memory buffering                │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴───────┐
        │              │
┌───────▼─────┐  ┌─────▼────────┐
│   Local     │  │   S3/Cloud   │
│  Storage    │  │   Storage    │
│  (Dev)      │  │  (Production)│
└───────┬─────┘  └─────┬────────┘
        │              │
        └──────┬───────┘
               │
┌──────────────▼──────────────────────────┐
│     Database Record                      │
│     - file path/URL                      │
│     - metadata                           │
└──────────────────────────────────────────┘
```

### File Types

- **Documents**: PDF, DOCX, TXT (max 10MB)
- **Images**: JPG, PNG, GIF (max 5MB)
- **Archives**: ZIP (max 50MB)
- **Spreadsheets**: XLSX, CSV (max 10MB)

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────┐
│         Docker Compose Stack            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Frontend Container               │ │
│  │  - Vite Dev Server :5173          │ │
│  │  - Hot Module Replacement         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Backend Container                │ │
│  │  - Node.js :3000                  │ │
│  │  - Nodemon (hot reload)           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  PostgreSQL Container             │ │
│  │  - Port: 5432                     │ │
│  │  - Volume: postgres_data          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Redis Container                  │ │
│  │  - Port: 6379                     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer (AWS ALB)                   │
│                    SSL/TLS Termination                       │
└────────┬──────────────────────────────┬─────────────────────┘
         │                              │
┌────────▼────────┐          ┌──────────▼──────────┐
│   Frontend      │          │   Backend Cluster   │
│   (S3 + CDN)    │          │   (ECS/Kubernetes)  │
│   Static Files  │          │                     │
└─────────────────┘          │  ┌────────────────┐ │
                             │  │  Instance 1    │ │
                             │  │  Instance 2    │ │
                             │  │  Instance N    │ │
                             │  └────────────────┘ │
                             └──────────┬──────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
         ┌──────────▼──────────┐              ┌────────────▼─────────┐
         │   PostgreSQL RDS    │              │   ElastiCache Redis  │
         │   - Multi-AZ        │              │   - Cluster Mode     │
         │   - Read Replicas   │              │   - Failover         │
         └─────────────────────┘              └──────────────────────┘
```

### Environment-Specific Configurations

#### Development
- Single instance of each service
- Hot reload enabled
- Verbose logging
- Debug tools enabled
- Local file storage
- Seeded test data

#### Staging
- Production-like setup
- Scaled-down resources
- Integration with test services
- Test data
- Monitoring enabled

#### Production
- Multiple backend instances (auto-scaling)
- Database replication
- Redis cluster
- CDN for static assets
- Cloud file storage (S3)
- Full monitoring and alerting
- Automated backups
- HTTPS only
- Rate limiting enforced

## Security Considerations

### Application Security

1. **Authentication**
   - JWT with short expiration
   - Refresh token rotation
   - Secure token storage (httpOnly cookies or secure storage)

2. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - Ownership validation

3. **Input Validation**
   - Schema validation (Joi)
   - Type checking (TypeScript)
   - Sanitization of user input

4. **SQL Injection Prevention**
   - Parameterized queries (TypeORM)
   - No raw SQL with user input

5. **XSS Prevention**
   - Content Security Policy
   - Input sanitization
   - Output encoding

6. **CSRF Protection**
   - SameSite cookies
   - CSRF tokens for state-changing operations

7. **Rate Limiting**
   - Per-IP rate limits
   - Per-user rate limits
   - Endpoint-specific limits

### Infrastructure Security

1. **Network Security**
   - VPC isolation
   - Security groups
   - Private subnets for databases

2. **Data Encryption**
   - TLS 1.3 in transit
   - Encrypted at rest (database, file storage)
   - Encrypted backups

3. **Secrets Management**
   - Environment variables
   - Secrets manager (AWS Secrets Manager, HashiCorp Vault)
   - No secrets in code

4. **Monitoring & Logging**
   - Centralized logging
   - Security event monitoring
   - Audit trails

## Scalability

### Horizontal Scaling

The architecture supports horizontal scaling:

1. **Stateless Backend**
   - No server-side sessions (JWT)
   - Can add backend instances freely
   - Load balanced across instances

2. **Database Scaling**
   - Read replicas for read-heavy operations
   - Connection pooling
   - Query optimization

3. **Caching**
   - Redis cluster for distributed caching
   - Reduces database load

4. **File Storage**
   - Cloud storage (S3) scales automatically
   - CDN for global distribution

### Performance Optimizations

1. **Database**
   - Indexed columns for frequent queries
   - Materialized views for complex reports
   - Connection pooling

2. **API**
   - Response compression
   - Pagination for list endpoints
   - Field selection/projection

3. **Frontend**
   - Code splitting
   - Lazy loading
   - Asset optimization (minification, compression)
   - Service worker caching

4. **Monitoring**
   - Application Performance Monitoring (APM)
   - Database query analysis
   - Real-time metrics

### Load Estimates

For 10,000 concurrent users:
- Backend: 5-10 instances (2 CPU, 4GB RAM each)
- Database: RDS instance (4 CPU, 16GB RAM)
- Redis: 1GB memory cluster
- Storage: ~100GB for user files
