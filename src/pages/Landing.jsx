import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap, ClipboardCheck, CalendarClock, Megaphone,
  Brain, Bot, TrendingUp, LineChart, FileText, BookOpen,
  Sparkles, ShieldCheck, ArrowRight, Github,
} from 'lucide-react'
import Logo from '@/components/Logo'

const features = [
  { icon: ClipboardCheck, title: 'Attendance Tracking',     desc: 'Real-time roll-call with biometric-style verification & reports.' },
  { icon: CalendarClock,  title: 'Smart Timetable',         desc: 'AI-optimized schedules that minimize conflicts and travel time.' },
  { icon: FileText,       title: 'Results & Transcripts',   desc: 'Generate GPA, certificates, and transcripts on demand.' },
  { icon: Megaphone,      title: 'Offline Announcements',   desc: 'Reach students even without internet via service-worker cache.' },
  { icon: Bot,            title: 'AI Chatbot',              desc: 'Answer university enquiries 24/7 with a Claude-powered agent.' },
  { icon: Brain,          title: 'Decision Support',        desc: 'Data-driven recommendations for academic leadership.' },
  { icon: TrendingUp,     title: 'Predictive Enrollment',   desc: 'Forecast future intake and resource needs with ML models.' },
  { icon: LineChart,      title: 'Real-time Analytics',     desc: 'Live dashboards on staff, student, and academic KPIs.' },
  { icon: BookOpen,       title: 'Mobile Learning',         desc: 'W3Schools-style micro-lessons inside the platform.' },
  { icon: Sparkles,       title: 'Course Recommendations',  desc: 'Personalized electives based on past performance.' },
  { icon: ShieldCheck,    title: 'Role-Based Access',       desc: 'Hierarchical permissions for students, lecturers, staff, admin.' },
  { icon: GraduationCap,  title: 'Automated Recovery',      desc: 'Resit registration, fee tracking, and academic recovery flows.' },
]

const stats = [
  { value: '15+', label: 'Integrated Modules' },
  { value: '4',   label: 'User Roles' },
  { value: 'AI',  label: 'Smart Insights' },
  { value: '∞',   label: 'Possibilities' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Nav */}
      <nav className="sticky top-0 z-30 backdrop-blur-lg bg-white/70 border-b border-ink-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-600">
            <a href="#features" className="hover:text-brand-600 transition">Features</a>
            <a href="#vision" className="hover:text-brand-600 transition">Vision</a>
            <a href="#about" className="hover:text-brand-600 transition">About</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">
              Get started <ArrowRight size={16} />
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
              <Sparkles size={12} /> AI-powered academic platform
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-ink-900 leading-[1.05]">
              The unified <span className="gradient-text">academic OS</span><br />
              for modern universities.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-600 max-w-2xl mx-auto">
              SIARM brings attendance, results, timetables, AI analytics, mobile learning,
              and decision support into one seamless platform — built for private universities.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">
                Create free account <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                Explore demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-500">
              Demo credentials → <span className="font-mono">student@siarm.edu / password</span>
            </p>
          </motion.div>

          {/* Hero illustration */}
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
                    { label: 'Active Students', value: '2,847', trend: '+12%' },
                    { label: 'AI Predictions',   value: '94%',   trend: 'accuracy' },
                    { label: 'Avg. Attendance',  value: '88%',   trend: '+5%' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-ink-50 p-5 text-left">
                      <div className="text-sm text-ink-500">{s.label}</div>
                      <div className="text-3xl font-display font-bold mt-1">{s.value}</div>
                      <div className="text-xs text-green-600 mt-1 font-medium">{s.trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-y border-ink-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-ink-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-info"><Sparkles size={12} /> Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4">
              Every academic workflow, <span className="gradient-text">automated.</span>
            </h2>
            <p className="text-lg text-ink-600 mt-4">
              From the first day of class to graduation, SIARM handles every touchpoint
              with intelligence and grace.
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
                <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
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
      <section id="vision" className="py-24 bg-gradient-to-br from-brand-950 to-ink-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            One platform. <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-accent-300">Every role.</span>
          </h2>
          <p className="mt-5 text-ink-300 max-w-2xl mx-auto text-lg">
            Built with a hierarchical, role-based architecture so each user sees exactly
            what they need — no more, no less.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { role: 'Students',    desc: 'Learn, track, grow' },
              { role: 'Lecturers',   desc: 'Teach, grade, mentor' },
              { role: 'Staff',       desc: 'Operate, support, scale' },
              { role: 'Leadership',  desc: 'Decide with data' },
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
          <h2 className="text-4xl font-display font-bold">Ready to modernize your institution?</h2>
          <p className="mt-4 text-ink-600 text-lg">
            Start with the demo, explore every module, then connect Firebase to go live.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Get started free <ArrowRight size={18} />
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary px-6 py-3 text-base">
              <Github size={18} /> View source
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <div className="text-sm text-ink-500">
            © {new Date().getFullYear()} SIARM. Bachelor project — IUGET Bonaberi.
          </div>
        </div>
      </footer>
    </div>
  )
}
