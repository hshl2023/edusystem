# EduSystem - Modern Educational Management Platform

## Overview

EduSystem is a comprehensive educational management platform designed to streamline the interaction between students, teachers, and administrators. The system provides a robust set of features for course management, assignment submission, grading, and real-time communication within educational institutions.

## Architecture

EduSystem follows a modern, decoupled architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                  (React + TypeScript + Vite)                 │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Courses  │  │Assignments│  │   Users  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬──────────────────────────────────────┘
                        │ REST API (JSON)
                        │ WebSocket (Real-time)
┌───────────────────────┴──────────────────────────────────────┐
│                        Backend Layer                         │
│                  (Node.js + Express + TypeScript)            │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Authentication  │  │   Authorization   │                │
│  │     (JWT)        │  │   (Role-based)    │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Courses  │  │Assignments│  │  Grades  │   │
│  │ Service  │  │ Service  │  │  Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬──────────────────────────────────────┘
                        │ SQL Queries (TypeORM)
┌───────────────────────┴──────────────────────────────────────┐
│                      Database Layer                          │
│                     (PostgreSQL 15+)                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ courses  │  │assignments│  │  grades  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │enrollments│ │submissions│ │notifications│                │
│  └──────────┘  └──────────┘  └──────────┘                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Docker   │  │   Redis    │  │  File      │            │
│  │ Containers │  │   Cache    │  │  Storage   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **React 18+**: Modern UI library with hooks and concurrent features
- **TypeScript**: Type safety and improved developer experience
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Zod**: Runtime type validation

**Rationale**: React provides a mature ecosystem with excellent community support. TypeScript adds type safety reducing runtime errors. Vite offers superior development experience with instant HMR. Zustand and TanStack Query provide optimal state management without Redux boilerplate.

### Backend
- **Node.js 18+**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe backend development
- **TypeORM**: Object-relational mapping with migrations
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing
- **Joi**: Request validation
- **Winston**: Logging framework
- **Express Rate Limit**: API rate limiting

**Rationale**: Node.js enables JavaScript across the stack. Express provides flexibility and extensive middleware ecosystem. TypeORM simplifies database operations with type safety. JWT enables scalable, stateless authentication suitable for microservices.

### Database
- **PostgreSQL 15+**: Relational database
- **Redis**: Session cache and real-time features

**Rationale**: PostgreSQL offers ACID compliance, advanced querying capabilities, and excellent JSON support for flexible data structures. Redis provides high-performance caching and pub/sub for real-time features.

### DevOps
- **Docker & Docker Compose**: Containerization and orchestration
- **Nginx**: Reverse proxy and static file serving
- **GitHub Actions**: CI/CD pipelines

## Key Features

### User Management
- **Multi-role authentication**: Students, Teachers, Administrators
- **Profile management**: Avatars, contact information, preferences
- **Role-based access control (RBAC)**: Fine-grained permissions
- **Password reset**: Email-based recovery flow
- **Session management**: Secure JWT with refresh tokens

### Course Management
- **Course creation**: Teachers can create and manage courses
- **Enrollment**: Students can browse and enroll in courses
- **Course materials**: Upload syllabi, lecture notes, resources
- **Course calendar**: Schedule classes, exams, office hours
- **Announcements**: Course-wide notifications

### Assignment System
- **Assignment creation**: Multiple question types (essay, multiple choice, file upload)
- **Submission workflow**: Draft, submit, late submission handling
- **File uploads**: Support for various document formats
- **Deadline enforcement**: Automatic late penalties
- **Plagiarism checking**: Integration with similarity detection

### Grading System
- **Gradebook**: Comprehensive grade tracking per course
- **Rubric support**: Customizable grading rubrics
- **Grade analytics**: Distribution charts, statistics
- **Grade export**: CSV/Excel format support
- **Grade appeals**: Student submission review requests

### Communication
- **Announcements**: System, course, and class-level
- **Messaging**: Direct messages between users
- **Notifications**: Real-time alerts for important events
- **Discussion forums**: Course-specific discussions

### Analytics & Reporting
- **Student progress tracking**: Completion rates, grade trends
- **Course analytics**: Enrollment statistics, success rates
- **Teacher performance**: Teaching load, grade distribution
- **Admin dashboards**: System-wide metrics

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker)
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-org/edusystem.git
cd edusystem
```

2. **Set up environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

3. **Start with Docker Compose (Recommended)**
```bash
docker-compose up -d
```

This starts:
- Backend API on `http://localhost:3000`
- Frontend on `http://localhost:5173`
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

4. **Run database migrations**
```bash
cd backend
npm run migration:run
```

5. **Seed sample data (optional)**
```bash
npm run seed
```

### Manual Setup (Without Docker)

1. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Set up PostgreSQL database**
```bash
createdb edusystem_dev
```

3. **Run migrations**
```bash
cd backend
npm run migration:run
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/edusystem_dev

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-refresh-secret-change-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=EduSystem
```

## Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend

# Unit tests
npm test

# Component tests
npm run test:components

# E2E tests with Playwright
npm run test:e2e

# Coverage report
npm run test:coverage
```

## API Documentation

API documentation is available in multiple formats:

- **Interactive Swagger UI**: `http://localhost:3000/api/docs` (when backend is running)
- **OpenAPI Spec**: `/docs/openapi.yaml`
- **Markdown Reference**: `/docs/api.md`

## Project Structure

```
edusystem/
├── backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # TypeORM entities
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── migrations/      # Database migrations
│   ├── tests/               # Test suites
│   ├── uploads/             # File uploads (gitignored)
│   └── package.json
│
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Zustand stores
│   │   ├── api/             # API client
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
│
├── docs/                    # Documentation
│   ├── architecture.md      # Architecture details
│   ├── api.md               # API reference
│   ├── data-model.md        # Database schema
│   ├── frontend.md          # Frontend guide
│   └── testing.md           # Testing strategy
│
├── docker-compose.yml       # Docker orchestration
├── docker-compose.prod.yml  # Production configuration
├── .github/
│   └── workflows/           # CI/CD pipelines
└── README.md
```

## Deployment

### Production Deployment

1. **Build applications**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

2. **Deploy with Docker**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Run migrations**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run
```

### Environment-specific Configurations

- **Development**: Hot reload, verbose logging, debug tools
- **Staging**: Production-like, with test data, monitoring
- **Production**: Optimized builds, security hardening, monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Security

- All passwords are hashed with bcrypt (12 rounds)
- JWT tokens with short expiration
- HTTPS enforced in production
- SQL injection prevention via parameterized queries
- XSS protection through input sanitization
- CSRF protection on state-changing endpoints
- Rate limiting on all API endpoints
- Security headers via Helmet.js

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: `/docs` directory
- **Issues**: GitHub Issues
- **Email**: support@edusystem.example.com

## Roadmap

- [ ] Mobile applications (iOS/Android)
- [ ] Video conferencing integration
- [ ] AI-powered assignment grading assistance
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] LMS standard compliance (SCORM, xAPI)
