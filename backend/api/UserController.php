<?php
/**
 * User Controller
 * Handles user management (Admin/Staff)
 */

require_once __DIR__ . '/BaseController.php';

class UserController extends BaseController {
    
    public function index() {
        $this->requireAuth();
        $this->requireRole(['admin', 'staff']);
        
        $page = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $search = $_GET['search'] ?? '';
        $role = $_GET['role'] ?? '';
        $status = $_GET['status'] ?? '';
        
        $where = ['1=1'];
        $params = [];
        
        if ($search) {
            $where[] = "(full_name LIKE ? OR email LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        if ($role) {
            $where[] = "role = ?";
            $params[] = $role;
        }
        
        if ($status) {
            $where[] = "status = ?";
            $params[] = $status;
        }
        
        $whereClause = implode(' AND ', $where);
        $offset = ($page - 1) * $perPage;
        
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM users WHERE $whereClause";
        $total = $this->db->prepare($countSql);
        $total->execute($params);
        $total = $total->fetch()['total'];
        
        // Get users
        $sql = "SELECT id, uuid, email, full_name, role, avatar_url, phone, status, last_login_at, created_at 
                FROM users WHERE $whereClause ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $params[] = $perPage;
        $params[] = $offset;
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();
        
        echo ApiResponse::paginated($users, $page, $perPage, $total);
    }
    
    public function show($id) {
        $this->requireAuth();
        $this->requireRole(['admin', 'staff']);
        
        $stmt = $this->db->prepare("
            SELECT u.*, 
                   s.registration_number, s.matricule, s.level, s.specialty,
                   l.employee_number as lecturer_employee_number, l.specialization,
                   st.employee_number as staff_employee_number, st.position
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN lecturers l ON u.id = l.user_id
            LEFT JOIN staff st ON u.id = st.user_id
            WHERE u.id = ?
        ");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            echo ApiResponse::error('User not found', 404);
            return;
        }
        
        // Remove sensitive data
        unset($user['password_hash']);
        
        echo ApiResponse::success($user);
    }
    
    public function store() {
        $this->requireAuth();
        $this->requireRole(['admin']);
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['email'], $input['password'], $input['full_name'], $input['role'])) {
            echo ApiResponse::error('Missing required fields', 400);
            return;
        }
        
        // Validate email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            echo ApiResponse::error('Invalid email format', 400);
            return;
        }
        
        // Check if email exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$input['email']]);
        if ($stmt->fetch()) {
            echo ApiResponse::error('Email already in use', 400);
            return;
        }
        
        // Validate role
        if (!in_array($input['role'], ['admin', 'lecturer', 'staff', 'student'])) {
            echo ApiResponse::error('Invalid role', 400);
            return;
        }
        
        // Hash password
        $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        
        $this->db->beginTransaction();
        try {
            // Create user
            $stmt = $this->db->prepare("
                INSERT INTO users (email, password_hash, full_name, role, phone, status, email_verified_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $input['email'],
                $passwordHash,
                $input['full_name'],
                $input['role'],
                $input['phone'] ?? null,
                $input['status'] ?? 'active'
            ]);
            $userId = $this->db->lastInsertId();
            
            // Create role-specific record
            if ($input['role'] === 'student') {
                $this->createStudentRecord($userId, $input);
            } elseif ($input['role'] === 'lecturer') {
                $this->createLecturerRecord($userId, $input);
            } elseif ($input['role'] === 'staff') {
                $this->createStaffRecord($userId, $input);
            }
            
            $this->db->commit();
            
            echo ApiResponse::success(['id' => $userId], 'User created successfully', 201);
        } catch (Exception $e) {
            $this->db->rollback();
            echo ApiResponse::error('Failed to create user: ' . $e->getMessage(), 500);
        }
    }
    
    public function update($id) {
        $this->requireAuth();
        $this->requireRole(['admin', 'staff']);
        
        // Staff can only update students
        if ($this->user['role'] === 'staff' && $id != $this->user['id']) {
            $stmt = $this->db->prepare("SELECT role FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $targetUser = $stmt->fetch();
            if (!$targetUser || $targetUser['role'] !== 'student') {
                echo ApiResponse::error('Insufficient permissions', 403);
                return;
            }
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            echo ApiResponse::error('No data provided', 400);
            return;
        }
        
        // Build update query
        $allowedFields = ['full_name', 'phone', 'address', 'date_of_birth', 'gender', 'avatar_url', 'status'];
        $updates = [];
        $params = [];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updates[] = "`$field` = ?";
                $params[] = $input[$field];
            }
        }
        
        if (empty($updates)) {
            echo ApiResponse::error('No valid fields to update', 400);
            return;
        }
        
        $params[] = $id;
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            
            if ($stmt->rowCount() === 0) {
                echo ApiResponse::error('User not found', 404);
                return;
            }
            
            echo ApiResponse::success(null, 'User updated successfully');
        } catch (Exception $e) {
            echo ApiResponse::error('Failed to update user: ' . $e->getMessage(), 500);
        }
    }
    
    public function destroy($id) {
        $this->requireAuth();
        $this->requireRole(['admin']);
        
        if ($id == $this->user['id']) {
            echo ApiResponse::error('Cannot delete your own account', 400);
            return;
        }
        
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            echo ApiResponse::error('User not found', 404);
            return;
        }
        
        echo ApiResponse::success(null, 'User deleted successfully');
    }
    
    public function changePassword($id) {
        $this->requireAuth();
        
        // Users can only change their own password unless admin
        if ($id != $this->user['id'] && $this->user['role'] !== 'admin') {
            echo ApiResponse::error('Insufficient permissions', 403);
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['current_password'], $input['new_password'])) {
            echo ApiResponse::error('Current and new password required', 400);
            return;
        }
        
        if (strlen($input['new_password']) < 8) {
            echo ApiResponse::error('Password must be at least 8 characters', 400);
            return;
        }
        
        // Verify current password
        $stmt = $this->db->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($input['current_password'], $user['password_hash'])) {
            echo ApiResponse::error('Current password is incorrect', 400);
            return;
        }
        
        // Update password
        $newHash = password_hash($input['new_password'], PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = $this->db->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$newHash, $id]);
        
        echo ApiResponse::success(null, 'Password changed successfully');
    }
    
    private function createStudentRecord($userId, $input) {
        $year = date('Y');
        $stmt = $this->db->prepare("SELECT COUNT(*) as cnt FROM students WHERE YEAR(enrollment_date) = ?");
        $stmt->execute([$year]);
        $count = $stmt->fetch()['cnt'] + 1;
        
        $regNumber = "REG-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
        $matricule = "IUGET/{$year}/" . ($input['specialty'] ?? 'SWE') . "/" . str_pad($count, 4, '0', STR_PAD_LEFT);
        
        $stmt = $this->db->prepare("
            INSERT INTO students (user_id, registration_number, matricule, faculty_id, department_id, 
                                programme_id, level, specialty, academic_year_id, enrollment_date,
                                guardian_name, guardian_phone, guardian_email, guardian_address,
                                fee_status, fees_paid, fees_total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, 'partial', 0, ?)
        ");
        $stmt->execute([
            $userId, $regNumber, $matricule,
            $input['faculty_id'] ?? 1,
            $input['department_id'] ?? 1,
            $input['programme_id'] ?? 1,
            $input['level'] ?? 1,
            $input['specialty'] ?? 'SWE',
            $input['academic_year_id'] ?? 1,
            $input['guardian_name'] ?? null,
            $input['guardian_phone'] ?? null,
            $input['guardian_email'] ?? null,
            $input['guardian_address'] ?? null,
            $input['fees_total'] ?? 500000
        ]);
    }
    
    private function createLecturerRecord($userId, $input) {
        $year = date('Y');
        $stmt = $this->db->prepare("SELECT COUNT(*) as cnt FROM lecturers WHERE YEAR(hire_date) = ?");
        $stmt->execute([$year]);
        $count = $stmt->fetch()['cnt'] + 1;
        $empNumber = "LEC/{$year}/" . str_pad($count, 4, '0', STR_PAD_LEFT);
        
        $stmt = $this->db->prepare("
            INSERT INTO lecturers (user_id, employee_number, department_id, specialization, qualification, hire_date, employment_type)
            VALUES (?, ?, ?, ?, ?, NOW(), ?)
        ");
        $stmt->execute([
            $userId, $empNumber,
            $input['department_id'] ?? 1,
            $input['specialization'] ?? null,
            $input['qualification'] ?? null,
            $input['employment_type'] ?? 'full_time'
        ]);
    }
    
    private function createStaffRecord($userId, $input) {
        $year = date('Y');
        $stmt = $this->db->prepare("SELECT COUNT(*) as cnt FROM staff WHERE YEAR(hire_date) = ?");
        $stmt->execute([$year]);
        $count = $stmt->fetch()['cnt'] + 1;
        $empNumber = "STA/{$year}/" . str_pad($count, 4, '0', STR_PAD_LEFT);
        
        $stmt = $this->db->prepare("
            INSERT INTO staff (user_id, employee_number, department_id, position, hire_date, employment_type)
            VALUES (?, ?, ?, ?, NOW(), ?)
        ");
        $stmt->execute([
            $userId, $empNumber,
            $input['department_id'] ?? 1,
            $input['position'] ?? 'Officer',
            $input['employment_type'] ?? 'full_time'
        ]);
    }
}