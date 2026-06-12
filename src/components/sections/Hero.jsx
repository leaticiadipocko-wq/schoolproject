import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, Sparkles, Code, Globe, Shield, Cpu, Database,
  Network, Monitor, Zap, ChevronRight
} from 'lucide-react';

const floatingIcons = [
  { icon: Code, delay: 0, x: 20, y: -30, color: 'text-emerald-400' },
  { icon: Globe, delay: 1, x: -25, y: 20, color: 'text-blue-400' },
  { icon: Shield, delay: 2, x: 30, y: 25, color: 'text-amber-400' },
  { icon: Cpu, delay: 0.5, x: -20, y: -25, color: 'text-purple-400' },
  { icon: Database, delay: 1.5, x: 15, y: 30, color: 'text-pink-400' },
  { icon: Network, delay: 2.5, x: -30, y: -15, color: 'text-cyan-400' },
];

const codeSnippet = `const navicTech = {
  mission: "Elevate Skills",
  services: ["IT Training", "Web Dev", "Networks"],
  location: "Douala, Cameroon",
  impact: "Transforming Careers"
};

async function buildFuture() {
  const skills = await learn(navicTech.services);
  const career = transform(skills);
  return success(career);
}`;

export default function Hero() {
  const [typedCode, setTypedCode] = useState('');
  const [codeIndex, setCodeIndex] = useState(0);

  useEffect(() => {
    if (codeIndex < codeSnippet.length) {
      const timeout = setTimeout(() => {
        setTypedCode(prev => prev + codeSnippet[codeIndex]);
        setCodeIndex(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [codeIndex]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950" />
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Animated Orbs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1, y: [0, -20, 0] }}
          transition={{
            opacity: { delay: item.delay, duration: 1 },
            scale: { delay: item.delay, duration: 1 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
          className={`absolute ${item.color} hidden lg:block`}
          style={{ left: `${15 + index * 15}%`, top: `${20 + (index % 3) * 25}%` }}
        >
          <item.icon className="w-8 h-8" />
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">AI-Powered Digital Solutions</span>
            </motion.div>

            {/* Heading */}
            <h1 className="heading-1 mb-6">
              <span className="text-white">Elevating </span>
              <span className="gradient-text">Skills</span>
              <br />
              <span className="text-white">Delivering </span>
              <span className="gradient-text">Digital Excellence</span>
            </h1>

            {/* Subheading */}
            <p className="body-large mb-8 max-w-xl">
              At Navic Tech, we monetise your skills and give an added value to your career.
              We offer reliable digital services with a relational marketing approach where
              our customers become our promotion agents.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
              >
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300 group"
              >
                <Play className="w-5 h-5" />
                View Our Work
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: '500+', label: 'Students Trained' },
                { value: '100+', label: 'Projects Delivered' },
                { value: '50+', label: 'Partners' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-white font-display">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />

              {/* Code Window */}
              <div className="relative bg-navy-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* Window Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-400 font-mono">navic-tech.js</span>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm leading-relaxed">
                  <pre className="text-gray-300">
                    <code>
                      {typedCode.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-gray-600 w-8 text-right mr-4 select-none">{i + 1}</span>
                          <span>
                            {line.includes('const') && (
                              <>
                                <span className="text-purple-400">const</span>
                                <span className="text-white">{line.split('const')[1]}</span>
                              </>
                            )}
                            {line.includes('async') && (
                              <>
                                <span className="text-purple-400">async</span>
                                <span className="text-blue-400">{line.split('async')[1].split('(')[0]}</span>
                                <span className="text-white">{'(' + line.split('(')[1]}</span>
                              </>
                            )}
                            {line.includes('await') && (
                              <>
                                <span className="text-white">{line.split('await')[0]}</span>
                                <span className="text-purple-400">await</span>
                                <span className="text-white">{line.split('await')[1]}</span>
                              </>
                            )}
                            {line.includes('return') && (
                              <>
                                <span className="text-purple-400">return</span>
                                <span className="text-emerald-400">{line.split('return')[1]}</span>
                              </>
                            )}
                            {!line.includes('const') && !line.includes('async') && !line.includes('await') && !line.includes('return') && (
                              <span className="text-gray-300">{line}</span>
                            )}
                          </span>
                        </div>
                      ))}
                      <span className="cursor-blink text-emerald-400">▌</span>
                    </code>
                  </pre>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-navy-950/50">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Ready
                    </span>
                    <span className="text-xs text-gray-500">JavaScript</span>
                  </div>
                  <span className="text-xs text-gray-500">UTF-8</span>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">AI-Powered</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-medium">Douala, CM</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-400">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-gray-400/30 flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-400"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
