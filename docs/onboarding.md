# EduSystem Developer Onboarding Guide

Welcome to the EduSystem development team! This guide will help you get set up and oriented with the project.

## Table of Contents
1. [Pre-requisites](#pre-requisites)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)
7. [Resources](#resources)
8. [Team Communication](#team-communication)

## Pre-requisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

- [ ] **Node.js 18+** - [Download](https://nodejs.org/)
  ```bash
  node --version  # Should be 18.x or higher
  ```

- [ ] **npm or yarn** - Comes with Node.js
  ```bash
  npm --version  # Should be 9.x or higher
  ```

- [ ] **Git** - [Download](https://git-scm.com/)
  ```bash
  git --version
  ```

- [ ] **Docker & Docker Compose** - [Download](https://www.docker.com/)
  ```bash
  docker --version
  docker-compose --version
  ```

- [ ] **PostgreSQL 15+** (if not using Docker) - [Download](https://www.postgresql.org/)
  ```bash
  psql --version
  ```

### Recommended Tools

- [ ] **VS Code** - [Download](https://code.visualstudio.com/)
- [ ] **Postman** or **Insomnia** - For API testing
- [ ] **DBeaver** or **pgAdmin** - For database management
- [ ] **Git GUI** (optional) - GitKraken, SourceTree, or GitHub Desktop

### VS Code Extensions

Install these extensions for the best development experience:

- ESLint
- Prettier - Code formatter
- TypeScript + JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- Docker
- REST Client (alternative to Postman)
- Error Lens
- Auto Rename Tag
- Path Intellisense

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/edusystem.git
cd edusystem
```

### 2. Set Up Environment Variables

#### Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```bash
# Node Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edusystem_dev

# JWT Secrets (change these!)
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-me
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# Email (optional for local dev)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASSWORD=your-mailtrap-password
SMTP_FROM=noreply@edusystem.local

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=EduSystem
```

### 3. Start Development Environment

#### Option A: Using Docker (Recommended)

This is the easiest way to get started:

```bash
# From project root
docker-compose up -d
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:5173
- PostgreSQL on localhost:5432
- Redis on localhost:6379

**Wait for services to start** (check logs):
```bash
docker-compose logs -f
```

Press `Ctrl+C` to stop following logs.

#### Option B: Manual Setup

**Terminal 1 - Database & Redis:**
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run migration:run  # Run database migrations
npm run seed          # Seed sample data (optional)
npm run dev           # Start development server
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Verify Installation

1. **Backend API**: Visit http://localhost:3000/api/health
   - You should see: `{"status": "ok"}`

2. **API Documentation**: Visit http://localhost:3000/api/docs
   - You should see Swagger UI

3. **Frontend**: Visit http://localhost:5173
   - You should see the login page

4. **Database Connection**:
   ```bash
   docker-compose exec postgres psql -U postgres -d edusystem_dev -c "\dt"
   ```
   - You should see a list of tables

### 5. Test Login

Use the seeded test accounts:

**Student Account:**
- Email: `student@test.com`
- Password: `TestPass123!`

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `TestPass123!`

**Admin Account:**
- Email: `admin@test.com`
- Password: `TestPass123!`

## Development Workflow

### Daily Workflow

1. **Pull Latest Changes**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**
   - Write code
   - Write tests
   - Update documentation if needed

4. **Run Tests**
   ```bash
   # Backend
   cd backend
   npm test

   # Frontend
   cd frontend
   npm test
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user profile editing"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

6. **Push Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in description
   - Request reviews
   - Link related issues

8. **Address Review Comments**
   - Make requested changes
   - Push updates to same branch
   - PR will update automatically

9. **Merge**
   - Once approved, merge to main
   - Delete feature branch

### Git Best Practices

1. **Keep commits small and focused**
2. **Write descriptive commit messages**
3. **Don't commit generated files** (check .gitignore)
4. **Don't commit secrets** (use .env files)
5. **Rebase before merging** (optional, team preference)
6. **Keep branches up to date**
   ```bash
   git checkout feature/your-feature
   git rebase main
   ```

## Code Standards

### TypeScript

- **Use TypeScript** for all new code
- **Define interfaces** for all data structures
- **Avoid `any` type** - use `unknown` if type is truly unknown
- **Use strict mode** - enabled in tsconfig.json

```typescript
// Good
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### Code Style

We use **ESLint** and **Prettier** for code formatting:

```bash
# Backend
cd backend
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format code

# Frontend
cd frontend
npm run lint
npm run lint:fix
npm run format
```

**Formatting happens automatically on save** if you have Prettier extension installed.

### Naming Conventions

- **Variables/Functions**: camelCase (`getUserById`, `courseName`)
- **Classes/Interfaces**: PascalCase (`UserService`, `CourseRepository`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`)
- **Files**:
  - Components: PascalCase (`CourseCard.tsx`)
  - Others: camelCase (`userService.ts`, `validation.ts`)
- **Database tables**: snake_case (`users`, `course_enrollments`)

### Project Structure

**Backend:**
```
src/
├── controllers/    # HTTP request handlers
├── services/       # Business logic
├── repositories/   # Data access layer
├── models/         # TypeORM entities
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── config/         # Configuration
```

**Frontend:**
```
src/
├── components/     # React components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── store/          # State management
├── api/            # API client
├── lib/            # Utilities
└── types/          # TypeScript types
```

### Documentation

1. **Code Comments**
   - Only comment complex logic
   - Code should be self-documenting
   - Use JSDoc for public APIs

2. **README Updates**
   - Update README if you add new features
   - Document environment variables
   - Document setup steps

3. **API Documentation**
   - Update Swagger specs for new endpoints
   - Include examples in API docs

## Common Tasks

### Database Migrations

**Create a new migration:**
```bash
cd backend
npm run migration:generate -- -n AddColumnToUsers
```

**Run migrations:**
```bash
npm run migration:run
```

**Revert last migration:**
```bash
npm run migration:revert
```

**Check migration status:**
```bash
npm run migration:show
```

### Seeding Data

**Run seeds:**
```bash
cd backend
npm run seed
```

**Create new seed:**
1. Create file in `backend/src/seeds/`
2. Follow existing patterns
3. Update seed runner

### Adding a New API Endpoint

1. **Define route** in `backend/src/routes/`
2. **Create controller** method in `backend/src/controllers/`
3. **Add service** logic in `backend/src/services/`
4. **Update Swagger** documentation
5. **Write tests** in `backend/tests/`
6. **Update frontend API** client in `frontend/src/api/`

Example:
```typescript
// 1. Route
router.get('/courses/:id', authenticate, courseController.getCourse);

// 2. Controller
async getCourse(req: Request, res: Response) {
  const course = await courseService.getCourseById(req.params.id);
  res.json(course);
}

// 3. Service
async getCourseById(id: string): Promise<Course> {
  const course = await courseRepository.findById(id);
  if (!course) throw new NotFoundException('Course not found');
  return course;
}
```

### Adding a New React Component

1. **Create component** file in appropriate directory
2. **Define TypeScript** interface for props
3. **Style with Tailwind** CSS
4. **Write tests** in same directory
5. **Export** from index file (if applicable)

Example:
```typescript
// components/courses/CourseCard.tsx
interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-xl font-bold">{course.title}</h3>
      {/* ... */}
    </div>
  );
};

// components/courses/CourseCard.test.tsx
describe('CourseCard', () => {
  it('should render course information', () => {
    // ...
  });
});
```

### Running Tests

**Backend:**
```bash
cd backend

# All tests
npm test

# Watch mode
npm test -- --watch

# Specific file
npm test -- courseService.test.ts

# Coverage
npm run test:coverage

# Only unit tests
npm run test:unit

# Only integration tests
npm run test:integration
```

**Frontend:**
```bash
cd frontend

# All tests
npm test

# Watch mode
npm test -- --watch

# UI mode
npm test -- --ui

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Debugging

**Backend (VS Code):**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**Frontend:**
- Use browser DevTools
- React DevTools extension
- Console.log (temporarily)

### Checking Code Quality

Before committing:
```bash
# Backend
cd backend
npm run lint
npm run type-check
npm test

# Frontend
cd frontend
npm run lint
npm run type-check
npm test
```

These checks also run in CI/CD pipeline.

## Troubleshooting

### Common Issues

#### Issue: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### Issue: Database Connection Failed

**Error:** `ECONNREFUSED` or `Connection refused`

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check connection details in .env
```

#### Issue: Migration Failed

**Error:** Migration errors

**Solution:**
```bash
# Check migration status
npm run migration:show

# Drop database and recreate (DEV ONLY!)
docker-compose down -v
docker-compose up -d
npm run migration:run
npm run seed
```

#### Issue: Cannot Find Module

**Error:** `Cannot find module '@/...'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check tsconfig paths configuration
```

#### Issue: TypeScript Errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Command Palette > TypeScript: Restart TS Server

# Check for type errors
npm run type-check
```

#### Issue: Tests Failing

**Solution:**
```bash
# Clear test cache
npm test -- --clearCache

# Check test database
# Ensure test DB is separate from dev DB

# Update snapshots if needed
npm test -- -u
```

### Getting Help

1. **Check Documentation**
   - README.md
   - /docs directory
   - API documentation

2. **Search Issues**
   - GitHub Issues
   - Check if someone else had the same problem

3. **Ask the Team**
   - Slack: #edusystem-dev channel
   - Team standup
   - Pair programming session

4. **Create an Issue**
   - Describe the problem
   - Include error messages
   - Share code snippets
   - Mention what you've tried

## Resources

### Documentation

- **Project Docs**: `/docs` directory
  - [Architecture](./architecture.md)
  - [API Reference](./api.md)
  - [Data Model](./data-model.md)
  - [Frontend Guide](./frontend.md)
  - [Testing Strategy](./testing.md)

- **API Docs**: http://localhost:3000/api/docs

### External Resources

**TypeScript:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

**React:**
- [React Docs](https://react.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**Node.js/Express:**
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

**Database:**
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeORM Guide](https://typeorm.io/)

**Testing:**
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev/)

### Learning Path

**Week 1: Setup & Basics**
- [ ] Complete environment setup
- [ ] Run the application locally
- [ ] Explore the codebase
- [ ] Make a small documentation fix
- [ ] Submit your first PR

**Week 2: Backend**
- [ ] Understand backend architecture
- [ ] Review existing services
- [ ] Add a simple API endpoint
- [ ] Write tests for your endpoint
- [ ] Review data model

**Week 3: Frontend**
- [ ] Understand frontend architecture
- [ ] Review component structure
- [ ] Create a simple component
- [ ] Integrate with backend API
- [ ] Write component tests

**Week 4: Full Feature**
- [ ] Pick a small feature from backlog
- [ ] Implement backend + frontend
- [ ] Write comprehensive tests
- [ ] Update documentation
- [ ] Submit for review

## Team Communication

### Channels

- **Slack**:
  - `#edusystem-dev` - Development discussions
  - `#edusystem-bugs` - Bug reports
  - `#edusystem-general` - General updates

- **GitHub**:
  - Issues - Bug reports, feature requests
  - Pull Requests - Code reviews
  - Discussions - Design discussions

### Meetings

- **Daily Standup** - 9:30 AM (15 minutes)
  - What did you do yesterday?
  - What will you do today?
  - Any blockers?

- **Sprint Planning** - Every 2 weeks, Monday
  - Plan upcoming work
  - Estimate tasks

- **Sprint Review** - Every 2 weeks, Friday
  - Demo completed features
  - Gather feedback

- **Sprint Retrospective** - Every 2 weeks, Friday
  - What went well?
  - What could be improved?
  - Action items

### Code Review Process

1. **Create PR** with clear description
2. **Request reviewers** (at least 2)
3. **Reviewers** provide feedback within 24 hours
4. **Address comments** and push updates
5. **Approval** - Need 2 approvals to merge
6. **Merge** - Squash and merge to main
7. **Delete branch** after merge

### Best Practices

- Be respectful and constructive in reviews
- Review promptly (within 24 hours)
- Ask questions if something is unclear
- Suggest improvements, don't demand
- Approve when code meets standards
- Celebrate good work! 🎉

## Next Steps

Now that you're set up:

1. ✅ Complete the checklist above
2. 📚 Read through the documentation
3. 🐛 Try fixing a "good first issue" bug
4. 💬 Introduce yourself in #edusystem-dev
5. ☕ Schedule a 1-on-1 with your mentor
6. 🎯 Discuss your first project/feature

**Welcome to the team!** 🚀
