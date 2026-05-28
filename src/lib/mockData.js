// Mock data for SIARM demo mode.
// This provides realistic data shapes for all modules so the UI can be developed
// and demonstrated without a live Firebase backend.

export const MOCK_USERS = [
  {
    uid: 'stu-001',
    email: 'student@iuget.cm',
    password: 'password',
    role: 'student',
    name: 'Alice Mbah',
    studentId: 'IUGET/2023/CS/0142',
    program: 'BSc Computer Science',
    level: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    uid: 'lec-001',
    email: 'lecturer@iuget.cm',
    password: 'password',
    role: 'lecturer',
    name: 'Mr Nkoma Ngouloure',
    department: 'Computer Science',
    courses: ['CS501', 'CS503'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nkoma',
  },
  {
    uid: 'sta-001',
    email: 'staff@iuget.cm',
    password: 'password',
    role: 'staff',
    name: 'Mrs. Linda Foncha',
    department: 'Registrar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
  },
  {
    uid: 'adm-001',
    email: 'admin@iuget.cm',
    password: 'password',
    role: 'admin',
    name: 'Prof. James Murdza',
    title: 'Vice-Chancellor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
]

// Real IUGET Level-3 SWE lecturers and courses
export const MOCK_COURSES = [
  { code: 'CS501', name: 'Compiler Design',           credits: 3, lecturer: 'Mr Nkoma Ngouloure',  level: 3 },
  { code: 'CS503', name: 'Research Methodology',      credits: 2, lecturer: 'Mr Nkoma Ngouloure',  level: 3 },
  { code: 'CS505', name: 'Embedded Systems',          credits: 3, lecturer: 'Eng Fotseu Julien',   level: 3 },
  { code: 'CS507', name: 'Mobile Development',        credits: 3, lecturer: 'Mr Smith Wills',      level: 3 },
  { code: 'CS509', name: 'Design Project',            credits: 4, lecturer: 'Dr Romeo Mougnol',    level: 3 },
  { code: 'CS511', name: 'Object Oriented Programming', credits: 3, lecturer: 'Mr Asongafack Patrick', level: 3 },
]

export const MOCK_TIMETABLE = [
  { day: 'Monday',    time: '08:00 - 10:00', course: 'CS501', room: 'Hall A', lecturer: 'Mr Nkoma Ngouloure' },
  { day: 'Monday',    time: '10:00 - 12:00', course: 'CS511', room: 'Lab 2',  lecturer: 'Mr Asongafack Patrick' },
  { day: 'Tuesday',   time: '08:00 - 10:00', course: 'CS505', room: 'Lab 1',  lecturer: 'Eng Fotseu Julien' },
  { day: 'Tuesday',   time: '13:00 - 15:00', course: 'CS507', room: 'Lab 3',  lecturer: 'Mr Smith Wills' },
  { day: 'Wednesday', time: '09:00 - 11:00', course: 'CS509', room: 'Studio', lecturer: 'Dr Romeo Mougnol' },
  { day: 'Thursday',  time: '08:00 - 10:00', course: 'CS501', room: 'Hall A', lecturer: 'Mr Nkoma Ngouloure' },
  { day: 'Thursday',  time: '13:00 - 15:00', course: 'CS503', room: 'Hall B', lecturer: 'Mr Nkoma Ngouloure' },
  { day: 'Friday',    time: '10:00 - 12:00', course: 'CS511', room: 'Lab 2',  lecturer: 'Mr Asongafack Patrick' },
  { day: 'Friday',    time: '13:00 - 15:00', course: 'CS507', room: 'Lab 3',  lecturer: 'Mr Smith Wills' },
]

export const MOCK_ATTENDANCE = [
  { course: 'CS501', total: 24, attended: 22, percent: 92 },
  { course: 'CS503', total: 18, attended: 17, percent: 94 },
  { course: 'CS505', total: 22, attended: 19, percent: 86 },
  { course: 'CS507', total: 22, attended: 21, percent: 95 },
  { course: 'CS509', total: 14, attended: 13, percent: 93 },
  { course: 'CS511', total: 24, attended: 20, percent: 83 },
]

export const MOCK_RESULTS = [
  { course: 'CS401', semester: 'S1 2025', ca: 28, exam: 52, total: 80, grade: 'A' },
  { course: 'CS403', semester: 'S1 2025', ca: 22, exam: 48, total: 70, grade: 'B+' },
  { course: 'CS405', semester: 'S1 2025', ca: 25, exam: 40, total: 65, grade: 'B' },
  { course: 'CS501', semester: 'S1 2026', ca: 27, exam: 55, total: 82, grade: 'A' },
  { course: 'CS503', semester: 'S1 2026', ca: 24, exam: 50, total: 74, grade: 'B+' },
  { course: 'CS505', semester: 'S1 2026', ca: 26, exam: 48, total: 74, grade: 'B+' },
  { course: 'CS507', semester: 'S1 2026', ca: 28, exam: 54, total: 82, grade: 'A' },
  { course: 'CS509', semester: 'S1 2026', ca: 25, exam: 49, total: 74, grade: 'B+' },
  { course: 'CS511', semester: 'S1 2026', ca: 23, exam: 45, total: 68, grade: 'B' },
]

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'a-1',
    title: 'Mid-semester exams begin June 10',
    body: 'All students should consult their timetable for room allocations. Bring your student ID card.',
    author: 'Registrar',
    audience: 'all',
    pinned: true,
    createdAt: '2026-05-25T08:30:00Z',
  },
  {
    id: 'a-2',
    title: 'Library extends opening hours',
    body: 'The IUGET library will now open from 7am to 10pm during the exam period.',
    author: 'Library',
    audience: 'students',
    createdAt: '2026-05-24T14:00:00Z',
  },
  {
    id: 'a-3',
    title: 'Design Project deadline reminder',
    body: 'Dr Romeo Mougnol reminds CS509 students that final project submissions are due June 15.',
    author: 'Dr Romeo Mougnol',
    audience: 'students',
    createdAt: '2026-05-23T09:00:00Z',
  },
  {
    id: 'a-4',
    title: 'Tuition payment deadline extended',
    body: 'The deadline for second-semester fees has been pushed to June 5. Use the new SIARM payment portal — Mobile Money, Orange Money, and bank transfers accepted.',
    author: 'Bursary',
    audience: 'students',
    createdAt: '2026-05-20T11:15:00Z',
  },
]

export const MOCK_ENROLLMENT_TREND = [
  { year: '2020', applications: 420, admitted: 310 },
  { year: '2021', applications: 510, admitted: 380 },
  { year: '2022', applications: 645, admitted: 460 },
  { year: '2023', applications: 720, admitted: 540 },
  { year: '2024', applications: 880, admitted: 610 },
  { year: '2025', applications: 1020, admitted: 720 },
  { year: '2026 (predicted)', applications: 1240, admitted: 860 },
]

export const MOCK_DEPARTMENT_DISTRIBUTION = [
  { name: 'Computer Science', value: 320 },
  { name: 'Business',          value: 280 },
  { name: 'Engineering',       value: 240 },
  { name: 'Nursing',           value: 180 },
  { name: 'Law',               value: 140 },
]

export const MOCK_LEARNING_TOPICS = [
  {
    id: 't-1', category: 'Web', title: 'HTML Fundamentals', minutes: 25,
    summary: 'Learn the structure of web pages with semantic HTML5.',
    lessons: 12,
  },
  {
    id: 't-2', category: 'Web', title: 'CSS Layouts with Flexbox', minutes: 35,
    summary: 'Master modern responsive layouts using Flexbox.',
    lessons: 10,
  },
  {
    id: 't-3', category: 'Web', title: 'JavaScript Essentials', minutes: 60,
    summary: 'Variables, functions, async/await, and the DOM.',
    lessons: 18,
  },
  {
    id: 't-4', category: 'Data', title: 'SQL for Beginners', minutes: 40,
    summary: 'Query, insert, update, and design relational schemas.',
    lessons: 14,
  },
  {
    id: 't-5', category: 'AI', title: 'Intro to Machine Learning', minutes: 90,
    summary: 'Supervised vs unsupervised learning with real examples.',
    lessons: 16,
  },
  {
    id: 't-6', category: 'Mobile', title: 'React Native Basics', minutes: 75,
    summary: 'Build cross-platform mobile apps with React Native.',
    lessons: 15,
  },
]

export const MOCK_RECOMMENDED_COURSES = [
  { code: 'CS601', name: 'Advanced AI & Deep Learning',      match: 94, reason: 'Strong performance in OOP (CS511) and Mobile Dev (CS507)' },
  { code: 'CS603', name: 'Cloud Computing & DevOps',          match: 88, reason: 'Complements your Compiler Design background' },
  { code: 'CS605', name: 'Cybersecurity & Ethical Hacking',   match: 81, reason: 'Builds on Embedded Systems coursework' },
]

export const MOCK_AI_INSIGHTS = [
  { type: 'success',  text: 'Student attendance is up 12% this semester compared to last.' },
  { type: 'warning',  text: '11% of Level-3 students are at risk in CS511 (OOP) — consider extra tutorials.' },
  { type: 'info',     text: 'Predicted enrollment for 2026 intake: 1,240 applicants (+22%).' },
  { type: 'success',  text: 'Lecturer Mr Nkoma Ngouloure has the highest student satisfaction this term.' },
]

export const MOCK_STUDENTS = Array.from({ length: 18 }, (_, i) => ({
  id: `IUGET/2023/CS/${String(140 + i).padStart(4, '0')}`,
  name: ['Alice Mbah', 'Brian Etoh', 'Clara Wirba', 'David Nfor', 'Esther Akem',
         'Frank Tabi', 'Gloria Mbi', 'Henri Anye', 'Ivy Nkeng', 'Joel Tagne',
         'Karen Asaba', 'Leo Nfah', 'Mary Tah', 'Noah Bate', 'Olivia Foncha',
         'Paul Etame', 'Queen Nya', 'Ralph Tane'][i],
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
}))

// Tuition fee data
export const MOCK_FEE_STRUCTURE = {
  tuition:        450000,  // FCFA
  registration:    25000,
  examFee:         15000,
  libraryFee:       8000,
  studentUnion:     2000,
  total:          500000,
  paid:           350000,
  balance:        150000,
  currency:       'FCFA',
  academicYear:   '2025 / 2026',
  deadline:       '2026-06-05',
}

export const MOCK_PAYMENT_HISTORY = [
  { id: 'pay-1', date: '2025-10-12', amount: 200000, method: 'MTN MoMo',     reference: 'MOMO-2025-A8F3K2', status: 'success' },
  { id: 'pay-2', date: '2026-01-25', amount: 150000, method: 'Orange Money', reference: 'OM-2026-B4D9P1',    status: 'success' },
]

export const PAYMENT_METHODS = [
  { id: 'momo',    name: 'MTN Mobile Money', subtitle: 'Pay with MoMo',         color: 'bg-amber-500', textColor: 'text-amber-900', code: '*126#'  },
  { id: 'om',      name: 'Orange Money',     subtitle: 'Pay with OM',           color: 'bg-orange-500', textColor: 'text-orange-900', code: '#150*4#' },
  { id: 'visa',    name: 'Visa / Mastercard',subtitle: 'Credit or debit card',  color: 'bg-blue-600',  textColor: 'text-blue-100',  code: ''        },
  { id: 'bank',    name: 'Bank Transfer',    subtitle: 'Afriland / UBA / Ecobank', color: 'bg-emerald-600', textColor: 'text-emerald-100', code: '' },
]
