import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap, ClipboardCheck, CalendarClock, Megaphone,
  Wallet, IdCard, TrendingUp, LineChart, FileText, BookOpen,
  UserPlus, ShieldCheck, ArrowRight, Banknote, Languages,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { useLang } from '@/context/LanguageContext'

const features = [
  { icon: ClipboardCheck, title: 'Attendance Tracking',  desc: 'Lecturers mark daily attendance; students view their own records and rates.' },
  { icon: CalendarClock,  title: 'Timetable Portal',     desc: 'Bachelor evening, Level 1 and Level 2 morning sessions on one screen, by specialty.' },
  { icon: FileText,       title: 'Results & Transcripts',desc: 'Lecturers enter grades; students view results and download printable transcripts.' },
  { icon: Megaphone,      title: 'Announcements',        desc: 'Institutional notices that stay available even when offline.' },
  { icon: Wallet,         title: 'Tuition Payment',      desc: 'Pay tuition via MTN MoMo, Orange Money, Visa, or bank transfer with printable receipts.' },
  { icon: Banknote,       title: 'Financial Tracking',   desc: 'Bursary dashboard for tuition collected, outstanding balances, and recovery rate.' },
  { icon: IdCard,         title: 'Student ID Card',      desc: 'Generate and print the official student ID card with photo and verification code.' },
  { icon: UserPlus,       title: 'Automated Enrolment',  desc: 'Register students one-by-one or by CSV upload; matricule, email and accounts created automatically.' },
  { icon: LineChart,      title: 'Reporting Dashboards', desc: 'Operational dashboards for students, lecturers, registrar and leadership.' },
  { icon: BookOpen,       title: 'Mobile Learning',      desc: 'Self-paced course material accessible inside the platform.' },
  { icon: ShieldCheck,    title: 'Role-Based Access',    desc: 'Hierarchical permissions for students, lecturers, staff and administration.' },
  { icon: GraduationCap,  title: 'Academic Recovery',    desc: 'Resit registration, deferral handling and continuous-assessment recovery flows.' },
]

export default function Landing() {
  const { t, lang, toggle } = useLang()
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Nav */}
      <nav className="sticky top-0 z-30 backdrop-blur-lg bg-white/70 border-b border-ink-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Logo size={42} />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-600">
            <a href="#features" className="hover:text-accent-600 transition">{t('landing.nav.features')}</a>
            <a href="#vision"   className="hover:text-accent-600 transition">{t('landing.nav.vision')}</a>
            <a href="#about"    className="hover:text-accent-600 transition">{t('landing.nav.about')}</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-ink-200 hover:bg-ink-50 text-ink-700 text-xs font-bold uppercase" title={t('common.lang.toggle')}>
              <Languages size={14} /> {lang === 'en' ? 'FR' : 'EN'}
            </button>
            <Link to="/parent" className="btn-ghost hidden md:inline-flex">{t('landing.nav.parent')}</Link>
            <Link to="/login"  className="btn-ghost">{t('common.signIn')}</Link>
            <Link to="/register" className="btn-primary">
              {t('common.getStarted')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative gradient-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
              <span className="badge-info mb-6 inline-flex">
                {t('landing.hero.badge')}
              </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-ink-900 leading-[1.05]">
              {t('landing.hero.title1')} <span className="gradient-text">{t('landing.hero.title2')}</span><br />
              {t('landing.hero.title3')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-600 max-w-2xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <p className="mt-3 text-sm italic text-accent-700 font-medium">
              {t('landing.hero.motto')}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/parent" className="btn-primary px-6 py-3 text-base">
                {t('landing.hero.cta.parent')} <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                {t('landing.hero.cta.demo')}
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-500">
              {t('landing.hero.demo')}
            </p>
          </motion.div>

          {/* Hero stats card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="card-hover p-2 bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
              <div className="rounded-xl bg-white p-6 shadow-soft">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: t('landing.stats.students'),   value: '2,847', trend: t('landing.stats.year') },
                    { label: t('landing.stats.attendance'), value: '88%',   trend: t('landing.stats.semester') },
                    { label: t('landing.stats.tuition'),    value: '92%',   trend: t('landing.stats.recovery') },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-ink-50 p-5 text-left">
                      <div className="text-sm text-ink-500">{s.label}</div>
                      <div className="text-3xl font-display font-bold mt-1">{s.value}</div>
                      <div className="text-xs text-accent-600 mt-1 font-medium">{s.trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {/* Features grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-info">{t('landing.features.badge')}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4">
              {t('landing.features.title1')} <span className="gradient-text">{t('landing.features.title2')}</span>
            </h2>
            <p className="text-lg text-ink-600 mt-4">
              {t('landing.features.subtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="card-hover group"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center group-hover:bg-brand-800 group-hover:text-white transition">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-lg mt-4">{title}</h3>
                <p className="text-sm text-ink-600 mt-1.5">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="py-24 bg-gradient-to-br from-brand-900 to-brand-950 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            {t('landing.vision.title1')} <span className="text-accent-400">{t('landing.vision.title2')}</span>
          </h2>
          <p className="mt-5 text-ink-300 max-w-2xl mx-auto text-lg">
            {t('landing.vision.subtitle')}
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { role: t('landing.vision.role.students'),   desc: t('landing.vision.desc.students')   },
              { role: t('landing.vision.role.lecturers'),  desc: t('landing.vision.desc.lecturers')  },
              { role: t('landing.vision.role.staff'),      desc: t('landing.vision.desc.staff')      },
              { role: t('landing.vision.role.leadership'), desc: t('landing.vision.desc.leadership') },
            ].map((r) => (
              <div key={r.role} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                <div className="text-xl font-display font-bold">{r.role}</div>
                <div className="text-sm text-ink-400 mt-1">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold">{t('landing.cta.title')}</h2>
          <p className="mt-4 text-ink-600 text-lg">
            {t('landing.cta.subtitle')}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              {t('common.getStarted')} <ArrowRight size={18} />
            </Link>
            <a href="https://iuget.cm" target="_blank" rel="noreferrer" className="btn-secondary px-6 py-3 text-base">
              {t('landing.cta.visit')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-ink-100 bg-ink-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={32} />
          <div className="text-sm text-ink-500 text-center md:text-right">
            {t('footer.copyright', { year: new Date().getFullYear() })}<br />
            <span className="text-xs">{t('footer.author')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
