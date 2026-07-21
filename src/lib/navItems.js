import {
  LayoutDashboard, ClipboardCheck, CalendarClock, FileText, Megaphone,
  BookOpen, FileSpreadsheet, Users, TrendingUp,
  UserCog, Settings, Wallet, IdCard, UserPlus, Banknote, GraduationCap,
  WifiOff, MapPin, Sparkles, ClipboardList, MessageSquare, Activity,
  Archive, Globe, MessageCircle, Library, AlertTriangle, CalendarDays,
  GraduationCap as GraduationIcon, Map, Building2,
} from 'lucide-react'

export const STUDENT_NAV = [
  {
    title: 'Main',
    links: [
      { to: '/student',               label: 'Dashboard',     icon: LayoutDashboard },
      { to: '/student/attendance',    label: 'Attendance',    icon: ClipboardCheck },
      { to: '/student/timetable',     label: 'Timetable',     icon: CalendarClock },
      { to: '/student/results',       label: 'Results',       icon: FileText },
      { to: '/student/transcript',    label: 'Transcript',    icon: FileSpreadsheet },
      { to: '/student/assignments',   label: 'Assignments',   icon: ClipboardList },
    ],
  },
  {
    title: 'Finance',
    links: [
      { to: '/student/fees',          label: 'Tuition & Fees', icon: Banknote },
    ],
  },
  {
    title: 'Communicate',
    links: [
      { to: '/student/chat',          label: 'Chat',           icon: MessageCircle },
      { to: '/student/discussions',   label: 'Discussions',   icon: MessageSquare },
    ],
  },
  {
    title: 'Learning',
    links: [
      { to: '/student/learning',      label: 'Mobile Learning', icon: GraduationCap },
      { to: '/student/announcements', label: 'Announcements',   icon: Megaphone },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/student/library',       label: 'Library',         icon: Library },
      { to: '/student/id-card',       label: 'ID Card',         icon: IdCard },
      { to: '/student/check-in',      label: 'QR Check-In',     icon: MapPin },
      { to: '/student/exam-seating',  label: 'Exam Seating',    icon: Map },
      { to: '/student/events',        label: 'Events',          icon: CalendarDays },
      { to: '/student/complaints',    label: 'Complaints',      icon: AlertTriangle },
      { to: '/student/alumni',        label: 'Alumni Network',  icon: GraduationIcon },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/student/profile',       label: 'Profile',        icon: UserCog },
      { to: '/student/help',          label: 'Help & FAQ',     icon: FileText },
      { to: '/student/offline',       label: 'Offline Mode',   icon: WifiOff },
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
      { to: '/lecturer/chat',          label: 'Chat',           icon: MessageCircle },
      { to: '/lecturer/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/lecturer/library',       label: 'Library',         icon: Library },
      { to: '/lecturer/complaints',    label: 'Complaints',      icon: AlertTriangle },
      { to: '/lecturer/events',        label: 'Events',          icon: CalendarDays },
      { to: '/lecturer/alumni',        label: 'Alumni Network',  icon: GraduationIcon },
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
      { to: '/staff/assignments',   label: 'Assignments',     icon: MapPin },
      { to: '/staff/timetable',     label: 'Timetable',       icon: CalendarClock },
      { to: '/staff/announcements', label: 'Announcements',   icon: Megaphone },
      { to: '/staff/chat',          label: 'Chat',             icon: MessageCircle },
    ],
  },
  {
    title: 'Academic',
    links: [
      { to: '/staff/attendance',    label: 'Attendance',      icon: ClipboardCheck },
      { to: '/staff/grades',        label: 'Grades',           icon: FileSpreadsheet },
      { to: '/staff/complaints',    label: 'Complaints',       icon: AlertTriangle },
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
    title: 'Services',
    links: [
      { to: '/staff/library',       label: 'Library',         icon: Library },
      { to: '/staff/complaints',    label: 'Complaints',      icon: AlertTriangle },
      { to: '/staff/events',        label: 'Events',          icon: CalendarDays },
      { to: '/staff/alumni',        label: 'Alumni Network',  icon: GraduationIcon },
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
      { to: '/admin/assignments',   label: 'Assignments',   icon: MapPin },
      { to: '/admin/users',         label: 'Users',         icon: UserCog },
      { to: '/admin/timetable',     label: 'Timetable',     icon: CalendarClock },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/admin/courses',       label: 'Courses',       icon: BookOpen },
      { to: '/admin/departments',   label: 'Departments',   icon: Building2 },
      { to: '/admin/payroll',       label: 'Payroll',       icon: Banknote },
      { to: '/admin/settings',      label: 'Settings',      icon: Settings },
    ],
  },
  {
    title: 'Compliance',
    links: [
      { to: '/admin/audit',         label: 'Audit Log',     icon: Activity },
      { to: '/admin/minesup',       label: 'MINESUP Reports', icon: Globe },
      { to: '/admin/export',        label: 'Data Export',   icon: Archive },
      { to: '/admin/chat',          label: 'Chat',           icon: MessageCircle },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/admin/library',       label: 'Library',         icon: Library },
      { to: '/admin/complaints',    label: 'Complaints',      icon: AlertTriangle },
      { to: '/admin/events',        label: 'Events',          icon: CalendarDays },
      { to: '/admin/alumni',        label: 'Alumni Network',  icon: GraduationIcon },
    ],
  },
  {
    title: 'System',
    links: [
      { to: '/admin/campus',        label: 'Campus Sync',     icon: Building2 },
      { to: '/admin/offline',       label: 'Offline Mode',    icon: WifiOff },
    ],
  },
]
