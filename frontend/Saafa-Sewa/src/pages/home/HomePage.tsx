
import React, { useState, useEffect } from 'react';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  DollarSign,
  BarChart2,
  Layers,
  MoreVertical,
  Building2,
  Users,
  AlertCircle,
  Globe,
  Wind,
  Leaf,
  Send,
  Mail,
  User,
  MessageSquare,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  Camera,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const NavItem = ({ children, href = "#", onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors cursor-pointer"
  >
    {children}
  </a>
);

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (delay > 0 && displayText === "" && !isDeleting) {
        // Initial delay
        setDisplayText(text.charAt(0));
        return;
      }

      if (!isDeleting && displayText.length < text.length) {
        setDisplayText(text.substring(0, displayText.length + 1));
        setTypingSpeed(100 + Math.random() * 50);
      } else if (isDeleting && displayText.length > 0) {
        setDisplayText(text.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else if (!isDeleting && displayText.length === text.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
        setTypingSpeed(150);
      }
    }, displayText === "" && !isDeleting ? delay * 1000 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text, delay, typingSpeed]);

  return (
    <span className="relative inline-block">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[4px] h-[0.8em] bg-primary ml-1 align-middle"
      />
    </span>
  );
};


// export function HomePage() {
//   const [currentPage, setCurrentPage] = useState<'landing' | 'register' | 'login'>('landing');

//   return (
//     <AnimatePresence mode="wait">
//       {currentPage === 'landing' && (
//         <LandingPage
//           key="landing"
//           onNavigateToRegister={() => setCurrentPage('register')}
//           onNavigateToLogin={() => setCurrentPage('login')}
//         />
//       )}
//       {currentPage === 'register' && (
//         <RegisterPage
//           key="register"
//           onBack={() => setCurrentPage('landing')}
//           onNavigateToLogin={() => setCurrentPage('login')}
//         />
//       )}
//       {currentPage === 'login' && (
//         <LoginPage
//           key="login"
//           onBack={() => setCurrentPage('landing')}
//           onNavigateToRegister={() => setCurrentPage('register')}
//         />
//       )}
//     </AnimatePresence>
//   );
// }


export function HomePage() {
  const navigate = useNavigate(); // <-- Initialize React Router navigation
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-green-100 selection:text-green-900 relative">
      <div className="bg-gradient-soft" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 h-20 flex items-center ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Leaf size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Saafa Sewa</span>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-8 mr-4">
              {/* Smooth scrolling works natively with these hrefs! */}
              <NavItem href="#home">Home</NavItem>
              <NavItem href="#about">About</NavItem>
              <NavItem href="#contact">Support</NavItem>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')} // <-- Changed from prop
                className=" cursor-pointer px-4 py-2 text-slate-600 hover:text-primary text-sm font-bold transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')} // <-- Changed from prop
                className="cursor-pointer bg-primary text-white px-5 md:px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative">
        {/* Hero Section */}
        <section id="home" className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl md:text-8xl font-black text-[#1E293B] leading-[0.9] mb-6">
              <Typewriter text="Saafa" /><br />
              <Typewriter text="Sewa" delay={0.6} />
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-2xl text-gray-400 font-medium mb-10"
            >
              <Typewriter text="The Escalation Engine" delay={1.2} />
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')} // <-- Changed from prop
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-600 font-bold rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50"
              >
                View Reports
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-20">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1E293B] mb-3 flex items-center gap-2">
                  <Plus size={14} className="text-primary" /> OUR ENVIRONMENT
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We should and use all possible methods to ensure the next generation towards achieving a green and sustainable environment in Kathmandu.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1E293B] mb-3">
                  OUR STORY
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Restoration starts at the community level. We empower citizens to hold local authorities accountable for waste management.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Illustration Circle */}
            <div className="aspect-square rounded-full bg-gradient-to-br from-primary to-green-600 p-12 shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden">
                <img
                  src="https://picsum.photos/seed/kathmandu/800/800"
                  alt="Kathmandu Environment"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-[#1E293B] rotate-45 transform translate-x-12 -translate-y-8 shadow-2xl" />
                  <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-yellow-400 rounded-full shadow-lg shadow-yellow-200" />
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 left-1/4 bg-white px-4 py-2 rounded-full shadow-xl border border-gray-50 flex items-center gap-2"
            >
              <Wind size={16} className="text-sky-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">CLEAN AIR GOAL</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 -right-4 bg-white px-4 py-2 rounded-full shadow-xl border border-gray-50 flex items-center gap-2"
            >
              <Leaf size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">100% SUSTAINABLE</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Phases Section */}
        <section id="about" className="grid md:grid-cols-2 gap-8 mb-32">
          {/* Phase 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-50"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">PHASE 1</span>
                <h2 className="text-3xl font-black text-[#1E293B] mt-1">The Government Window</h2>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                <Building2 size={24} />
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed mb-12">
              When a waste report is filed, a 72-hour "Ticking Pin" is placed on the map. This gives the local government a priority window to resolve the issue before it escalates to the community.
            </p>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ESCALATION TIMER</span>
                <span className="text-xs font-mono font-bold text-primary">48 : 12 : 09</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '65%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Phase 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-50"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">PHASE 2</span>
                <h2 className="text-3xl font-black text-[#1E293B] mt-1">The Janta Override</h2>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed mb-12">
              If the government fails to act within the window, the report converts into a "Bounty". Local verified collectors or community groups can fulfill the cleanup and claim the reward.
            </p>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-[#1E293B]">Ward 7 Trash Pile</h4>
                    <span className="text-sm font-black text-primary">Rs. 1,500</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase bg-gray-200 px-2 py-0.5 rounded text-gray-500">Urgent</span>
                    <span className="text-[9px] font-black uppercase text-gray-400">Escalated 2h ago</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-[#1E293B] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#2D3748] transition-colors">
                Claim Bounty
              </button>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-32">
          {/* ... Contact section code remains exactly the same as your original ... */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-gray-50 overflow-hidden grid lg:grid-cols-2">
            <div className="p-12 lg:p-20 bg-green-50/30">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">GET IN TOUCH</span>
              <h2 className="text-5xl font-black text-[#1E293B] mt-4 mb-8 leading-tight">
                Let's make Kathmandu<br />cleaner together.
              </h2>
              <p className="text-gray-500 mb-12 max-w-md">
                Have questions about the escalation engine or want to become a verified collector? Send us a message and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-600">hello@saafasewa.org</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <Globe size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-600">Kathmandu, Nepal</span>
                </div>
              </div>
            </div>

            <div className="p-12 lg:p-20">
              <form onSubmit={() => navigate('/')} className="space-y-6">

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 text-gray-300" size={18} />
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-slate-400"
                    ></textarea>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus !== 'idle'}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${formStatus === 'sent'
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-white shadow-xl shadow-primary/20'
                    }`}
                >
                  {formStatus === 'idle' && (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                  {formStatus === 'sending' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  {formStatus === 'sent' && (
                    <>
                      <span>Message Sent!</span>
                      <Leaf size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-gray-100">
        <div className="flex flex-col md:row items-center justify-between gap-8">
          <p className="text-[10px] font-medium text-gray-400">
            © 2024 Saafa Sewa Kathmandu. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}