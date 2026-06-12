import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, Code, Brain, Zap, MessageSquare,
  Cpu, Database, Globe, ArrowRight, RefreshCw
} from 'lucide-react';

const aiResponses = [
  {
    question: "What services does Navic Tech offer?",
    answer: "Navic Tech offers a wide range of IT services including:\n• IT Training (Digital Marketing, China Buyer programs)\n• Website Creation & Development\n• Network Configuration\n• System Creation\n• Business Advertisement\n• Maintenance & After-Sales Support\n• Combinational Logic Circuits",
    icon: Globe,
  },
  {
    question: "Where is Navic Tech located?",
    answer: "Navic Tech is proudly based in Douala, Cameroon! We serve clients locally and internationally, bringing world-class IT solutions to Central Africa and beyond.",
    icon: Database,
  },
  {
    question: "Tell me about the internship programs",
    answer: "Our internship programs offer:\n• Hands-on experience with real projects\n• Certification upon completion\n• Preparation for official IT exams\n• Mentorship from industry experts\n• Career development support\n\nInterns work on cutting-edge technologies and gain practical skills that set them apart in the job market.",
    icon: Code,
  },
  {
    question: "How does relational marketing work?",
    answer: "At Navic Tech, we believe in building lasting relationships. Our relational marketing approach means:\n• Customers become our promotion agents\n• We deliver exceptional value that speaks for itself\n• Word-of-mouth referrals drive our growth\n• We invest in long-term partnerships\n\nThis creates a win-win ecosystem where everyone benefits!",
    icon: Brain,
  },
];

const codeLanguages = [
  { name: 'Python', snippet: 'def elevate_skills():', color: 'text-yellow-400' },
  { name: 'JavaScript', snippet: 'const future = async () => {', color: 'text-amber-400' },
  { name: 'TypeScript', snippet: 'interface Career {', color: 'text-blue-400' },
  { name: 'Rust', snippet: 'fn build_excellence() -> Result {', color: 'text-orange-400' },
  { name: 'Go', snippet: 'func Transform() error {', color: 'text-cyan-400' },
  { name: 'Java', snippet: 'public class NavicTech {', color: 'text-red-400' },
];

export default function AIInteractive() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [typedResponse, setTypedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeLang, setActiveLang] = useState(0);
  const [customQuestion, setCustomQuestion] = useState('');
  const responseRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLang((prev) => (prev + 1) % codeLanguages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeQuestion !== null) {
      setIsTyping(true);
      setTypedResponse('');
      const response = aiResponses[activeQuestion].answer;
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < response.length) {
          setTypedResponse(prev => prev + response[index]);
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 20);

      return () => clearInterval(typeInterval);
    }
  }, [activeQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      // Simulate AI response
      setActiveQuestion(null);
      setIsTyping(true);
      setTypedResponse('');
      const response = `Great question! "${customQuestion}"\n\nAt Navic Tech, we're always ready to help. Our team of experts is available to discuss your specific needs and provide tailored solutions. Contact us to learn more about how we can assist you!`;
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < response.length) {
          setTypedResponse(prev => prev + response[index]);
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 20);

      setCustomQuestion('');
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/30 to-navy-950" />
        <div className="absolute inset-0 circuit-pattern opacity-30" />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Bot className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">AI-Powered Experience</span>
          </div>
          <h2 className="heading-2 mb-4">
            Chat with <span className="gradient-text">Navic AI</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Experience our AI-powered interactive assistant. Ask questions about our services,
            learn about our programs, or explore what we offer.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-navy-900/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Navic AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-6 min-h-[300px] max-h-[400px] overflow-y-auto" ref={responseRef}>
                {/* Welcome Message */}
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none p-4 max-w-[80%]">
                    <p className="text-gray-300 text-sm">
                      Hello! I'm the Navic AI assistant. How can I help you today?
                      Feel free to ask about our services, programs, or anything else!
                    </p>
                  </div>
                </div>

                {/* Quick Questions */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-3">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiResponses.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveQuestion(index)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all duration-300 ${
                          activeQuestion === index
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/20 hover:text-emerald-400'
                        }`}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response */}
                <AnimatePresence>
                  {typedResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="bg-white/5 rounded-xl rounded-tl-none p-4 max-w-[80%]">
                        <p className="text-gray-300 text-sm whitespace-pre-line">
                          {typedResponse}
                          {isTyping && <span className="cursor-blink text-emerald-400">▌</span>}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-white/10 bg-navy-900/30">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Ask anything about Navic Tech..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right: Code Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Code Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-navy-900/50">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">languages.txt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Multi-Language</span>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="flex overflow-x-auto px-4 py-2 gap-2 border-b border-white/10">
                {codeLanguages.map((lang, index) => (
                  <button
                    key={lang.name}
                    onClick={() => setActiveLang(index)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap ${
                      activeLang === index
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* Code Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLang}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="font-mono text-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={codeLanguages[activeLang].color}>
                          {codeLanguages[activeLang].name}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">navic-tech.{codeLanguages[activeLang].name.toLowerCase() === 'c#' ? 'cs' : codeLanguages[activeLang].name.toLowerCase() === 'javascript' ? 'js' : codeLanguages[activeLang].name.toLowerCase() === 'typescript' ? 'ts' : codeLanguages[activeLang].name.toLowerCase() === 'python' ? 'py' : codeLanguages[activeLang].name.toLowerCase() === 'rust' ? 'rs' : codeLanguages[activeLang].name.toLowerCase() === 'go' ? 'go' : 'java'}</span>
                      </div>
                      <div className="space-y-2 text-gray-300">
                        <div>
                          <span className="text-purple-400">import</span>
                          <span className="text-white"> {'{'}</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-amber-400">skills</span>
                          <span className="text-white">,</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-amber-400">career</span>
                          <span className="text-white">,</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-amber-400">excellence</span>
                          <span className="text-white">,</span>
                        </div>
                        <div>
                          <span className="text-white">{'}'}</span>
                          <span className="text-purple-400"> from </span>
                          <span className="text-emerald-400">'navic-tech'</span>
                          <span className="text-white">;</span>
                        </div>
                        <div className="mt-4">
                          <span className={codeLanguages[activeLang].color}>
                            {codeLanguages[activeLang].snippet}
                          </span>
                        </div>
                        <div className="pl-4">
                          <span className="text-purple-400">const</span>
                          <span className="text-white"> training = </span>
                          <span className="text-purple-400">await</span>
                          <span className="text-blue-400"> skills.learn</span>
                          <span className="text-white">();</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-purple-400">const</span>
                          <span className="text-white"> future = </span>
                          <span className="text-blue-400">career.transform</span>
                          <span className="text-white">(training);</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-purple-400">return</span>
                          <span className="text-blue-400"> excellence.deliver</span>
                          <span className="text-white">(future);</span>
                        </div>
                        <div>
                          <span className="text-white">{'}'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Fun Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                  {[
                    { icon: Zap, label: 'Fast', value: '< 2s' },
                    { icon: Brain, label: 'Smart', value: 'AI-Powered' },
                    { icon: Sparkles, label: 'Modern', value: '2024+' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <div className="text-xs text-gray-500">{stat.label}</div>
                      <div className="text-sm text-white font-mono">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Language Badges */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java', 'C++', 'Ruby'].map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-default"
                >
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
