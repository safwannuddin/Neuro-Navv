import { motion } from 'framer-motion';
import { Upload, Brain, FileBarChart } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Scan',
    description: 'Securely upload your MRI scan through our intuitive, HIPAA-compliant portal.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our advanced AI models instantly process and analyze brain regions for anomalies.',
  },
  {
    icon: FileBarChart,
    title: 'Receive Insights',
    description: 'Get a detailed report with visualizations and actionable diagnostic insights.',
  },
];

export default function HowItWorksSection() {
  return (
    <motion.section className="relative overflow-hidden bg-[#f7fafd] py-28 px-6 sm:px-10 lg:px-20" id="how-it-works">
      {/* Glowing Blur Background */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-neuronav-accent opacity-10 blur-3xl rounded-full z-0"></div>
      <div className="absolute bottom-[-100px] right-1/2 transform translate-x-1/2 w-[600px] h-[600px] bg-neuronav-primary opacity-10 blur-3xl rounded-full z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text">
            How NeuroNav Works
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Our streamlined workflow makes brain analysis simple, secure, and fast.
          </p>
        </motion.div>
      </div>

      {/* Main Container for Steps (mimics the large card box from image) */}
      <div className="relative z-10 max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 py-12 px-4 md:px-0 overflow-hidden">
        {/* Horizontal Line connecting numbers - precisely positioned */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 w-full h-px bg-gray-200 hidden md:block" style={{ transform: 'translateY(-0.5px)' }}
        />

        {/* Numbered Circles positioned over the border, dynamically centered */}
        {steps.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.4, type: "spring", bounce: 0.5 }}
            viewport={{ once: true }}
            className="absolute top-0 w-12 h-12 rounded-full bg-gradient-to-br from-neuronav-primary to-neuronav-accent text-white font-bold text-lg flex items-center justify-center shadow-lg z-20"
            style={{
              left: index === 0 ? 'calc(100%/6)' : index === 1 ? 'calc(100%/2)' : 'calc(100%*5/6)',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {index + 1}
          </motion.div>
        ))}

        {/* Steps Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-0 h-full pt-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: index * 0.15 + 0.6, type: "spring", bounce: 0.25 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center text-center py-8 px-8 relative z-10 transition-all duration-300 ease-out bg-white rounded-2xl shadow-lg border border-gray-100 ` + (index < steps.length - 1 ? 'md:border-r border-gray-200' : '')}
                whileHover={{
                  translateY: -10,
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)',
                  scale: 1.03,
                }}
                style={{ transformStyle: "preserve-3d" }} // For potential 3D effects
              >
                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-md">
                  <Icon className="text-white" size={40} />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
} 