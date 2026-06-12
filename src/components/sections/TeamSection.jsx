import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User, Award, Briefcase, Code, Database, Globe, Shield,
  ArrowRight, Linkedin, Twitter, Github, Mail
} from 'lucide-react';

const team = [
  {
    name: 'Ebong Victor',
    role: 'CEO & Founder',
    description: 'Visionary leader with expertise in IT solutions and digital transformation. Creator of innovative systems including a Library Management System and an electronic e-commerce platform.',
    projects: ['Library Management System', 'Electronic E-Commerce Website'],
    skills: ['Full-Stack Development', 'System Architecture', 'Digital Strategy', 'Project Management'],
    image: null,
    initials: 'EV',
    gradient: 'from-emerald-400 to-teal-500',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
      email: 'ebong@navictech.com',
    },
  },
  {
    name: 'Dipocko Leaticia',
    role: 'Personal Assistant',
    description: 'Talented professional and creator of SIARM (Smart Institution Academic Resource Management), a comprehensive code analysis pipeline for educational institutions.',
    projects: ['SIARM - Code Analysis Pipeline', 'Academic Resource Management'],
    skills: ['Code Analysis', 'Pipeline Architecture', 'Data Processing', 'Quality Assurance'],
    image: null,
    initials: 'DL',
    gradient: 'from-purple-400 to-pink-500',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#',
      email: 'dipocko@navictech.com',
    },
  },
];

export default function TeamSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
        <div className="absolute inset-0 cameroon-pattern" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Our Leadership</span>
          </div>
          <h2 className="heading-2 mb-4">
            Meet the <span className="gradient-text">Visionaries</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Our talented team drives innovation and delivers excellence in every project we undertake.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-glow-emerald">
                {/* Header */}
                <div className="flex items-start gap-6 mb-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-3xl font-bold text-white shadow-lg`}>
                      {member.initials}
                    </div>
                    <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${member.gradient} opacity-20 blur-sm group-hover:opacity-40 transition-opacity`} />
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-white font-display">{member.name}</h3>
                    <p className="text-emerald-400 font-medium">{member.role}</p>
                    <div className="flex gap-3 mt-3">
                      <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a href={member.social.twitter} className="text-gray-400 hover:text-sky-400 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a href={member.social.github} className="text-gray-400 hover:text-white transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                      <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-emerald-400 transition-colors">
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {member.description}
                </p>

                {/* Projects */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Notable Projects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.projects.map((project) => (
                      <span
                        key={project}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Core Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs font-medium bg-white/5 text-gray-300 rounded-lg border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300 group"
          >
            View Full Portfolio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
