<?php
/**
 * Auth Middleware
 * Handles authentication and authorization
 */

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/JWTHandler.php';
require_once __DIR__ . '/ApiResponse.php';

class AuthMiddleware {
    private $db;
    private $user = null;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (!preg_match('/^Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return false;
        }
        
        $token = $matches[1];
        $payload = JWTHandler::decode($token);
        
        if (!$payload || !isset($payload['user_id'])) {
            return false;
        }
        
        // Verify user exists and is active
        $stmt = $this->db->prepare("SELECT id, uuid, email, full_name, role, status FROM users WHERE id = ? AND status = 'active'");
        $stmt->execute([$payload['user_id']]);
        $this->user = $stmt->fetch();
        
        return $this->user !== false;
    }
    
    public function getUser() {
        return $this->user;
    }
    
    public function requireRole($roles) {
        if (!$this->user) {
            return false;
        }
        
        $roles = is_array($roles) ? $roles : [$roles];
        return in_array($this->user['role'], $roles);
    }
    
    public function requirePermission($permission) {
        // Implement permission-based access if needed
        return true;
    }
    
    public static function handleCORS() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = ALLOWED_ORIGINS;
        
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit(0);
        }
    }
}