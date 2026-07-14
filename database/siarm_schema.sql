-- SIARM Database Schema
-- Smart Integrated Academic Resource Management System
-- Compatible with MySQL 8.0+ / MariaDB 10.5+

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database
CREATE DATABASE IF NOT EXISTS `siarm_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `siarm_db`;

-- --------------------------------------------------------
-- Table: users (core authentication table)
-- --------------------------------------------------------
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `role` ENUM('admin','lecturer','staff','student') NOT NULL DEFAULT 'student',
    `avatar_url` VARCHAR(500) NULL,
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `date_of_birth` DATE NULL,
    `gender` ENUM('M','F','O') NULL,
    `status` ENUM('active','inactive','pending','suspended') NOT NULL DEFAULT 'pending',
    `email_verified_at` TIMESTAMP NULL,
    `last_login_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_uuid` (`uuid`),
    KEY `idx_role` (`role`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: students (student-specific information)
-- --------------------------------------------------------
CREATE TABLE `students` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `registration_number` VARCHAR(50) NOT NULL,
    `matricule` VARCHAR(50) NOT NULL,
    `faculty_id` BIGINT UNSIGNED NULL,
    `department_id` BIGINT UNSIGNED NULL,
    `programme_id` BIGINT UNSIGNED NULL,
    `level` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `specialty` VARCHAR(100) NULL,
    `academic_year_id` BIGINT UNSIGNED NULL,
    `enrollment_date` DATE NOT NULL,
    `guardian_name` VARCHAR(255) NULL,
    `guardian_phone` VARCHAR(20) NULL,
    `guardian_email` VARCHAR(255) NULL,
    `guardian_address` TEXT NULL,
    `emergency_contact` VARCHAR(255) NULL,
    `fee_status` ENUM('paid','partial','overdue','exempt') NOT NULL DEFAULT 'partial',
    `fees_paid` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `fees_total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_id` (`user_id`),
    UNIQUE KEY `uk_registration_number` (`registration_number`),
    UNIQUE KEY `uk_matricule` (`matricule`),
    KEY `idx_faculty` (`faculty_id`),
    KEY `idx_department` (`department_id`),
    KEY `idx_programme` (`programme_id`),
    KEY `idx_level` (`level`),
    KEY `idx_academic_year` (`academic_year_id`),
    CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: lecturers (lecturer-specific information)
-- --------------------------------------------------------
CREATE TABLE `lecturers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `employee_number` VARCHAR(50) NOT NULL,
    `faculty_id` BIGINT UNSIGNED NULL,
    `department_id` BIGINT UNSIGNED NULL,
    `specialization` VARCHAR(255) NULL,
    `qualification` VARCHAR(255) NULL,
    `hire_date` DATE NOT NULL,
    `employment_type` ENUM('full_time','part_time','contract','visiting') NOT NULL DEFAULT 'full_time',
    `office_number` VARCHAR(50) NULL,
    `office_hours` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_id` (`user_id`),
    UNIQUE KEY `uk_employee_number` (`employee_number`),
    KEY `idx_faculty` (`faculty_id`),
    KEY `idx_department` (`department_id`),
    CONSTRAINT `fk_lecturers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: staff (staff-specific information)
-- --------------------------------------------------------
CREATE TABLE `staff` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `employee_number` VARCHAR(50) NOT NULL,
    `faculty_id` BIGINT UNSIGNED NULL,
    `department_id` BIGINT UNSIGNED NULL,
    `position` VARCHAR(255) NOT NULL,
    `hire_date` DATE NOT NULL,
    `employment_type` ENUM('full_time','part_time','contract') NOT NULL DEFAULT 'full_time',
    `office_number` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_id` (`user_id`),
    UNIQUE KEY `uk_employee_number` (`employee_number`),
    KEY `idx_faculty` (`faculty_id`),
    KEY `idx_department` (`department_id`),
    CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: faculties
-- --------------------------------------------------------
CREATE TABLE `faculties` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `dean_id` BIGINT UNSIGNED NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`),
    UNIQUE KEY `uk_name` (`name`),
    KEY `idx_dean` (`dean_id`),
    CONSTRAINT `fk_faculties_dean` FOREIGN KEY (`dean_id`) REFERENCES `lecturers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: departments
-- --------------------------------------------------------
CREATE TABLE `departments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `faculty_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `hod_id` BIGINT UNSIGNED NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_faculty_code` (`faculty_id`, `code`),
    KEY `idx_faculty` (`faculty_id`),
    KEY `idx_hod` (`hod_id`),
    CONSTRAINT `fk_departments_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_departments_hod` FOREIGN KEY (`hod_id`) REFERENCES `lecturers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: programmes
-- --------------------------------------------------------
CREATE TABLE `programmes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `department_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `duration_years` TINYINT UNSIGNED NOT NULL DEFAULT 4,
    `total_credits` SMALLINT UNSIGNED NOT NULL DEFAULT 120,
    `degree_type` ENUM('bachelor','master','phd','diploma','certificate') NOT NULL DEFAULT 'bachelor',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_department_code` (`department_id`, `code`),
    KEY `idx_department` (`department_id`),
    CONSTRAINT `fk_programmes_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: courses
-- --------------------------------------------------------
CREATE TABLE `courses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `programme_id` BIGINT UNSIGNED NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `credits` TINYINT UNSIGNED NOT NULL DEFAULT 3,
    `level` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `semester` ENUM('1','2','summer') NOT NULL DEFAULT '1',
    `prerequisite_id` BIGINT UNSIGNED NULL,
    `is_elective` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`),
    KEY `idx_programme` (`programme_id`),
    KEY `idx_level` (`level`),
    KEY `idx_prerequisite` (`prerequisite_id`),
    CONSTRAINT `fk_courses_programme` FOREIGN KEY (`programme_id`) REFERENCES `programmes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_courses_prerequisite` FOREIGN KEY (`prerequisite_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: academic_years
-- --------------------------------------------------------
CREATE TABLE `academic_years` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: semesters
-- --------------------------------------------------------
CREATE TABLE `semesters` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `academic_year_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `number` TINYINT UNSIGNED NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `registration_start` DATE NULL,
    `registration_end` DATE NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_year_number` (`academic_year_id`, `number`),
    KEY `idx_academic_year` (`academic_year_id`),
    CONSTRAINT `fk_semesters_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: classrooms
-- --------------------------------------------------------
CREATE TABLE `classrooms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `building` VARCHAR(100) NULL,
    `floor` VARCHAR(20) NULL,
    `capacity` SMALLINT UNSIGNED NOT NULL DEFAULT 50,
    `type` ENUM('lecture_hall','lab','tutorial','seminar','studio') NOT NULL DEFAULT 'lecture_hall',
    `has_projector` BOOLEAN NOT NULL DEFAULT FALSE,
    `has_computers` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: timetable_slots (defines time periods)
-- --------------------------------------------------------
CREATE TABLE `timetable_slots` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `day` ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `period_name` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_day_time` (`day`, `start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: timetable (class schedule)
-- --------------------------------------------------------
CREATE TABLE `timetable` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `academic_year_id` BIGINT UNSIGNED NOT NULL,
    `semester_id` BIGINT UNSIGNED NOT NULL,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `lecturer_id` BIGINT UNSIGNED NOT NULL,
    `classroom_id` BIGINT UNSIGNED NULL,
    `slot_id` BIGINT UNSIGNED NOT NULL,
    `programme_id` BIGINT UNSIGNED NOT NULL,
    `level` TINYINT UNSIGNED NOT NULL,
    `group_name` VARCHAR(50) NULL,
    `specialty` VARCHAR(100) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_academic_year` (`academic_year_id`),
    KEY `idx_semester` (`semester_id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_lecturer` (`lecturer_id`),
    KEY `idx_classroom` (`classroom_id`),
    KEY `idx_slot` (`slot_id`),
    KEY `idx_programme_level` (`programme_id`, `level`),
    CONSTRAINT `fk_timetable_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_timetable_semester` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_timetable_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_timetable_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_timetable_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_timetable_slot` FOREIGN KEY (`slot_id`) REFERENCES `timetable_slots` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_timetable_programme` FOREIGN KEY (`programme_id`) REFERENCES `programmes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: course_registration (student course enrollment)
-- --------------------------------------------------------
CREATE TABLE `course_registrations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `semester_id` BIGINT UNSIGNED NOT NULL,
    `academic_year_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('pending','approved','rejected','dropped','completed') NOT NULL DEFAULT 'pending',
    `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `approved_at` TIMESTAMP NULL,
    `approved_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_student_course_semester` (`student_id`, `course_id`, `semester_id`),
    KEY `idx_student` (`student_id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_semester` (`semester_id`),
    KEY `idx_status` (`status`),
    CONSTRAINT `fk_course_reg_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_course_reg_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_course_reg_semester` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_course_reg_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_course_reg_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: attendance
-- --------------------------------------------------------
CREATE TABLE `attendance` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `timetable_id` BIGINT UNSIGNED NULL,
    `date` DATE NOT NULL,
    `slot_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('present','absent','late','excused') NOT NULL DEFAULT 'absent',
    `marked_by` BIGINT UNSIGNED NULL,
    `marked_at` TIMESTAMP NULL,
    `method` ENUM('manual','qr_code','biometric','self_checkin') NOT NULL DEFAULT 'manual',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_student_course_date_slot` (`student_id`, `course_id`, `date`, `slot_id`),
    KEY `idx_student` (`student_id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_timetable` (`timetable_id`),
    KEY `idx_date` (`date`),
    KEY `idx_status` (`status`),
    CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_attendance_timetable` FOREIGN KEY (`timetable_id`) REFERENCES `timetable` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_attendance_slot` FOREIGN KEY (`slot_id`) REFERENCES `timetable_slots` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_attendance_marked_by` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: results (CA + Exam marks)
-- --------------------------------------------------------
CREATE TABLE `results` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `semester_id` BIGINT UNSIGNED NOT NULL,
    `academic_year_id` BIGINT UNSIGNED NOT NULL,
    `ca_mark` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `exam_mark` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `total_mark` DECIMAL(5,2) GENERATED ALWAYS AS (`ca_mark` + `exam_mark`) STORED,
    `grade` VARCHAR(2) NULL,
    `grade_point` DECIMAL(3,2) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
    `published_at` TIMESTAMP NULL,
    `published_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_student_course_semester` (`student_id`, `course_id`, `semester_id`),
    KEY `idx_student` (`student_id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_semester` (`semester_id`),
    KEY `idx_published` (`is_published`),
    CONSTRAINT `fk_results_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_results_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_results_semester` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_results_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_results_published_by` FOREIGN KEY (`published_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: grade_scale
-- --------------------------------------------------------
CREATE TABLE `grade_scale` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `min_mark` DECIMAL(5,2) NOT NULL,
    `max_mark` DECIMAL(5,2) NOT NULL,
    `grade` VARCHAR(2) NOT NULL,
    `grade_point` DECIMAL(3,2) NOT NULL,
    `description` VARCHAR(100) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_grade` (`grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: announcements
-- --------------------------------------------------------
CREATE TABLE `announcements` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `author_id` BIGINT UNSIGNED NOT NULL,
    `target_role` ENUM('all','admin','lecturer','staff','student') NOT NULL DEFAULT 'all',
    `target_faculty_id` BIGINT UNSIGNED NULL,
    `target_department_id` BIGINT UNSIGNED NULL,
    `target_programme_id` BIGINT UNSIGNED NULL,
    `is_pinned` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
    `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_author` (`author_id`),
    KEY `idx_target_role` (`target_role`),
    KEY `idx_published` (`is_published`),
    KEY `idx_expires` (`expires_at`),
    CONSTRAINT `fk_announcements_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_announcements_faculty` FOREIGN KEY (`target_faculty_id`) REFERENCES `faculties` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_announcements_department` FOREIGN KEY (`target_department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_announcements_programme` FOREIGN KEY (`target_programme_id`) REFERENCES `programmes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: notifications
-- --------------------------------------------------------
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `data` JSON NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `read_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_is_read` (`is_read`),
    KEY `idx_created` (`created_at`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: assignments
-- --------------------------------------------------------
CREATE TABLE `assignments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `lecturer_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `max_points` SMALLINT UNSIGNED NOT NULL DEFAULT 100,
    `due_date` TIMESTAMP NOT NULL,
    `allow_late_submission` BOOLEAN NOT NULL DEFAULT FALSE,
    `late_penalty_percent` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `attachment_url` VARCHAR(500) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_lecturer` (`lecturer_id`),
    KEY `idx_due_date` (`due_date`),
    CONSTRAINT `fk_assignments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_assignments_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: submissions
-- --------------------------------------------------------
CREATE TABLE `submissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `assignment_id` BIGINT UNSIGNED NOT NULL,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `content` TEXT NULL,
    `file_url` VARCHAR(500) NULL,
    `file_name` VARCHAR(255) NULL,
    `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_late` BOOLEAN NOT NULL DEFAULT FALSE,
    `grade` DECIMAL(5,2) NULL,
    `feedback` TEXT NULL,
    `graded_at` TIMESTAMP NULL,
    `graded_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_assignment_student` (`assignment_id`, `student_id`),
    KEY `idx_assignment` (`assignment_id`),
    KEY `idx_student` (`student_id`),
    KEY `idx_graded` (`graded_at`),
    CONSTRAINT `fk_submissions_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_submissions_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_submissions_graded_by` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: discussions
-- --------------------------------------------------------
CREATE TABLE `discussions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `author_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `is_pinned` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_locked` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_author` (`author_id`),
    CONSTRAINT `fk_discussions_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_discussions_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: discussion_replies
-- --------------------------------------------------------
CREATE TABLE `discussion_replies` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `discussion_id` BIGINT UNSIGNED NOT NULL,
    `author_id` BIGINT UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `parent_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_discussion` (`discussion_id`),
    KEY `idx_author` (`author_id`),
    KEY `idx_parent` (`parent_id`),
    CONSTRAINT `fk_discussion_replies_discussion` FOREIGN KEY (`discussion_id`) REFERENCES `discussions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_discussion_replies_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_discussion_replies_parent` FOREIGN KEY (`parent_id`) REFERENCES `discussion_replies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: lessons (learning materials)
-- --------------------------------------------------------
CREATE TABLE `lessons` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `lecturer_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NULL,
    `attachment_url` VARCHAR(500) NULL,
    `attachment_name` VARCHAR(255) NULL,
    `duration_minutes` SMALLINT UNSIGNED NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
    `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_lecturer` (`lecturer_id`),
    CONSTRAINT `fk_lessons_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_lessons_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: fees (tuition structure)
-- --------------------------------------------------------
CREATE TABLE `fees` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `programme_id` BIGINT UNSIGNED NOT NULL,
    `level` TINYINT UNSIGNED NOT NULL,
    `academic_year_id` BIGINT UNSIGNED NOT NULL,
    `fee_type` ENUM('tuition','registration','exam','library','union','medical','other') NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `description` VARCHAR(255) NULL,
    `is_mandatory` BOOLEAN NOT NULL DEFAULT TRUE,
    `due_date` DATE NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_programme` (`programme_id`),
    KEY `idx_academic_year` (`academic_year_id`),
    KEY `idx_fee_type` (`fee_type`),
    CONSTRAINT `fk_fees_programme` FOREIGN KEY (`programme_id`) REFERENCES `programmes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fees_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: payments
-- --------------------------------------------------------
CREATE TABLE `payments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `fee_id` BIGINT UNSIGNED NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `payment_method` ENUM('cash','card','mobile_money','bank_transfer','cheque','other') NOT NULL,
    `transaction_ref` VARCHAR(100) NULL,
    `reference_number` VARCHAR(100) NULL,
    `status` ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
    `paid_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `confirmed_at` TIMESTAMP NULL,
    `confirmed_by` BIGINT UNSIGNED NULL,
    `receipt_number` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_receipt_number` (`receipt_number`),
    KEY `idx_student` (`student_id`),
    KEY `idx_fee` (`fee_id`),
    KEY `idx_status` (`status`),
    KEY `idx_paid_at` (`paid_at`),
    CONSTRAINT `fk_payments_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payments_fee` FOREIGN KEY (`fee_id`) REFERENCES `fees` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_payments_confirmed_by` FOREIGN KEY (`confirmed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: audit_log
-- --------------------------------------------------------
CREATE TABLE `audit_log` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` BIGINT UNSIGNED NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_action` (`action`),
    KEY `idx_entity` (`entity_type`, `entity_id`),
    KEY `idx_created` (`created_at`),
    CONSTRAINT `fk_audit_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: password_reset_tokens
-- --------------------------------------------------------
CREATE TABLE `password_reset_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `used_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_token` (`token`),
    KEY `idx_email` (`email`),
    KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: sessions (for session-based auth)
-- --------------------------------------------------------
CREATE TABLE `sessions` (
    `id` VARCHAR(128) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `payload` TEXT NOT NULL,
    `last_activity` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_last_activity` (`last_activity`),
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Insert Seed Data
-- --------------------------------------------------------

-- Grade Scale
INSERT INTO `grade_scale` (`min_mark`, `max_mark`, `grade`, `grade_point`, `description`) VALUES
(70, 100, 'A', 5.00, 'Excellent'),
(60, 69, 'B', 4.00, 'Very Good'),
(50, 59, 'C', 3.00, 'Good'),
(45, 49, 'D', 2.00, 'Pass'),
(40, 44, 'E', 1.00, 'Conditional Pass'),
(0, 39, 'F', 0.00, 'Fail');

-- Academic Year
INSERT INTO `academic_years` (`name`, `start_date`, `end_date`, `is_current`, `is_active`) VALUES
('2025/2026', '2025-09-01', '2026-08-31', TRUE, TRUE),
('2024/2025', '2024-09-01', '2025-08-31', FALSE, TRUE);

-- Semesters for 2025/2026
INSERT INTO `semesters` (`academic_year_id`, `name`, `number`, `start_date`, `end_date`, `registration_start`, `registration_end`, `is_current`, `is_active`) VALUES
(1, 'First Semester', 1, '2025-09-01', '2026-01-31', '2025-08-15', '2025-09-15', FALSE, TRUE),
(1, 'Second Semester', 2, '2026-02-01', '2026-07-31', '2026-01-15', '2026-02-15', TRUE, TRUE);

-- Timetable Slots
INSERT INTO `timetable_slots` (`day`, `start_time`, `end_time`, `period_name`) VALUES
('monday', '08:00:00', '10:00:00', 'Period 1'),
('monday', '10:00:00', '12:00:00', 'Period 2'),
('monday', '13:00:00', '15:00:00', 'Period 3'),
('monday', '15:00:00', '17:00:00', 'Period 4'),
('tuesday', '08:00:00', '10:00:00', 'Period 1'),
('tuesday', '10:00:00', '12:00:00', 'Period 2'),
('tuesday', '13:00:00', '15:00:00', 'Period 3'),
('tuesday', '15:00:00', '17:00:00', 'Period 4'),
('wednesday', '08:00:00', '10:00:00', 'Period 1'),
('wednesday', '10:00:00', '12:00:00', 'Period 2'),
('wednesday', '13:00:00', '15:00:00', 'Period 3'),
('wednesday', '15:00:00', '17:00:00', 'Period 4'),
('thursday', '08:00:00', '10:00:00', 'Period 1'),
('thursday', '10:00:00', '12:00:00', 'Period 2'),
('thursday', '13:00:00', '15:00:00', 'Period 3'),
('thursday', '15:00:00', '17:00:00', 'Period 4'),
('friday', '08:00:00', '10:00:00', 'Period 1'),
('friday', '10:00:00', '12:00:00', 'Period 2'),
('friday', '13:00:00', '15:00:00', 'Period 3'),
('friday', '15:00:00', '17:00:00', 'Period 4'),
('saturday', '08:00:00', '10:00:00', 'Period 1'),
('saturday', '10:00:00', '12:00:00', 'Period 2'),
('saturday', '13:00:00', '15:00:00', 'Period 3'),
('saturday', '15:00:00', '17:00:00', 'Period 4');

-- Faculties
INSERT INTO `faculties` (`name`, `code`, `description`, `is_active`) VALUES
('Faculty of Engineering', 'FENG', 'Engineering and Technology programmes', TRUE),
('Faculty of Science', 'FSCI', 'Pure and Applied Sciences', TRUE),
('Faculty of Business', 'FBUS', 'Business and Management Studies', TRUE),
('Faculty of Arts', 'FART', 'Humanities and Social Sciences', TRUE);

-- Departments
INSERT INTO `departments` (`faculty_id`, `name`, `code`, `description`, `is_active`) VALUES
(1, 'Computer Science', 'CS', 'Computer Science and Software Engineering', TRUE),
(1, 'Electrical Engineering', 'EE', 'Electrical and Electronics Engineering', TRUE),
(2, 'Mathematics', 'MATH', 'Pure and Applied Mathematics', TRUE),
(2, 'Physics', 'PHY', 'Physics and Astronomy', TRUE),
(3, 'Business Administration', 'BA', 'Business Management and Administration', TRUE),
(3, 'Accounting', 'ACC', 'Accounting and Finance', TRUE);

-- Programmes
INSERT INTO `programmes` (`department_id`, `name`, `code`, `description`, `duration_years`, `total_credits`, `degree_type`, `is_active`) VALUES
(1, 'Bachelor of Technology in Software Engineering', 'BTech-SWE', 'Software Engineering programme', 4, 120, 'bachelor', TRUE),
(1, 'Bachelor of Technology in Computer Networks', 'BTech-CNSM', 'Computer Networks & Multimedia Systems', 4, 120, 'bachelor', TRUE),
(1, 'Bachelor of Technology in Business Strategy', 'BTech-BST', 'Business Strategy & Technology', 4, 120, 'bachelor', TRUE),
(2, 'Bachelor of Engineering in Electrical Engineering', 'BEng-EE', 'Electrical Engineering programme', 5, 150, 'bachelor', TRUE),
(3, 'Bachelor of Science in Mathematics', 'BSc-MATH', 'Mathematics programme', 4, 120, 'bachelor', TRUE);

-- Classrooms
INSERT INTO `classrooms` (`name`, `code`, `building`, `floor`, `capacity`, `type`, `has_projector`, `has_computers`, `is_active`) VALUES
('Lecture Hall A', 'LH-A', 'Main Building', 'Ground', 120, 'lecture_hall', TRUE, FALSE, TRUE),
('Lecture Hall B', 'LH-B', 'Main Building', 'Ground', 100, 'lecture_hall', TRUE, FALSE, TRUE),
('Computer Lab 1', 'CL-1', 'IT Block', '1st', 40, 'lab', TRUE, TRUE, TRUE),
('Computer Lab 2', 'CL-2', 'IT Block', '1st', 40, 'lab', TRUE, TRUE, TRUE),
('Tutorial Room 1', 'TR-1', 'Main Building', '1st', 30, 'tutorial', FALSE, FALSE, TRUE),
('Tutorial Room 2', 'TR-2', 'Main Building', '1st', 30, 'tutorial', FALSE, FALSE, TRUE),
('Seminar Room', 'SR-1', 'Main Building', '2nd', 25, 'seminar', TRUE, FALSE, TRUE),
('Engineering Lab', 'EL-1', 'Engineering Block', 'Ground', 35, 'lab', TRUE, TRUE, TRUE);

-- Users (passwords are hashed with PHP password_hash - default password: 'password123')
-- Hash for 'password123': $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO `users` (`email`, `password_hash`, `full_name`, `role`, `avatar_url`, `phone`, `status`, `email_verified_at`, `created_at`) VALUES
('admin@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Prof. James Murdza', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', '+237600000001', 'active', NOW(), NOW()),
('lecturer@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr Nkoma Ngouloure', 'lecturer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nkoma', '+237600000002', 'active', NOW(), NOW()),
('staff@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mrs Linda Foncha', 'staff', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda', '+237600000003', 'active', NOW(), NOW()),
('student@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Chituh Innocentia', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia', '+237600000004', 'active', NOW(), NOW()),
('lecturer2@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Eng Fotseu Julien', 'lecturer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fotseu', '+237600000005', 'active', NOW(), NOW()),
('lecturer3@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr Smith Wills', 'lecturer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Smith', '+237600000006', 'active', NOW(), NOW()),
('student2@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nkwenti Deshnic', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deshnic', '+237600000007', 'active', NOW(), NOW()),
('student3@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Winner Chinuere', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Winner', '+237600000008', 'active', NOW(), NOW()),
('student4@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Zelio Gerald', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zelio', '+237600000009', 'active', NOW(), NOW()),
('student5@iuget.cm', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Wandji Adrien', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wandji', '+237600000010', 'active', NOW(), NOW());

-- Lecturers
INSERT INTO `lecturers` (`user_id`, `employee_number`, `faculty_id`, `department_id`, `specialization`, `qualification`, `hire_date`, `employment_type`, `office_number`, `office_hours`) VALUES
(2, 'LEC-001', 1, 1, 'Compiler Design, Research Methodology', 'PhD Computer Science', '2018-09-01', 'full_time', 'CS-201', 'Mon-Wed 10:00-12:00'),
(5, 'LEC-002', 1, 1, 'Embedded Systems, Linux Programming', 'MSc Embedded Systems', '2020-01-15', 'full_time', 'CS-202', 'Tue-Thu 14:00-16:00'),
(6, 'LEC-003', 1, 1, 'Mobile Development, React Native', 'MSc Mobile Computing', '2021-03-01', 'full_time', 'CS-203', 'Wed-Fri 09:00-11:00');

-- Staff
INSERT INTO `staff` (`user_id`, `employee_number`, `faculty_id`, `department_id`, `position`, `hire_date`, `employment_type`, `office_number`) VALUES
(3, 'STA-001', 1, 1, 'Registrar Officer', '2015-09-01', 'full_time', 'REG-101');

-- Students
INSERT INTO `students` (`user_id`, `registration_number`, `matricule`, `faculty_id`, `department_id`, `programme_id`, `level`, `specialty`, `academic_year_id`, `enrollment_date`, `guardian_name`, `guardian_phone`, `guardian_email`, `fee_status`, `fees_paid`, `fees_total`) VALUES
(4, 'REG-2025-0001', 'IUGET/2025/SWE/0142', 1, 1, 1, 3, 'SWE', 1, '2023-09-15', 'Mr Chituh Senior', '+237600111111', 'chituh.senior@email.com', 'partial', 350000, 500000),
(7, 'REG-2025-0002', 'IUGET/2025/SWE/0143', 1, 1, 1, 3, 'SWE', 1, '2023-09-15', 'Mr Nkwenti Senior', '+237600111112', 'nkwenti.senior@email.com', 'partial', 300000, 500000),
(8, 'REG-2025-0003', 'IUGET/2025/CNSM/0144', 1, 1, 2, 3, 'CNSM', 1, '2023-09-15', 'Mrs Chinuere Grace', '+237600111113', 'chinuere.grace@email.com', 'paid', 500000, 500000),
(9, 'REG-2025-0004', 'IUGET/2025/BST/0145', 1, 1, 3, 3, 'BST', 1, '2023-09-15', 'Mr Zelio Felix', '+237600111114', 'zelio.felix@email.com', 'partial', 250000, 500000),
(10, 'REG-2025-0005', 'IUGET/2025/SWE/0146', 1, 1, 1, 3, 'SWE', 1, '2023-09-15', 'Mrs Wandji Marie', '+237600111115', 'wandji.marie@email.com', 'overdue', 150000, 500000);

-- Update faculty deans and department HODs
UPDATE `faculties` SET `dean_id` = 1 WHERE `id` = 1;
UPDATE `departments` SET `hod_id` = 1 WHERE `id` = 1;

-- Courses
INSERT INTO `courses` (`programme_id`, `code`, `name`, `description`, `credits`, `level`, `semester`, `is_active`) VALUES
(1, 'CS501', 'Compiler Design', 'Principles of compiler construction', 3, 3, '2', TRUE),
(1, 'CS503', 'Research Methodology', 'Research methods and academic writing', 2, 3, '2', TRUE),
(1, 'CS505', 'Embedded Systems', 'Microcontroller programming and interfacing', 3, 3, '2', TRUE),
(1, 'CS507', 'Mobile Development', 'Cross-platform mobile app development', 3, 3, '2', TRUE),
(1, 'CS509', 'Design Project', 'Capstone design project', 4, 3, '2', TRUE),
(1, 'CS511', 'Object Oriented Programming', 'Advanced OOP concepts and patterns', 3, 3, '2', TRUE),
(1, 'CS101', 'Intro to Computer Science', 'Fundamentals of computing', 3, 1, '1', TRUE),
(1, 'CS103', 'Mathematics for CS', 'Discrete mathematics and logic', 3, 1, '1', TRUE),
(1, 'CS105', 'Programming Fundamentals', 'Introduction to programming', 3, 1, '1', TRUE),
(1, 'CS107', 'Communication Skills', 'Technical communication', 2, 1, '1', TRUE),
(1, 'CS201', 'Data Structures & Algorithms', 'Core data structures and algorithms', 3, 2, '1', TRUE),
(1, 'CS203', 'Database Systems', 'Relational databases and SQL', 3, 2, '1', TRUE),
(1, 'CS205', 'Computer Networks', 'Network protocols and architectures', 3, 2, '1', TRUE),
(1, 'CS207', 'Software Engineering Intro', 'Software development lifecycle', 3, 2, '1', TRUE);

-- Fees
INSERT INTO `fees` (`programme_id`, `level`, `academic_year_id`, `fee_type`, `amount`, `description`, `is_mandatory`, `due_date`) VALUES
(1, 1, 1, 'tuition', 450000, 'Annual tuition fees', TRUE, '2026-06-05'),
(1, 1, 1, 'registration', 25000, 'Registration fees', TRUE, '2026-06-05'),
(1, 1, 1, 'exam', 15000, 'Examination fees', TRUE, '2026-06-05'),
(1, 1, 1, 'library', 8000, 'Library fees', TRUE, '2026-06-05'),
(1, 1, 1, 'union', 2000, 'Student union fees', TRUE, '2026-06-05'),
(1, 2, 1, 'tuition', 450000, 'Annual tuition fees', TRUE, '2026-06-05'),
(1, 2, 1, 'registration', 25000, 'Registration fees', TRUE, '2026-06-05'),
(1, 1, 1, 'exam', 15000, 'Examination fees', TRUE, '2026-06-05'),
(1, 2, 1, 'library', 8000, 'Library fees', TRUE, '2026-06-05'),
(1, 2, 1, 'union', 2000, 'Student union fees', TRUE, '2026-06-05'),
(1, 3, 1, 'tuition', 450000, 'Annual tuition fees', TRUE, '2026-06-05'),
(1, 3, 1, 'registration', 25000, 'Registration fees', TRUE, '2026-06-05'),
(1, 3, 1, 'exam', 15000, 'Examination fees', TRUE, '2026-06-05'),
(1, 3, 1, 'library', 8000, 'Library fees', TRUE, '2026-06-05'),
(1, 3, 1, 'union', 2000, 'Student union fees', TRUE, '2026-06-05');

-- Sample Announcements
INSERT INTO `announcements` (`title`, `content`, `author_id`, `target_role`, `is_pinned`, `is_published`) VALUES
('Welcome to SIARM', 'Welcome to the Smart Integrated Academic Resource Management System for the 2025/2026 academic year.', 1, 'all', TRUE, TRUE),
('Registration Deadline', 'Course registration for second semester closes on February 15, 2026.', 1, 'student', FALSE, TRUE),
('Faculty Meeting', 'Monthly faculty meeting scheduled for next Monday at 10:00 AM.', 1, 'lecturer', FALSE, TRUE);

-- Sample Timetable entries
INSERT INTO `timetable` (`academic_year_id`, `semester_id`, `course_id`, `lecturer_id`, `classroom_id`, `slot_id`, `programme_id`, `level`, `group_name`, `specialty`, `is_published`) VALUES
(1, 2, 1, 1, 1, 5, 1, 3, 'SWE-A', 'SWE', TRUE),   -- CS501 Mon 08:00
(1, 2, 1, 1, 1, 6, 1, 3, 'SWE-A', 'SWE', TRUE),   -- CS501 Mon 10:00
(1, 2, 3, 2, 3, 7, 1, 3, 'SWE-A', 'SWE', TRUE),   -- CS505 Mon 13:00
(1, 2, 4, 3, 4, 8, 1, 3, 'SWE-A', 'SWE', TRUE),   -- CS507 Mon 15:00
(1, 2, 1, 1, 1, 10, 1, 3, 'SWE-A', 'SWE', TRUE),  -- CS501 Tue 08:00
(1, 2, 3, 2, 3, 11, 1, 3, 'SWE-A', 'SWE', TRUE),  -- CS505 Tue 10:00
(1, 2, 4, 3, 4, 12, 1, 3, 'SWE-A', 'SWE', TRUE),  -- CS507 Tue 13:00
(1, 2, 2, 1, 5, 13, 1, 3, 'SWE-A', 'SWE', TRUE),  -- CS503 Tue 15:00
(1, 2, 6, 1, 1, 14, 1, 3, 'SWE-A', 'SWE', TRUE),  -- CS511 Wed 08:00
(1, 2, 5, 1, 2, 15, 1, 3, 'SWE-A', 'SWE', TRUE);  -- CS509 Wed 10:00

COMMIT;