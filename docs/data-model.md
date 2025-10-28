# EduSystem Data Model Documentation

## Table of Contents
1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Database Tables](#database-tables)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Migrations](#migrations)
7. [Data Constraints](#data-constraints)
8. [Sample Queries](#sample-queries)

## Overview

EduSystem uses PostgreSQL 15+ as the primary database. The schema is managed through TypeORM migrations, ensuring version control and reproducibility across environments.

### Technology Stack
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM 0.3+
- **Migration Tool**: TypeORM CLI
- **Connection Pooling**: pg-pool (20 connections)

### Design Principles
- **Normalization**: 3NF (Third Normal Form) for data integrity
- **Soft Deletes**: Most entities support soft deletion (deletedAt field)
- **Audit Trails**: Timestamps (createdAt, updatedAt) on all entities
- **UUID Primary Keys**: For security and distributed systems
- **Foreign Key Constraints**: Enforced at database level

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EduSystem ERD                                      │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────┐
                        │      users       │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ email (UNIQUE)   │
                        │ passwordHash     │
                        │ firstName        │
                        │ lastName         │
                        │ role (ENUM)      │
                        │ avatar           │
                        │ bio              │
                        │ isActive         │
                        │ createdAt        │
                        │ updatedAt        │
                        │ deletedAt        │
                        └────────┬─────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
         teacherId        studentId        userId
                 │               │               │
    ┌────────────▼───┐  ┌────────▼───────┐  ┌───▼──────────────┐
    │    courses     │  │  enrollments   │  │  notifications   │
    ├────────────────┤  ├────────────────┤  ├──────────────────┤
    │ id (PK)        │  │ id (PK)        │  │ id (PK)          │
    │ code (UNIQUE)  │  │ studentId (FK) │  │ userId (FK)      │
    │ title          │  │ courseId (FK)  │  │ type             │
    │ description    │  │ enrolledAt     │  │ title            │
    │ teacherId (FK) │  │ status         │  │ message          │
    │ syllabus       │  │ grade          │  │ data (JSON)      │
    │ schedule       │  │ createdAt      │  │ read             │
    │ location       │  │ updatedAt      │  │ createdAt        │
    │ maxEnrollment  │  │ deletedAt      │  └──────────────────┘
    │ status         │  └────────┬───────┘
    │ startDate      │           │
    │ endDate        │           │
    │ createdAt      │           │
    │ updatedAt      │           │
    │ deletedAt      │           │
    └────────┬───────┘           │
             │                   │
             │ courseId   courseId & studentId
             │                   │
    ┌────────▼───────┐  ┌────────▼─────────┐
    │  assignments   │  │  submissions     │
    ├────────────────┤  ├──────────────────┤
    │ id (PK)        │  │ id (PK)          │
    │ courseId (FK)  │  │ assignmentId (FK)│
    │ title          │  │ studentId (FK)   │
    │ description    │  │ status           │
    │ instructions   │  │ submittedAt      │
    │ type (ENUM)    │  │ isLate           │
    │ maxPoints      │  │ fileUrl          │
    │ dueDate        │  │ text             │
    │ allowLate      │  │ links (JSON)     │
    │ latePenalty    │  │ createdAt        │
    │ status         │  │ updatedAt        │
    │ createdAt      │  └────────┬─────────┘
    │ updatedAt      │           │
    │ deletedAt      │           │ submissionId
    └────────┬───────┘           │
             │                   │
             │ assignmentId      │
             │                   │
    ┌────────▼───────┐  ┌────────▼─────────┐
    │   attachments  │  │     grades       │
    ├────────────────┤  ├──────────────────┤
    │ id (PK)        │  │ id (PK)          │
    │ assignmentId(FK)│ │ submissionId (FK)│
    │ filename       │  │ points           │
    │ fileUrl        │  │ maxPoints        │
    │ fileSize       │  │ percentage       │
    │ mimeType       │  │ feedback         │
    │ uploadedAt     │  │ gradedById (FK)  │
    └────────────────┘  │ gradedAt         │
                        │ createdAt        │
    ┌───────────────┐   │ updatedAt        │
    │   materials   │   └──────────────────┘
    ├───────────────┤
    │ id (PK)       │   ┌──────────────────┐
    │ courseId (FK) │   │  rubric_criteria │
    │ title         │   ├──────────────────┤
    │ description   │   │ id (PK)          │
    │ type          │   │ assignmentId (FK)│
    │ fileUrl       │   │ name             │
    │ fileSize      │   │ description      │
    │ uploadedAt    │   │ maxPoints        │
    │ createdAt     │   │ order            │
    │ updatedAt     │   └────────┬─────────┘
    └───────────────┘            │
                                 │ criteriaId
    ┌───────────────┐            │
    │ announcements │   ┌────────▼─────────┐
    ├───────────────┤   │  rubric_scores   │
    │ id (PK)       │   ├──────────────────┤
    │ courseId (FK) │   │ id (PK)          │
    │ authorId (FK) │   │ gradeId (FK)     │
    │ title         │   │ criteriaId (FK)  │
    │ content       │   │ points           │
    │ priority      │   │ comment          │
    │ publishedAt   │   │ createdAt        │
    │ createdAt     │   └──────────────────┘
    │ updatedAt     │
    └───────────────┘   ┌──────────────────┐
                        │   audit_logs     │
    ┌───────────────┐   ├──────────────────┤
    │refresh_tokens │   │ id (PK)          │
    ├───────────────┤   │ userId (FK)      │
    │ id (PK)       │   │ action           │
    │ userId (FK)   │   │ entityType       │
    │ token         │   │ entityId         │
    │ expiresAt     │   │ details (JSON)   │
    │ createdAt     │   │ ipAddress        │
    │ revokedAt     │   │ userAgent        │
    └───────────────┘   │ createdAt        │
                        └──────────────────┘
```

## Database Tables

### users

Stores all user accounts (students, teachers, administrators).

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;
```

**Columns**:
- `id`: Unique identifier (UUID)
- `email`: User email address (unique, used for login)
- `password_hash`: bcrypt hashed password (12 rounds)
- `first_name`: User's first name
- `last_name`: User's last name
- `role`: User role (student, teacher, admin)
- `avatar`: URL to profile picture
- `bio`: User biography/description
- `is_active`: Account active status (for suspension)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp
- `deleted_at`: Soft delete timestamp (NULL if active)

**Constraints**:
- Email must be unique and valid format
- Password minimum 8 characters (enforced at application level)
- Role must be one of the enum values

---

### courses

Stores course information.

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    teacher_id UUID NOT NULL,
    syllabus TEXT,
    schedule VARCHAR(200),
    location VARCHAR(200),
    max_enrollment INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_course_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT check_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_dates ON courses(start_date, end_date);
```

**Columns**:
- `id`: Unique identifier
- `code`: Course code (e.g., "CS101") - unique
- `title`: Course title
- `description`: Course description
- `teacher_id`: Reference to teacher (users table)
- `syllabus`: Full course syllabus
- `schedule`: Class schedule (e.g., "MWF 10:00-11:00")
- `location`: Physical or virtual location
- `max_enrollment`: Maximum number of students
- `status`: Course status (draft, published, archived)
- `start_date`: Course start date
- `end_date`: Course end date
- Timestamps and soft delete

**Constraints**:
- Course code must be unique
- End date must be after start date
- Teacher must exist in users table

---

### enrollments

Tracks student enrollments in courses.

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
    grade DECIMAL(5,2),
    letter_grade VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT unique_enrollment UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

**Columns**:
- `id`: Unique identifier
- `student_id`: Reference to student
- `course_id`: Reference to course
- `enrolled_at`: Enrollment timestamp
- `status`: Enrollment status (active, dropped, completed)
- `grade`: Final numeric grade (0-100)
- `letter_grade`: Final letter grade (A, B, C, D, F)
- Timestamps and soft delete

**Constraints**:
- Student-course combination must be unique
- Student and course must exist

---

### assignments

Stores assignment details for courses.

```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('homework', 'quiz', 'exam', 'project', 'essay')),
    max_points DECIMAL(6,2) NOT NULL DEFAULT 100,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    allow_late_submission BOOLEAN DEFAULT false,
    late_penalty DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_assignment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT check_points CHECK (max_points > 0),
    CONSTRAINT check_penalty CHECK (late_penalty >= 0 AND late_penalty <= 100)
);

CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_status ON assignments(status);
```

**Columns**:
- `id`: Unique identifier
- `course_id`: Reference to course
- `title`: Assignment title
- `description`: Brief description
- `instructions`: Detailed instructions
- `type`: Assignment type (homework, quiz, exam, project, essay)
- `max_points`: Maximum possible points
- `due_date`: Submission deadline
- `allow_late_submission`: Whether late submissions are accepted
- `late_penalty`: Percentage penalty for late submissions
- `status`: Assignment status (draft, published, closed)
- Timestamps and soft delete

**Constraints**:
- Max points must be positive
- Late penalty must be 0-100%

---

### submissions

Stores student assignment submissions.

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    is_late BOOLEAN DEFAULT false,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    text_content TEXT,
    links JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_submission UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_date ON submissions(submitted_at);
```

**Columns**:
- `id`: Unique identifier
- `assignment_id`: Reference to assignment
- `student_id`: Reference to student
- `status`: Submission status (draft, submitted, graded)
- `submitted_at`: Submission timestamp
- `is_late`: Whether submission was late
- `file_url`: URL to uploaded file
- `file_name`: Original filename
- `file_size`: File size in bytes
- `text_content`: Text submission content
- `links`: Additional links (JSON array)
- Timestamps

**Constraints**:
- One submission per student per assignment

---

### grades

Stores grades for submissions.

```sql
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE,
    points DECIMAL(6,2) NOT NULL,
    max_points DECIMAL(6,2) NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((points / max_points) * 100) STORED,
    feedback TEXT,
    graded_by_id UUID NOT NULL,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grade_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_grader FOREIGN KEY (graded_by_id) REFERENCES users(id),
    CONSTRAINT check_grade_points CHECK (points >= 0 AND points <= max_points)
);

CREATE INDEX idx_grades_submission ON grades(submission_id);
CREATE INDEX idx_grades_grader ON grades(graded_by_id);
CREATE INDEX idx_grades_date ON grades(graded_at);
```

**Columns**:
- `id`: Unique identifier
- `submission_id`: Reference to submission (one-to-one)
- `points`: Points earned
- `max_points`: Maximum possible points
- `percentage`: Calculated percentage (computed column)
- `feedback`: Grading feedback/comments
- `graded_by_id`: Reference to grader (teacher)
- `graded_at`: Grading timestamp
- Timestamps

**Constraints**:
- Points must be between 0 and max_points
- One grade per submission

---

### rubric_criteria

Defines grading rubric criteria for assignments.

```sql
CREATE TABLE rubric_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    max_points DECIMAL(6,2) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_criteria_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT check_criteria_points CHECK (max_points > 0)
);

CREATE INDEX idx_rubric_criteria_assignment ON rubric_criteria(assignment_id);
```

---

### rubric_scores

Stores rubric-based scores for graded submissions.

```sql
CREATE TABLE rubric_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL,
    criteria_id UUID NOT NULL,
    points DECIMAL(6,2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_score_grade FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    CONSTRAINT fk_score_criteria FOREIGN KEY (criteria_id) REFERENCES rubric_criteria(id) ON DELETE CASCADE,
    CONSTRAINT unique_rubric_score UNIQUE(grade_id, criteria_id)
);

CREATE INDEX idx_rubric_scores_grade ON rubric_scores(grade_id);
```

---

### materials

Stores course materials and resources.

```sql
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('slides', 'notes', 'reading', 'video', 'other')),
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_material_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_materials_course ON materials(course_id);
CREATE INDEX idx_materials_type ON materials(type);
```

---

### attachments

Stores assignment attachments.

```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

CREATE INDEX idx_attachments_assignment ON attachments(assignment_id);
```

---

### notifications

Stores user notifications.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

---

### announcements

Stores course announcements.

```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    author_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_announcement_author FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX idx_announcements_course ON announcements(course_id);
CREATE INDEX idx_announcements_published ON announcements(published_at);
```

---

### refresh_tokens

Stores refresh tokens for authentication.

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

---

### audit_logs

Stores audit trail of important actions.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## Relationships

### One-to-Many Relationships

1. **User → Courses** (as teacher)
   - One teacher can create many courses
   - FK: `courses.teacher_id → users.id`

2. **Course → Assignments**
   - One course has many assignments
   - FK: `assignments.course_id → courses.id`

3. **Course → Enrollments**
   - One course has many enrollments
   - FK: `enrollments.course_id → courses.id`

4. **User → Enrollments** (as student)
   - One student can enroll in many courses
   - FK: `enrollments.student_id → users.id`

5. **Assignment → Submissions**
   - One assignment has many submissions
   - FK: `submissions.assignment_id → assignments.id`

6. **User → Submissions** (as student)
   - One student can have many submissions
   - FK: `submissions.student_id → users.id`

7. **Assignment → Rubric Criteria**
   - One assignment can have many rubric criteria
   - FK: `rubric_criteria.assignment_id → assignments.id`

8. **Grade → Rubric Scores**
   - One grade can have many rubric scores
   - FK: `rubric_scores.grade_id → grades.id`

### One-to-One Relationships

1. **Submission → Grade**
   - Each submission has at most one grade
   - FK: `grades.submission_id → submissions.id` (UNIQUE)

### Many-to-Many Relationships

1. **Students ↔ Courses** (through enrollments)
   - Students can enroll in multiple courses
   - Courses can have multiple students
   - Junction table: `enrollments`

## Indexes

### Primary Indexes
All tables have UUID primary key indexes automatically.

### Foreign Key Indexes
Indexes on all foreign key columns for join performance.

### Query Optimization Indexes

1. **Users**
   - Email lookup (login): `idx_users_email`
   - Role filtering: `idx_users_role`
   - Active users: `idx_users_active`

2. **Courses**
   - Teacher's courses: `idx_courses_teacher`
   - Course filtering: `idx_courses_status`
   - Date range queries: `idx_courses_dates`

3. **Enrollments**
   - Student's enrollments: `idx_enrollments_student`
   - Course roster: `idx_enrollments_course`
   - Status filtering: `idx_enrollments_status`

4. **Assignments**
   - Course assignments: `idx_assignments_course`
   - Due date sorting: `idx_assignments_due_date`

5. **Submissions**
   - Assignment submissions: `idx_submissions_assignment`
   - Student's submissions: `idx_submissions_student`
   - Submission date queries: `idx_submissions_date`

6. **Notifications**
   - User notifications: `idx_notifications_user`
   - Unread notifications: `idx_notifications_read`
   - Recent notifications: `idx_notifications_created`

## Migrations

### Migration Management

Migrations are managed through TypeORM CLI:

```bash
# Generate a new migration
npm run migration:generate -- -n MigrationName

# Create a blank migration
npm run migration:create -- -n MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Migration History

| Migration | Description | Date |
|-----------|-------------|------|
| 1640000001000 | InitialSchema | Initial database schema with core tables |
| 1640000002000 | AddUserProfiles | Added avatar and bio fields to users |
| 1640000003000 | AddRubricTables | Added rubric criteria and scores |
| 1640000004000 | AddNotifications | Added notifications table |
| 1640000005000 | AddAnnouncements | Added course announcements |
| 1640000006000 | AddAuditLogs | Added audit logging |
| 1640000007000 | AddMaterials | Added course materials |
| 1640000008000 | AddRefreshTokens | Added refresh token support |
| 1640000009000 | AddSubmissionText | Added text_content to submissions |
| 1640000010000 | AddCourseArchival | Added status field to courses |

### Best Practices

1. **Never modify existing migrations** - Always create new migrations for schema changes
2. **Test migrations** - Test both up and down migrations in development
3. **Backup before production migrations** - Always backup production DB before running migrations
4. **Keep migrations atomic** - Each migration should be a logical unit
5. **Add indexes in separate migrations** - For large tables, add indexes separately

## Data Constraints

### Business Rules

1. **User Constraints**
   - Email must be unique
   - Email format validation (application level)
   - Password minimum 8 characters with complexity (application level)
   - Valid role values

2. **Course Constraints**
   - Course code must be unique
   - End date must be after start date
   - Max enrollment must be positive
   - Teacher must have teacher or admin role (application level)

3. **Enrollment Constraints**
   - Student can enroll only once per course
   - Cannot enroll after max enrollment reached (application level)
   - Student must have student role (application level)

4. **Assignment Constraints**
   - Max points must be positive
   - Due date must be in future at creation (application level)
   - Late penalty 0-100%

5. **Submission Constraints**
   - One submission per student per assignment
   - Cannot submit after due date unless late allowed (application level)
   - File size limits (application level)

6. **Grade Constraints**
   - Points must be 0 to max_points
   - One grade per submission
   - Only teachers can grade (application level)

### Data Validation Layers

1. **Database Level**
   - CHECK constraints
   - NOT NULL constraints
   - UNIQUE constraints
   - Foreign key constraints

2. **ORM Level (TypeORM)**
   - Entity decorators
   - Column types
   - Relationship definitions

3. **Application Level (Joi)**
   - Request validation
   - Business rule enforcement
   - Complex validation logic

## Sample Queries

### Common Queries

#### Get student's enrolled courses with grades

```sql
SELECT 
    c.id,
    c.code,
    c.title,
    c.start_date,
    c.end_date,
    u.first_name || ' ' || u.last_name AS teacher_name,
    e.status,
    e.grade,
    e.letter_grade
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN users u ON c.teacher_id = u.id
WHERE e.student_id = $1
    AND e.deleted_at IS NULL
    AND c.deleted_at IS NULL
ORDER BY c.start_date DESC;
```

#### Get course gradebook

```sql
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    a.id AS assignment_id,
    a.title AS assignment_title,
    a.max_points,
    g.points,
    g.percentage,
    s.submitted_at,
    s.is_late
FROM enrollments e
JOIN users u ON e.student_id = u.id
LEFT JOIN submissions s ON s.student_id = u.id
LEFT JOIN assignments a ON s.assignment_id = a.id AND a.course_id = e.course_id
LEFT JOIN grades g ON g.submission_id = s.id
WHERE e.course_id = $1
    AND e.status = 'active'
    AND e.deleted_at IS NULL
ORDER BY u.last_name, u.first_name, a.due_date;
```

#### Get pending submissions for teacher

```sql
SELECT 
    s.id,
    s.submitted_at,
    s.is_late,
    a.id AS assignment_id,
    a.title AS assignment_title,
    a.max_points,
    c.code AS course_code,
    c.title AS course_title,
    u.first_name,
    u.last_name,
    u.email
FROM submissions s
JOIN assignments a ON s.assignment_id = a.id
JOIN courses c ON a.course_id = c.id
JOIN users u ON s.student_id = u.id
LEFT JOIN grades g ON g.submission_id = s.id
WHERE c.teacher_id = $1
    AND s.status = 'submitted'
    AND g.id IS NULL
ORDER BY s.submitted_at ASC;
```

#### Get course statistics

```sql
SELECT 
    c.id,
    c.code,
    c.title,
    COUNT(DISTINCT e.id) AS enrollment_count,
    COUNT(DISTINCT a.id) AS assignment_count,
    COUNT(DISTINCT s.id) AS submission_count,
    COUNT(DISTINCT g.id) AS graded_count,
    AVG(g.percentage) AS average_grade
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
LEFT JOIN assignments a ON c.id = a.course_id AND a.status = 'published'
LEFT JOIN submissions s ON a.id = s.assignment_id
LEFT JOIN grades g ON s.id = g.submission_id
WHERE c.teacher_id = $1
    AND c.deleted_at IS NULL
GROUP BY c.id, c.code, c.title
ORDER BY c.start_date DESC;
```

#### Get student progress in course

```sql
SELECT 
    a.id,
    a.title,
    a.type,
    a.max_points,
    a.due_date,
    s.id AS submission_id,
    s.submitted_at,
    s.is_late,
    s.status AS submission_status,
    g.points,
    g.percentage,
    g.feedback
FROM assignments a
LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = $2
LEFT JOIN grades g ON s.id = g.submission_id
WHERE a.course_id = $1
    AND a.status = 'published'
    AND a.deleted_at IS NULL
ORDER BY a.due_date ASC;
```

### Performance Considerations

1. **Use indexes** - All sample queries leverage indexes for optimal performance
2. **Limit results** - Always use LIMIT/OFFSET for pagination
3. **Avoid N+1 queries** - Use JOINs instead of multiple queries
4. **Query planning** - Use EXPLAIN ANALYZE to optimize queries
5. **Connection pooling** - Reuse database connections
6. **Read replicas** - Use read replicas for read-heavy operations in production
