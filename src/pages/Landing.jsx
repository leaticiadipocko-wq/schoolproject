import Hero from '../components/sections/Hero';
import ServicesOverview from '../components/sections/ServicesOverview';
import TeamSection from '../components/sections/TeamSection';
import AIInteractive from '../components/sections/AIInteractive';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Globe, Shield, Zap, Users, Award, Code,
  Network, Monitor, Cpu, Binary, GraduationCap, Wrench, Megaphone,
  ShoppingCart, Star, HardDrive, MemoryStick
} from 'lucide-react';

const partners = [
  'TechCorp', 'DigitalWave', 'InnovateCam', 'AfriTech', 'DataFlow', 'NetSolutions'
];

const technologies = [
  { name: 'React', icon: '⚛️' },
  { name: 'Python', icon: '🐍' },
  { name: 'Node.js', icon: '💚' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Docker', icon: '🐳' },
  { name: 'AI/ML', icon: '🤖' },
  { name: 'Cybersecurity', icon: '🔒' },
  { name: 'Blockchain', icon: '⛓️' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Hero />

      {/* Trusted By Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm text-gray-500 uppercase tracking-wider">Trusted by leading organizations</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-xl font-bold text-gray-600 hover:text-emerald-400 transition-colors cursor-default font-display"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServicesOverview />

      {/* Featured Computers Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Computer Sales</span>
            </div>
            <h2 className="heading-2 mb-4">
              Premium <span className="gradient-text">Computers</span> & Equipment
            </h2>
            <p className="body-large max-w-2xl mx-auto">
              Browse our selection of high-quality laptops, desktops, and accessories.
              All products come with warranty and after-sales support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'HP ProBook 450 G9',
                specs: 'i5-1235U • 8GB • 512GB SSD',
                price: '450,000 FCFA',
                rating: 4.5,
                badge: 'Best Seller',
              },
              {
                name: 'Dell Latitude 5530',
                specs: 'i7-1265U • 16GB • 512GB SSD',
                price: '580,000 FCFA',
                rating: 4.7,
                badge: 'Premium',
              },
              {
                name: 'Lenovo ThinkPad E14',
                specs: 'Ryzen 5 5625U • 8GB • 256GB SSD',
                price: '420,000 FCFA',
                rating: 4.6,
                badge: 'Popular',
              },
            ].map((computer, index) => (
              <motion.div
                key={computer.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-glow-emerald overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center relative">
                  <Monitor className="w-20 h-20 text-emerald-400/30" />
                  {computer.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-full">
                        {computer.badge}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-500">{computer.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {computer.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{computer.specs}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-400">{computer.price}</span>
                    <Link
                      to="/shop"
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg group"
            >
              Browse All Computers
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <AIInteractive />
      <TeamSection />
      <WhyChooseUs />

      {/* Technologies Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/30 to-navy-950" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Technologies We Use</span>
            </div>
            <h2 className="heading-2 mb-4">
              Fun with <span className="gradient-text">Programming Languages</span>
            </h2>
            <p className="body-large max-w-2xl mx-auto">
              We work with the latest technologies and programming languages to deliver
              cutting-edge solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-glow-emerald text-center cursor-default"
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <div className="text-sm font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20" />
          <div className="absolute inset-0 cameroon-pattern" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 mb-6">
              Ready to Start Your <span className="gradient-text">Digital Journey</span>?
            </h2>
            <p className="body-large mb-8 max-w-2xl mx-auto">
              Whether you're looking to upskill, build a project, or grow your business,
              Navic Tech is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
              >
                Contact Us Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Apply for Internship
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
