import {
  LayoutDashboard, ClipboardCheck, CalendarClock, FileText, Megaphone,
  BookOpen, Sparkles, FileSpreadsheet, Users, TrendingUp,
  UserCog, Settings, Wallet, IdCard,
} from 'lucide-react'

export const STUDENT_NAV = [
  {
    title: 'Main',
    links: [
      { to: '/student',               label: 'Dashboard',     icon: LayoutDashboard },
      { to: '/student/attendance',    label: 'Attendance',    icon: ClipboardCheck },
      { to: '/student/timetable',     label: 'Timetable',     icon: CalendarClock },
      { to: '/student/results',       label: 'Results',       icon: FileText },
      { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    title: 'Records',
    links: [
      { to: '/student/idcard',        label: 'ID Card',        icon: IdCard,           badge: 'New' },
      { to: '/student/fees',          label: 'Tuition & Fees', icon: Wallet,           badge: 'Pay' },
      { to: '/student/transcript',    label: 'Transcript',     icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Smart',
    links: [
      { to: '/student/learning', label: 'Mobile Learning',  icon: Sparkles },
    ],
  },
]

export const LECTURER_NAV = [
  {
    title: 'Teach',
    links: [
      { to: '/lecturer',            label: 'Dashboard',       icon: LayoutDashboard },
      { to: '/lecturer/classes',    label: 'My Classes',      icon: BookOpen },
      { to: '/lecturer/attendance', label: 'Mark Attendance', icon: ClipboardCheck },
      { to: '/lecturer/grades',     label: 'Enter Grades',    icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Communicate',
    links: [
      { to: '/lecturer/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
]

export const STAFF_NAV = [
  {
    title: 'Operate',
    links: [
      { to: '/staff',               label: 'Dashboard',       icon: LayoutDashboard },
      { to: '/staff/users',         label: 'Users',           icon: Users },
      { to: '/staff/timetable',     label: 'Timetable',       icon: CalendarClock },
      { to: '/staff/announcements', label: 'Announcements',   icon: Megaphone },
    ],
  },
  {
    title: 'Insights',
    links: [
      { to: '/staff/analytics',   label: 'Analytics',         icon: TrendingUp },
    ],
  },
]

export const ADMIN_NAV = [
  {
    title: 'Overview',
    links: [
      { to: '/admin',           label: 'Dashboard',     icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics',     icon: TrendingUp },
    ],
  },
  {
    title: 'Manage',
    links: [
      { to: '/admin/users',         label: 'Users',         icon: UserCog },
      { to: '/admin/timetable',     label: 'Timetable',     icon: CalendarClock },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/admin/settings',      label: 'Settings',      icon: Settings },
    ],
  },
]
