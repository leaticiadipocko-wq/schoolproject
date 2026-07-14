<?php

/**
 * Base Controller for API endpoints
 * Provides common functionality for all controllers
 */
abstract class BaseController {
    protected $db;
    protected $auth;
    
    public function __construct($db, $auth) {
        $this->db = $db;
        $this->auth = $auth;
    }
    
    protected function requireAuth() {
        if (!$this->auth->isLoggedIn()) {
            echo ApiResponse::error('Authentication required', 401);
            exit;
        }
    }
    
    protected function requireRole($roles) {
        $this->requireAuth();
        if (!$this->auth->hasRole($roles)) {
            echo ApiResponse::error('Insufficient permissions', 403);
            exit;
        }
    }
    
    protected function getInput() {
        $input = json_decode(file_get_contents('php://input'), true);
        return $input ?? [];
    }
    
    protected function getQueryParams() {
        return $_GET;
    }
    
    protected function validateRequired($data, $fields) {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $missing[] = $field;
            }
        }
        return $missing;
    }
    
    protected function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
}