import {
  LayoutDashboard, ClipboardCheck, CalendarClock, FileText, Megaphone,
  BookOpen, FileSpreadsheet, Users, TrendingUp,
  UserCog, Settings, Wallet, IdCard, UserPlus, Banknote, GraduationCap,
  WifiOff, Sparkles, ClipboardList, MessageSquare, Activity,
  Archive, Globe,
} from 'lucide-react'

export const STUDENT_NAV = [
  {
    title: 'Main',
    links: [
      { to: '/student',               label: 'Dashboard',     icon: LayoutDashboard },
      { to: '/student/attendance',    label: 'Attendance',    icon: ClipboardCheck },
      { to: '/student/timetable',     label: 'Timetable',     icon: CalendarClock },
      { to: '/student/results',       label: 'Results',       icon: FileText },
      { to: '/student/assignments',   label: 'Assignments',   icon: ClipboardList },
      { to: '/student/discussions',   label: 'Discussions',   icon: MessageSquare },
      { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    title: 'Records',
    links: [
      { to: '/student/idcard',        label: 'ID Card',        icon: IdCard },
      { to: '/student/fees',          label: 'Tuition & Fees', icon: Wallet },
      { to: '/student/transcript',    label: 'Transcript',     icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Learning',
    links: [
      { to: '/student/learning', label: 'Mobile Learning',  icon: GraduationCap },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/student/offline',  label: 'Offline Mode',     icon: WifiOff },
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
      { to: '/lecturer/assignments',label: 'Assignments',     icon: ClipboardList },
      { to: '/lecturer/lessons',    label: 'Publish Lesson',  icon: Sparkles },
      { to: '/lecturer/discussions',label: 'Discussions',     icon: MessageSquare },
    ],
  },
  {
    title: 'Communicate',
    links: [
      { to: '/lecturer/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/lecturer/offline', label: 'Offline Mode', icon: WifiOff },
    ],
  },
]

export const STAFF_NAV = [
  {
    title: 'Operate',
    links: [
      { to: '/staff',               label: 'Dashboard',       icon: LayoutDashboard },
      { to: '/staff/users',         label: 'Users',           icon: Users },
      { to: '/staff/enrollment',    label: 'Enrolment',       icon: UserPlus},
      { to: '/staff/assignments',   label: 'Course Scheduling', icon: CalendarClock },
      { to: '/staff/timetable',     label: 'Timetable',       icon: CalendarClock },
      { to: '/staff/announcements', label: 'Announcements',   icon: Megaphone },
    ],
  },
  {
    title: 'Finance',
    links: [
      { to: '/staff/finance',       label: 'Tuition Tracking', icon: Banknote},
    ],
  },
  {
    title: 'Insights',
    links: [
      { to: '/staff/analytics',     label: 'Analytics',         icon: TrendingUp },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/staff/offline',       label: 'Offline Mode',      icon: WifiOff },
    ],
  },
]

export const ADMIN_NAV = [
  {
    title: 'Overview',
    links: [
      { to: '/admin',           label: 'Dashboard',     icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics',     icon: TrendingUp },
      { to: '/admin/finance',   label: 'Finance',       icon: Banknote},
    ],
  },
  {
    title: 'Manage',
    links: [
      { to: '/admin/enrollment',    label: 'Enrolment',     icon: UserPlus},
      { to: '/admin/assignments',   label: 'Course Scheduling', icon: CalendarClock },
      { to: '/admin/users',         label: 'Users',         icon: UserCog },
      { to: '/admin/timetable',     label: 'Timetable',     icon: CalendarClock },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/admin/settings',      label: 'Settings',      icon: Settings },
    ],
  },
  {
    title: 'Compliance',
    links: [
      { to: '/admin/audit',         label: 'Audit Log',     icon: Activity },
      { to: '/admin/minesup',       label: 'MINESUP Reports', icon: Globe },
      { to: '/admin/export',        label: 'Data Export',   icon: Archive },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/admin/offline',       label: 'Offline Mode',  icon: WifiOff },
    ],
  },
]
