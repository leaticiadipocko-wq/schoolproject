import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap, Calendar, Clock, Wallet, ArrowRight, CheckCircle2,
  Globe, Briefcase, Building2, Phone, Mail, MapPin, ShieldCheck,
  BookOpen, Award, Users, Languages,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { useLang } from '@/context/LanguageContext'
import LangToggle from '@/components/LangToggle'

// IUGET — Bachelor of Technology specialties
// Real Cameroonian higher-education tuition order of magnitude
const SPECIALTIES = [
  {
    id: 'SWE',
    title: 'Software Engineering',
    short: 'SWE',
    accent: 'from-brand-700 to-brand-900',
    pill:   'bg-brand-100 text-brand-800',
    duration: '3 years · 6 semesters',
    intake:   '60 students / cohort',
    tuition:  500_000,
    tagline:  'Build the apps and platforms shaping Africa\'s digital future.',
    careers:  ['Full-stack Developer', 'Mobile Engineer', 'DevOps Engineer', 'Cloud Architect', 'Product Engineer'],
    curriculum: [
      'Object Oriented Programming · Compiler Design',
      'Mobile Development · Web Engineering',
      'Database Systems · Embedded Systems',
      'Software Architecture · Research Methodology',
      'Cloud & DevOps · Design Project',
    ],
    icon: BookOpen,
  },
  {
    id: 'CNSM',
    title: 'Computer Networks & Multimedia Systems',
    short: 'CNSM',
    accent: 'from-accent-600 to-accent-800',
    pill:   'bg-accent-100 text-accent-700',
    duration: '3 years · 6 semesters',
    intake:   '45 students / cohort',
    tuition:  500_000,
    tagline:  'Master networks, telecoms and multimedia — keep Cameroon connected.',
    careers:  ['Network Engineer', 'Cybersecurity Analyst', 'Multimedia Engineer', 'Cloud Network Admin', 'Telecom Specialist'],
    curriculum: [
      'Network Administration · Telecommunications',
      'Cybersecurity & Cryptography',
      'Multimedia Systems & Digital Signal Processing',
      'Linux Programming · Research Topic',
      'Wireless & Mobile Networks · Final Project',
    ],
    icon: Globe,
  },
  {
    id: 'BST',
    title: 'Business Strategy & Technology',
    short: 'BST',
    accent: 'from-amber-600 to-amber-800',
    pill:   'bg-amber-100 text-amber-800',
    duration: '3 years · 6 semesters',
    intake:   '40 students / cohort',
    tuition:  500_000,
    tagline:  'Where engineering meets entrepreneurship — lead tomorrow\'s ventures.',
    careers:  ['Business Analyst', 'Project Manager', 'Consultant', 'Geotechnical Engineer', 'Entrepreneur'],
    curriculum: [
      'Business Analysis · Strategic Management',
      'Geotechnical Engineering · Civil Foundations',
      'Financial Accounting · Marketing',
      'Project Management · Research Methodology',
      'Entrepreneurship · Capstone Project',
    ],
    icon: Briefcase,
  },
]

const CALENDAR = [
  { label: 'Applications open',    date: '01 Jul 2026' },
  { label: 'Entrance assessment',  date: '20 Aug 2026' },
  { label: 'Results published',    date: '05 Sep 2026' },
  { label: 'Tuition deadline',     date: '15 Sep 2026' },
  { label: 'Academic year begins', date: '01 Oct 2026' },
]

const FEE_BREAKDOWN = [
  { item: 'Tuition',          value: 450_000 },
  { item: 'Registration',     value:  25_000 },
  { item: 'Examination fee',  value:  15_000 },
  { item: 'Library fee',      value:   8_000 },
  { item: 'Student union',    value:   2_000 },
]
const TOTAL_FEES = FEE_BREAKDOWN.reduce((s, f) => s + f.value, 0)

export default function ParentPortal() {
  const { t, lang, toggle } = useLang()
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top nav */}
      <nav className="sticky top-0 z-30 backdrop-blur-lg bg-white/80 border-b border-ink-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Link to="/"><Logo size={42} /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-600">
            <a href="#specialties" className="hover:text-accent-600 transition">{t('parent.nav.specialties')}</a>
            <a href="#fees"        className="hover:text-accent-600 transition">{t('parent.nav.fees')}</a>
            <a href="#calendar"    className="hover:text-accent-600 transition">{t('parent.nav.calendar')}</a>
            <a href="#contact"     className="hover:text-accent-600 transition">{t('parent.nav.contact')}</a>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle compact />
            <Link to="/login"            className="btn-ghost hidden sm:inline-flex">{t('common.signIn')}</Link>
            <Link to="/parent/register"  className="btn-primary">
              {t('parent.cta.register')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — flyer style */}
      <section className="relative gradient-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge-info mb-5 inline-flex">
              <Calendar size={12} /> {t('parent.hero.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-ink-900 leading-[1.05]">
              {t('parent.hero.title1')} <span className="gradient-text">{t('parent.hero.title2')}</span><br />
              {t('parent.hero.title3')}
            </h1>
            <p className="mt-5 text-lg text-ink-600 max-w-xl">
              {t('parent.hero.subtitle')}
            </p>
            <p className="mt-3 text-sm italic text-accent-700 font-medium">
              « Bien choisir c'est déjà réussir » — IUGET
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/parent/register" className="btn-primary px-6 py-3 text-base">
                {t('parent.hero.cta')} <ArrowRight size={18} />
              </Link>
              <a href="#specialties" className="btn-secondary px-6 py-3 text-base">
                {t('parent.hero.explore')}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> {t('parent.hero.minesup')}</span>
              <span className="inline-flex items-center gap-1.5"><Users size={14} className="text-brand-600" /> {t('parent.hero.students')}</span>
              <span className="inline-flex items-center gap-1.5"><Award size={14} className="text-amber-600" /> {t('parent.hero.employment')}</span>
            </div>
          </motion.div>

          {/* Hero side-card — admission snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-accent-400/30 to-amber-400/30 blur-2xl rounded-3xl" />
            <div className="relative bg-white rounded-3xl shadow-soft border border-ink-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-ink-500 uppercase tracking-wider">{t('parent.tuitionLabel')}</div>
                  <div className="text-4xl font-display font-bold text-ink-900 mt-1">{TOTAL_FEES.toLocaleString('en-US')}<span className="text-lg text-ink-500"> FCFA</span></div>
                  <div className="text-sm text-ink-500">{t('parent.tuitionSub')}</div>
                </div>
                <div className="badge-success">3-year programme</div>
              </div>
              <div className="mt-5 space-y-2.5">
                {FEE_BREAKDOWN.map((f) => (
                  <div key={f.item} className="flex items-center justify-between text-sm">
                    <span className="text-ink-600">{f.item}</span>
                    <span className="font-medium">{f.value.toLocaleString('en-US')} FCFA</span>
                  </div>
                ))}
                <div className="border-t border-ink-200 mt-3 pt-3 flex items-center justify-between font-bold">
                  <span>TOTAL / year</span>
                  <span className="text-brand-800">{TOTAL_FEES.toLocaleString('en-US')} FCFA</span>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div className="text-emerald-900">
                    Pay online by <span className="font-semibold">MTN MoMo</span>, <span className="font-semibold">Orange Money</span>, <span className="font-semibold">PayPal</span>, <span className="font-semibold">Visa</span> or <span className="font-semibold">bank transfer</span>.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specialties */}
      <section id="specialties" className="py-20 bg-white border-y border-ink-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-info">Bachelor of Technology</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4">
              {t('parent.specialty.title1')} <span className="gradient-text">{t('parent.specialty.title2')}</span>
            </h2>
            <p className="text-lg text-ink-600 mt-3">
              {t('parent.specialty.subtitle')}
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {SPECIALTIES.map((s) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden flex flex-col"
                >
                  <div className={`bg-gradient-to-br ${s.accent} text-white p-6`}>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 bg-white/15 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Icon size={14} /> {s.short}
                      </span>
                      <span className="text-xs text-white/70">{s.intake}</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold mt-4">{s.title}</h3>
                    <p className="text-sm text-white/80 mt-2 leading-relaxed">{s.tagline}</p>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-ink-50 p-3">
                        <div className="flex items-center gap-1.5 text-ink-500"><Clock size={12} /> {t('parent.specialty.duration')}</div>
                        <div className="font-semibold text-sm mt-0.5">{s.duration}</div>
                      </div>
                      <div className="rounded-xl bg-ink-50 p-3">
                        <div className="flex items-center gap-1.5 text-ink-500"><Wallet size={12} /> {t('parent.specialty.tuition')}</div>
                        <div className="font-semibold text-sm mt-0.5">{s.tuition.toLocaleString('en-US')} FCFA</div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{t('parent.specialty.curriculum')}</div>
                      <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                        {s.curriculum.map((c) => (
                          <li key={c} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5">
                      <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{t('parent.specialty.careers')}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.careers.map((c) => (
                          <span key={c} className={`${s.pill} text-[11px] px-2 py-0.5 rounded-full font-medium`}>{c}</span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/parent/register?specialty=${s.id}`}
                      className="mt-auto pt-5 inline-flex items-center justify-center gap-2 font-semibold text-brand-700 hover:text-brand-900"
                    >
                      {t('parent.specialty.cta', { code: s.short })} <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Calendar + Fees side by side */}
      <section id="calendar" className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Calendar size={20} className="text-brand-700" />
              <h2 className="text-2xl font-display font-bold">{t('parent.calendar.title')}</h2>
            </div>
            <div className="space-y-3">
              {CALENDAR.map((c, i) => (
                <div key={c.label} className="flex items-center gap-4 p-3 rounded-xl bg-ink-50 border border-ink-100">
                  <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{c.label}</div>
                    <div className="text-xs text-ink-500 mt-0.5">{c.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="fees" className="card">
            <div className="flex items-center gap-2 mb-5">
              <Wallet size={20} className="text-emerald-700" />
              <h2 className="text-2xl font-display font-bold">{t('parent.fees.title')}</h2>
            </div>
            <p className="text-sm text-ink-600 mb-4">
              {t('parent.fees.sub', { amount: `${TOTAL_FEES.toLocaleString('en-US')} FCFA` })}
            </p>
            <div className="space-y-2.5">
              {[
                { name: 'MTN Mobile Money',   sub: 'Pay from your phone',   code: '*126#'   },
                { name: 'Orange Money',       sub: 'Pay from your phone',   code: '#150*4#' },
                { name: 'PayPal',             sub: 'International transfers',code: 'paypal.com/iuget' },
                { name: 'Visa / Mastercard',  sub: 'Credit or debit card',  code: 'secure 3-D' },
                { name: 'Bank transfer',      sub: 'Afriland · UBA · Ecobank · BICEC · SGBC', code: 'IBAN: CM21' },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between p-3 rounded-xl border border-ink-100 hover:bg-ink-50 transition">
                  <div>
                    <div className="font-medium text-sm">{m.name}</div>
                    <div className="text-xs text-ink-500">{m.sub}</div>
                  </div>
                  <span className="font-mono text-xs text-ink-500">{m.code}</span>
                </div>
              ))}
            </div>
            <Link to="/parent/register" className="btn-primary w-full mt-5 py-3">
              {t('parent.fees.proceed')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact + footer */}
      <section id="contact" className="py-16 bg-gradient-to-br from-brand-900 to-brand-950 text-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Building2 size={22} className="text-accent-400 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">{t('parent.contact.campus')}</div>
              <div className="text-sm text-white/70 mt-0.5 whitespace-pre-line">{t('parent.contact.address')}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={22} className="text-accent-400 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">{t('parent.contact.admissions')}</div>
              <div className="text-sm text-white/70 mt-0.5">+237 233 39 12 12<br />+237 690 00 00 00</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={22} className="text-accent-400 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">{t('parent.contact.email')}</div>
              <div className="text-sm text-white/70 mt-0.5">admissions@iuget.cm<br />bursary@iuget.cm</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-ink-100 bg-ink-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo size={32} />
          <div className="text-xs text-ink-500 text-center md:text-right">
            © {new Date().getFullYear()} IUGET Bonabéri · SIARM Parent Portal<br />
            <span className="text-[10px]">N°30/IUGET/C-DIR/P-SP — Admissions 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
