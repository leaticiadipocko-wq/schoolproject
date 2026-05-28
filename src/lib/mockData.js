// Mock data for SIARM demo mode.
// This provides realistic data shapes for all modules so the UI can be developed
// and demonstrated without a live Firebase backend.

export const MOCK_USERS = [
  {
    uid: 'stu-001',
    email: 'student@siarm.edu',
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
    email: 'lecturer@siarm.edu',
    password: 'password',
    role: 'lecturer',
    name: 'Dr. Samuel Tagne',
    department: 'Computer Science',
    courses: ['CS301', 'CS305', 'CS402'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel',
  },
  {
    uid: 'sta-001',
    email: 'staff@siarm.edu',
    password: 'password',
    role: 'staff',
    name: 'Mrs. Linda Foncha',
    department: 'Registrar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
  },
  {
    uid: 'adm-001',
    email: 'admin@siarm.edu',
    password: 'password',
    role: 'admin',
    name: 'Prof. James Murdza',
    title: 'Vice-Chancellor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
]

export const MOCK_COURSES = [
  { code: 'CS301', name: 'Software Engineering', credits: 3, lecturer: 'Dr. Samuel Tagne', level: 3 },
  { code: 'CS305', name: 'Database Systems',     credits: 3, lecturer: 'Dr. Samuel Tagne', level: 3 },
  { code: 'CS307', name: 'Operating Systems',    credits: 3, lecturer: 'Dr. P. Nkeng',     level: 3 },
  { code: 'CS309', name: 'Web Technologies',     credits: 3, lecturer: 'Mr. A. Etame',     level: 3 },
  { code: 'CS311', name: 'Mobile Development',   credits: 2, lecturer: 'Mr. A. Etame',     level: 3 },
  { code: 'CS402', name: 'Artificial Intelligence', credits: 3, lecturer: 'Dr. Samuel Tagne', level: 4 },
]

export const MOCK_TIMETABLE = [
  { day: 'Monday',    time: '08:00 - 10:00', course: 'CS301', room: 'Hall A', lecturer: 'Dr. S. Tagne' },
  { day: 'Monday',    time: '10:00 - 12:00', course: 'CS305', room: 'Lab 2',  lecturer: 'Dr. S. Tagne' },
  { day: 'Tuesday',   time: '08:00 - 10:00', course: 'CS307', room: 'Hall B', lecturer: 'Dr. P. Nkeng' },
  { day: 'Tuesday',   time: '13:00 - 15:00', course: 'CS309', room: 'Lab 1',  lecturer: 'Mr. A. Etame' },
  { day: 'Wednesday', time: '09:00 - 11:00', course: 'CS311', room: 'Lab 3',  lecturer: 'Mr. A. Etame' },
  { day: 'Thursday',  time: '08:00 - 10:00', course: 'CS301', room: 'Hall A', lecturer: 'Dr. S. Tagne' },
  { day: 'Friday',    time: '10:00 - 12:00', course: 'CS305', room: 'Lab 2',  lecturer: 'Dr. S. Tagne' },
]

export const MOCK_ATTENDANCE = [
  { course: 'CS301', total: 24, attended: 22, percent: 92 },
  { course: 'CS305', total: 24, attended: 20, percent: 83 },
  { course: 'CS307', total: 22, attended: 16, percent: 73 },
  { course: 'CS309', total: 22, attended: 21, percent: 95 },
  { course: 'CS311', total: 18, attended: 14, percent: 78 },
]

export const MOCK_RESULTS = [
  { course: 'CS201', semester: 'S1 2023', ca: 28, exam: 52, total: 80, grade: 'A' },
  { course: 'CS203', semester: 'S1 2023', ca: 22, exam: 48, total: 70, grade: 'B+' },
  { course: 'CS205', semester: 'S1 2023', ca: 25, exam: 40, total: 65, grade: 'B' },
  { course: 'CS301', semester: 'S1 2024', ca: 27, exam: 55, total: 82, grade: 'A' },
  { course: 'CS305', semester: 'S1 2024', ca: 24, exam: 50, total: 74, grade: 'B+' },
  { course: 'CS307', semester: 'S1 2024', ca: 20, exam: 38, total: 58, grade: 'C+' },
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
    body: 'The university library will now open from 7am to 10pm during the exam period.',
    author: 'Library',
    audience: 'students',
    createdAt: '2026-05-24T14:00:00Z',
  },
  {
    id: 'a-3',
    title: 'Staff meeting — Friday 3pm',
    body: 'All academic staff are invited to the senate hall for the end-of-semester review.',
    author: 'VC Office',
    audience: 'staff',
    createdAt: '2026-05-23T09:00:00Z',
  },
  {
    id: 'a-4',
    title: 'Tuition payment deadline extended',
    body: 'The deadline for second-semester fees has been pushed to June 5. Use the bursary portal.',
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
  { code: 'CS402', name: 'Artificial Intelligence', match: 94, reason: 'Strong performance in CS305 and CS309' },
  { code: 'CS404', name: 'Cloud Computing',         match: 88, reason: 'Aligns with your web tech background' },
  { code: 'CS406', name: 'Cybersecurity',           match: 81, reason: 'Complements your systems coursework' },
]

export const MOCK_AI_INSIGHTS = [
  { type: 'success',  text: 'Student attendance is up 12% this semester compared to last.' },
  { type: 'warning',  text: '14% of Level-3 students are at risk in CS307 — consider extra tutorials.' },
  { type: 'info',     text: 'Predicted enrollment for 2026 intake: 1,240 applicants (+22%).' },
  { type: 'success',  text: 'Lecturer Dr. S. Tagne has the highest student satisfaction this term.' },
]
