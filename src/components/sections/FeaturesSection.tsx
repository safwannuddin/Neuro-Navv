import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Zap,
  Database,
  LineChart,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Advanced AI Analysis",
    description: "State-of-the-art neural networks analyze your brain scans with unprecedented accuracy and detail.",
    bgImage: "/features/ai-analysis.jpg",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant Security",
    description: "Your medical data is protected with enterprise-grade encryption and strict privacy controls.",
    bgImage: "/features/security.jpg",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Get instant results with our lightning-fast processing pipeline, optimized for medical imaging.",
    bgImage: "/features/processing.jpg",
  },
  {
    icon: Database,
    title: "Secure Cloud Storage",
    description: "Your scans and reports are safely stored in our HIPAA-compliant cloud infrastructure.",
    bgImage: "/features/storage.jpg",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "Monitor changes over time with detailed analytics and trend visualization tools.",
    bgImage: "/features/tracking.jpg",
  },
  {
    icon: Cpu,
    title: "Smart Diagnostics",
    description: "Leverage machine learning to detect patterns and anomalies with expert-level precision.",
    bgImage: "/features/diagnostics.jpg",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fb] py-28 px-6 sm:px-10 lg:px-20" id="features">
      {/* Glowing Blur Background */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-neuronav-accent opacity-20 blur-3xl rounded-full z-0"></div>
      <div className="absolute bottom-[-100px] right-1/2 transform translate-x-1/2 w-[600px] h-[600px] bg-neuronav-primary opacity-20 blur-3xl rounded-full z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text">
            Why Choose NeuroNav?
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Experience the future of brain scan analysis with our cutting-edge AI technology and medical expertise.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col-reverse sm:flex-row items-center gap-10 ${
                !isLeft && "sm:flex-row-reverse"
              }`}
            >
              {/* Icon Side */}
              <div className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-neuronav-primary to-neuronav-accent flex items-center justify-center shadow-lg shadow-neuronav-primary/20 transition-all"
                >
                  <Icon className="text-white" size={32} />
                </motion.div>
              </div>

              {/* Content Side */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-neuronav-primary/10 transition-all max-w-xl w-full relative overflow-hidden group"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <img
                    src={feature.bgImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
} 