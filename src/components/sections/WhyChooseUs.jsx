import { motion } from 'framer-motion';
import {
  Award, Users, Clock, Shield, TrendingUp, Heart,
  CheckCircle, ArrowRight, Sparkles, Zap, Globe, Target
} from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Expert-Led Training',
    description: 'Learn from industry professionals with years of real-world experience in IT and digital solutions.',
    stat: '500+',
    statLabel: 'Graduates',
  },
  {
    icon: Users,
    title: 'Community Focused',
    description: 'Join a vibrant community of tech enthusiasts, professionals, and innovators across Cameroon.',
    stat: '50+',
    statLabel: 'Partners',
  },
  {
    icon: Clock,
    title: 'Flexible Learning',
    description: 'Access training programs that fit your schedule with both online and in-person options.',
    stat: '24/7',
    statLabel: 'Support',
  },
  {
    icon: Shield,
    title: 'Certified Programs',
    description: 'Earn recognized certifications that boost your career prospects and professional credibility.',
    stat: '100%',
    statLabel: 'Certified',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'We don\'t just train—we help you monetize your skills and advance your career trajectory.',
    stat: '95%',
    statLabel: 'Placement',
  },
  {
    icon: Heart,
    title: 'Relational Marketing',
    description: 'Our unique approach turns satisfied customers into brand ambassadors, creating lasting partnerships.',
    stat: '1000+',
    statLabel: 'Happy Clients',
  },
];

const benefits = [
  'Hands-on practical experience with real projects',
  'Certification upon program completion',
  'Preparation for official IT exams',
  'Access to cutting-edge technologies',
  'Mentorship from industry experts',
  'Networking opportunities with professionals',
  'Career placement assistance',
  'Continuous learning and development',
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
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
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Why Choose Us</span>
          </div>
          <h2 className="heading-2 mb-4">
            The <span className="gradient-text">Navic Tech</span> Advantage
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            We combine expertise, innovation, and a unique relational approach to deliver
            exceptional value to our clients and collaborators.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-glow-emerald"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <reason.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {reason.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-400 font-display">{reason.stat}</span>
                    <span className="text-xs text-gray-500">{reason.statLabel}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Internship Benefits</span>
              </div>
              <h3 className="heading-3 mb-4">
                Gain Real-World <span className="gradient-text">Experience</span>
              </h3>
              <p className="text-gray-300 mb-8">
                Our internship programs are designed to bridge the gap between academic knowledge
                and industry requirements. We prepare you for success in the competitive IT landscape.
              </p>
              <a
                href="/internships"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 group"
              >
                Explore Internships
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { value: '500+', label: 'Students Trained', icon: Users },
            { value: '100+', label: 'Projects Delivered', icon: Zap },
            { value: '50+', label: 'Partners', icon: Globe },
            { value: '95%', label: 'Success Rate', icon: TrendingUp },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white font-display mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
