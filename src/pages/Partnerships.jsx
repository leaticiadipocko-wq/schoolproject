import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Handshake, TrendingUp, Users, Award, Globe, Shield,
  ArrowRight, CheckCircle, Sparkles, Zap, Target, Building,
  Star, Gift, Percent, Heart
} from 'lucide-react';

const partnerBenefits = [
  {
    icon: TrendingUp,
    title: 'Business Growth',
    description: 'Access new markets and customer segments through our extensive network and reputation.',
    features: ['Market Expansion', 'Lead Generation', 'Brand Visibility'],
  },
  {
    icon: Users,
    title: 'Talent Access',
    description: 'Connect with our pool of trained and certified IT professionals for your projects.',
    features: ['Skilled Workforce', 'Project Staffing', 'Consulting Services'],
  },
  {
    icon: Award,
    title: 'Co-Branding',
    description: 'Joint marketing initiatives and co-branded solutions that enhance both brands.',
    features: ['Joint Campaigns', 'Event Sponsorship', 'Content Collaboration'],
  },
  {
    icon: Shield,
    title: 'Technical Support',
    description: 'Priority technical support and dedicated account management for partners.',
    features: ['24/7 Support', 'Dedicated Manager', 'SLA Guarantees'],
  },
  {
    icon: Gift,
    title: 'Exclusive Benefits',
    description: 'Special pricing, early access to new programs, and exclusive partnership perks.',
    features: ['Partner Discounts', 'Early Access', 'VIP Events'],
  },
  {
    icon: Globe,
    title: 'Network Expansion',
    description: 'Join a growing ecosystem of tech companies, startups, and enterprise clients.',
    features: ['Networking Events', 'Referral Program', 'Community Access'],
  },
];

const partnerTiers = [
  {
    name: 'Silver Partner',
    price: '500,000 FCFA',
    period: '/year',
    description: 'Perfect for small businesses starting their partnership journey',
    features: [
      'Basic brand visibility on our platform',
      'Access to internship graduates',
      'Partner discount on services',
      'Quarterly networking events',
      'Email support',
    ],
    color: 'gray',
    icon: Star,
  },
  {
    name: 'Gold Partner',
    price: '1,500,000 FCFA',
    period: '/year',
    description: 'Ideal for growing businesses seeking deeper collaboration',
    features: [
      'Premium brand placement',
      'Priority access to talent pool',
      'Co-marketing opportunities',
      'Monthly networking events',
      'Dedicated account manager',
      'Joint workshop facilitation',
    ],
    color: 'amber',
    icon: Award,
    popular: true,
  },
  {
    name: 'Platinum Partner',
    price: '3,000,000 FCFA',
    period: '/year',
    description: 'For enterprise clients seeking strategic partnership',
    features: [
      'Maximum brand visibility',
      'Exclusive talent recruitment',
      'Joint product development',
      'Executive networking access',
      '24/7 priority support',
      'Custom training programs',
      'Revenue sharing opportunities',
    ],
    color: 'emerald',
    icon: Crown,
  },
];

function Crown(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

const testimonials = [
  {
    quote: "Partnering with Navic Tech has been transformative for our business. Their trained professionals have elevated our team's capabilities significantly.",
    author: "TechCorp Cameroon",
    role: "CEO",
  },
  {
    quote: "The internship program produces exceptional talent. We've hired multiple graduates who have become key contributors to our projects.",
    author: "Digital Solutions Ltd",
    role: "HR Director",
  },
  {
    quote: "Navic Tech's relational marketing approach creates genuine win-win partnerships. Their commitment to mutual growth is refreshing.",
    author: "InnovateCMR",
    role: "Managing Director",
  },
];

export default function Partnerships() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Handshake className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Partnership Program</span>
            </div>
            <h1 className="heading-1 mb-4">
              Grow Together with <span className="gradient-text">Navic Tech</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              Join our partnership ecosystem and unlock exclusive benefits, access top talent,
              and expand your business reach across Cameroon and beyond.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {partnerBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-glow-emerald"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {benefit.description}
                </p>
                <ul className="space-y-2">
                  {benefit.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Partnership Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                Partnership <span className="gradient-text">Tiers</span>
              </h2>
              <p className="body-large max-w-2xl mx-auto">
                Choose the partnership level that best fits your business goals and budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border transition-all duration-300 ${
                    tier.popular
                      ? 'border-amber-500/50 shadow-glow-amber'
                      : 'border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <tier.icon className={`w-12 h-12 mx-auto mb-4 ${
                      tier.color === 'amber' ? 'text-amber-400' :
                      tier.color === 'emerald' ? 'text-emerald-400' : 'text-gray-400'
                    }`} />
                    <h3 className="text-2xl font-bold text-white font-display">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-400">{tier.period}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500'
                        : 'border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                What Our <span className="gradient-text">Partners Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
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
            className="text-center"
          >
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-12">
              <h2 className="heading-2 mb-4">
                Ready to <span className="gradient-text">Partner</span> with Us?
              </h2>
              <p className="body-large mb-8 max-w-2xl mx-auto">
                Join our growing network of partners and unlock new opportunities for growth and success.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
