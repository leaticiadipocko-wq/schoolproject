import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { roleHome, ROLES } from '@/lib/roles'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ParentPortal from '@/pages/parent/ParentPortal'
import ParentRegister from '@/pages/parent/ParentRegister'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { STUDENT_NAV, LECTURER_NAV, STAFF_NAV, ADMIN_NAV } from '@/lib/navItems'

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard'
import Attendance from '@/pages/student/Attendance'
import Timetable from '@/pages/student/Timetable'
import Results from '@/pages/student/Results'
import Announcements from '@/pages/student/Announcements'
import Learning from '@/pages/student/Learning'
import Transcript from '@/pages/student/Transcript'
import Fees from '@/pages/student/Fees'
import IDCard from '@/pages/student/IDCard'

// Lecturer pages
import LecturerDashboard from '@/pages/lecturer/LecturerDashboard'
import MyClasses from '@/pages/lecturer/MyClasses'
import MarkAttendance from '@/pages/lecturer/MarkAttendance'
import EnterGrades from '@/pages/lecturer/EnterGrades'

// Staff pages
import StaffDashboard from '@/pages/staff/StaffDashboard'
import Enrollment from '@/pages/staff/Enrollment'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import Analytics from '@/pages/admin/Analytics'
import UserManagement from '@/pages/admin/UserManagement'
import TimetableBuilder from '@/pages/admin/TimetableBuilder'
import AdminAnnouncements from '@/pages/admin/Announcements'
import Settings from '@/pages/admin/Settings'
import Finance from '@/pages/admin/Finance'

function RoleHome() {
  const { user } = useAuth()
  return <Navigate to={user ? roleHome(user.role) : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/parent"   element={<ParentPortal />} />
      <Route path="/parent/register" element={<ParentRegister />} />

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole={ROLES.STUDENT}>
            <DashboardLayout navItems={STUDENT_NAV} />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="attendance"    element={<Attendance />} />
        <Route path="timetable"     element={<Timetable />} />
        <Route path="results"       element={<Results />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="learning"      element={<Learning />} />
        <Route path="transcript"    element={<Transcript />} />
        <Route path="fees"          element={<Fees />} />
        <Route path="idcard"        element={<IDCard />} />
      </Route>

      {/* Lecturer */}
      <Route
        path="/lecturer"
        element={
          <ProtectedRoute requiredRole={ROLES.LECTURER}>
            <DashboardLayout navItems={LECTURER_NAV} />
          </ProtectedRoute>
        }
      >
        <Route index element={<LecturerDashboard />} />
        <Route path="classes"       element={<MyClasses />} />
        <Route path="attendance"    element={<MarkAttendance />} />
        <Route path="grades"        element={<EnterGrades />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>

      {/* Staff */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute requiredRole={ROLES.STAFF}>
            <DashboardLayout navItems={STAFF_NAV} />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="users"         element={<UserManagement />} />
        <Route path="enrollment"    element={<Enrollment />} />
        <Route path="finance"       element={<Finance />} />
        <Route path="timetable"     element={<TimetableBuilder />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="analytics"     element={<Analytics />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <DashboardLayout navItems={ADMIN_NAV} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="analytics"     element={<Analytics />} />
        <Route path="finance"       element={<Finance />} />
        <Route path="enrollment"    element={<Enrollment />} />
        <Route path="users"         element={<UserManagement />} />
        <Route path="timetable"     element={<TimetableBuilder />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="settings"      element={<Settings />} />
      </Route>

      {/* Authed home redirect */}
      <Route path="/home" element={<RoleHome />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
