import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Wrench, Monitor, Globe, Megaphone, Network, Cpu,
  Binary, ArrowRight, CheckCircle, ChevronRight, Sparkles, Zap,
  Shield, Users, Clock, Award, Target, Code, Database, Server
} from 'lucide-react';

const services = [
  {
    id: 'training',
    icon: GraduationCap,
    title: 'IT Training',
    subtitle: 'Digital Marketing & Professional Certifications',
    description: 'Comprehensive training programs designed to equip you with in-demand IT skills. From digital marketing to specialized buyer programs, we prepare you for success in the digital economy.',
    features: [
      'Digital Marketing mastery (SEO, SEM, Social Media)',
      'China Buyer Program for international trade',
      'Professional IT certifications',
      'Hands-on practical workshops',
      'Industry-recognized credentials',
      'Career placement assistance',
    ],
    technologies: ['Google Analytics', 'Facebook Ads', 'SEO Tools', 'Email Marketing', 'Content Strategy'],
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'after-sales',
    icon: Wrench,
    title: 'After-Sales Services',
    subtitle: 'Post-Purchase Support & Maintenance',
    description: 'Expert technical support and maintenance services after your computer purchase. We ensure your systems run optimally with our comprehensive after-sales care.',
    features: [
      '24/7 technical support hotline',
      'Hardware troubleshooting and repair',
      'Software installation and updates',
      'System optimization and cleanup',
      'Warranty claim assistance',
      'Remote support services',
    ],
    technologies: ['Windows', 'macOS', 'Linux', 'Hardware Diagnostics', 'Remote Tools'],
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'maintenance',
    icon: Monitor,
    title: 'Maintenance',
    subtitle: 'Preventive & Corrective Care',
    description: 'Regular system maintenance and optimization services to keep your IT infrastructure running at peak performance. Prevent issues before they impact your business.',
    features: [
      'Scheduled preventive maintenance',
      'Performance monitoring and tuning',
      'Security patch management',
      'Backup and disaster recovery',
      'Hardware health checks',
      'Network performance optimization',
    ],
    technologies: ['Monitoring Tools', 'Antivirus', 'Backup Solutions', 'Performance Analyzers'],
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Website Creation',
    subtitle: 'Custom Web Development Solutions',
    description: 'Professional web development services tailored to your business needs. We create responsive, modern websites that drive engagement and conversions.',
    features: [
      'Custom responsive web design',
      'E-commerce solutions',
      'Content Management Systems',
      'Progressive Web Applications',
      'API integration and development',
      'SEO-friendly architecture',
    ],
    technologies: ['React', 'Node.js', 'WordPress', 'Shopify', 'AWS', 'Firebase'],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'advertising',
    icon: Megaphone,
    title: 'Business Advertisement',
    subtitle: 'Strategic Digital Marketing',
    description: 'Strategic digital advertising services to boost your brand visibility and reach your target audience effectively. Data-driven campaigns for maximum ROI.',
    features: [
      'Social media advertising campaigns',
      'Search engine marketing (SEM)',
      'Content marketing strategy',
      'Brand identity development',
      'Analytics and performance tracking',
      'A/B testing and optimization',
    ],
    technologies: ['Google Ads', 'Facebook Ads', 'Instagram', 'LinkedIn', 'Analytics'],
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'network',
    icon: Network,
    title: 'Network Configuration',
    subtitle: 'Professional Network Solutions',
    description: 'Professional network setup and configuration services for businesses of all sizes. Secure, reliable, and scalable network infrastructure.',
    features: [
      'LAN/WAN design and implementation',
      'Wireless network setup',
      'Firewall and security configuration',
      'VPN setup for remote access',
      'Cloud network integration',
      'Network monitoring and management',
    ],
    technologies: ['Cisco', 'Ubiquiti', 'pfSense', 'AWS VPC', 'Azure Networking'],
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'systems',
    icon: Cpu,
    title: 'System Creation',
    subtitle: 'Custom Software Development',
    description: 'Custom software systems and applications designed to streamline your business operations. From concept to deployment, we build solutions that work.',
    features: [
      'Custom software development',
      'Database design and optimization',
      'API development and integration',
      'Desktop application development',
      'Mobile app development',
      'System integration services',
    ],
    technologies: ['Python', 'Java', 'C#', 'SQL', 'REST APIs', 'Microservices'],
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'logic',
    icon: Binary,
    title: 'Combinational Logic Circuits',
    subtitle: 'Digital Circuit Design',
    description: 'Specialized digital logic circuit design and implementation for computing and embedded systems. Expert solutions for complex digital challenges.',
    features: [
      'Combinational circuit design',
      'FPGA programming and testing',
      'Embedded systems development',
      'Digital signal processing',
      'Circuit simulation and verification',
      'Hardware prototyping',
    ],
    technologies: ['VHDL', 'Verilog', 'Xilinx', 'Arduino', 'Raspberry Pi', 'MATLAB'],
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-500',
  },
];

export default function Services() {
  const [activeService, setActiveService] = useState('training');
  const currentService = services.find(s => s.id === activeService);

  return (
    <div className="min-h-screen bg-navy-950 pt-24">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
          <div className="absolute inset-0 mesh-gradient" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Our Services</span>
            </div>
            <h1 className="heading-1 mb-4">
              Reliable <span className="gradient-text">Digital Services</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              We offer a comprehensive range of IT services to elevate your business
              and career. From training to deployment, we've got you covered.
            </p>
          </motion.div>

          {/* Service Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                  activeService === service.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 shadow-glow-emerald'
                    : 'bg-white/5 border-white/10 hover:border-emerald-500/20'
                }`}
              >
                <service.icon className={`w-6 h-6 ${activeService === service.id ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium text-center ${activeService === service.id ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {service.title}
                </span>
              </button>
            ))}
          </div>

          {/* Service Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left: Service Info */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentService.gradient} flex items-center justify-center`}>
                      <currentService.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white font-display">{currentService.title}</h2>
                      <p className="text-emerald-400">{currentService.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {currentService.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">What's Included</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentService.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Technologies We Use</h3>
                    <div className="flex flex-wrap gap-3">
                      {currentService.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 text-sm font-mono bg-white/5 text-gray-300 rounded-lg border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 group"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>

                {/* Right: Service Visual */}
                <div className="relative">
                  <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
                    {/* Code Preview */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-navy-900/50">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{currentService.id}.service.js</span>
                    </div>

                    <div className="p-6 font-mono text-sm">
                      <div className="text-gray-500 mb-4">// {currentService.title} Service</div>
                      <div>
                        <span className="text-purple-400">class</span>
                        <span className="text-blue-400"> {currentService.title.replace(/\s+/g, '')}Service</span>
                        <span className="text-white"> {'{'}</span>
                      </div>
                      <div className="pl-4 mt-2">
                        <span className="text-purple-400">constructor</span>
                        <span className="text-white">() {'{'}</span>
                      </div>
                      <div className="pl-8">
                        <span className="text-amber-400">this</span>
                        <span className="text-white">.name = </span>
                        <span className="text-emerald-400">'{currentService.title}'</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="pl-8">
                        <span className="text-amber-400">this</span>
                        <span className="text-white">.features = [</span>
                      </div>
                      {currentService.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="pl-12">
                          <span className="text-emerald-400">'{feature}'</span>
                          <span className="text-white">{index < 2 ? ',' : ''}</span>
                        </div>
                      ))}
                      <div className="pl-8">
                        <span className="text-white">];</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-white">{'}'}</span>
                      </div>
                      <div className="pl-4 mt-2">
                        <span className="text-purple-400">async</span>
                        <span className="text-blue-400"> deliver</span>
                        <span className="text-white">() {'{'}</span>
                      </div>
                      <div className="pl-8">
                        <span className="text-purple-400">return</span>
                        <span className="text-emerald-400"> 'Excellence delivered!'</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-white">{'}'}</span>
                      </div>
                      <div>
                        <span className="text-white">{'}'}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-6 border-t border-white/10">
                      {[
                        { icon: Zap, label: 'Fast', value: 'Quick' },
                        { icon: Shield, label: 'Secure', value: 'Protected' },
                        { icon: Award, label: 'Quality', value: 'Premium' },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                          <div className="text-xs text-gray-500">{stat.label}</div>
                          <div className="text-sm text-white">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">Pro Service</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-12"
          >
            <h2 className="heading-2 mb-4">
              Need a <span className="gradient-text">Custom Solution</span>?
            </h2>
            <p className="body-large mb-8 max-w-2xl mx-auto">
              We specialize in creating tailored IT solutions for unique business challenges.
              Let's discuss how we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
              >
                Contact Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300"
              >
                Join Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
