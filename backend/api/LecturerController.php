<?php
/**
 * Lecturer Controller
 * Handles lecturer-specific operations
 */

require_once __DIR__ . '/BaseController.php';

class LecturerController extends BaseController {
    
    public function getProfile() {
        $this->requireAuth();
        $this->requireRole(['lecturer']);
        
        $lecturerId = $this->getLecturerId();
        
        $stmt = $this->db->prepare("
            SELECT l.*, u.full_name, u.email, u.avatar_url, u.phone,
                   f.name as faculty_name, d.name as department_name
            FROM lecturers l
            JOIN users u ON l.user_id = u.id
            LEFT JOIN faculties f ON l.faculty_id = f.id
            LEFT JOIN departments d ON l.department_id = d.id
            WHERE l.id = ?
        ");
        $stmt->execute([$lecturerId]);
        $lecturer = $stmt->fetch();
        
        if (!$lecturer) {
            echo ApiResponse::error('Lecturer profile not found', 404);
            return;
        }
        
        // Get assigned courses
        $stmt = $this->db->prepare("
            SELECT c.*, cr.status as registration_status
            FROM courses c
            LEFT JOIN course_registrations cr ON c.id = cr.course_id
            WHERE c.lecturer_id = ? AND c.is_active = 1
            ORDER BY c.code
        ");
        $stmt->execute([$lecturerId]);
        $lecturer['courses'] = $stmt->fetchAll();
        
        echo ApiResponse::success($lecturer);
    }
    
    public function getMyCourses() {
        $this->requireAuth();
        $this->requireRole(['lecturer']);
        
        $lecturerId = $this->getLecturerId();
        $semesterId = isset($_GET['semester_id']) ? (int)$_GET['semester_id'] : null;
        
        if (!$semesterId) {
            $stmt = $this->db->prepare("SELECT id FROM semesters WHERE is_current = 1 LIMIT 1");
            $stmt->execute();
            $sem = $stmt->fetch();
            $semesterId = $sem['id'] ?? 1;
        }
        
        $stmt = $this->db->prepare("
            SELECT c.*, cr.student_id, cr.status as reg_status,
                   s.registration_number, s.matricule, u.full_name as student_name
            FROM courses c
            LEFT JOIN course_registrations cr ON c.id = cr.course_id AND cr.semester_id = ?
            LEFT JOIN students s ON cr.student_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            WHERE c.lecturer_id = ? AND c.is_active = 1
            ORDER BY c.code, u.full_name
        ");
        $stmt->execute([$semesterId, $lecturerId]);
        $courses = $stmt->fetchAll();
        
        // Group by course
        $grouped = [];
        foreach ($courses as $row) {
            $cid = $row['id'];
            if (!isset($grouped[$cid])) {
                $grouped[$cid] = [
                    'course' => $row,
                    'students' => []
                ];
                unset($grouped[$cid]['course']['student_id'], $grouped[$cid]['course']['registration_status'], 
                      $grouped[$cid]['course']['registration_number'], $grouped[$cid]['course']['matricule'], $grouped[$cid]['course']['student_name']);
            }
            if ($row['student_id']) {
                $grouped[$cid]['students'][] = [
                    'student_id' => $row['student_id'],
                    'registration_number' => $row['registration_number'],
                    'matricule' => $row['matricule'],
                    'name' => $row['student_name'],
                    'status' => $row['reg_status']
                ];
            }
        }
        
        echo ApiResponse::success(array_values($grouped));
    }
    
    public function markAttendance() {
        $this->requireAuth();
        $this->requireRole(['lecturer']);
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['course_id'], $input['date'], $input['slot_id'], $input['records'])) {
            echo ApiResponse::error('Missing required fields: course_id, date, slot_id, records', 400);
            return;
        }
        
        $courseId = (int)$input['course_id'];
        $date = $input['date'];
        $slotId = (int)$input['slot_id'];
        $records = $input['records']; // array of [student_id, status]
        $method = $input['method'] ?? 'manual';
        
        // Verify lecturer teaches this course
        $stmt = $this->db->prepare("SELECT id FROM courses WHERE id = ? AND lecturer_id = ?");
        $stmt->execute([$courseId, $this->getLecturerId()]);
        if (!$stmt->fetch()) {
            echo ApiResponse::error('You are not assigned to this course', 403);
            return;
        }
        
        // Get timetable entry for this course/slot
        $stmt = $this->db->prepare("
            SELECT id FROM timetable 
            WHERE course_id = ? AND slot_id = ? AND is_published = 1
        ");
        $stmt->execute([$courseId, $slotId]);
        $timetable = $stmt->fetch();
        $timetableId = $timetable ? $timetable['id'] : null;
        
        $this->db->beginTransaction();
        
        try {
            $processed = 0;
            foreach ($records as $record) {
                $studentId = (int)$record['student_id'];
                $status = $record['status'];
                
                // Verify student is registered for this course
                $stmt = $this->db->prepare("
                    SELECT id FROM course_registrations 
                    WHERE student_id = ? AND course_id = ? AND status = 'approved'
                ");
                $stmt->execute([$studentId, $courseId]);
                if (!$stmt->fetch()) {
                    continue; // Skip unregistered students
                }
                
                // Insert or update attendance
                $stmt = $this->db->prepare("
                    INSERT INTO attendance (student_id, course_id, timetable_id, date, slot_id, status, marked_by, marked_at, method)
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
                    ON DUPLICATE KEY UPDATE 
                        status = VALUES(status),
                        marked_by = VALUES(marked_by),
                        marked_at = NOW(),
                        method = VALUES(method)
                ");
                $stmt->execute([$studentId, $courseId, $timetableId, $date, $slotId, $status, $this->user['id'], $method]);
                $processed++;
            }
            
            $this->db->commit();
            
            echo ApiResponse::success(['processed' => $processed], "Attendance recorded for $processed students");
            
        } catch (Exception $e) {
            $this->db->rollback();
            echo ApiResponse::error('Failed to record attendance: ' . $e->getMessage(), 500);
        }
    }
    
    public function getAttendanceRecords() {
        $this->requireAuth();
        $this->requireRole(['lecturer']);
        
        $courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : null;
        $date = $_GET['date'] ?? date('Y-m-d');
        
        if (!$courseId) {
            echo ApiResponse::error('Course ID required', 400);
            return;
        }
        
        // Verify lecturer teaches this course
        $stmt = $this->db->prepare("SELECT id FROM courses WHERE id = ? AND lecturer_id = ?");
        $stmt->execute([$courseId, $this->getLecturerId()]);
        if (!$stmt->fetch()) {
            echo ApiResponse::error('You are not assigned to this course', 403);
            return;
        }
        
        // Get all registered students with their attendance for this date
        $stmt = $this->db->prepare("
            SELECT s.id as student_id, s.registration_number, s.matricule, u.full_name as student_name,
                   a.id as attendance_id, a.status, a.marked_at, a.method
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN course_registrations cr ON s.id = cr.student_id
            LEFT JOIN attendance a ON a.student_id = s.id AND a.course_id = ? AND a.date = ?
            WHERE cr.course_id = ? AND cr.status = 'approved'
            ORDER BY u.full_name
        ");
        $stmt->execute([$courseId, $date, $courseId]);
        
        echo ApiResponse::success([
            'date' => $date,
            'course_id' => $courseId,
            'records' => $stmt->fetchAll()
        ]);
    }
    
    public function submitGrades() {
        $this->requireAuth();
        $this->requireRole(['lecturer']);
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['course_id'], $input['semester_id'], $input['grades'])) {
            echo ApiResponse::error('Missing required fields: course_id, semester_id, grades', 400);
            return;
        }
        
        $courseId = (int)$input['course_id'];
        $semesterId = (int)$input['semester_id'];
        $academicYearId = $input['academic_year_id'] ?? 1;
        $grades = $input['grades']; // array of [student_id, ca, exam]
        
        // Verify lecturer teaches this course
        $stmt = $this->db->prepare("SELECT id FROM courses WHERE id = ? AND lecturer_id = ?");
        $stmt->execute([$courseId, $this->getLecturerId()]);
        if (!$stmt->fetch()) {
            echo ApiResponse::error('You are not assigned to this course', 403);
            return;
        }
        
        $this->db->beginTransaction();
        
        try {
            $processed = 0;
            foreach ($grades as $grade) {
                $studentId = (int)$grade['student_id'];
                $ca = (float)$grade['ca'];
                $exam = (float)$grade['exam'];
                
                if ($ca < 0 || $ca > 30 || $exam < 0 || $exam > 70) {
                    continue; // Invalid marks
                }
                
                // Verify student is registered
                $stmt = $this->db->prepare("
                    SELECT id FROM course_registrations 
                    WHERE student_id = ? AND course_id = ? AND status = 'approved'
                ");
                $stmt->execute([$studentId, $courseId]);
                if (!$stmt->fetch()) {
                    continue;
                }
                
                $total = $ca + $exam;
                $grade = $this->calculateGrade($total);
                $gradePoint = $this->getGradePoint($grade);
                
                $stmt = $this->db->prepare("
                    INSERT INTO results (student_id, course_id, semester_id, academic_year_id, ca_mark, exam_mark, grade, grade_point, is_published)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
                    ON DUPLICATE KEY UPDATE
                        ca_mark = VALUES(ca_mark),
                        exam_mark = VALUES(exam_mark),
                        grade = VALUES(grade),
                        grade_point = VALUES(grade_point),
                        updated_at = NOW()
                ");
                $stmt->execute([$studentId, $courseId, $semesterId, $academicYearId, $ca, $exam, $grade, $gradePoint]);
                $processed++;
            }
            
            $this->db->commit();
            
            echo ApiResponse::success(['processed' => $processed], "$processed grade records saved (draft)");
            
        } catch (Exception $e) {
            $this->db->rollback();
            echo ApiResponse::error('Failed to save grades: ' . $e->getMessage(), 500);
        }
    }
    
    public function publishGrades() {
        $this->requireAuth();
        $this->requireRole(['lecturer']);
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['course_id'], $input['semester_id'])) {
            echo ApiResponse::error('Course ID and Semester ID required', 400);
            return;
        }
        
        $courseId = (int)$input['course_id'];
        $semesterId = (int)$input['semester_id'];
        
        // Verify lecturer teaches this course
        $stmt = $this->db->prepare("SELECT id FROM courses WHERE id = ? AND lecturer_id = ?");
        $stmt->execute([$courseId, $this->getLecturerId()]);
        if (!$stmt->fetch()) {
            echo ApiResponse::error('You are not assigned to this course', 403);
            return;
        }
        
        $stmt = $this->db->prepare("
            UPDATE results 
            SET is_published = 1, published_at = NOW(), published_by = ?
            WHERE course_id = ? AND semester_id = ?
        ");
        $stmt->execute([$this->user['id'], $courseId, $semesterId]);
        $count = $stmt->rowCount();
        
        echo ApiResponse::success(['published' => $count], "$count grade records published");
    }
    
    private function getLecturerId() {
        $stmt = $this->db->prepare("SELECT id FROM lecturers WHERE user_id = ?");
        $stmt->execute([$this->user['id']]);
        $lecturer = $stmt->fetch();
        return $lecturer ? $lecturer['id'] : null;
    }
    
    private function calculateGrade($total) {
        if ($total >= 70) return 'A';
        if ($total >= 60) return 'B';
        if ($total >= 50) return 'C';
        if ($total >= 45) return 'D';
        if ($total >= 40) return 'E';
        return 'F';
    }
    
    private function getGradePoint($grade) {
        $points = ['A' => 5.00, 'B' => 4.00, 'C' => 3.00, 'D' => 2.00, 'E' => 1.00, 'F' => 0.00];
        return $points[$grade] ?? 0.00;
    }
}