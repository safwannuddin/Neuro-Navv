import { motion } from 'framer-motion';
import { Brain, Activity, Microscope, FileBarChart } from 'lucide-react';

// Features data with background images and colorful icons
const features = [
  {
    icon: <Brain className="w-14 h-14 text-neuronav-primary" />,
    title: 'Stunning 3D Visualization',
    desc: 'Explore interactive, high-resolution 3D brain models for deeper understanding and better communication.',
    bg: '/1 img.jpg',
  },
  {
    icon: <Activity className="w-14 h-14 text-accent" />,
    title: 'AI-Powered Diagnostics',
    desc: 'Our deep learning models detect subtle patterns and anomalies, providing results with medical-grade accuracy.',
    bg: '/2.jpg',
  },
  {
    icon: <Microscope className="w-14 h-14 text-primary" />,
    title: 'Comparative & Longitudinal Analysis',
    desc: 'Track changes over time or compare with healthy references for a complete clinical picture.',
    bg: '/3.jpg',
  },
  {
    icon: <FileBarChart className="w-14 h-14 text-accent" />,
    title: 'Instant, Actionable Reports',
    desc: 'Get comprehensive, easy-to-understand reports with clear recommendations and next steps.',
    bg: '/4.jpg',
  },
];

// Animation variants for cards
const cardVariants = {
  hiddenLeft: { opacity: 0, x: -60, rotate: -6, filter: 'blur(8px)' },
  hiddenRight: { opacity: 0, x: 60, rotate: 6, filter: 'blur(8px)' },
  visible: { opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' },
};

// Shake keyframes for hover
const shakeKeyframes = {
  rotate: [0, 1, -1, 1, 0],
  transition: { duration: 0.5, ease: 'easeInOut' },
};

// Bounce keyframes for tap
const bounceKeyframes = {
  scale: [1, 0.96, 1.04, 1],
  transition: { duration: 0.3, type: 'spring', stiffness: 400 },
};

/**
 * FeaturesSection - Scroll-triggered, animated feature showcase
 * - Tagline with gradient and fade-in
 * - One feature card at a time, scroll-animated
 * - Responsive and touch-friendly
 */
export default function FeaturesSection() {
  return (
    <motion.section className="bg-gradient-to-b from-white via-[#f7fafd] to-white">
      {/* Main Tagline with blur-to-clear reveal */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Why Choose NeuroNav?
      </motion.h2>
      {/* Sub-tagline with delayed reveal and optional slide-in */}
      <motion.p
        className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 text-center"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)', x: 30 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', x: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        Discover the next generation of brain analysis. Our platform combines advanced AI, beautiful 3D visualization, and medical-grade security to deliver insights you can trust.
      </motion.p>
      {/* Features Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8 max-w-4xl mx-auto"
        style={{ gridTemplateRows: 'repeat(4, minmax(0, 1fr))' }}
      >
        {features.map((f, i) => {
          // Zigzag: even index left col, odd index right col
          const isLeft = i % 2 === 0;
          // For mobile, always col-span-1; for sm+, alternate col-start
          const colClass = isLeft
            ? 'sm:col-start-1 sm:justify-self-start'
            : 'sm:col-start-2 sm:justify-self-end';
          // Animation: left cards swipe in from left with twist, right from right with twist
          const initial = isLeft ? 'hiddenLeft' : 'hiddenRight';
          // Stagger delay for each card
          const delay = 0.8 + i * 0.18;
          // Hover tilt: left cards tiltY, right cards tiltX
          const hoverTilt = isLeft
            ? { scale: 1.05, rotateZ: 1, rotateY: 6, boxShadow: '0px 8px 24px rgba(124,58,237,0.13)' }
            : { scale: 1.05, rotateZ: 1, rotateX: 6, boxShadow: '0px 8px 24px rgba(6,182,212,0.13)' };
          return (
            <motion.div
              key={f.title}
              className={`w-full max-w-md ${colClass} bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-gray-100 transition-transform relative overflow-hidden`}
              variants={cardVariants}
              initial={initial}
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay, type: 'spring', bounce: 0.25 }}
              whileHover={{ ...hoverTilt, ...shakeKeyframes }}
              whileTap={bounceKeyframes}
              tabIndex={0}
              aria-label={f.title}
              style={{
                backgroundImage: `url('${f.bg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/50 z-0 rounded-2xl" />
              <div className="relative z-10 mb-4 flex items-center justify-center">{f.icon}</div>
              <div className="relative z-10 mb-2 text-center text-white text-xl font-semibold drop-shadow-lg">{f.title}</div>
              <div className="relative z-10 text-center text-white text-base drop-shadow-md">{f.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ---
// Suggestion: For even more visual impact, use AI-generated illustrations for each feature card.
// Example prompt:
// "Create a high-resolution, futuristic illustration representing AI-powered brain diagnostics. The image should feature a stylized human brain with interconnected neural pathways, glowing with soft blue and cyan hues. Incorporate subtle digital elements like data streams or circuit patterns to emphasize technology. The background should be dark with a gradient, ensuring the brain illustration stands out prominently. The style should be modern, clean, and suitable for a medical technology website." 