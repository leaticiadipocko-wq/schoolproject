<?php
/**
 * Student Controller
 * Handles student-specific operations
 */

require_once __DIR__ . '/BaseController.php';

class StudentController extends BaseController {
    
    public function getProfile() {
        $this->requireAuth();
        
        // Get the student ID - either from param or current user
        $studentId = isset($_GET['id']) ? (int)$_GET['id'] : $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT s.*, u.full_name, u.email, u.avatar_url, u.phone,
                   f.name as faculty_name, d.name as department_name,
                   p.name as programme_name, ay.name as academic_year_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN faculties f ON s.faculty_id = f.id
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN programmes p ON s.programme_id = p.id
            LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE s.id = ?
        ");
        $stmt->execute([$studentId]);
        $student = $stmt->fetch();
        
        if (!$student) {
            echo ApiResponse::error('Student not found', 404);
            return;
        }
        
        // Get enrolled courses
        $stmt = $this->db->prepare("
            SELECT cr.*, c.code, c.name, c.credits, c.level
            FROM course_registrations cr
            JOIN courses c ON cr.course_id = c.id
            WHERE cr.student_id = ? AND cr.status IN ('approved', 'completed')
        ");
        $stmt->execute([$studentId]);
        $student['courses'] = $stmt->fetchAll();
        
        echo ApiResponse::success($student);
    }
    
    public function getTimetable() {
        $this->requireAuth();
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT s.*, ts.day, ts.start_time, ts.end_time, ts.period_name,
                   c.code as course_code, c.name as course_name,
                   l.employee_number as lecturer_emp, u.full_name as lecturer_name,
                   cl.name as classroom_name, cl.code as classroom_code
            FROM students s
            JOIN course_registrations cr ON s.id = cr.student_id
            JOIN timetable t ON cr.course_id = t.course_id
            JOIN timetable_slots ts ON t.slot_id = ts.id
            JOIN courses c ON cr.course_id = c.id
            JOIN lecturers l ON t.lecturer_id = l.id
            JOIN users u ON l.user_id = u.id
            LEFT JOIN classrooms cl ON t.classroom_id = cl.id
            WHERE s.id = ? 
              AND cr.status = 'approved'
              AND t.is_published = 1
            ORDER BY FIELD(ts.day, 'monday','tuesday','wednesday','thursday','friday','saturday'), ts.start_time
        ");
        $stmt->execute([$studentId]);
        $timetable = $stmt->fetchAll();
        
        echo ApiResponse::success($timetable);
    }
    
    public function getAttendance() {
        $this->requireAuth();
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        $courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : null;
        $semesterId = isset($_GET['semester_id']) ? (int)$_GET['semester_id'] : null;
        
        $where = ['a.student_id = ?'];
        $params = [$studentId];
        
        if ($courseId) {
            $where[] = 'a.course_id = ?';
            $params[] = $courseId;
        }
        
        if ($semesterId) {
            $where[] = 'a.semester_id = ?';
            $params[] = $semesterId;
        }
        
        $whereClause = implode(' AND ', $where);
        
        $stmt = $this->db->prepare("
            SELECT a.*, c.code as course_code, c.name as course_name, c.credits,
                   ts.day, ts.start_time, ts.end_time, ts.period_name
            FROM attendance a
            JOIN courses c ON a.course_id = c.id
            LEFT JOIN timetable_slots ts ON a.slot_id = ts.id
            WHERE $whereClause
            ORDER BY a.date DESC, ts.start_time
        ");
        $stmt->execute($params);
        $attendance = $stmt->fetchAll();
        
        // Calculate summary
        $total = count($attendance);
        $present = count(array_filter($attendance, fn($a) => $a['status'] === 'present'));
        $percentage = $total > 0 ? round(($present / $total) * 100, 1) : 0;
        
        echo ApiResponse::success([
            'records' => $attendance,
            'summary' => [
                'total_sessions' => $total,
                'present' => $present,
                'absent' => $total - $present,
                'percentage' => $percentage
            ]
        ]);
    }
    
    public function getResults() {
        $this->requireAuth();
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        $semesterId = isset($_GET['semester_id']) ? (int)$_GET['semester_id'] : null;
        
        $where = ['r.student_id = ?'];
        $params = [$studentId];
        
        if ($semesterId) {
            $where[] = 'r.semester_id = ?';
            $params[] = $semesterId;
        }
        
        $whereClause = implode(' AND ', $where);
        
        $stmt = $this->db->prepare("
            SELECT r.*, c.code as course_code, c.name as course_name, c.credits,
                   ay.name as academic_year, s.name as semester_name
            FROM results r
            JOIN courses c ON r.course_id = c.id
            JOIN semesters s ON r.semester_id = s.id
            JOIN academic_years ay ON r.academic_year_id = ay.id
            WHERE $whereClause
            ORDER BY ay.name DESC, s.number, c.code
        ");
        $stmt->execute($params);
        $results = $stmt->fetchAll();
        
        // Calculate GPA
        $totalCredits = 0;
        $totalGradePoints = 0;
        
        foreach ($results as $result) {
            if ($result['grade_point'] !== null) {
                $totalCredits += $result['credits'];
                $totalGradePoints += $result['grade_point'] * $result['credits'];
            }
        }
        
        $gpa = $totalCredits > 0 ? round($totalGradePoints / $totalCredits, 2) : 0;
        
        echo ApiResponse::success([
            'results' => $results,
            'gpa' => $gpa,
            'total_credits' => $totalCredits
        ]);
    }
    
    public function getTranscript() {
        $this->requireAuth();
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        // Get all results grouped by semester/year
        $stmt = $this->db->prepare("
            SELECT r.*, c.code as course_code, c.name as course_name, c.credits,
                   ay.name as academic_year, s.name as semester_name, s.number as semester_number,
                   gs.grade, gs.grade_point
            FROM results r
            JOIN courses c ON r.course_id = c.id
            JOIN semesters s ON r.semester_id = s.id
            JOIN academic_years ay ON r.academic_year_id = ay.id
            LEFT JOIN grade_scale gs ON r.grade = gs.grade
            WHERE r.student_id = ? AND r.is_published = 1
            ORDER BY ay.name, s.number, c.code
        ");
        $stmt->execute([$studentId]);
        $results = $stmt->fetchAll();
        
        // Group by academic year and semester
        $transcript = [];
        foreach ($results as $result) {
            $year = $result['academic_year'];
            $sem = $result['semester_name'];
            $key = "$year - $sem";
            
            if (!isset($transcript[$key])) {
                $transcript[$key] = [
                    'academic_year' => $year,
                    'semester' => $sem,
                    'courses' => [],
                    'semester_gpa' => 0,
                    'semester_credits' => 0
                ];
            }
            
            $transcript[$key]['courses'][] = $result;
        }
        
        // Calculate semester GPAs
        foreach ($transcript as &$sem) {
            $credits = 0;
            $points = 0;
            foreach ($sem['courses'] as $course) {
                if ($course['grade_point'] !== null) {
                    $credits += $course['credits'];
                    $points += $course['grade_point'] * $course['credits'];
                }
            }
            $sem['semester_credits'] = $credits;
            $sem['semester_gpa'] = $credits > 0 ? round($points / $credits, 2) : 0;
        }
        
        // Get student info
        $stmt = $this->db->prepare("
            SELECT s.*, u.full_name, u.email, u.avatar_url,
                   f.name as faculty_name, d.name as department_name,
                   p.name as programme_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN faculties f ON s.faculty_id = f.id
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN programmes p ON s.programme_id = p.id
            WHERE s.id = ?
        ");
        $stmt->execute([$studentId]);
        $student = $stmt->fetch();
        
        echo ApiResponse::success([
            'student' => $student,
            'transcript' => array_values($transcript)
        ]);
    }
    
    public function getFees() {
        $this->requireAuth();
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT s.*, f.fee_type, f.amount as fee_amount, f.due_date,
                   p.amount as paid_amount, p.paid_at, p.status as payment_status,
                   p.receipt_number, p.payment_method
            FROM students s
            LEFT JOIN fees f ON f.programme_id = s.programme_id AND f.level = s.level
            LEFT JOIN payments p ON p.student_id = s.id AND p.fee_id = f.id
            WHERE s.id = ?
            ORDER BY f.due_date
        ");
        $stmt->execute([$studentId]);
        $fees = $stmt->fetchAll();
        
        // Get payment history
        $stmt = $this->db->prepare("
            SELECT p.*, f.fee_type
            FROM payments p
            LEFT JOIN fees f ON p.fee_id = f.id
            WHERE p.student_id = ?
            ORDER BY p.paid_at DESC
        ");
        $stmt->execute([$studentId]);
        $payments = $stmt->fetchAll();
        
        echo ApiResponse::success([
            'fees' => $fees,
            'payments' => $payments,
            'summary' => [
                'total_fees' => array_sum(array_column($fees, 'fee_amount')),
                'total_paid' => array_sum(array_column(array_filter($fees, fn($f) => $f['payment_status'] === 'completed'), 'paid_amount')),
                'balance' => array_sum(array_column($fees, 'fee_amount')) - array_sum(array_column(array_filter($fees, fn($f) => $f['payment_status'] === 'completed'), 'paid_amount'))
            ]
        ]);
    }
    
    public function registerCourses() {
        $this->requireAuth();
        $this->requireRole(['student']);
        
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['course_ids']) || !is_array($input['course_ids'])) {
            echo ApiResponse::error('Course IDs array required', 400);
            return;
        }
        
        $courseIds = $input['course_ids'];
        $semesterId = $input['semester_id'] ?? null;
        $academicYearId = $input['academic_year_id'] ?? null;
        
        // Get current semester if not specified
        if (!$semesterId) {
            $stmt = $this->db->prepare("SELECT id FROM semesters WHERE is_current = 1 LIMIT 1");
            $stmt->execute();
            $sem = $stmt->fetch();
            $semesterId = $sem['id'] ?? 1;
        }
        
        if (!$academicYearId) {
            $stmt = $this->db->prepare("SELECT id FROM academic_years WHERE is_current = 1 LIMIT 1");
            $stmt->execute();
            $ay = $stmt->fetch();
            $academicYearId = $ay['id'] ?? 1;
        }
        
        $this->db->beginTransaction();
        
        try {
            $registered = 0;
            foreach ($courseIds as $courseId) {
                // Check if already registered
                $stmt = $this->db->prepare("
                    SELECT id FROM course_registrations 
                    WHERE student_id = ? AND course_id = ? AND semester_id = ?
                ");
                $stmt->execute([$studentId, $courseId, $semesterId]);
                
                if ($stmt->fetch()) {
                    continue; // Already registered
                }
                
                $stmt = $this->db->prepare("
                    INSERT INTO course_registrations (student_id, course_id, semester_id, academic_year_id, status)
                    VALUES (?, ?, ?, ?, 'pending')
                ");
                $stmt->execute([$studentId, $courseId, $semesterId, $academicYearId]);
                $registered++;
            }
            
            $this->db->commit();
            
            echo ApiResponse::success(['registered' => $registered], "$registered courses registered successfully");
            
        } catch (Exception $e) {
            $this->db->rollback();
            echo ApiResponse::error('Registration failed: ' . $e->getMessage(), 500);
        }
    }
    
    public function getAvailableCourses() {
        $this->requireAuth();
        $studentId = $this->getStudentId();
        
        if (!$studentId) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        // Get student's programme and level
        $stmt = $this->db->prepare("SELECT programme_id, level FROM students WHERE id = ?");
        $stmt->execute([$studentId]);
        $student = $stmt->fetch();
        
        if (!$student) {
            echo ApiResponse::error('Student profile not found', 404);
            return;
        }
        
        // Get current semester
        $stmt = $this->db->prepare("SELECT id FROM semesters WHERE is_current = 1 LIMIT 1");
        $stmt->execute();
        $semester = $stmt->fetch();
        $semesterId = $semester['id'] ?? 1;
        
        // Get courses for programme and level
        $stmt = $this->db->prepare("
            SELECT c.*, 
                   CASE WHEN cr.id IS NOT NULL THEN 'registered' ELSE 'available' END as status,
                   cr.status as registration_status
            FROM courses c
            LEFT JOIN course_registrations cr ON c.id = cr.course_id AND cr.student_id = ? AND cr.semester_id = ?
            WHERE c.programme_id = ? AND c.level = ? AND c.is_active = 1
            ORDER BY c.code
        ");
        $stmt->execute([$studentId, $semesterId, $student['programme_id'], $student['level']]);
        
        echo ApiResponse::success($stmt->fetchAll());
    }
    
    private function getStudentId() {
        if ($this->user['role'] === 'student') {
            $stmt = $this->db->prepare("SELECT id FROM students WHERE user_id = ?");
            $stmt->execute([$this->user['id']]);
            $student = $stmt->fetch();
            return $student ? $student['id'] : null;
        }
        
        // Admin/staff can access specific student by ID
        return isset($_GET['id']) ? (int)$_GET['id'] : null;
    }
}