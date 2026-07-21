// Mock data for SIARM demo mode.
// This provides realistic data shapes for all modules so the UI can be developed
// and demonstrated without a live Firebase backend.

// ── Multi-Campus ──────────────────────────────────────────────
export const CAMPUSES = [
  { id: 'bonaberi',  name: 'Bonabéri',     fullName: 'IUGET Bonabéri',      color: 'bg-brand-600' },
  { id: 'bonamoussadi', name: 'Bonamoussadi', fullName: 'IUGET Bonamoussadi', color: 'bg-accent-600' },
  { id: 'all',       name: 'All Campuses', fullName: 'All Campuses',        color: 'bg-ink-600' },
]

export const MOCK_LIBRARY_BOOKS = [
  { id: 'bk-1', isbn: '978-0-13-110362-7', title: 'The C Programming Language', author: 'Kernighan & Ritchie', category: 'Programming', copies: 5, available: 3, shelf: 'A-12' },
  { id: 'bk-2', isbn: '978-0-596-51774-8', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Programming', copies: 3, available: 1, shelf: 'A-14' },
  { id: 'bk-3', isbn: '978-1-491-95035-7', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Database', copies: 2, available: 0, shelf: 'B-03' },
  { id: 'bk-4', isbn: '978-0-262-03384-8', title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Algorithms', copies: 4, available: 2, shelf: 'C-07' },
  { id: 'bk-5', isbn: '978-0-13-468599-1', title: 'Operating System Concepts', author: 'Silberschatz et al.', category: 'OS', copies: 3, available: 3, shelf: 'D-01' },
  { id: 'bk-6', isbn: '978-1-59327-950-9', title: 'The Linux Programming Interface', author: 'Michael Kerrisk', category: 'Linux', copies: 2, available: 1, shelf: 'D-05' },
  { id: 'bk-7', isbn: '978-1-449-37292-8', title: 'Computer Networks', author: 'Tanenbaum & Wetherall', category: 'Networking', copies: 3, available: 2, shelf: 'E-02' },
  { id: 'bk-8', isbn: '978-0-321-55268-6', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', copies: 4, available: 0, shelf: 'A-10' },
  { id: 'bk-9', isbn: '978-0-13-235088-4', title: 'The Mythical Man-Month', author: 'Fred Brooks', category: 'SE', copies: 2, available: 2, shelf: 'F-08' },
  { id: 'bk-10', isbn: '978-0-12-374856-0', title: 'Digital Signal Processing', author: 'Proakis & Manolakis', category: 'Signal Processing', copies: 2, available: 0, shelf: 'G-04' },
]

export const MOCK_BORROWINGS = [
  { id: 'br-1', bookId: 'bk-1', userId: 'stu-001', userName: 'Chituh Innocentia', borrowDate: '2026-05-10', dueDate: '2026-05-31', returned: false },
  { id: 'br-2', bookId: 'bk-3', userId: 'stu-002', userName: 'Nkwenti Deshnic', borrowDate: '2026-05-12', dueDate: '2026-06-02', returned: false },
  { id: 'br-3', bookId: 'bk-8', userId: 'lec-001', userName: 'Mr Nkoma Ngouloure', borrowDate: '2026-04-20', dueDate: '2026-05-11', returned: false },
  { id: 'br-4', bookId: 'bk-2', userId: 'stu-003', userName: 'Wandji Adrien', borrowDate: '2026-05-15', dueDate: '2026-06-05', returned: true, returnedDate: '2026-05-28' },
]

export const MOCK_COMPLAINTS = [
  { id: 'cp-1', userId: 'stu-001', userName: 'Chituh Innocentia', category: 'Facilities', subject: 'Broken projector in Hall A', description: 'The projector in Hall A has been malfunctioning for 2 weeks.', status: 'open', priority: 'high', createdAt: '2026-05-20T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z' },
  { id: 'cp-2', userId: 'stu-003', userName: 'Wandji Adrien', category: 'Academic', subject: 'Grade discrepancy in CS501', description: 'My CA score was entered as 22 but I received 27 on the script.', status: 'in-progress', priority: 'urgent', createdAt: '2026-05-18T14:30:00Z', updatedAt: '2026-05-19T09:00:00Z' },
  { id: 'cp-3', userId: 'stu-005', userName: 'Winner Chinuere', category: 'Library', subject: 'Overdue book not recorded', description: 'I returned Clean Code on May 28 but it still shows as borrowed.', status: 'resolved', priority: 'medium', createdAt: '2026-05-12T08:00:00Z', updatedAt: '2026-05-14T11:00:00Z', resolution: 'Record corrected. Thank you for reporting.' },
]

export const MOCK_EXAM_SEATING = {
  'CS501': {
    course: 'Compiler Design', date: '2026-06-12', time: '09:00 - 12:00', venue: 'Main Hall',
    rows: [
      { row: 'A', seats: ['A01','A02','A03','A04','A05'], students: ['Chituh Innocentia','Nkwenti Deshnic','Wandji Adrien','Mbah Alice','Wirba Clara'] },
      { row: 'B', seats: ['B01','B02','B03','B04','B05'], students: ['Akem Esther','Tabi Franklin','Nfor David','Zelio Gerald','Mbi Gloria'] },
    ]
  },
  'CS503': {
    course: 'Research Methodology', date: '2026-06-14', time: '14:00 - 16:00', venue: 'Hall B',
    rows: [
      { row: 'A', seats: ['A01','A02','A03','A04','A05'], students: ['Chituh Innocentia','Nkwenti Deshnic','Winner Chinuere','Wandji Adrien','Anye Henri'] },
      { row: 'B', seats: ['B01','B02','B03','B04','B05'], students: ['Tagne Joel','Asaba Karen','Nfah Leo','Tah Mary','Etoh Brian'] },
    ]
  }
}

export const MOCK_ALUMNI = [
  { id: 'al-1', name: 'Dr. Ayuk Peter', graduationYear: 2015, program: 'BTech Software Engineering', email: 'ayuk.peter@example.com', company: 'Google', position: 'Senior Engineer', linkedin: 'https://linkedin.com/in/ayukpeter', testimonial: 'SIARM laid the foundation for my career in tech.' },
  { id: 'al-2', name: 'Ndam Esther', graduationYear: 2018, program: 'BTech Computer Networks', email: 'ndam.esther@example.com', company: 'Orange Cameroon', position: 'Network Architect', linkedin: 'https://linkedin.com/in/ndamesther', testimonial: 'The hands-on networking labs were invaluable.' },
  { id: 'al-3', name: 'Fonkem Elvis', graduationYear: 2020, program: 'BTech Software Engineering', email: 'fonkem.elvis@example.com', company: 'Afriland First Bank', position: 'IT Project Manager', linkedin: 'https://linkedin.com/in/fonkemelvis' },
  { id: 'al-4', name: 'Tchinda Mary', graduationYear: 2019, program: 'BTech Business Technology', email: 'tchinda.mary@example.com', company: 'MTN Cameroon', position: 'Product Manager', linkedin: 'https://linkedin.com/in/tchindamary', testimonial: 'SIARM taught me to think like an engineer and lead like a manager.' },
]

export const MOCK_EVENTS = [
  { id: 'ev-1', title: 'Career Fair 2026', date: '2026-07-15', time: '09:00 - 16:00', venue: 'Bonabéri Campus', description: 'Meet top employers from across Cameroon.', organizer: 'Career Services', campus: 'bonaberi' },
  { id: 'ev-2', title: 'Tech Workshop: AI & ML', date: '2026-07-20', time: '14:00 - 17:00', venue: 'Bonamoussadi Campus', description: 'Hands-on introduction to machine learning with Python.', organizer: 'CS Department', campus: 'bonamoussadi' },
  { id: 'ev-3', title: 'End-of-Semester Party', date: '2026-07-25', time: '18:00 - 23:00', venue: 'Bonabéri Campus', description: 'Celebrate the end of the semester with music, food, and games.', organizer: 'Student Council', campus: 'bonaberi' },
  { id: 'ev-4', title: 'Research Seminar: Distributed Systems', date: '2026-06-30', time: '10:00 - 12:00', venue: 'Bonabéri Campus', description: 'Guest lecture by Prof. Nkengafac from MIT.', organizer: 'Research Office', campus: 'bonaberi' },
]

export const MOCK_USERS = [
  {
    uid: 'stu-001',
    email: 'student@iuget.cm',
    password: 'password',
    role: 'student',
    name: 'Chituh Innocentia',
    studentId: 'IUGET/2023/SWE/0142',
    program: 'Bachelor of Technology — Software Engineering',
    specialty: 'SWE',
    level: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia',
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

// Real IUGET courses across all three sections
export const MOCK_COURSES = [
  // Level 3 SWE — Bachelor section (evening + Saturday)
  { code: 'CS501', name: 'Compiler Design',             credits: 3, lecturer: 'Mr Nkoma Ngouloure',     level: 3, track: 'bachelor-evening' },
  { code: 'CS503', name: 'Research Methodology',        credits: 2, lecturer: 'Mr Nkoma Ngouloure',     level: 3, track: 'bachelor-evening' },
  { code: 'CS505', name: 'Embedded Systems',            credits: 3, lecturer: 'Eng Fotseu Julien',      level: 3, track: 'bachelor-evening' },
  { code: 'CS507', name: 'Mobile Development',          credits: 3, lecturer: 'Mr Smith Wills',         level: 3, track: 'bachelor-evening' },
  { code: 'CS509', name: 'Design Project',              credits: 4, lecturer: 'Dr Romeo Mougnol',       level: 3, track: 'bachelor-evening' },
  { code: 'CS511', name: 'Object Oriented Programming', credits: 3, lecturer: 'Mr Asongafack Patrick',  level: 3, track: 'bachelor-evening' },
  // Level 1 — morning section
  { code: 'CS101', name: 'Intro to Computer Science',   credits: 3, lecturer: 'Mr B. Kamgang',          level: 1, track: 'l1-morning' },
  { code: 'CS103', name: 'Mathematics for CS',          credits: 3, lecturer: 'Mrs A. Tchio',            level: 1, track: 'l1-morning' },
  { code: 'CS105', name: 'Programming Fundamentals',    credits: 3, lecturer: 'Mr B. Kamgang',          level: 1, track: 'l1-morning' },
  { code: 'CS107', name: 'Communication Skills',        credits: 2, lecturer: 'Dr P. Eloundou',         level: 1, track: 'l1-morning' },
  // Level 2 — morning section
  { code: 'CS201', name: 'Data Structures & Algorithms',credits: 3, lecturer: 'Mr J. Foncha',           level: 2, track: 'l2-morning' },
  { code: 'CS203', name: 'Database Systems',            credits: 3, lecturer: 'Mrs L. Awah',            level: 2, track: 'l2-morning' },
  { code: 'CS205', name: 'Computer Networks',           credits: 3, lecturer: 'Mr J. Foncha',           level: 2, track: 'l2-morning' },
  { code: 'CS207', name: 'Software Engineering Intro',  credits: 3, lecturer: 'Dr K. Mbah',             level: 2, track: 'l2-morning' },
]

// IUGET Bachelor of Technology — Bonabéri campus runs three specialties
// in parallel on the same evening + Saturday grid:
//   SWE   — Software Engineering
//   CNSM  — Computer Networks & Multimedia Systems
//   BST   — Business Strategy & Technology (Geotechnical/Civil track)
// Reference timetable: N°30/IUGET/C-DIR/P-SP/05-26-SW · Sixth Semester · Week 25–31 May 2026
export const SPECIALTIES = {
  SWE:  { id: 'SWE',  name: 'Software Engineering',                  color: 'brand',   chip: 'bg-brand-100 text-brand-800' },
  CNSM: { id: 'CNSM', name: 'Computer Networks & Multimedia Systems',color: 'accent',  chip: 'bg-accent-100 text-accent-700' },
  BST:  { id: 'BST',  name: 'Business Strategy & Technology',        color: 'amber',   chip: 'bg-amber-100 text-amber-700' },
}

// Tracks define when classes happen — the Bachelor section shares one grid
// across all three specialties. Level 1 and 2 run their own morning grid.
export const TIMETABLE_TRACKS = {
  'bachelor-evening': {
    id: 'bachelor-evening',
    name: 'Bachelor of Technology — Sixth Semester',
    short: 'Bachelor · Evening',
    description: 'Mon–Fri 18:00–22:00  ·  Sat 08:00–17:00',
    docRef: 'N°30/IUGET/C-DIR/P-SP/05-26-SW',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaySlots: ['18:00 - 20:00', '20:00 - 22:00'],
    saturdaySlots: ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'],
    specialties: ['SWE', 'CNSM', 'BST'],
    color: 'bg-brand-800',
  },
  'l1-morning': {
    id: 'l1-morning',
    name: 'Level 1 — Morning',
    short: 'Level 1 · Morning',
    description: 'Mon–Fri 08:00–17:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    weekdaySlots: ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'],
    saturdaySlots: [],
    specialties: ['SWE', 'CNSM', 'BST'],
    color: 'bg-emerald-600',
  },
  'l2-morning': {
    id: 'l2-morning',
    name: 'Level 2 — Morning',
    short: 'Level 2 · Morning',
    description: 'Mon–Fri 08:00–17:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    weekdaySlots: ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'],
    saturdaySlots: [],
    specialties: ['SWE', 'CNSM', 'BST'],
    color: 'bg-accent-600',
  },
}

// Holidays / non-class days for the current week
export const HOLIDAYS = [
  { date: '2026-05-27', day: 'Wednesday', name: 'Eid Al-Adha observation', track: 'bachelor-evening' },
]

export const ALL_TIMETABLE_SLOTS = [
  '08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00',
  '18:00 - 20:00', '20:00 - 22:00',
]

// Bachelor of Technology — Sixth Semester (25–31 May 2026)
// Sourced from the official IUGET timetable (ref N°30/IUGET/C-DIR/P-SP/05-26-SW).
// Each row pins a specialty so all three (SWE, CNSM, BST) can share the same grid.
export const MOCK_TIMETABLE = [
  // ===== MONDAY 25/05/2026 =====
  { day: 'Monday',    time: '18:00 - 20:00', specialty: 'SWE',  course: 'Linux Programming',         room: 'Hall A', lecturer: 'Engr Malobe Lottin',   group: '4/6', track: 'bachelor-evening' },
  { day: 'Monday',    time: '18:00 - 20:00', specialty: 'CNSM', course: 'Linux Programming',         room: 'Hall A', lecturer: 'Engr Malobe Lottin',   group: '4/6', track: 'bachelor-evening' },
  { day: 'Monday',    time: '18:00 - 20:00', specialty: 'BST',  course: 'Geotechnical Engineering',  room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',     group: '5/6', track: 'bachelor-evening' },
  { day: 'Monday',    time: '20:00 - 22:00', specialty: 'SWE',  course: 'Computer Graphics',         room: 'Lab 2',  lecturer: 'Mr Nkoma Ngouloure',   group: '3/6', kind: 'CA', track: 'bachelor-evening' },
  { day: 'Monday',    time: '20:00 - 22:00', specialty: 'CNSM', course: 'Research Topic',            room: 'Studio', lecturer: 'By Supervisor',                       track: 'bachelor-evening' },
  { day: 'Monday',    time: '20:00 - 22:00', specialty: 'BST',  course: 'Geotechnical Engineering II', room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',   group: '5/6', track: 'bachelor-evening' },

  // ===== TUESDAY 26/05/2026 (partial — placeholders pending full data) =====
  { day: 'Tuesday',   time: '18:00 - 20:00', specialty: 'SWE',  course: 'Compiler Design',           room: 'Hall A', lecturer: 'Mr Nkoma Ngouloure',                  track: 'bachelor-evening' },
  { day: 'Tuesday',   time: '18:00 - 20:00', specialty: 'CNSM', course: 'Network Security',          room: 'Lab 1',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Tuesday',   time: '18:00 - 20:00', specialty: 'BST',  course: 'Project Management',        room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',                    track: 'bachelor-evening' },
  { day: 'Tuesday',   time: '20:00 - 22:00', specialty: 'SWE',  course: 'Mobile Development',        room: 'Lab 3',  lecturer: 'Mr Smith Wills',                      track: 'bachelor-evening' },
  { day: 'Tuesday',   time: '20:00 - 22:00', specialty: 'CNSM', course: 'Multimedia Systems',        room: 'Lab 1',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Tuesday',   time: '20:00 - 22:00', specialty: 'BST',  course: 'Business Analytics',        room: 'Hall B', lecturer: 'Dr Romeo Mougnol',                    track: 'bachelor-evening' },

  // ===== WEDNESDAY 27/05/2026 — EID AL-ADHA HOLIDAY (no classes) =====

  // ===== THURSDAY 28/05/2026 (provisional — confirm with screenshot) =====
  { day: 'Thursday',  time: '18:00 - 20:00', specialty: 'SWE',  course: 'Object Oriented Programming', room: 'Lab 2', lecturer: 'Mr Asongafack Patrick',              track: 'bachelor-evening' },
  { day: 'Thursday',  time: '18:00 - 20:00', specialty: 'CNSM', course: 'Linux Programming',         room: 'Hall A', lecturer: 'Engr Malobe Lottin',                  track: 'bachelor-evening' },
  { day: 'Thursday',  time: '18:00 - 20:00', specialty: 'BST',  course: 'Geotechnical Engineering',  room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',                    track: 'bachelor-evening' },
  { day: 'Thursday',  time: '20:00 - 22:00', specialty: 'SWE',  course: 'Research Methodology',      room: 'Hall A', lecturer: 'Mr Nkoma Ngouloure',                  track: 'bachelor-evening' },
  { day: 'Thursday',  time: '20:00 - 22:00', specialty: 'CNSM', course: 'Computer Graphics',         room: 'Lab 2',  lecturer: 'Mr Nkoma Ngouloure',                  track: 'bachelor-evening' },
  { day: 'Thursday',  time: '20:00 - 22:00', specialty: 'BST',  course: 'Geotechnical Engineering II', room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',                  track: 'bachelor-evening' },

  // ===== FRIDAY 29/05/2026 (provisional) =====
  { day: 'Friday',    time: '18:00 - 20:00', specialty: 'SWE',  course: 'Embedded Systems',          room: 'Lab 1',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Friday',    time: '18:00 - 20:00', specialty: 'CNSM', course: 'Wireless Networks',         room: 'Lab 1',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Friday',    time: '18:00 - 20:00', specialty: 'BST',  course: 'Marketing Strategy',        room: 'Hall B', lecturer: 'Dr Romeo Mougnol',                    track: 'bachelor-evening' },
  { day: 'Friday',    time: '20:00 - 22:00', specialty: 'SWE',  course: 'Mobile Development',        room: 'Lab 3',  lecturer: 'Mr Smith Wills',                      track: 'bachelor-evening' },
  { day: 'Friday',    time: '20:00 - 22:00', specialty: 'CNSM', course: 'IoT Systems',               room: 'Lab 3',  lecturer: 'Mr Smith Wills',                      track: 'bachelor-evening' },
  { day: 'Friday',    time: '20:00 - 22:00', specialty: 'BST',  course: 'Operations Management',     room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',                    track: 'bachelor-evening' },

  // ===== SATURDAY 30/05/2026 — Full day (provisional) =====
  { day: 'Saturday',  time: '08:00 - 10:00', specialty: 'SWE',  course: 'Design Project',            room: 'Studio', lecturer: 'Dr Romeo Mougnol',                    track: 'bachelor-evening' },
  { day: 'Saturday',  time: '08:00 - 10:00', specialty: 'CNSM', course: 'Design Project',            room: 'Lab 4',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Saturday',  time: '08:00 - 10:00', specialty: 'BST',  course: 'Design Project',            room: 'Hall C', lecturer: 'Dr Romeo Mougnol',                    track: 'bachelor-evening' },
  { day: 'Saturday',  time: '10:00 - 12:00', specialty: 'SWE',  course: 'Design Project (cont.)',    room: 'Studio', lecturer: 'Dr Romeo Mougnol',                    track: 'bachelor-evening' },
  { day: 'Saturday',  time: '10:00 - 12:00', specialty: 'CNSM', course: 'Design Project (cont.)',    room: 'Lab 4',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Saturday',  time: '10:00 - 12:00', specialty: 'BST',  course: 'Design Project (cont.)',    room: 'Hall C', lecturer: 'Dr Romeo Mougnol',                    track: 'bachelor-evening' },
  { day: 'Saturday',  time: '13:00 - 15:00', specialty: 'SWE',  course: 'Research Methodology',      room: 'Hall A', lecturer: 'Mr Nkoma Ngouloure',                  track: 'bachelor-evening' },
  { day: 'Saturday',  time: '13:00 - 15:00', specialty: 'CNSM', course: 'Research Methodology',      room: 'Hall A', lecturer: 'Mr Nkoma Ngouloure',                  track: 'bachelor-evening' },
  { day: 'Saturday',  time: '13:00 - 15:00', specialty: 'BST',  course: 'Business Ethics',           room: 'Hall B', lecturer: 'Mr Kamdem Arnaud',                    track: 'bachelor-evening' },
  { day: 'Saturday',  time: '15:00 - 17:00', specialty: 'SWE',  course: 'Object Oriented Programming Lab', room: 'Lab 2', lecturer: 'Mr Asongafack Patrick',           track: 'bachelor-evening' },
  { day: 'Saturday',  time: '15:00 - 17:00', specialty: 'CNSM', course: 'Network Lab',               room: 'Lab 1',  lecturer: 'Eng Fotseu Julien',                   track: 'bachelor-evening' },
  { day: 'Saturday',  time: '15:00 - 17:00', specialty: 'BST',  course: 'Field Study',               room: 'External', lecturer: 'Mr Kamdem Arnaud',                  track: 'bachelor-evening' },

  // Level 1 — morning session (placeholder, to be filled by admin)
  { day: 'Monday',    time: '08:00 - 10:00', course: 'CS101', room: 'Hall C',  lecturer: 'Mr B. Kamgang',        track: 'l1-morning' },
  { day: 'Monday',    time: '10:00 - 12:00', course: 'CS103', room: 'Hall C',  lecturer: 'Mrs A. Tchio',          track: 'l1-morning' },
  { day: 'Tuesday',   time: '08:00 - 10:00', course: 'CS105', room: 'Lab 4',   lecturer: 'Mr B. Kamgang',        track: 'l1-morning' },
  { day: 'Tuesday',   time: '13:00 - 15:00', course: 'CS107', room: 'Hall C',  lecturer: 'Dr P. Eloundou',       track: 'l1-morning' },
  { day: 'Wednesday', time: '10:00 - 12:00', course: 'CS101', room: 'Hall C',  lecturer: 'Mr B. Kamgang',        track: 'l1-morning' },
  { day: 'Thursday',  time: '08:00 - 10:00', course: 'CS103', room: 'Hall C',  lecturer: 'Mrs A. Tchio',          track: 'l1-morning' },
  { day: 'Friday',    time: '13:00 - 15:00', course: 'CS105', room: 'Lab 4',   lecturer: 'Mr B. Kamgang',        track: 'l1-morning' },

  // Level 2 — morning session
  { day: 'Monday',    time: '08:00 - 10:00', course: 'CS201', room: 'Hall D',  lecturer: 'Mr J. Foncha',          track: 'l2-morning' },
  { day: 'Monday',    time: '13:00 - 15:00', course: 'CS203', room: 'Lab 5',   lecturer: 'Mrs L. Awah',           track: 'l2-morning' },
  { day: 'Tuesday',   time: '10:00 - 12:00', course: 'CS205', room: 'Hall D',  lecturer: 'Mr J. Foncha',          track: 'l2-morning' },
  { day: 'Wednesday', time: '08:00 - 10:00', course: 'CS207', room: 'Lab 5',   lecturer: 'Dr K. Mbah',            track: 'l2-morning' },
  { day: 'Thursday',  time: '10:00 - 12:00', course: 'CS201', room: 'Hall D',  lecturer: 'Mr J. Foncha',          track: 'l2-morning' },
  { day: 'Friday',    time: '13:00 - 15:00', course: 'CS203', room: 'Lab 5',   lecturer: 'Mrs L. Awah',           track: 'l2-morning' },
]

export const MOCK_ATTENDANCE = [
  { course: 'CS501', period: '10:00 - 12:00', total: 24, attended: 22, percent: 92 },
  { course: 'CS503', period: '08:00 - 10:00', total: 18, attended: 17, percent: 94 },
  { course: 'CS505', period: '10:00 - 12:00', total: 22, attended: 19, percent: 86 },
  { course: 'CS507', period: '13:00 - 15:00', total: 22, attended: 21, percent: 95 },
  { course: 'CS509', period: '15:00 - 17:00', total: 14, attended: 13, percent: 93 },
  { course: 'CS511', period: '10:00 - 12:00', total: 24, attended: 20, percent: 83 },
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

export const MOCK_CAMPUS_DATA = {
  bonaberi: {
    name: 'Bonabéri',
    heads: { director: 'Prof. James Murdza', registrar: 'Mrs. Linda Foncha', librarian: 'Mr. Tabe Martin' },
    stats: { students: 420, lecturers: 28, staff: 15, programs: 6 },
  },
  bonamoussadi: {
    name: 'Bonamoussadi',
    heads: { director: 'Dr. Nkengafac Mfortaw', registrar: 'Mr. Enow Peter', librarian: 'Mrs. Mfortaw Irene' },
    stats: { students: 310, lecturers: 22, staff: 12, programs: 4 },
  },
}

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
    id: 't-5', category: 'Mobile', title: 'React Native Basics', minutes: 75,
    summary: 'Build cross-platform mobile apps with React Native.',
    lessons: 15,
  },
]

export const MOCK_ANNOUNCEMENT_INSIGHTS = [
  { type: 'success',  text: 'Student attendance is up 12% this semester compared to last.' },
  { type: 'info',     text: 'Lecturer Mr Nkoma Ngouloure has the highest student satisfaction this term.' },
  { type: 'warning',  text: 'CS509 Design Project has 4 students at risk of failing — recommend tutorial sessions.' },
  { type: 'success',  text: 'Tuition collection rate reached 92% — best Q2 result in three years.' },
]

// Real student roster — Chituh Innocentia is the demo account; the rest are
// classmates across SWE, CNSM, and BST specialties at IUGET Bonabéri.
const STUDENT_ROSTER = [
  // Featured students (per IUGET roster)
  { name: 'Chituh Innocentia', specialty: 'SWE',  level: 3 },
  { name: 'Nkwenti Deshnic',   specialty: 'SWE',  level: 3 },
  { name: 'Winner Chinuere',   specialty: 'CNSM', level: 3 },
  { name: 'Zelio Gerald',      specialty: 'BST',  level: 3 },
  { name: 'Wandji Adrien',     specialty: 'SWE',  level: 3 },
  // Other classmates
  { name: 'Mbah Alice',        specialty: 'CNSM', level: 3 },
  { name: 'Etoh Brian',        specialty: 'BST',  level: 3 },
  { name: 'Wirba Clara',       specialty: 'SWE',  level: 3 },
  { name: 'Nfor David',        specialty: 'CNSM', level: 3 },
  { name: 'Akem Esther',       specialty: 'BST',  level: 3 },
  { name: 'Tabi Franklin',     specialty: 'SWE',  level: 3 },
  { name: 'Mbi Gloria',        specialty: 'CNSM', level: 3 },
  { name: 'Anye Henri',        specialty: 'SWE',  level: 3 },
  { name: 'Nkeng Ivy',         specialty: 'BST',  level: 3 },
  { name: 'Tagne Joel',        specialty: 'SWE',  level: 3 },
  { name: 'Asaba Karen',       specialty: 'CNSM', level: 3 },
  { name: 'Nfah Leo',          specialty: 'BST',  level: 3 },
  { name: 'Tah Mary',          specialty: 'SWE',  level: 3 },
]

// Deterministic financial state per student — drives the Financial Tracking page
const FEE_STATES = ['paid', 'partial', 'overdue', 'paid', 'partial', 'paid', 'paid', 'partial', 'overdue', 'paid']

export const MOCK_STUDENTS = STUDENT_ROSTER.map((s, i) => {
  const idx = String(140 + i).padStart(4, '0')
  const feeStatus = FEE_STATES[i % FEE_STATES.length]
  const totalFees = 500000
  const paid =
    feeStatus === 'paid'    ? totalFees :
    feeStatus === 'partial' ? 350000   :
                              200000   // overdue
  const lastName = s.name.split(' ').pop().toLowerCase()
  return {
    id:        `IUGET/2023/${s.specialty}/${idx}`,
    name:      s.name,
    email:     `${lastName}.${idx}@iuget.cm`,
    specialty: s.specialty,
    level:     s.level,
    program:   `Bachelor of Technology — ${s.specialty}`,
    feeStatus,
    feesPaid:  paid,
    feesTotal: totalFees,
    feesBalance: totalFees - paid,
    enrolledOn: `2023-09-${String(15 + (i % 10)).padStart(2, '0')}`,
    avatar:    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`,
  }
})

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

// ── Departments & Faculties ──────────────────────────────────────
export const DEPARTMENTS = [
  { id: 'dept-1', code: 'CS',  name: 'Computer Science',          faculty: 'Science & Technology', hod: 'Dr. Nkengafac Mfortaw',   budget: 45000000, students: 320, lecturers: 14, established: '2015-09-01' },
  { id: 'dept-2', code: 'BUS', name: 'Business Administration',    faculty: 'Management Sciences', hod: 'Prof. Marie Claire Etoh',  budget: 38000000, students: 280, lecturers: 11, established: '2015-09-01' },
  { id: 'dept-3', code: 'ENG', name: 'Engineering',               faculty: 'Science & Technology', hod: 'Dr. Emmanuel Tabi',       budget: 52000000, students: 240, lecturers: 12, established: '2016-09-01' },
  { id: 'dept-4', code: 'NRS', name: 'Nursing Science',           faculty: 'Health Sciences',     hod: 'Dr. Susan Ako',           budget: 35000000, students: 180, lecturers: 9,  established: '2017-09-01' },
  { id: 'dept-5', code: 'LAW', name: 'Law',                       faculty: 'Social Sciences',     hod: 'Barrister John Ndifor',   budget: 28000000, students: 140, lecturers: 7,  established: '2018-09-01' },
]

export const FACULTIES = [
  { id: 'fac-1', name: 'Science & Technology',   code: 'FST', dean: 'Prof. Fonkem',       departments: ['dept-1', 'dept-3'], established: '2015-01-01' },
  { id: 'fac-2', name: 'Management Sciences',    code: 'FMS', dean: 'Prof. Beatrice Nkwi', departments: ['dept-2'],             established: '2015-01-01' },
  { id: 'fac-3', name: 'Health Sciences',        code: 'FHS', dean: 'Dr. Michael Ngane',   departments: ['dept-4'],             established: '2017-01-01' },
  { id: 'fac-4', name: 'Social Sciences',        code: 'FSS', dean: 'Dr. Christine Mbaku', departments: ['dept-5'],             established: '2018-01-01' },
]

// ── Payroll / Lecturer Salary ────────────────────────────────────
export const MOCK_PAYROLL_RECORDS = [
  { id: 'payroll-1',  lecturerId: 'lec-001', lecturerName: 'Dr. Nkengafac Mfortaw',   role: 'Senior Lecturer', department: 'Computer Science',      baseSalary: 450000, allowances: 120000, deductions: 45000,  netPay: 525000, bankAccount: 'CM1000123456', bankName: 'Afriland First Bank', paymentMethod: 'Bank Transfer', status: 'paid',      period: '2026-06', paidOn: '2026-06-30' },
  { id: 'payroll-2',  lecturerId: 'lec-002', lecturerName: 'Dr. Smith John',           role: 'Lecturer',       department: 'Computer Science',      baseSalary: 350000, allowances: 80000,  deductions: 35000,  netPay: 395000, bankAccount: 'CM1000234567', bankName: 'Afriland First Bank', paymentMethod: 'Bank Transfer', status: 'paid',      period: '2026-06', paidOn: '2026-06-30' },
  { id: 'payroll-3',  lecturerId: 'lec-003', lecturerName: 'Prof. Williams',           role: 'Professor',      department: 'Business Administration', baseSalary: 550000, allowances: 150000, deductions: 55000,  netPay: 645000, bankAccount: 'CM1000345678', bankName: 'UBA Cameroon',      paymentMethod: 'Bank Transfer', status: 'paid',      period: '2026-06', paidOn: '2026-06-30' },
  { id: 'payroll-4',  lecturerId: 'lec-004', lecturerName: 'Dr. Johnson Anne',         role: 'Lecturer',       department: 'Business Administration', baseSalary: 320000, allowances: 70000,  deductions: 32000,  netPay: 358000, bankAccount: 'CM1000456789', bankName: 'Ecobank Cameroon',   paymentMethod: 'Bank Transfer', status: 'pending',   period: '2026-07', paidOn: null },
  { id: 'payroll-5',  lecturerId: 'lec-005', lecturerName: 'Dr. Brown Chris',          role: 'Senior Lecturer', department: 'Engineering',           baseSalary: 420000, allowances: 100000, deductions: 42000,  netPay: 478000, bankAccount: 'CM1000567890', bankName: 'Afriland First Bank', paymentMethod: 'Bank Transfer', status: 'pending',   period: '2026-07', paidOn: null },
  { id: 'payroll-6',  lecturerId: 'lec-006', lecturerName: 'Dr. Davis Paul',           role: 'Lecturer',       department: 'Engineering',           baseSalary: 310000, allowances: 60000,  deductions: 31000,  netPay: 339000, bankAccount: 'CM1000678901', bankName: 'Societe Generale',    paymentMethod: 'Bank Transfer', status: 'paid',      period: '2026-06', paidOn: '2026-06-28' },
  { id: 'payroll-7',  lecturerId: 'lec-007', lecturerName: 'Dr. Wilson Mark',          role: 'Professor',      department: 'Nursing Science',        baseSalary: 500000, allowances: 130000, deductions: 50000,  netPay: 580000, bankAccount: 'CM1000789012', bankName: 'UBA Cameroon',      paymentMethod: 'Bank Transfer', status: 'paid',      period: '2026-06', paidOn: '2026-06-29' },
  { id: 'payroll-8',  lecturerId: 'lec-008', lecturerName: 'Prof. Nkoma Ngouloure',    role: 'Professor',      department: 'Computer Science',      baseSalary: 580000, allowances: 160000, deductions: 58000,  netPay: 682000, bankAccount: 'CM1000890123', bankName: 'Afriland First Bank', paymentMethod: 'Bank Transfer', status: 'pending',   period: '2026-07', paidOn: null },
]

export const PAYROLL_SUMMARY = {
  totalBudget:   8000000,
  totalPaid:     3720000,
  totalPending:  2442000,
  month:         'July 2026',
  currency:      'FCFA',
}
