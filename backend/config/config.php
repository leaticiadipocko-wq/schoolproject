<?php
/**
 * SIARM Backend Configuration
 * Database and application settings
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'siarm_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Application Configuration
define('APP_NAME', 'SIARM');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost:8000');
define('API_URL', 'http://localhost:8000/api');

// Security Configuration
define('JWT_SECRET', 'siarm-jwt-secret-key-2025-change-in-production');
define('JWT_EXPIRY', 3600); // 1 hour
define('SESSION_LIFETIME', 7200); // 2 hours
define('PASSWORD_HASH_ALGO', PASSWORD_BCRYPT);
define('PASSWORD_HASH_COST', 12);

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173'
]);

// File Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'zip']);

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Error Reporting (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Timezone
date_default_timezone_set('Africa/Douala');