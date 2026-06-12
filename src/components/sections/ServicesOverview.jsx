import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Wrench, Monitor, Globe, Megaphone, Network, Cpu,
  Binary, ArrowRight, Sparkles, ChevronRight
} from 'lucide-react';

const services = [
  {
    icon: GraduationCap,
    title: 'IT Training',
    description: 'Comprehensive digital marketing, China buyer programs, and professional IT certifications.',
    features: ['Digital Marketing', 'China Buyer Program', 'Professional Certifications'],
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    link: '/services#training',
  },
  {
    icon: Wrench,
    title: 'After-Sales Services',
    description: 'Expert support and maintenance after your computer purchase to ensure optimal performance.',
    features: ['Technical Support', 'Hardware Maintenance', 'Software Updates'],
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    link: '/services#after-sales',
  },
  {
    icon: Monitor,
    title: 'Maintenance',
    description: 'Regular system maintenance and optimization to keep your IT infrastructure running smoothly.',
    features: ['Preventive Care', 'Performance Tuning', 'Security Updates'],
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    link: '/services#maintenance',
  },
  {
    icon: Globe,
    title: 'Website Creation',
    description: 'Custom web development solutions tailored to your business needs with modern technologies.',
    features: ['Responsive Design', 'E-commerce', 'CMS Solutions'],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    link: '/services#web',
  },
  {
    icon: Megaphone,
    title: 'Business Advertisement',
    description: 'Strategic digital advertising to boost your brand visibility and reach your target audience.',
    features: ['Social Media Ads', 'SEO Optimization', 'Content Marketing'],
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    link: '/services#advertising',
  },
  {
    icon: Network,
    title: 'Network Configuration',
    description: 'Professional network setup and configuration for businesses of all sizes.',
    features: ['LAN/WAN Setup', 'Security Configuration', 'Cloud Integration'],
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    link: '/services#network',
  },
  {
    icon: Cpu,
    title: 'System Creation',
    description: 'Custom software systems and applications designed to streamline your business operations.',
    features: ['Custom Software', 'Database Design', 'API Development'],
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-500',
    link: '/services#systems',
  },
  {
    icon: Binary,
    title: 'Combinational Logic',
    description: 'Digital logic circuit design and implementation for specialized computing needs.',
    features: ['Circuit Design', 'FPGA Programming', 'Embedded Systems'],
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-500',
    link: '/services#logic',
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-500/40 hover:shadow-glow-emerald',
    iconBg: 'bg-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    hover: 'hover:border-blue-500/40 hover:shadow-glow-blue',
    iconBg: 'bg-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    hover: 'hover:border-purple-500/40',
    iconBg: 'bg-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    hover: 'hover:border-amber-500/40 hover:shadow-glow-amber',
    iconBg: 'bg-amber-500/20',
  },
  pink: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
    hover: 'hover:border-pink-500/40',
    iconBg: 'bg-pink-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    hover: 'hover:border-cyan-500/40',
    iconBg: 'bg-cyan-500/20',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    hover: 'hover:border-indigo-500/40',
    iconBg: 'bg-indigo-500/20',
  },
  teal: {
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    text: 'text-teal-400',
    hover: 'hover:border-teal-500/40',
    iconBg: 'bg-teal-500/20',
  },
};

export default function ServicesOverview() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Our Services</span>
          </div>
          <h2 className="heading-2 mb-4">
            Reliable <span className="gradient-text">Digital Services</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            We offer a comprehensive range of IT services to elevate your business
            and career. From training to deployment, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const colors = colorClasses[service.color];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={service.link}
                  className={`block h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500 ${colors.hover} group`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                        <ChevronRight className={`w-3 h-3 ${colors.text}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <div className={`flex items-center gap-1 text-sm ${colors.text} font-medium`}>
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
          >
            View All Services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
