import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const current = navLinks.find(link => location.pathname.startsWith(link.href));
      if (current) setActiveSection(current.name);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      className="h-16 bg-white"
      style={{ marginTop: 0 }}
    >
      <div className={`mx-auto max-w-7xl h-full transition-all duration-300 px-4 ${
        isScrolled
          ? 'shadow-md border-b border-gray-200'
          : ''
      }`}>
        <nav className="h-full flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-[140px] flex items-center"
          >
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo-2.webp"
                alt="NeuroNav Logo"
                className="w-12 h-12 rounded-xl object-cover shadow-md"
              />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-neuronav-primary to-neuronav-accent bg-clip-text text-transparent font-display">NeuroNav</span>
            </Link>
          </motion.div>

          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3 bg-white/70 px-3 py-1 rounded-full border border-gray-200 shadow-sm" style={{ background: 'rgba(255,255,255,0.7)' }}>
              {navLinks.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Link
                    to={item.href}
                    className={`text-base font-medium flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      location.pathname.startsWith(item.href)
                        ? 'text-gray-900 bg-gray-100 font-bold'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveSection(item.name)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                  {activeSection === item.name && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-gray-100 rounded-md -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right space for symmetry */}
          <div className="w-[140px]" />
        </nav>
      </div>
    </motion.header>
  );
}