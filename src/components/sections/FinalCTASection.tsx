import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function FinalCTASection() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/upload');
  };
  return (
    <motion.section
      className="py-28 relative overflow-hidden bg-[#f8f9fb]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      {/* Glowing Blur Background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-neuronav-primary opacity-10 blur-3xl rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neuronav-accent opacity-10 blur-3xl rounded-full z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text"
          >
            Ready to Navigate the Future of Diagnostics?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-10"
          >
            Start exploring brain scans with unprecedented precision and clarity today.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
              viewport={{ once: true }}
            >
              <Button size="xl" variant="gradient" className="group shadow-lg" onClick={handleGetStarted}>
                <span className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
              viewport={{ once: true }}
            >
              <Button size="xl" variant="outline" className="group border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow">
                <a href="#">
                  Schedule a Demo
                  <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-sm font-medium text-green-700 shadow-sm border border-green-200"
            >
              Free to try. No sign-up required.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-blue-700 shadow-sm border border-blue-200"
            >
              Secure upload. HIPAA compliant.
            </motion.span>
          </div>
        </div>
      </div>
    </motion.section>
  );
} 