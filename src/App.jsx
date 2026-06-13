import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { roleHome, ROLES } from '@/lib/roles'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import ParentPortal from '@/pages/parent/ParentPortal'
import ParentRegister from '@/pages/parent/ParentRegister'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { STUDENT_NAV, LECTURER_NAV, STAFF_NAV, ADMIN_NAV } from '@/lib/navItems'

// Student pages (lazy-loaded)
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'))
const Attendance = lazy(() => import('@/pages/student/Attendance'))
const Timetable = lazy(() => import('@/pages/student/Timetable'))
const Results = lazy(() => import('@/pages/student/Results'))
const Announcements = lazy(() => import('@/pages/student/Announcements'))
const Learning = lazy(() => import('@/pages/student/Learning'))
const Transcript = lazy(() => import('@/pages/student/Transcript'))
const Fees = lazy(() => import('@/pages/student/Fees'))
const IDCard = lazy(() => import('@/pages/student/IDCard'))

// Lecturer pages (lazy-loaded)
const LecturerDashboard = lazy(() => import('@/pages/lecturer/LecturerDashboard'))
const MyClasses = lazy(() => import('@/pages/lecturer/MyClasses'))
const MarkAttendance = lazy(() => import('@/pages/lecturer/MarkAttendance'))
const EnterGrades = lazy(() => import('@/pages/lecturer/EnterGrades'))
const PublishLesson = lazy(() => import('@/pages/lecturer/PublishLesson'))

// Staff pages (lazy-loaded)
const StaffDashboard = lazy(() => import('@/pages/staff/StaffDashboard'))
const Enrollment = lazy(() => import('@/pages/staff/Enrollment'))

// Shared pages (lazy-loaded)
const Profile = lazy(() => import('@/pages/Profile'))
const Help = lazy(() => import('@/pages/Help'))
const OfflineStatus = lazy(() => import('@/pages/OfflineStatus'))
const Discussions = lazy(() => import('@/pages/Discussions'))

// Admin pages (lazy-loaded)
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const Analytics = lazy(() => import('@/pages/admin/Analytics'))
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'))
const TimetableBuilder = lazy(() => import('@/pages/admin/TimetableBuilder'))
const AdminAnnouncements = lazy(() => import('@/pages/admin/Announcements'))
const Settings = lazy(() => import('@/pages/admin/Settings'))
const Finance = lazy(() => import('@/pages/admin/Finance'))
const Assignments = lazy(() => import('@/pages/admin/Assignments'))
const AuditLog = lazy(() => import('@/pages/admin/AuditLog'))
const MinesupReports = lazy(() => import('@/pages/admin/MinesupReports'))
const DataExport = lazy(() => import('@/pages/admin/DataExport'))

// Domain pages (lazy-loaded)
const LecturerAssignments = lazy(() => import('@/pages/lecturer/Assignments'))
const StudentAssignments = lazy(() => import('@/pages/student/Assignments'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-600 border-t-transparent" />
    </div>
  )
}

function RoleHome() {
  const { user } = useAuth()
  return <Navigate to={user ? roleHome(user.role) : '/login'} replace />
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
          <Route path="assignments"   element={<StudentAssignments />} />
          <Route path="discussions"   element={<Discussions />} />
          <Route path="profile"       element={<Profile />} />
          <Route path="help"          element={<Help />} />
          <Route path="offline"       element={<OfflineStatus />} />
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
          <Route path="lessons"       element={<PublishLesson />} />
          <Route path="assignments"   element={<LecturerAssignments />} />
          <Route path="discussions"   element={<Discussions />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="profile"       element={<Profile />} />
          <Route path="help"          element={<Help />} />
          <Route path="offline"       element={<OfflineStatus />} />
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
          <Route path="assignments"   element={<Assignments />} />
          <Route path="timetable"     element={<TimetableBuilder />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="analytics"     element={<Analytics />} />
          <Route path="audit"         element={<AuditLog />} />
          <Route path="minesup"       element={<MinesupReports />} />
          <Route path="export"        element={<DataExport />} />
          <Route path="profile"       element={<Profile />} />
          <Route path="help"          element={<Help />} />
          <Route path="offline"       element={<OfflineStatus />} />
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
          <Route path="assignments"   element={<Assignments />} />
          <Route path="users"         element={<UserManagement />} />
          <Route path="timetable"     element={<TimetableBuilder />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings"      element={<Settings />} />
          <Route path="audit"         element={<AuditLog />} />
          <Route path="minesup"       element={<MinesupReports />} />
          <Route path="export"        element={<DataExport />} />
          <Route path="profile"       element={<Profile />} />
          <Route path="help"          element={<Help />} />
          <Route path="offline"       element={<OfflineStatus />} />
        </Route>

        {/* Authed home redirect */}
        <Route path="/home" element={<RoleHome />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
