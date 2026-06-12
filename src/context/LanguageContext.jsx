import { createContext, useContext, useEffect, useState, useMemo } from 'react'

/**
 * Lightweight i18n for SIARM.
 *
 * - Language is persisted in localStorage under 'siarm.lang'.
 * - Default to French if the browser is French-speaking, otherwise English.
 * - Components consume t(key) for translated strings; fall back to the key if missing.
 */
const STORAGE_KEY = 'siarm.lang'
const LANGS = ['en', 'fr']

const LanguageContext = createContext(null)

function detectDefault() {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && LANGS.includes(stored)) return stored
  const nav = (navigator.language || 'en').toLowerCase()
  return nav.startsWith('fr') ? 'fr' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectDefault())

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang) } catch (e) {}
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const toggle = () => setLang((l) => (l === 'en' ? 'fr' : 'en'))

  const t = useMemo(() => {
    return (key, vars = {}) => {
      const dict = TRANSLATIONS[lang] || {}
      let value = dict[key]
      if (value === undefined) value = TRANSLATIONS.en[key] ?? key
      // Variable interpolation: {name} → vars.name
      return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`))
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}

/* ─── Translation dictionaries ────────────────────────────── */
export const TRANSLATIONS = {
  en: {
    /* common */
    'common.signIn':         'Sign in',
    'common.signOut':        'Sign out',
    'common.getStarted':     'Get started',
    'common.continue':       'Continue',
    'common.cancel':         'Cancel',
    'common.back':           'Back',
    'common.save':           'Save',
    'common.print':          'Print',
    'common.download':       'Download',
    'common.downloadPDF':    'Download PDF',
    'common.search':         'Search…',
    'common.viewAll':        'View all',
    'common.welcome':        'Welcome',
    'common.dashboard':      'Dashboard',
    'common.profile':        'Profile',
    'common.settings':       'Settings',
    'common.help':           'Help',
    'common.notifications':  'Notifications',
    'common.noNotifications':'No new notifications',
    'common.markAllRead':    'Mark all read',
    'common.theme.light':    'Light theme',
    'common.theme.dark':     'Dark theme',
    'common.lang.toggle':    'Français',
    'common.required':       'Required',
    'common.optional':       'Optional',

    /* nav */
    'nav.attendance':        'Attendance',
    'nav.timetable':         'Timetable',
    'nav.results':           'Results',
    'nav.announcements':     'Announcements',
    'nav.idcard':            'ID Card',
    'nav.fees':              'Tuition & Fees',
    'nav.transcript':        'Transcript',
    'nav.learning':          'Mobile Learning',
    'nav.classes':           'My Classes',
    'nav.markAttendance':    'Mark Attendance',
    'nav.enterGrades':       'Enter Grades',
    'nav.users':             'Users',
    'nav.enrolment':         'Enrolment',
    'nav.finance':           'Tuition Tracking',
    'nav.analytics':         'Analytics',

    /* landing */
    'landing.hero.badge':    'Bachelor of Technology · IUGET Bonabéri',
    'landing.hero.title1':   'The unified',
    'landing.hero.title2':   'academic platform',
    'landing.hero.title3':   'for IUGET University.',
    'landing.hero.subtitle': 'SIARM brings attendance, results, timetables, tuition payment and student records into one platform — tailored for IUGET Bonabéri.',
    'landing.hero.motto':    '« Bien choisir c\'est déjà réussir » — IUGET',
    'landing.hero.cta.parent':'Register your child',
    'landing.hero.cta.demo': 'Explore demo',
    'landing.hero.demo':     'Demo credentials → student@iuget.cm / password',

    'landing.stats.students':'Active Students',
    'landing.stats.attendance':'Avg. Attendance',
    'landing.stats.tuition': 'Tuition Collected',
    'landing.stats.year':    '2025/2026',
    'landing.stats.semester':'this semester',
    'landing.stats.recovery':'recovery rate',

    'landing.features.badge':'Capabilities',
    'landing.features.title1':'Every academic workflow,',
    'landing.features.title2':'in one place.',
    'landing.features.subtitle':'From admission to graduation, SIARM covers every touchpoint of an IUGET student\'s journey.',

    'landing.nav.features':  'Features',
    'landing.nav.vision':    'Vision',
    'landing.nav.about':     'About',
    'landing.nav.parent':    'Parent portal',

    'landing.vision.title1': 'One platform.',
    'landing.vision.title2': 'Every role.',
    'landing.vision.subtitle':'Built with a hierarchical, role-based architecture so each user sees exactly what they need — no more, no less.',
    'landing.vision.role.students':   'Students',
    'landing.vision.role.lecturers':  'Lecturers',
    'landing.vision.role.staff':      'Staff',
    'landing.vision.role.leadership': 'Leadership',
    'landing.vision.desc.students':   'Learn, track, grow',
    'landing.vision.desc.lecturers':  'Teach, grade, mentor',
    'landing.vision.desc.staff':      'Operate, support, scale',
    'landing.vision.desc.leadership': 'Decide with data',

    'landing.cta.title':     'Ready to modernise IUGET?',
    'landing.cta.subtitle':  'Start with the demo, explore every module, then connect Firebase to go live.',
    'landing.cta.visit':     'Visit IUGET',

    /* login */
    'login.title':           'Sign in',
    'login.subtitle':        'Continue to your SIARM dashboard.',
    'login.demoMode':        'Demo mode is on',
    'login.demoMode.sub':    'Click a role below to fill in demo credentials.',
    'login.email':           'Email address',
    'login.password':        'Password',
    'login.rememberMe':      'Remember me',
    'login.forgot':          'Forgot password?',
    'login.signing':         'Signing in…',
    'login.newAccount':      'New to SIARM?',
    'login.createAccount':   'Create an account',
    'login.parentCta':       'Are you a parent? Register your child →',
    'login.success':         'Welcome back, {name}!',
    'login.error.empty':     'Please fill in all fields',
    'login.welcomeBack':     'Welcome back to',
    'login.tagline':         'academic excellence.',
    'login.welcomeSub':      'Sign in to access your personalised dashboard — attendance, grades, timetable, and results.',

    /* parent portal */
    'parent.nav.specialties':'Specialties',
    'parent.nav.fees':       'Fees',
    'parent.nav.calendar':   'Calendar',
    'parent.nav.contact':    'Contact',
    'parent.hero.badge':     'Admissions · Academic Year 2026/2027',
    'parent.hero.title1':    'A future-ready',
    'parent.hero.title2':    'Bachelor of Technology',
    'parent.hero.title3':    'for your child.',
    'parent.hero.subtitle':  'IUGET Bonabéri — the Institut Universitaire du Golfe de Guinée — offers three accredited specialties combining theory, practical projects, and direct industry entry. Everything a parent needs to register their child is on this page.',
    'parent.hero.cta':       'Begin registration',
    'parent.hero.explore':   'Explore specialties',
    'parent.hero.minesup':   'MINESUP accredited',
    'parent.hero.students':  '2,800+ students',
    'parent.hero.employment':'92% employment rate',
    'parent.tuitionLabel':   'Annual Tuition',
    'parent.tuitionSub':     'All-inclusive · payable in 2 instalments',
    'parent.specialty.title1':'Three specialties,',
    'parent.specialty.title2':'one future.',
    'parent.specialty.subtitle':'All three programmes share the same evening schedule (Mon–Fri 6 pm – 10 pm and Saturday 8 am – 5 pm), ideal for working students.',
    'parent.specialty.duration':'Duration',
    'parent.specialty.tuition': 'Tuition / yr',
    'parent.specialty.curriculum':'Curriculum highlights',
    'parent.specialty.careers':'Career outlook',
    'parent.specialty.cta':  'Register for {code}',
    'parent.calendar.title': 'Academic calendar',
    'parent.fees.title':     'Fees & payment options',
    'parent.fees.sub':       'Total tuition: {amount} per academic year, all-inclusive. Two instalments accepted (50% at registration, 50% before final exams).',
    'parent.fees.proceed':   'Proceed to registration',
    'parent.contact.campus': 'Bonabéri campus',
    'parent.contact.address':'Carrefour Bonabéri,\nDouala, Cameroon',
    'parent.contact.admissions':'Admissions office',
    'parent.contact.email':  'Email',
    'parent.cta.register':   'Register child',

    /* student dashboard */
    'student.greeting':      'Welcome back, {name}',
    'student.balance':       'Outstanding tuition',
    'student.balanceDue':    'Due {date}',
    'student.idcard':        'Student ID Card',
    'student.idcard.view':   'View & print',
    'student.idcard.valid':  'Valid until Sep 2027',
    'student.stats.attendance':'Avg. Attendance',
    'student.stats.gpa':     'Current GPA',
    'student.stats.courses': 'Active Courses',
    'student.stats.classesToday':'Classes Today',
    'student.attendanceTitle':'Attendance by Course',
    'student.thisSemester':  'This semester',
    'student.todayTitle':    'Today',
    'student.todayEmpty':    'No classes scheduled — enjoy your day!',
    'student.latestAnnouncements':'Latest Announcements',
    'student.myCourses':     'My Courses',

    /* footer */
    'footer.copyright':      '© {year} SIARM · Bachelor project — IUGET Bonabéri',
    'footer.author':         'By James Murdza · Level 3 SWE',
  },

  fr: {
    /* common */
    'common.signIn':         'Se connecter',
    'common.signOut':        'Déconnexion',
    'common.getStarted':     'Commencer',
    'common.continue':       'Continuer',
    'common.cancel':         'Annuler',
    'common.back':           'Retour',
    'common.save':           'Enregistrer',
    'common.print':          'Imprimer',
    'common.download':       'Télécharger',
    'common.downloadPDF':    'Télécharger PDF',
    'common.search':         'Rechercher…',
    'common.viewAll':        'Tout voir',
    'common.welcome':        'Bienvenue',
    'common.dashboard':      'Tableau de bord',
    'common.profile':        'Profil',
    'common.settings':       'Paramètres',
    'common.help':           'Aide',
    'common.notifications':  'Notifications',
    'common.noNotifications':'Aucune nouvelle notification',
    'common.markAllRead':    'Tout marquer comme lu',
    'common.theme.light':    'Thème clair',
    'common.theme.dark':     'Thème sombre',
    'common.lang.toggle':    'English',
    'common.required':       'Requis',
    'common.optional':       'Optionnel',

    /* nav */
    'nav.attendance':        'Présences',
    'nav.timetable':         'Emploi du temps',
    'nav.results':           'Résultats',
    'nav.announcements':     'Annonces',
    'nav.idcard':            'Carte étudiant',
    'nav.fees':              'Scolarité',
    'nav.transcript':        'Relevé de notes',
    'nav.learning':          'Apprentissage mobile',
    'nav.classes':           'Mes classes',
    'nav.markAttendance':    'Faire l\'appel',
    'nav.enterGrades':       'Saisir les notes',
    'nav.users':             'Utilisateurs',
    'nav.enrolment':         'Inscription',
    'nav.finance':           'Suivi scolarité',
    'nav.analytics':         'Analyses',

    /* landing */
    'landing.hero.badge':    'Bachelor of Technology · IUGET Bonabéri',
    'landing.hero.title1':   'La plateforme académique',
    'landing.hero.title2':   'unifiée',
    'landing.hero.title3':   'pour l\'Université IUGET.',
    'landing.hero.subtitle': 'SIARM réunit présences, résultats, emploi du temps, paiement de la scolarité et dossiers étudiants au sein d\'une plateforme unique — pensée pour IUGET Bonabéri.',
    'landing.hero.motto':    '« Bien choisir c\'est déjà réussir » — IUGET',
    'landing.hero.cta.parent':'Inscrire votre enfant',
    'landing.hero.cta.demo': 'Découvrir la démo',
    'landing.hero.demo':     'Identifiants démo → student@iuget.cm / password',

    'landing.stats.students':'Étudiants actifs',
    'landing.stats.attendance':'Présence moyenne',
    'landing.stats.tuition': 'Scolarité encaissée',
    'landing.stats.year':    '2025/2026',
    'landing.stats.semester':'ce semestre',
    'landing.stats.recovery':'taux de recouvrement',

    'landing.features.badge':'Fonctionnalités',
    'landing.features.title1':'Tous les flux académiques,',
    'landing.features.title2':'au même endroit.',
    'landing.features.subtitle':'De l\'admission à la remise de diplôme, SIARM couvre chaque étape du parcours étudiant à IUGET.',

    'landing.nav.features':  'Fonctionnalités',
    'landing.nav.vision':    'Vision',
    'landing.nav.about':     'À propos',
    'landing.nav.parent':    'Espace parent',

    'landing.vision.title1': 'Une plateforme.',
    'landing.vision.title2': 'Tous les rôles.',
    'landing.vision.subtitle':'Construite avec une architecture hiérarchique basée sur les rôles : chaque utilisateur voit exactement ce dont il a besoin.',
    'landing.vision.role.students':   'Étudiants',
    'landing.vision.role.lecturers':  'Enseignants',
    'landing.vision.role.staff':      'Personnel',
    'landing.vision.role.leadership': 'Direction',
    'landing.vision.desc.students':   'Apprendre, suivre, progresser',
    'landing.vision.desc.lecturers':  'Enseigner, noter, accompagner',
    'landing.vision.desc.staff':      'Gérer, soutenir, dimensionner',
    'landing.vision.desc.leadership': 'Décider sur la base des données',

    'landing.cta.title':     'Prêt à moderniser IUGET ?',
    'landing.cta.subtitle':  'Commencez par la démo, explorez chaque module, puis branchez Firebase pour passer en production.',
    'landing.cta.visit':     'Visiter IUGET',

    /* login */
    'login.title':           'Connexion',
    'login.subtitle':        'Accédez à votre tableau de bord SIARM.',
    'login.demoMode':        'Mode démo activé',
    'login.demoMode.sub':    'Cliquez sur un rôle ci-dessous pour pré-remplir les identifiants.',
    'login.email':           'Adresse e-mail',
    'login.password':        'Mot de passe',
    'login.rememberMe':      'Se souvenir de moi',
    'login.forgot':          'Mot de passe oublié ?',
    'login.signing':         'Connexion en cours…',
    'login.newAccount':      'Nouveau sur SIARM ?',
    'login.createAccount':   'Créer un compte',
    'login.parentCta':       'Vous êtes parent ? Inscrivez votre enfant →',
    'login.success':         'Bienvenue, {name} !',
    'login.error.empty':     'Veuillez remplir tous les champs',
    'login.welcomeBack':     'Bienvenue à',
    'login.tagline':         'l\'excellence académique.',
    'login.welcomeSub':      'Connectez-vous pour accéder à votre tableau de bord — présences, notes, emploi du temps et résultats.',

    /* parent portal */
    'parent.nav.specialties':'Spécialités',
    'parent.nav.fees':       'Frais',
    'parent.nav.calendar':   'Calendrier',
    'parent.nav.contact':    'Contact',
    'parent.hero.badge':     'Admissions · Année académique 2026/2027',
    'parent.hero.title1':    'Un',
    'parent.hero.title2':    'Bachelor of Technology',
    'parent.hero.title3':    'tourné vers l\'avenir pour votre enfant.',
    'parent.hero.subtitle':  'IUGET Bonabéri — l\'Institut Universitaire du Golfe de Guinée — propose trois spécialités accréditées alliant théorie, projets pratiques et insertion professionnelle directe. Toutes les informations nécessaires à l\'inscription se trouvent sur cette page.',
    'parent.hero.cta':       'Commencer l\'inscription',
    'parent.hero.explore':   'Découvrir les spécialités',
    'parent.hero.minesup':   'Accrédité MINESUP',
    'parent.hero.students':  '2 800+ étudiants',
    'parent.hero.employment':'92 % d\'insertion',
    'parent.tuitionLabel':   'Scolarité annuelle',
    'parent.tuitionSub':     'Tout inclus · payable en 2 tranches',
    'parent.specialty.title1':'Trois spécialités,',
    'parent.specialty.title2':'un avenir.',
    'parent.specialty.subtitle':'Les trois programmes partagent le même emploi du temps en soirée (Lun–Ven 18 h – 22 h et Samedi 8 h – 17 h), idéal pour les étudiants qui travaillent.',
    'parent.specialty.duration':'Durée',
    'parent.specialty.tuition': 'Scolarité / an',
    'parent.specialty.curriculum':'Programme — points forts',
    'parent.specialty.careers':'Débouchés',
    'parent.specialty.cta':  'Inscrire en {code}',
    'parent.calendar.title': 'Calendrier académique',
    'parent.fees.title':     'Frais & options de paiement',
    'parent.fees.sub':       'Scolarité totale : {amount} par année académique, tout compris. Paiement en 2 tranches accepté (50 % à l\'inscription, 50 % avant les examens finaux).',
    'parent.fees.proceed':   'Passer à l\'inscription',
    'parent.contact.campus': 'Campus de Bonabéri',
    'parent.contact.address':'Carrefour Bonabéri,\nDouala, Cameroun',
    'parent.contact.admissions':'Bureau des admissions',
    'parent.contact.email':  'E-mail',
    'parent.cta.register':   'Inscrire l\'enfant',

    /* student dashboard */
    'student.greeting':      'Bienvenue, {name}',
    'student.balance':       'Scolarité due',
    'student.balanceDue':    'Échéance {date}',
    'student.idcard':        'Carte étudiant',
    'student.idcard.view':   'Voir & imprimer',
    'student.idcard.valid':  'Valable jusqu\'en sept. 2027',
    'student.stats.attendance':'Présence moyenne',
    'student.stats.gpa':     'Moyenne actuelle',
    'student.stats.courses': 'Cours actifs',
    'student.stats.classesToday':'Cours aujourd\'hui',
    'student.attendanceTitle':'Présences par cours',
    'student.thisSemester':  'Ce semestre',
    'student.todayTitle':    'Aujourd\'hui',
    'student.todayEmpty':    'Aucun cours prévu — bonne journée !',
    'student.latestAnnouncements':'Dernières annonces',
    'student.myCourses':     'Mes cours',

    /* footer */
    'footer.copyright':      '© {year} SIARM · Projet de licence — IUGET Bonabéri',
    'footer.author':         'Par James Murdza · Licence 3 Génie Logiciel',
  },
}
