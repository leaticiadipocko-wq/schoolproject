import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube,
  ArrowRight, Heart, ExternalLink
} from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'IT Training', path: '/services#training' },
    { name: 'Web Development', path: '/services#web' },
    { name: 'Network Configuration', path: '/services#network' },
    { name: 'System Creation', path: '/services#systems' },
    { name: 'Business Advertisement', path: '/services#advertising' },
  ],
  company: [
    { name: 'About Us', path: '/#about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Internships', path: '/internships' },
    { name: 'Partnerships', path: '/partnerships' },
    { name: 'Careers', path: '/contact' },
  ],
  resources: [
    { name: 'Blog', path: '#' },
    { name: 'Documentation', path: '#' },
    { name: 'Community', path: '#' },
    { name: 'Support', path: '/contact' },
    { name: 'FAQ', path: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-white/10">
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-16 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Ready to <span className="gradient-text">Transform</span> Your Digital Journey?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join Navic Tech today and unlock your potential with our expert-led training,
              cutting-edge services, and vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/internships"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300"
              >
                View Internships
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-white">
                  Navic<span className="text-emerald-400">Tech</span>
                </span>
                <div className="text-[10px] text-gray-400 -mt-1 tracking-wider">DIGITAL EXCELLENCE</div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              At Navic Tech, we elevate skills and deliver reliable digital services.
              Our platform deals in relational marketing, where our customers become our
              marketing promotion agents.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@navictech.com" className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@navictech.com</span>
              </a>
              <a href="tel:+237XXXXXXXX" className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>+237 XXX XXX XXX</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Douala, Cameroon</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Navic Tech. All rights reserved. Made with{' '}
            <Heart className="w-4 h-4 inline text-red-500" /> in Cameroon
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
