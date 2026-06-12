import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Award, Clock, Users, BookOpen, Code, Database,
  Globe, Shield, Cpu, Network, Binary, CheckCircle, ArrowRight,
  Sparkles, Zap, Target, Briefcase, FileText, Star
} from 'lucide-react';

const programs = [
  {
    title: 'Web Development Internship',
    duration: '3 months',
    level: 'Intermediate',
    description: 'Master modern web development with React, Node.js, and cloud technologies. Build real-world projects and deploy them live.',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Git', 'Deployment'],
    certification: 'Certified Web Developer',
    icon: Globe,
    color: 'emerald',
  },
  {
    title: 'Digital Marketing Internship',
    duration: '2 months',
    level: 'Beginner',
    description: 'Learn the art of digital marketing including SEO, social media, content marketing, and analytics. Create campaigns that drive results.',
    skills: ['SEO', 'Social Media', 'Content Marketing', 'Google Analytics', 'Email Marketing'],
    certification: 'Digital Marketing Specialist',
    icon: Target,
    color: 'blue',
  },
  {
    title: 'Network Administration Internship',
    duration: '4 months',
    level: 'Advanced',
    description: 'Gain hands-on experience in network configuration, security, and administration. Work with enterprise-grade equipment and tools.',
    skills: ['TCP/IP', 'Routing & Switching', 'Firewall Config', 'VPN Setup', 'Network Monitoring'],
    certification: 'Network Administration Professional',
    icon: Network,
    color: 'purple',
  },
  {
    title: 'Software Engineering Internship',
    duration: '6 months',
    level: 'Advanced',
    description: 'Comprehensive software engineering program covering architecture, design patterns, testing, and deployment. Work on production-grade applications.',
    skills: ['System Design', 'Design Patterns', 'Testing', 'CI/CD', 'Agile/Scrum'],
    certification: 'Software Engineering Professional',
    icon: Code,
    color: 'amber',
  },
  {
    title: 'Database Administration Internship',
    duration: '3 months',
    level: 'Intermediate',
    description: 'Master database design, optimization, and administration. Work with SQL and NoSQL databases in production environments.',
    skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Database Design', 'Performance Tuning'],
    certification: 'Database Administration Specialist',
    icon: Database,
    color: 'cyan',
  },
  {
    title: 'Cybersecurity Internship',
    duration: '4 months',
    level: 'Advanced',
    description: 'Learn to protect systems and networks from cyber threats. Hands-on experience with security tools, penetration testing, and incident response.',
    skills: ['Security Auditing', 'Penetration Testing', 'Incident Response', 'Security Tools'],
    certification: 'Cybersecurity Professional',
    icon: Shield,
    color: 'red',
  },
];

const examPreps = [
  {
    name: 'CompTIA A+',
    description: 'Foundation-level certification for IT professionals',
    duration: '2 months',
  },
  {
    name: 'CompTIA Network+',
    description: 'Network infrastructure and troubleshooting certification',
    duration: '3 months',
  },
  {
    name: 'Cisco CCNA',
    description: 'Cisco Certified Network Associate certification prep',
    duration: '4 months',
  },
  {
    name: 'AWS Cloud Practitioner',
    description: 'Amazon Web Services foundational cloud certification',
    duration: '2 months',
  },
  {
    name: 'Google IT Support',
    description: 'Google IT Support Professional Certificate preparation',
    duration: '3 months',
  },
  {
    name: 'Microsoft Azure Fundamentals',
    description: 'Microsoft Azure cloud services certification prep',
    duration: '2 months',
  },
];

export default function Internships() {
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
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">Internship Programs</span>
            </div>
            <h1 className="heading-1 mb-4">
              Launch Your <span className="gradient-text">IT Career</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              Gain real-world experience, earn certifications, and prepare for official IT exams
              with our comprehensive internship programs.
            </p>
          </motion.div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Award, title: 'Certification', description: 'Earn recognized certifications upon completion' },
              { icon: BookOpen, title: 'Exam Preparation', description: 'Prepare for official IT certification exams' },
              { icon: Briefcase, title: 'Career Support', description: 'Get placement assistance and career guidance' },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <benefit.icon className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-glow-emerald"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${program.color}-500/20 flex items-center justify-center`}>
                    <program.icon className={`w-6 h-6 text-${program.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {program.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {program.duration}
                      </span>
                      <span className="text-xs text-emerald-400">{program.level}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">
                  {program.description}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Skills You'll Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certification */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">{program.certification}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Exam Preparation Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">Exam Preparation</span>
              </div>
              <h2 className="heading-2 mb-4">
                Official <span className="gradient-text">Exam Programs</span>
              </h2>
              <p className="body-large max-w-2xl mx-auto">
                Prepare for industry-recognized certifications with our structured exam preparation programs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {examPreps.map((exam, index) => (
                <motion.div
                  key={exam.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">{exam.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{exam.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{exam.duration} preparation</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-12">
              <h2 className="heading-2 mb-4">
                Ready to <span className="gradient-text">Get Started</span>?
              </h2>
              <p className="body-large mb-8 max-w-2xl mx-auto">
                Apply now for our internship programs and take the first step towards a successful IT career.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
