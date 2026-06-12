import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Award, Briefcase, Code, Database, Globe, Shield,
  ArrowRight, ExternalLink, Github, Layers, Monitor, Cpu,
  BookOpen, ShoppingCart, BarChart3, FileCode, Zap
} from 'lucide-react';

const teamMembers = [
  {
    id: 'ceo',
    name: 'Ebong Victor',
    role: 'CEO & Founder',
    description: 'Visionary leader with expertise in IT solutions and digital transformation. Passionate about elevating skills and delivering digital excellence across Cameroon and beyond.',
    initials: 'EV',
    gradient: 'from-emerald-400 to-teal-500',
    skills: [
      'Full-Stack Development',
      'System Architecture',
      'Digital Strategy',
      'Project Management',
      'E-Commerce Solutions',
      'Database Design',
      'UI/UX Design',
      'Cloud Computing',
    ],
    projects: [
      {
        title: 'Library Management System',
        description: 'A comprehensive library management solution featuring book cataloging, member management, borrowing tracking, and automated notifications. Built with modern web technologies for optimal performance.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        features: ['Book Cataloging', 'Member Management', 'Borrowing System', 'Automated Notifications', 'Report Generation'],
        icon: BookOpen,
        color: 'emerald',
      },
      {
        title: 'Electronic E-Commerce Website',
        description: 'A full-featured e-commerce platform specializing in IT equipment sales. Features include product browsing, secure checkout, order tracking, and inventory management.',
        technologies: ['React', 'Firebase', 'Stripe', 'Tailwind CSS'],
        features: ['Product Catalog', 'Secure Checkout', 'Order Tracking', 'Inventory Management', 'Customer Reviews'],
        icon: ShoppingCart,
        color: 'blue',
      },
    ],
    achievements: [
      'Founded Navic Tech and grew it into a leading IT services provider',
      'Trained 500+ students in various IT disciplines',
      'Delivered 100+ successful projects',
      'Built partnerships with 50+ organizations',
    ],
  },
  {
    id: 'pa',
    name: 'Dipocko Leaticia',
    role: 'Personal Assistant',
    description: 'Talented professional and creator of SIARM (Smart Institution Academic Resource Management), a comprehensive code analysis pipeline for educational institutions.',
    initials: 'DL',
    gradient: 'from-purple-400 to-pink-500',
    skills: [
      'Code Analysis',
      'Pipeline Architecture',
      'Data Processing',
      'Quality Assurance',
      'Academic Management',
      'System Integration',
      'Documentation',
      'Testing & QA',
    ],
    projects: [
      {
        title: 'SIARM - Code Analysis Pipeline',
        description: 'Smart Institution Academic Resource Management - A sophisticated code analysis pipeline that helps educational institutions manage academic resources, analyze code quality, and streamline administrative processes.',
        technologies: ['Python', 'Docker', 'PostgreSQL', 'FastAPI'],
        features: ['Code Quality Analysis', 'Resource Management', 'Student Tracking', 'Performance Analytics', 'Automated Reporting'],
        icon: FileCode,
        color: 'purple',
      },
      {
        title: 'Academic Dashboard',
        description: 'An interactive dashboard for monitoring academic performance, tracking student progress, and generating comprehensive reports for institutional decision-making.',
        technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
        features: ['Performance Metrics', 'Student Analytics', 'Report Generation', 'Data Visualization', 'Export Tools'],
        icon: BarChart3,
        color: 'pink',
      },
    ],
    achievements: [
      'Created SIARM - a groundbreaking academic management system',
      'Streamlined code analysis processes for institutions',
      'Improved academic resource management efficiency by 60%',
      'Mentored junior developers in pipeline architecture',
    ],
  },
];

export default function Portfolio() {
  const [activeMember, setActiveMember] = useState('ceo');
  const [activeProject, setActiveProject] = useState(0);

  const currentMember = teamMembers.find(m => m.id === activeMember);

  return (
    <div className="min-h-screen bg-navy-950 pt-24">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
          <div className="absolute inset-0 cameroon-pattern" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Our Portfolio</span>
            </div>
            <h1 className="heading-1 mb-4">
              Meet Our <span className="gradient-text">Talented Team</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              Discover the innovative projects and expertise that drive Navic Tech's success.
              Our team members are creators, innovators, and problem-solvers.
            </p>
          </motion.div>

          {/* Team Member Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  setActiveMember(member.id);
                  setActiveProject(0);
                }}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                  activeMember === member.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 shadow-glow-emerald'
                    : 'bg-white/5 border-white/10 hover:border-emerald-500/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-lg font-bold text-white`}>
                  {member.initials}
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${activeMember === member.id ? 'text-emerald-400' : 'text-white'}`}>
                    {member.name}
                  </div>
                  <div className="text-xs text-gray-400">{member.role}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Member Profile */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMember}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="sticky top-28 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                    {/* Avatar */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${currentMember.gradient} flex items-center justify-center text-5xl font-bold text-white shadow-lg`}>
                        {currentMember.initials}
                      </div>
                      <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${currentMember.gradient} opacity-20 blur-sm`} />
                    </div>

                    {/* Info */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-white font-display">{currentMember.name}</h2>
                      <p className="text-emerald-400">{currentMember.role}</p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {currentMember.description}
                    </p>

                    {/* Skills */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentMember.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 text-xs font-medium bg-white/5 text-gray-300 rounded-lg border border-white/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Key Achievements
                      </h3>
                      <ul className="space-y-2">
                        {currentMember.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="lg:col-span-2">
                  {/* Project Tabs */}
                  <div className="flex gap-4 mb-6">
                    {currentMember.projects.map((project, index) => (
                      <button
                        key={project.title}
                        onClick={() => setActiveProject(index)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                          activeProject === index
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-white/5 border-white/10 hover:border-emerald-500/20'
                        }`}
                      >
                        <project.icon className={`w-5 h-5 ${activeProject === index ? 'text-emerald-400' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${activeProject === index ? 'text-emerald-400' : 'text-gray-300'}`}>
                          {project.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Project Details */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeMember}-${activeProject}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
                    >
                      {/* Project Header */}
                      <div className="p-8 border-b border-white/10">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-xl bg-${currentMember.projects[activeProject].color}-500/20 flex items-center justify-center`}>
                            {(() => {
                              const Icon = currentMember.projects[activeProject].icon;
                              return <Icon className={`w-8 h-8 text-${currentMember.projects[activeProject].color}-400`} />;
                            })()}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white font-display">
                              {currentMember.projects[activeProject].title}
                            </h3>
                            <p className="text-gray-400 mt-2">
                              {currentMember.projects[activeProject].description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="p-8 border-b border-white/10">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {currentMember.projects[activeProject].technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 text-sm font-mono bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="p-8">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Key Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {currentMember.projects[activeProject].features.map((feature, index) => (
                            <div
                              key={feature}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-emerald-400">{index + 1}</span>
                              </div>
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Project Preview Placeholder */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Want to see more?</h4>
                        <p className="text-gray-400 text-sm">
                          Contact us to discuss custom projects and solutions for your needs.
                        </p>
                      </div>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 group"
                      >
                        Get in Touch
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
