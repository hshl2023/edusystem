# Contributing to EduSystem

Thank you for your interest in contributing to EduSystem! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect:

- **Be Respectful**: Treat everyone with respect and professionalism
- **Be Inclusive**: Welcome contributors of all backgrounds and experience levels
- **Be Collaborative**: Work together to create the best solution
- **Be Patient**: Help others learn and grow
- **Be Open-Minded**: Consider different perspectives and approaches

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or insults
- Trolling or inflammatory comments
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

1. Read the [README.md](README.md) for project overview
2. Read the [Onboarding Guide](docs/onboarding.md) for setup instructions
3. Set up your development environment
4. Join our communication channels (Slack, Discord, etc.)

### Finding Issues to Work On

- Check the [Issues](https://github.com/your-org/edusystem/issues) page
- Look for issues labeled:
  - `good first issue` - Great for new contributors
  - `help wanted` - We need community help
  - `bug` - Bug fixes
  - `enhancement` - New features

### Claiming an Issue

1. Comment on the issue to express interest
2. Wait for approval from maintainers
3. Fork the repository
4. Create a branch for your work

## Development Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/edusystem.git
cd edusystem
git remote add upstream https://github.com/your-org/edusystem.git
```

### 2. Create a Branch

Use descriptive branch names:

```bash
# Feature
git checkout -b feature/add-user-profile-editing

# Bug fix
git checkout -b fix/enrollment-validation-error

# Documentation
git checkout -b docs/update-api-reference
```

### 3. Make Changes

- Write clean, readable code
- Follow the [coding standards](#coding-standards)
- Write tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Backend tests
cd backend
npm test
npm run lint

# Frontend tests
cd frontend
npm test
npm run lint

# E2E tests
npm run test:e2e
```

### 5. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(courses): add course filtering by category"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(api): update authentication endpoints"
git commit -m "test(assignments): add submission validation tests"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Scope Examples:**
- `auth` - Authentication
- `courses` - Course management
- `assignments` - Assignment system
- `grades` - Grading system
- `api` - API changes
- `ui` - UI components

### 6. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 7. Push Your Changes

```bash
git push origin feature/your-feature-name
```

## Pull Request Process

### Before Submitting

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### Creating a Pull Request

1. Go to the GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Added user profile editing
- Updated API endpoints
- Added validation tests

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: At least 2 reviewers approve
3. **Feedback**: Address review comments
4. **Approval**: Maintainers approve the PR
5. **Merge**: Maintainers merge the PR

### Review Timeline

- We aim to review PRs within **2-3 business days**
- Complex PRs may take longer
- Tag maintainers if no response after 5 days

### Addressing Review Comments

```bash
# Make changes based on feedback
git add .
git commit -m "refactor: address review comments"
git push origin feature/your-feature-name
```

The PR will automatically update.

## Coding Standards

### General Principles

1. **SOLID Principles**: Follow SOLID design principles
2. **DRY**: Don't Repeat Yourself
3. **KISS**: Keep It Simple, Stupid
4. **YAGNI**: You Aren't Gonna Need It
5. **Separation of Concerns**: Each module has one responsibility

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

async function getUserById(id: string): Promise<User> {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

// ❌ Bad
function getUser(id: any): any {
  return db.query('SELECT * FROM users WHERE id = ' + id);
}
```

### React Components

```typescript
// ✅ Good
interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEnroll 
}) => {
  const handleEnroll = () => {
    onEnroll?.(course.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleEnroll}>Enroll</Button>
      </CardContent>
    </Card>
  );
};

// ❌ Bad
export default function CourseCard(props) {
  return <div onClick={() => props.onEnroll(props.course.id)}>
    {props.course.title}
  </div>;
}
```

### Code Style

- Use **Prettier** for formatting (automatic)
- Use **ESLint** for code quality
- **2 spaces** for indentation
- **Semicolons** required
- **Single quotes** for strings
- **Trailing commas** in multiline

### Naming Conventions

```typescript
// Variables and functions: camelCase
const userName = 'John';
function getUserById(id: string) {}

// Classes and interfaces: PascalCase
class UserService {}
interface UserRepository {}

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10485760;
const DEFAULT_PAGE_SIZE = 20;

// Enums: PascalCase with UPPER_SNAKE_CASE values
enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// Private properties: prefix with underscore
class User {
  private _password: string;
}

// Boolean variables: prefix with is/has/can
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

### Comments

```typescript
// ✅ Good - Comments explain WHY, not WHAT
// Calculate late penalty based on days past due date
// Formula: 10% per day, max 50%
const penalty = Math.min(daysPastDue * 10, 50);

// ❌ Bad - Comments explain obvious things
// Set x to 5
const x = 5;

// ✅ Good - JSDoc for public APIs
/**
 * Enrolls a student in a course
 * @param studentId - The student's unique identifier
 * @param courseId - The course's unique identifier
 * @returns The enrollment record
 * @throws {ConflictException} If student is already enrolled
 * @throws {NotFoundException} If course or student not found
 */
async function enrollStudent(
  studentId: string, 
  courseId: string
): Promise<Enrollment> {
  // Implementation
}
```

## Testing Guidelines

### Test Coverage

- **Minimum**: 80% overall coverage
- **Critical paths**: 95%+ coverage
- **New code**: Must include tests

### Test Structure

```typescript
describe('CourseService', () => {
  // Setup
  beforeEach(() => {
    // Initialize test dependencies
  });

  // Cleanup
  afterEach(() => {
    // Clear mocks, close connections
  });

  describe('getCourseById', () => {
    it('should return course when found', async () => {
      // Arrange
      const mockCourse = createTestCourse();
      
      // Act
      const result = await courseService.getCourseById('123');
      
      // Assert
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course not found', async () => {
      // Arrange & Act & Assert
      await expect(courseService.getCourseById('invalid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
```

### Test Best Practices

1. **Descriptive Test Names**: Clearly describe what's being tested
2. **AAA Pattern**: Arrange, Act, Assert
3. **One Assertion**: Focus on one thing per test
4. **Independent Tests**: Tests shouldn't depend on each other
5. **Mock External Dependencies**: Database, APIs, etc.
6. **Test Edge Cases**: Empty inputs, null, errors

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing functionality
- Adding new API endpoints
- Modifying configuration
- Fixing bugs (if not obvious)

### What to Update

- **README.md**: High-level changes, new features
- **docs/api.md**: New or changed endpoints
- **docs/architecture.md**: Architectural changes
- **docs/data-model.md**: Database schema changes
- **Code Comments**: Complex logic, business rules
- **Inline Documentation**: JSDoc for public APIs

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows
- Keep it up to date with code changes

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Design discussions, questions
- **Slack**: `#edusystem-dev` for real-time chat
- **Email**: dev@edusystem.example.com

### Getting Help

1. Search existing issues and documentation
2. Ask in GitHub Discussions
3. Reach out in Slack
4. Tag maintainers if urgent

### Recognition

We value all contributions! Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor swag
- Invited to community events

## License

By contributing to EduSystem, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:
- GitHub Discussions
- Slack: `#edusystem-dev`
- Email: dev@edusystem.example.com

**Thank you for contributing to EduSystem!** 🎉
