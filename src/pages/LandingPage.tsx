// 🔥 NeuroNav Landing Page — Upgraded by Bunny and Team 🔥
// Complete rewrite of the landing page based on deep analysis
// Technologies: React + TailwindCSS + Framer Motion + Lucide Icons

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, BarChart2, Users } from 'lucide-react';
import brainImg from '../../brain-img.jpg';
import FeaturesSection from '@/components/sections/FeaturesSection';
import InfrastructureSection from '@/components/sections/InfrastructureSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ResearchSection from '@/components/sections/ResearchSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import FooterSection from '@/components/layout/FooterSection';
import { useNavigate } from 'react-router-dom';

const heroTaglines = [
  {
    headline: 'AI-Powered Brain Scan Analysis',
    subtext: "Get instant, expert-level insights from your MRI with NeuroNav's advanced AI.",
  },
  {
    headline: 'Precision Diagnostics, Effortless Experience',
    subtext: 'Upload, analyze, and receive actionable results in seconds—no waiting, no hassle.',
  },
  {
    headline: 'Your Brain Health, Reimagined',
    subtext: 'Empowering patients and clinicians with next-generation medical intelligence.',
  },
];

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  // Animated counters
  const [counts, setCounts] = useState({ scans: 0, accuracy: 0, users: 0 });
  useEffect(() => {
    if (isInView) {
      const start = { scans: 0, accuracy: 0, users: 0 };
      const end = { scans: 10000, accuracy: 99, users: 5000 };
      const duration = 1200;
      let startTime: number | null = null;
      function animateCounter(ts: number) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        setCounts({
          scans: Math.floor(start.scans + (end.scans - start.scans) * progress),
          accuracy: Math.floor(start.accuracy + (end.accuracy - start.accuracy) * progress),
          users: Math.floor(start.users + (end.users - start.users) * progress),
        });
        if (progress < 1) requestAnimationFrame(animateCounter);
      }
      requestAnimationFrame(animateCounter);
      }
  }, [isInView]);
  return (
    <motion.section
      ref={ref}
      className="py-20 bg-[#f8f9fb]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: 'spring' }}
            className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center"
                >
            <BarChart2 className="w-10 h-10 text-neuronav-primary mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">{counts.scans.toLocaleString()}+</div>
            <div className="text-gray-600 font-medium">MRI Scans Processed</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
            className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">{counts.accuracy}%</div>
            <div className="text-gray-600 font-medium">Model Accuracy</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, type: 'spring' }}
            className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center"
          >
            <Users className="w-10 h-10 text-blue-500 mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">{counts.users.toLocaleString()}+</div>
            <div className="text-gray-600 font-medium">Medical Users</div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default function LandingPage() {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroTaglines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/upload');
  };

  return (
    <div className="overflow-x-hidden bg-[#f7fafd] overflow-hidden">
      {/* Hero Section */}
      <section ref={targetRef} className="min-h-[85vh] flex items-center justify-center relative z-10 bg-white py-24 px-6 sm:px-10 lg:px-20">
        {/* Glowing Blur Background for Brain */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 w-[800px] h-[800px] bg-neuronav-accent opacity-20 blur-3xl rounded-full z-0 pointer-events-none" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-[55%] text-center lg:text-left relative">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-neuronav-primary/10 to-neuronav-accent/10 rounded-full text-neuronav-primary font-medium text-sm">
                Experience the Future of Brain Diagnostics
              </span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="relative"
              >
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {heroTaglines[index].headline}
                </motion.h3>
                <motion.p
                  className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {heroTaglines[index].subtext}
                </motion.p>
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleGetStarted}
                    className="relative px-8 py-4 text-lg font-bold text-white group bg-gradient-to-r from-neuronav-primary to-neuronav-accent rounded-lg shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <ArrowRight className="inline-block w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-neuronav-primary to-neuronav-accent opacity-60"
                      animate={{ scale: isHovered ? [1, 1.08, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                  <motion.button
                    className="px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      Watch Demo
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </motion.button>
                </div>
                {/* Trust Badges */}
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                    Built with FastAPI + TensorFlow
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Brain Visual */}
          <div className="lg:w-[45%] flex items-center justify-center relative">
            {/* Animated Glow Behind Brain */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-neuronav-primary/30 via-neuronav-accent/20 to-white/0 blur-2xl z-0"
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Brain Image with Parallax/Floating Effect */}
            <motion.div
              className="relative z-10 w-[440px] h-[440px] rounded-[2rem] overflow-hidden shadow-2xl"
              animate={{ y: [0, -25, 0, 25, 0], rotate: [0, 3, 0, -3, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.img
                src={brainImg}
                alt="Brain Neural Network"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
                initial={{ filter: "grayscale(100%) blur(5px)" }}
                animate={{ filter: "grayscale(0%) blur(0px)" }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust/Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Infrastructure Section */}
      <motion.div
        className="pt-20 pb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <InfrastructureSection />
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        className="pt-20 pb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
      >
        <HowItWorksSection />
      </motion.div>

      {/* Research Section */}
      <div className="pt-20 pb-20">
        <ResearchSection />
      </div>

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
