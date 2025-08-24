import { motion } from 'framer-motion';
import { Shield, Cloud, Zap, Cpu, ArrowRight } from 'lucide-react';

// Infrastructure features data
const infraFeatures = [
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security with end-to-end encryption and strict access controls.'
  },
  {
    icon: Cloud,
    title: 'Cloud Native',
    description: 'Scalable architecture built on leading cloud infrastructure.'
  },
  {
    icon: Zap,
    title: 'Fast Inference',
    description: 'Optimized for rapid processing of large medical imaging datasets.'
  },
  {
    icon: Cpu,
    title: 'Medical-Grade AI',
    description: 'State-of-the-art neural networks trained on verified medical data.'
  },
];

export default function InfrastructureSection() {
  return (
    <motion.section className="relative overflow-hidden bg-[#eff2f7] py-28 px-6 sm:px-10 lg:px-20" id="infrastructure">
      {/* Glowing Blur Background */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] bg-neuronav-accent opacity-15 blur-3xl rounded-full z-0"></div>
      <div className="absolute bottom-[-100px] right-1/2 transform translate-x-1/2 w-[500px] h-[500px] bg-neuronav-primary opacity-15 blur-3xl rounded-full z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Enterprise-Grade Infrastructure
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto">
            Built on a foundation of medical-grade security, compliance, and performance.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {infraFeatures.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring", bounce: 0.3 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-blue-50/70 to-blue-100/70 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between shadow-lg border border-blue-100 transition-all duration-300 ease-in-out hover:shadow-xl"
              whileHover={{
                translateY: -10,
                rotateX: 2,
                rotateY: -2,
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Subtle background overlay effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative z-10 flex flex-col">
                <motion.div
                  whileHover={{ scale: 1.15, translateY: -12, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center mb-6 shadow-lg"
                >
                  <Icon className="text-white" size={28} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>
              <motion.a
                href="#"
                className="relative z-10 flex items-center text-blue-600 font-medium group text-sm mt-4 w-fit px-3 py-1 -ml-3 rounded-md"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)", scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Learn more
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
} 