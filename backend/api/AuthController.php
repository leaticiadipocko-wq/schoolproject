<?php
/**
 * Authentication Controller
 * Handles login, register, logout, password reset
 */

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/JWTHandler.php';

class AuthController extends BaseController {
    
    public function login() {
        $input = $this->getInput();
        
        $missing = $this->validateRequired($input, ['email', 'password']);
        if (!empty($missing)) {
            echo ApiResponse::error('Missing required fields: ' . implode(', ', $missing), 400);
            return;
        }
        
        $email = strtolower(trim($input['email']));
        $password = $input['password'];
        
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user || !password_verify($password, $user['password_hash'])) {
                echo ApiResponse::error('Invalid email or password', 401);
                return;
            }
            
            // Generate JWT token
            $token = JWTHandler::encode([
                'user_id' => $user['id'],
                'uuid' => $user['uuid'],
                'email' => $user['email'],
                'role' => $user['role'],
                'name' => $user['full_name']
            ]);
            
            // Update last login
            $stmt = $this->db->prepare("UPDATE users SET last_login_at = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);
            
            // Get role-specific data
            $profile = $this->getProfileData($user);
            
            echo ApiResponse::success([
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'uuid' => $user['uuid'],
                    'email' => $user['email'],
                    'full_name' => $user['full_name'],
                    'role' => $user['role'],
                    'avatar_url' => $user['avatar_url'],
                    'phone' => $user['phone'],
                    'status' => $user['status'],
                    'last_login_at' => $user['last_login_at'],
                    'profile' => $profile
                ]
            ], 'Login successful');
            
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            echo ApiResponse::error('Login failed', 500);
        }
    }
    
    public function register() {
        $input = $this->getInput();
        
        $missing = $this->validateRequired($input, ['email', 'password', 'full_name', 'role']);
        if (!empty($missing)) {
            echo ApiResponse::error('Missing required fields: ' . implode(', ', $missing), 400);
            return;
        }
        
        $email = strtolower(trim($input['email']));
        $password = $input['password'];
        $fullName = trim($input['full_name']);
        $role = $input['role'];
        $phone = $input['phone'] ?? null;
        
        // Validate role
        if (!in_array($role, ['student', 'lecturer', 'staff', 'admin'])) {
            echo ApiResponse::error('Invalid role', 400);
            return;
        }
        
        // Validate password strength
        if (strlen($password) < 8) {
            echo ApiResponse::error('Password must be at least 8 characters', 400);
            return;
        }
        
        try {
            // Check if email exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                echo ApiResponse::error('Email already in use', 409);
                return;
            }
            
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
            
            // Generate avatar
            $avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($fullName);
            
            // Start transaction
            $this->db->beginTransaction();
            
            try {
                // Create user
                $stmt = $this->db->prepare("
                    INSERT INTO users (email, password_hash, full_name, role, avatar_url, phone, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
                ");
                $stmt->execute([$email, $passwordHash, $fullName, $role, $avatarUrl, $phone]);
                $userId = $this->db->lastInsertId();
                
                // Create role-specific record
                if ($role === 'student') {
                    $this->createStudentRecord($userId, $input);
                } elseif ($role === 'lecturer') {
                    $this->createLecturerRecord($userId, $input);
                } elseif ($role === 'staff') {
                    $this->createStaffRecord($userId, $input);
                }
                
                $this->db->commit();
                
                // Generate token
                $token = JWTHandler::encode([
                    'user_id' => $userId,
                    'email' => $email,
                    'role' => $role,
                    'name' => $fullName
                ]);
                
                echo ApiResponse::success([
                    'token' => $token,
                    'user' => [
                        'id' => $userId,
                        'email' => $email,
                        'full_name' => $fullName,
                        'role' => $role,
                        'avatar_url' => $avatarUrl,
                        'status' => 'pending'
                    ]
                ], 'Registration successful. Account pending approval.', 201);
                
            } catch (Exception $e) {
                $this->db->rollback();
                throw $e;
            }
            
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            echo ApiResponse::error('Registration failed', 500);
        }
    }
    
    public function logout() {
        // Client-side token removal is sufficient for JWT
        // For session-based auth, we'd invalidate the session
        echo ApiResponse::success(null, 'Logged out successfully');
    }
    
    public function me() {
        $this->requireAuth();
        
        $profile = $this->getProfileData($this->auth->getUser());
        
        echo ApiResponse::success([
            'user' => array_merge($this->auth->getUser(), ['profile' => $profile])
        ]);
    }
    
    public function forgotPassword() {
        $input = $this->getInput();
        $missing = $this->validateRequired($input, ['email']);
        if (!empty($missing)) {
            echo ApiResponse::error('Email is required', 400);
            return;
        }
        
        $email = strtolower(trim($input['email']));
        
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            // Always return success to prevent email enumeration
            if ($user) {
                // Generate reset token
                $token = bin2hex(random_bytes(32));
                $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour
                
                $stmt = $this->db->prepare("
                    INSERT INTO password_reset_tokens (email, token, expires_at)
                    VALUES (?, ?, ?)
                ");
                $stmt->execute([$email, $token, $expiresAt]);
                
                // In production, send email with reset link
                // For now, we'll just log it
                error_log("Password reset token for $email: $token");
            }
            
            echo ApiResponse::success(null, 'If the email exists, a reset link has been sent');
            
        } catch (Exception $e) {
            error_log("Forgot password error: " . $e->getMessage());
            echo ApiResponse::error('Failed to process request', 500);
        }
    }
    
    public function resetPassword() {
        $input = $this->getInput();
        
        $missing = $this->validateRequired($input, ['token', 'password', 'password_confirm']);
        if (!empty($missing)) {
            echo ApiResponse::error('Missing required fields: ' . implode(', ', $missing), 400);
            return;
        }
        
        if ($input['password'] !== $input['password_confirm']) {
            echo ApiResponse::error('Passwords do not match', 400);
            return;
        }
        
        if (strlen($input['password']) < 8) {
            echo ApiResponse::error('Password must be at least 8 characters', 400);
            return;
        }
        
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM password_reset_tokens 
                WHERE token = ? AND expires_at > NOW() AND used_at IS NULL
            ");
            $stmt->execute([$input['token']]);
            $resetToken = $stmt->fetch();
            
            if (!$resetToken) {
                echo ApiResponse::error('Invalid or expired reset token', 400);
                return;
            }
            
            $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT, ['cost' => 12]);
            
            $this->db->beginTransaction();
            
            // Update password
            $stmt = $this->db->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
            $stmt->execute([$passwordHash, $resetToken['email']]);
            
            // Mark token as used
            $stmt = $this->db->prepare("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?");
            $stmt->execute([$resetToken['id']]);
            
            $this->db->commit();
            
            echo ApiResponse::success(null, 'Password reset successful');
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Reset password error: " . $e->getMessage());
            echo ApiResponse::error('Failed to reset password', 500);
        }
    }
    
    public function changePassword() {
        $this->requireAuth();
        
        $input = $this->getInput();
        $missing = $this->validateRequired($input, ['current_password', 'new_password', 'new_password_confirm']);
        if (!empty($missing)) {
            echo ApiResponse::error('Missing required fields: ' . implode(', ', $missing), 400);
            return;
        }
        
        if ($input['new_password'] !== $input['new_password_confirm']) {
            echo ApiResponse::error('New passwords do not match', 400);
            return;
        }
        
        if (strlen($input['new_password']) < 8) {
            echo ApiResponse::error('Password must be at least 8 characters', 400);
            return;
        }
        
        try {
            $stmt = $this->db->prepare("SELECT password_hash FROM users WHERE id = ?");
            $stmt->execute([$this->user['id']]);
            $user = $stmt->fetch();
            
            if (!password_verify($input['current_password'], $user['password_hash'])) {
                echo ApiResponse::error('Current password is incorrect', 401);
                return;
            }
            
            $newHash = password_hash($input['new_password'], PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt = $this->db->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$newHash, $this->user['id']]);
            
            echo ApiResponse::success(null, 'Password changed successfully');
            
        } catch (Exception $e) {
            error_log("Change password error: " . $e->getMessage());
            echo ApiResponse::error('Failed to change password', 500);
        }
    }
    
    private function getProfileData($user) {
        if ($user['role'] === 'student') {
            $stmt = $this->db->prepare("
                SELECT s.*, f.name as faculty_name, d.name as department_name, p.name as programme_name
                FROM students s
                LEFT JOIN faculties f ON s.faculty_id = f.id
                LEFT JOIN departments d ON s.department_id = d.id
                LEFT JOIN programmes p ON s.programme_id = p.id
                WHERE s.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            return $stmt->fetch() ?? [];
        } elseif ($user['role'] === 'lecturer') {
            $stmt = $this->db->prepare("
                SELECT l.*, f.name as faculty_name, d.name as department_name
                FROM lecturers l
                LEFT JOIN faculties f ON l.faculty_id = f.id
                LEFT JOIN departments d ON l.department_id = d.id
                WHERE l.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            return $stmt->fetch() ?? [];
        } elseif ($user['role'] === 'staff') {
            $stmt = $this->db->prepare("
                SELECT s.*, f.name as faculty_name, d.name as department_name
                FROM staff s
                LEFT JOIN faculties f ON s.faculty_id = f.id
                LEFT JOIN departments d ON s.department_id = d.id
                WHERE s.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            return $stmt->fetch() ?? [];
        }
        return [];
    }
    
    private function createStudentRecord($userId, $input) {
        // Get current academic year
        $stmt = $this->db->prepare("SELECT id FROM academic_years WHERE is_current = 1 LIMIT 1");
        $stmt->execute();
        $academicYear = $stmt->fetch();
        $academicYearId = $academicYear['id'] ?? 1;
        
        // Generate registration number
        $year = date('Y');
        $stmt = $this->db->prepare("SELECT COUNT(*) as cnt FROM students WHERE YEAR(enrollment_date) = ?");
        $stmt->execute([$year]);
        $count = $stmt->fetch()['cnt'] + 1;
        $regNumber = "REG/{$year}/" . str_pad($count, 5, '0', STR_PAD_LEFT);
        
        // Generate matricule
        $specialty = $input['specialty'] ?? 'SWE';
        $stmt = $this->db->prepare("SELECT COUNT(*) as cnt FROM students WHERE specialty = ?");
        $stmt->execute([$specialty]);
        $specCount = $stmt->fetch()['cnt'] + 1;
        $matricule = "IUGET/{$year}/{$specialty}/" . str_pad($specCount, 4, '0', STR_PAD_LEFT);
        
        // Get programme ID
        $programmeId = $input['programme_id'] ?? null;
        if (!$programmeId) {
            $stmt = $this->db->prepare("SELECT id FROM programmes WHERE code = ? LIMIT 1");
            $stmt->execute([$specialty]);
            $prog = $stmt->fetch();
            $programmeId = $prog['id'] ?? 1;
        }
        
        $stmt = $this->db->prepare("
            INSERT INTO students (user_id, registration_number, matricule, programme_id, academic_year_id, 
                                specialty, level, enrollment_date, guardian_name, guardian_phone, guardian_email, guardian_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)
        ");
        $stmt->execute([
            $userId, $regNumber, $matricule, $programmeId, $academicYearId,
            $specialty, $input['level'] ?? 1,
            $input['guardian_name'] ?? null,
            $input['guardian_phone'] ?? null,
            $input['guardian_email'] ?? null,
            $input['guardian_address'] ?? null
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