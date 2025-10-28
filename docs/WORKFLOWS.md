# End-to-End Workflows

This document describes the complete end-to-end workflows for different user roles in the School Management System.

## Prerequisites

1. Backend API running at `http://localhost:3000/api`
2. Frontend running at `http://localhost:5173` (default Vite dev server)
3. Test users created in the backend

## Admin Workflows

### Workflow 1: Create a New Student

1. **Login as Admin**
   - Navigate to `http://localhost:5173/login`
   - Enter admin credentials
   - System authenticates and redirects to `/admin`

2. **Access Admin Dashboard**
   - View list of existing students
   - View list of existing courses
   - Both lists load via API: `GET /api/students` and `GET /api/courses`

3. **Create New Student**
   - Click "Create Student" button
   - Modal opens with form
   - Fill in required fields:
     - Email
     - Password
     - First Name
     - Last Name
     - Student Number
     - Enrollment Date
   - Click "Create"
   - API call: `POST /api/students`
   - On success:
     - Student added to database
     - Query invalidation triggers
     - Student list refreshes automatically
     - Success message displayed
     - Modal closes
   - On error:
     - Global error interceptor shows error message
     - 409: "Student with this email already exists"
     - 422: Validation errors displayed
     - Modal remains open for correction

4. **Verify Creation**
   - New student appears in the list
   - Click "View" to see student details

### Workflow 2: Assign Course to Student

1. **Login as Admin**
   - Same as Workflow 1

2. **Navigate to Student Details**
   - Click on a student from the list
   - View student's enrolled courses
   - API call: `GET /api/students/{id}/courses`

3. **Enroll in Course**
   - Select a course from available courses
   - Click "Enroll"
   - API call: `POST /api/courses/enroll`
   - Request body: `{ studentId, courseId }`
   - On success:
     - Enrollment created
     - Course appears in student's course list
     - Query invalidation refreshes data
   - On error:
     - Error message displayed
     - 409: "Student already enrolled in this course"

4. **Verify Enrollment**
   - Course appears in student's enrolled courses
   - Navigate to course details to see student in roster

### Workflow 3: Create Course and Assign Teacher

1. **Login as Admin**
   - Same as Workflow 1

2. **Create New Course**
   - Click "Create Course" button
   - Fill in form:
     - Course Code (e.g., "CS101")
     - Course Name
     - Description
     - Credits
     - Semester
     - Academic Year
   - Click "Create"
   - API call: `POST /api/courses`
   - On success:
     - Course created
     - Appears in course list
     - Success message shown

3. **Assign Teacher**
   - View course details
   - Select teacher from dropdown
   - API call: `PUT /api/courses/{id}/assign-teacher`
   - Optimistic update:
     - UI immediately shows selected teacher
     - If API call fails, UI reverts to previous state
   - On success:
     - Teacher assigned
     - Teacher can now see course in their dashboard

4. **Verify Assignment**
   - Course shows assigned teacher
   - Navigate to teacher dashboard to verify course appears

## Teacher Workflows

### Workflow 4: Submit Grades for Students

1. **Login as Teacher**
   - Navigate to login page
   - Enter teacher credentials
   - Redirected to `/teacher`

2. **View Assigned Courses**
   - Teacher dashboard displays all assigned courses
   - API call: `GET /api/teachers/{id}/courses`
   - Each course shows:
     - Course code and name
     - Semester and credits
     - Number of enrolled students

3. **Select Course for Grading**
   - Click "View Details" on a course
   - System loads enrolled students
   - API call: `GET /api/courses/{id}/students`
   - Grade submission form displayed with:
     - Student list
     - Input fields for score, letter grade, comments

4. **Enter Grades**
   - For each student:
     - Enter score (0-100)
     - Enter letter grade (A, B, C, etc.)
     - Add optional comments
   - Data stored in local component state (reactive)

5. **Submit Individual Grade**
   - Click "Submit" for a student
   - API call: `POST /api/grades/submit`
   - Request body:
     ```json
     {
       "studentId": 1,
       "courseId": 1,
       "score": 95,
       "letterGrade": "A",
       "comments": "Excellent work"
     }
     ```
   - Loading state: Button shows "Submitting..."
   - On success:
     - Grade saved to database
     - Query invalidation: `invalidateQueries('grades')`
     - Success message displayed
     - Form remains for next student
   - On error:
     - Error message shown
     - Form data retained for correction

6. **Verify Submission**
   - Grade marked as submitted
   - Student can now view grade in their dashboard

### Workflow 5: View Course Roster

1. **Login as Teacher**
   - Same as Workflow 4

2. **Select Course**
   - Click on course from dashboard
   - View full course details

3. **View Enrolled Students**
   - API call: `GET /api/courses/{id}/students`
   - Display list showing:
     - Student number
     - Full name
     - Email
     - Enrollment status
     - Current grade (if submitted)

4. **Export or Print**
   - Use browser print function to save roster
   - Filter by status if needed

## Student Workflows

### Workflow 6: View Enrolled Courses

1. **Login as Student**
   - Navigate to login page
   - Enter student credentials
   - Redirected to `/student`

2. **View Dashboard**
   - Student profile information displayed
   - API call: `GET /api/auth/me`
   - Shows:
     - Name
     - Email
     - Student number

3. **View Enrolled Courses**
   - API call: `GET /api/students/{id}/courses`
   - Loading state: Shows spinner
   - Once loaded:
     - Grid of course cards displayed
     - Each card shows:
       - Course code and name
       - Description
       - Credits
       - Teacher name
       - Semester

4. **Course Details**
   - Click on a course to view more details
   - See syllabus, schedule, materials

### Workflow 7: View Grades and Academic Performance

1. **Login as Student**
   - Same as Workflow 6

2. **Navigate to Grades Section**
   - Automatically visible on dashboard
   - API call: `GET /api/students/{id}/grades`

3. **View Grade Table**
   - Loading state: Shows spinner
   - Once loaded:
     - Table displays all grades
     - Columns:
       - Course Code
       - Course Name
       - Score
       - Letter Grade
       - Comments
       - Submission Date
     - Sorted by date (newest first)

4. **View Academic Summary**
   - Summary cards show:
     - Total enrolled courses
     - Completed grades count
     - Average score (calculated client-side)
   - Calculation:
     ```typescript
     averageScore = sum(all scores) / number of grades
     ```

5. **Check Individual Grade Details**
   - View comments from teacher
   - See submission timestamp
   - Compare with other courses

## Error Handling Workflows

### Workflow 8: Session Expiration

1. **Active Session**
   - User logged in and working
   - Token stored in localStorage
   - Token attached to all API requests

2. **Token Expires**
   - User attempts an API call
   - Backend returns 401 Unauthorized
   - Response interceptor catches error

3. **Automatic Logout**
   - Error interceptor calls: `authStore.logout()`
   - Clears user data from store
   - Removes token from localStorage
   - Redirects to: `window.location.href = '/login'`
   - Alert shown: "Unauthorized access - logging out"

4. **Re-login**
   - User sees login page
   - Can enter credentials again
   - New token issued upon successful login

### Workflow 9: Permission Denied

1. **User Attempts Unauthorized Action**
   - Example: Student tries to access admin route
   - Router guard checks role

2. **Router Guard Blocks**
   - Check in `router/index.ts`:
     ```typescript
     if (requiredRole && authStore.user?.role !== requiredRole) {
       // Redirect to appropriate dashboard
     }
     ```

3. **Redirect to Correct Dashboard**
   - User redirected to their role-specific dashboard
   - No data leak occurs

4. **Alternative: API Returns 403**
   - If router guard missed, API returns 403
   - Response interceptor shows alert
   - Error message: "You do not have permission to perform this action."

### Workflow 10: Network Error

1. **User Performs Action**
   - Example: Submit a form
   - API request initiated

2. **Network Failure**
   - No internet connection
   - Server down
   - Timeout after 30 seconds

3. **Error Handling**
   - Request interceptor catches error
   - Checks: `error.request && !error.response`
   - Shows alert: "Network error. Please check your connection and try again."
   - Loading state cleared
   - Form data retained

4. **Retry Option**
   - User can click button again to retry
   - Or check connection and refresh page

## Data Freshness Workflows

### Workflow 11: Optimistic Update

1. **User Updates Data**
   - Example: Change student status
   - UI immediately reflects change (optimistic)

2. **API Call in Progress**
   - Request sent: `PUT /api/students/{id}`
   - UI shows updated status before confirmation

3. **Success Case**
   - API returns 200 OK
   - Optimistic update confirmed
   - No UI change needed
   - Query invalidation marks cache stale

4. **Failure Case**
   - API returns error
   - Optimistic update reverted
   - UI shows previous state
   - Error message displayed
   - User can try again

### Workflow 12: Cache Invalidation

1. **User Views List**
   - Example: Admin views student list
   - Data cached with key: "students-list"
   - API call: `GET /api/students`

2. **User Creates New Student**
   - Modal form submitted
   - API call: `POST /api/students`
   - On success: `invalidateQueries('students')`

3. **Cache Marked Stale**
   - All queries matching "students" marked stale
   - Includes: "students-list", "students-1", etc.

4. **Data Refetched**
   - Next time student list viewed
   - System checks cache
   - Sees stale flag
   - Fetches fresh data from API
   - Updates cache with new data

5. **Fresh Data Displayed**
   - New student appears in list
   - All components show consistent data

## Performance Optimization Workflows

### Workflow 13: Pagination

1. **Large Dataset**
   - Example: School with 1000+ students
   - Cannot load all at once

2. **Initial Load**
   - API call: `GET /api/students?page=1&pageSize=20`
   - First 20 students displayed
   - Pagination info returned:
     ```json
     {
       "data": [...],
       "pagination": {
         "page": 1,
         "pageSize": 20,
         "totalPages": 50,
         "totalItems": 1000
       }
     }
     ```

3. **Navigate Pages**
   - User clicks "Next" button
   - API call: `GET /api/students?page=2&pageSize=20`
   - New page data loaded
   - Previous page data cached

4. **Quick Navigation**
   - User clicks "Back" to page 1
   - Cached data displayed immediately
   - No API call needed (unless stale)

### Workflow 14: Search with Debouncing

1. **User Types in Search**
   - Example: Search for "john"
   - User types: "j" → "jo" → "joh" → "john"

2. **Debounce Timer**
   - Each keystroke resets 300ms timer
   - No API call until user stops typing

3. **Timer Completes**
   - 300ms after last keystroke
   - API call: `GET /api/students?search=john`
   - Loading indicator shown

4. **Results Displayed**
   - Filtered list of matching students
   - Highlighting or relevance sorting applied

5. **Efficient API Usage**
   - Only 1 API call instead of 4
   - Reduced server load
   - Better user experience

## Summary

All workflows follow consistent patterns:
- ✅ Centralized API calls through typed services
- ✅ Loading states for user feedback
- ✅ Error handling with meaningful messages
- ✅ Query invalidation for data freshness
- ✅ Optimistic updates for better UX
- ✅ Type safety throughout
- ✅ Role-based access control
- ✅ Automatic session management

For more details on implementation, see:
- `README.md` - Getting started
- `API_INTEGRATION.md` - Technical details
- `EXAMPLES.md` - Code examples
