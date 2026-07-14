<?php
/**
 * Main API Router
 * Entry point for all API requests
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

// Load dependencies
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/config/AuthMiddleware.php';
require_once __DIR__ . '/config/ApiResponse.php';
require_once __DIR__ . '/config/JWTHandler.php';
require_once __DIR__ . '/api/BaseController.php';
require_once __DIR__ . '/api/AuthController.php';
require_once __DIR__ . '/api/UserController.php';
require_once __DIR__ . '/api/LecturerController.php';

// Initialize database and auth
$db = Database::getInstance()->getConnection();
$auth = new AuthMiddleware();

// Parse request
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $requestUri);
$path = trim($path, '/');
$segments = $path ? explode('/', $path) : [];

$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$action = $segments[2] ?? null;

// Route to appropriate controller
try {
    switch ($resource) {
        case 'auth':
            $controller = new AuthController($db, $auth);
            
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    if ($id === 'login') {
                        $controller->login();
                    } elseif ($id === 'register') {
                        $controller->register();
                    } elseif ($id === 'logout') {
                        $controller->logout();
                    } elseif ($id === 'forgot-password') {
                        $controller->forgotPassword();
                    } elseif ($id === 'reset-password') {
                        $controller->resetPassword();
                    } elseif ($id === 'change-password') {
                        $controller->changePassword();
                    } else {
                        echo ApiResponse::error('Invalid auth endpoint', 404);
                    }
                    break;
                case 'GET':
                    if ($id === 'me') {
                        $controller->me();
                    } else {
                        echo ApiResponse::error('Invalid auth endpoint', 404);
                    }
                    break;
                default:
                    echo ApiResponse::error('Method not allowed', 405);
            }
            break;
            
        case 'users':
            $controller = new UserController($db, $auth);
            
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    if ($id) {
                        $controller->show($id);
                    } else {
                        $controller->index();
                    }
                    break;
                case 'POST':
                    $controller->store();
                    break;
                case 'PUT':
                case 'PATCH':
                    if ($id) {
                        $controller->update($id);
                    } else {
                        echo ApiResponse::error('User ID required', 400);
                    }
                    break;
                case 'DELETE':
                    if ($id) {
                        $controller->destroy($id);
                    } else {
                        echo ApiResponse::error('User ID required', 400);
                    }
                    break;
                default:
                    echo ApiResponse::error('Method not allowed', 405);
            }
            break;
            
        case 'students':
            // Student routes would go here
            echo ApiResponse::error('Student endpoints not implemented yet', 501);
            break;
            
        case 'lecturer':
            $controller = new LecturerController($db, $auth);
            
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'POST':
                    if ($id === 'attendance') {
                        $controller->markAttendance();
                    } elseif ($id === 'grades') {
                        $controller->submitGrades();
                    } elseif ($id === 'publish-grades') {
                        $controller->publishGrades();
                    } else {
                        echo ApiResponse::error('Invalid lecturer endpoint', 404);
                    }
                    break;
                case 'GET':
                    if ($id === 'attendance' && $action === 'records') {
                        $controller->getAttendanceRecords();
                    } else {
                        echo ApiResponse::error('Invalid lecturer endpoint', 404);
                    }
                    break;
                default:
                    echo ApiResponse::error('Method not allowed', 405);
            }
            break;
            
        case '':
            // API info
            echo ApiResponse::success([
                'name' => APP_NAME,
                'version' => APP_VERSION,
                'endpoints' => [
                    'POST /api/auth/login' => 'User login',
                    'POST /api/auth/register' => 'User registration',
                    'POST /api/auth/logout' => 'User logout',
                    'POST /api/auth/forgot-password' => 'Request password reset',
                    'POST /api/auth/reset-password' => 'Reset password with token',
                    'POST /api/auth/change-password' => 'Change password',
                    'GET /api/auth/me' => 'Get current user',
                    'GET /api/users' => 'List users (admin/staff)',
                    'POST /api/users' => 'Create user (admin)',
                    'GET /api/users/{id}' => 'Get user details',
                    'PUT /api/users/{id}' => 'Update user',
                    'DELETE /api/users/{id}' => 'Delete user (admin)',
                    'POST /api/lecturer/attendance' => 'Mark attendance',
                    'GET /api/lecturer/attendance/records' => 'Get attendance records',
                    'POST /api/lecturer/grades' => 'Submit grades (draft)',
                    'POST /api/lecturer/publish-grades' => 'Publish grades'
                ]
            ]);
            break;
            
        default:
            echo ApiResponse::error('Endpoint not found', 404);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    echo ApiResponse::error('Internal server error', 500);
}