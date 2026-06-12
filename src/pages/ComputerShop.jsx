import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Cpu, HardDrive, MemoryStick, Battery, Wifi, Camera,
  ShoppingCart, Phone, Mail, MessageSquare, CheckCircle, Star,
  ArrowRight, Filter, Search, ChevronDown, ChevronUp, Zap, Shield,
  Award, Truck, CreditCard, Heart, Eye, Info, ArrowUpDown
} from 'lucide-react';

const categories = ['All', 'Laptops', 'Desktops', 'Workstations', 'Gaming', 'Accessories'];

const computers = [
  {
    id: 1,
    name: 'HP ProBook 450 G9',
    category: 'Laptops',
    price: 450000,
    oldPrice: 520000,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    badge: 'Best Seller',
    image: null,
    specs: {
      processor: 'Intel Core i5-1235U',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      display: '15.6" FHD IPS',
      graphics: 'Intel Iris Xe',
      battery: '45Wh',
      os: 'Windows 11 Pro',
      weight: '1.74 kg',
    },
    features: ['Fingerprint Reader', 'Backlit Keyboard', 'USB-C', 'Wi-Fi 6'],
    description: 'Perfect for business professionals seeking reliability and performance. The HP ProBook 450 G9 delivers enterprise-grade security and productivity features.',
  },
  {
    id: 2,
    name: 'Dell Latitude 5530',
    category: 'Laptops',
    price: 580000,
    oldPrice: 650000,
    rating: 4.7,
    reviews: 95,
    inStock: true,
    badge: 'Premium',
    image: null,
    specs: {
      processor: 'Intel Core i7-1265U',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      display: '15.6" FHD Anti-Glare',
      graphics: 'Intel Iris Xe',
      battery: '58Wh',
      os: 'Windows 11 Pro',
      weight: '1.59 kg',
    },
    features: ['Smart Card Reader', 'Thunderbolt 4', 'ExpressConnect', 'AI Noise Cancellation'],
    description: 'Enterprise-class laptop with advanced security features and exceptional battery life for demanding business environments.',
  },
  {
    id: 3,
    name: 'Lenovo ThinkPad E14 Gen 4',
    category: 'Laptops',
    price: 420000,
    oldPrice: 480000,
    rating: 4.6,
    reviews: 156,
    inStock: true,
    badge: 'Popular',
    image: null,
    specs: {
      processor: 'AMD Ryzen 5 5625U',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      display: '14" FHD IPS',
      graphics: 'AMD Radeon',
      battery: '45Wh',
      os: 'Windows 11 Home',
      weight: '1.64 kg',
    },
    features: ['MIL-STD-810H', 'ThinkShutter', 'Rapid Charge', 'Dual Array Mic'],
    description: 'Built to last with military-grade durability. The ThinkPad E14 combines legendary reliability with modern performance.',
  },
  {
    id: 4,
    name: 'HP EliteDesk 800 G9',
    category: 'Desktops',
    price: 680000,
    oldPrice: 750000,
    rating: 4.8,
    reviews: 67,
    inStock: true,
    badge: 'Enterprise',
    image: null,
    specs: {
      processor: 'Intel Core i7-12700',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      display: 'N/A',
      graphics: 'Intel UHD 770',
      battery: 'N/A',
      os: 'Windows 11 Pro',
      weight: '5.4 kg',
    },
    features: ['Tool-less Access', 'HP Wolf Security', 'Manageability', 'Compact Design'],
    description: 'Powerful and secure desktop solution for enterprise environments. Features advanced manageability and security tools.',
  },
  {
    id: 5,
    name: 'Dell OptiPlex 7010',
    category: 'Desktops',
    price: 520000,
    oldPrice: 580000,
    rating: 4.5,
    reviews: 89,
    inStock: true,
    badge: null,
    image: null,
    specs: {
      processor: 'Intel Core i5-13500',
      ram: '8GB DDR5',
      storage: '256GB SSD',
      display: 'N/A',
      graphics: 'Intel UHD 770',
      battery: 'N/A',
      os: 'Windows 11 Pro',
      weight: '5.3 kg',
    },
    features: ['Dell Optimizer', 'ExpressResponse', 'Intelligent Audio', 'Compact Form Factor'],
    description: 'Versatile business desktop with intelligent features that adapt to how you work. Perfect for modern office environments.',
  },
  {
    id: 6,
    name: 'Lenovo ThinkStation P360',
    category: 'Workstations',
    price: 1250000,
    oldPrice: 1400000,
    rating: 4.9,
    reviews: 42,
    inStock: true,
    badge: 'Professional',
    image: null,
    specs: {
      processor: 'Intel Core i9-12900',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      display: 'N/A',
      graphics: 'NVIDIA RTX A2000 12GB',
      battery: 'N/A',
      os: 'Windows 11 Pro for Workstations',
      weight: '10.5 kg',
    },
    features: ['ISV Certified', 'Tool-less Design', 'ThinkStation Diagnostics', 'Lenovo Performance Tuner'],
    description: 'Professional workstation certified for demanding applications like CAD, 3D rendering, and video editing.',
  },
  {
    id: 7,
    name: 'ASUS ROG Strix G15',
    category: 'Gaming',
    price: 850000,
    oldPrice: 950000,
    rating: 4.7,
    reviews: 203,
    inStock: true,
    badge: 'Gaming',
    image: null,
    specs: {
      processor: 'AMD Ryzen 7 6800H',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      display: '15.6" FHD 300Hz',
      graphics: 'NVIDIA RTX 3060 6GB',
      battery: '90Wh',
      os: 'Windows 11 Home',
      weight: '2.3 kg',
    },
    features: ['RGB Keyboard', 'MUX Switch', 'Dolby Atmos', 'Liquid Metal Cooling'],
    description: 'Dominate the competition with the ROG Strix G15. Features a high-refresh display and powerful cooling for extended gaming sessions.',
  },
  {
    id: 8,
    name: 'MSI Katana GF66',
    category: 'Gaming',
    price: 720000,
    oldPrice: 800000,
    rating: 4.6,
    reviews: 178,
    inStock: true,
    badge: 'Value Gaming',
    image: null,
    specs: {
      processor: 'Intel Core i7-12700H',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      display: '15.6" FHD 144Hz',
      graphics: 'NVIDIA RTX 3050 Ti 4GB',
      battery: '53.5Wh',
      os: 'Windows 11 Home',
      weight: '2.25 kg',
    },
    features: ['Cooler Boost 5', 'Hi-Res Audio', 'MSI Center', 'Thin Bezel'],
    description: 'Excellent gaming performance at an attractive price point. The Katana GF66 delivers smooth gameplay with its 144Hz display.',
  },
  {
    id: 9,
    name: 'Dell UltraSharp U2723QE',
    category: 'Accessories',
    price: 380000,
    oldPrice: 420000,
    rating: 4.8,
    reviews: 156,
    inStock: true,
    badge: 'Monitor',
    image: null,
    specs: {
      processor: 'N/A',
      ram: 'N/A',
      storage: 'N/A',
      display: '27" 4K IPS Black',
      graphics: 'N/A',
      battery: 'N/A',
      os: 'N/A',
      weight: '6.6 kg',
    },
    features: ['USB-C 90W PD', 'IPS Black Technology', 'KVM Switch', 'VESA Mount'],
    description: 'Professional-grade monitor with stunning 4K resolution and IPS Black technology for accurate color reproduction.',
  },
  {
    id: 10,
    name: 'Logitech MX Keys Combo',
    category: 'Accessories',
    price: 85000,
    oldPrice: 95000,
    rating: 4.7,
    reviews: 312,
    inStock: true,
    badge: 'Keyboard',
    image: null,
    specs: {
      processor: 'N/A',
      ram: 'N/A',
      storage: 'N/A',
      display: 'N/A',
      graphics: 'N/A',
      battery: 'Up to 10 days',
      os: 'Multi-platform',
      weight: '810g',
    },
    features: ['Perfect Stroke Keys', 'Smart Illumination', 'Flow Cross-Computer', 'USB-C Charging'],
    description: 'Premium keyboard and mouse combo designed for creative professionals. Seamlessly switch between multiple devices.',
  },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ComputerShop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    notes: '',
  });
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);

  const filteredComputers = computers.filter((computer) => {
    const matchesCategory = activeCategory === 'All' || computer.category === activeCategory;
    const matchesSearch = computer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         computer.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBooking = (e) => {
    e.preventDefault();
    setIsBookingSubmitted(true);
    setTimeout(() => {
      setIsBookingSubmitted(false);
      setShowBookingForm(false);
      setBookingData({ name: '', email: '', phone: '', quantity: 1, notes: '' });
    }, 3000);
  };

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
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Computer Sales</span>
            </div>
            <h1 className="heading-1 mb-4">
              Premium <span className="gradient-text">Computers</span> & Equipment
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              Browse our selection of high-quality laptops, desktops, workstations, and accessories.
              All products come with after-sales support and warranty.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Shield, label: 'Warranty Included', value: '1 Year' },
              { icon: Truck, label: 'Free Delivery', value: 'Douala' },
              { icon: CreditCard, label: 'Flexible Payment', value: 'Installments' },
              { icon: Award, label: 'Certified Products', value: '100%' },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <badge.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs text-gray-400">{badge.label}</div>
                <div className="text-sm font-semibold text-white">{badge.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search computers..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-emerald-500/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComputers.map((computer, index) => (
              <motion.div
                key={computer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-glow-emerald overflow-hidden"
              >
                {/* Product Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                  <Monitor className="w-20 h-20 text-emerald-400/30" />
                  {computer.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-full">
                        {computer.badge}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-white/20 transition-all">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedComputer(computer)}
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/20 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  {!computer.inStock && (
                    <div className="absolute inset-0 bg-navy-950/80 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">{computer.category}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-500">{computer.rating} ({computer.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {computer.name}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {computer.description}
                  </p>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Cpu className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">{computer.specs.processor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MemoryStick className="w-3 h-3 text-emerald-400" />
                      <span>{computer.specs.ram}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <HardDrive className="w-3 h-3 text-emerald-400" />
                      <span>{computer.specs.storage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Monitor className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">{computer.specs.display}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-emerald-400">
                      {formatPrice(computer.price)}
                    </span>
                    {computer.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(computer.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedComputer(computer);
                        setShowBookingForm(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 group"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Book Now
                    </button>
                    <button
                      onClick={() => setSelectedComputer(computer)}
                      className="px-4 py-3 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/10 transition-all"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredComputers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No computers found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedComputer && !showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setSelectedComputer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {selectedComputer.badge && (
                    <span className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-full">
                      {selectedComputer.badge}
                    </span>
                  )}
                  <span className="text-sm text-gray-400">{selectedComputer.category}</span>
                </div>
                <button
                  onClick={() => setSelectedComputer(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl flex items-center justify-center h-64">
                    <Monitor className="w-32 h-32 text-emerald-400/30" />
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedComputer.name}</h2>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedComputer.rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">({selectedComputer.reviews} reviews)</span>
                    </div>

                    <p className="text-gray-300 mb-6">{selectedComputer.description}</p>

                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-3xl font-bold text-emerald-400">
                        {formatPrice(selectedComputer.price)}
                      </span>
                      {selectedComputer.oldPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(selectedComputer.oldPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Book Now
                      </button>
                      <a
                        href="tel:+237XXXXXXXX"
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/10 transition-all"
                      >
                        <Phone className="w-5 h-5" />
                        Call
                      </a>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(selectedComputer.specs).map(([key, value]) => (
                      <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-gray-500 uppercase mb-1">{key}</div>
                        <div className="text-sm text-white font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedComputer.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Need Help? Contact Us</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="tel:+237XXXXXXXX" className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors">
                      <Phone className="w-5 h-5 text-emerald-400" />
                      <span>+237 XXX XXX XXX</span>
                    </a>
                    <a href="mailto:sales@navictech.com" className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors">
                      <Mail className="w-5 h-5 text-emerald-400" />
                      <span>sales@navictech.com</span>
                    </a>
                    <a href="https://wa.me/237XXXXXXXX" className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && selectedComputer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-navy-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Book {selectedComputer.name}</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {isBookingSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-400">We'll contact you shortly to confirm your order.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Product Summary */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-emerald-400/50" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{selectedComputer.name}</h4>
                        <p className="text-emerald-400 font-bold">{formatPrice(selectedComputer.price)}</p>
                      </div>
                    </div>

                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                            placeholder="+237 XXX XXX XXX"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                        <select
                          value={bookingData.quantity}
                          onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        >
                          {[1, 2, 3, 4, 5, 10, 15, 20].map((num) => (
                            <option key={num} value={num}>{num} unit{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Additional Notes</label>
                        <textarea
                          value={bookingData.notes}
                          onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                          placeholder="Any special requirements or configurations..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <span className="text-gray-400">Total Price</span>
                        <span className="text-2xl font-bold text-emerald-400">
                          {formatPrice(selectedComputer.price * bookingData.quantity)}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 group"
                      >
                        Confirm Booking
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        By booking, you agree to our terms and conditions. We'll contact you to confirm payment and delivery details.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-12"
          >
            <h2 className="heading-2 mb-4">
              Need Bulk Orders or <span className="gradient-text">Custom Configurations</span>?
            </h2>
            <p className="body-large mb-8 max-w-2xl mx-auto">
              Contact our sales team for special pricing on bulk orders, custom hardware configurations,
              or enterprise solutions tailored to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+237XXXXXXXX"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow-emerald group"
              >
                <Phone className="w-5 h-5" />
                Call Sales Team
              </a>
              <a
                href="mailto:sales@navictech.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Email Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
