import { motion } from 'framer-motion';
import bratsImg from '/BRATS.png';
import tciaImg from '/TCAI.png';
import { ExternalLink } from 'lucide-react';

const dataSources = [
  {
    name: 'BraTS 2020',
    logo: bratsImg,
    url: 'https://www.med.upenn.edu/cbica/brats2020/data.html',
    description: 'Largest public dataset for brain tumor segmentation, crucial for our AI model training.',
  },
  {
    name: 'TCIA MRI',
    logo: tciaImg,
    url: 'https://www.cancerimagingarchive.net/collections/',
    description: 'Comprehensive collection of cancer medical images, enhancing our diagnostic capabilities.',
  },
];

export default function ResearchSection() {
  return (
    <motion.section className="relative overflow-hidden bg-[#f8f9fb] py-28 px-6 sm:px-10 lg:px-20" id="research">
      {/* Glowing Blur Background */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-neuronav-primary opacity-15 blur-3xl rounded-full z-0"></div>
      <div className="absolute bottom-[-100px] right-1/2 transform translate-x-1/2 w-[600px] h-[600px] bg-neuronav-accent opacity-15 blur-3xl rounded-full z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text">
            Backed by Cutting-Edge Research
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Our platform is built on a foundation of rigorous scientific studies and validated data sources.
          </p>
        </motion.div>
      </div>

      {/* Data Sources Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {dataSources.map((source, index) => (
          <motion.a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.15, type: "spring", bounce: 0.3 }}
            viewport={{ once: true }}
            className="block bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] group relative"
          >
            <div className="flex items-center mb-6">
              <img src={source.logo} alt={source.name + ' logo'} className="h-16 w-auto object-contain mr-4" loading="lazy" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-neuronav-primary to-neuronav-accent text-transparent bg-clip-text">
                {source.name}
              </h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {source.description}
            </p>
            <div className="flex items-center text-blue-600 font-medium group text-sm">
              Learn more
              <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
            {/* Subtle background overlay effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-neuronav-primary/10 to-neuronav-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.a>
        ))}
      </div>

      {/* Quote Section */}
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
        className="relative z-10 text-center text-xl md:text-2xl font-semibold text-gray-800 max-w-3xl mx-auto italic mb-12 p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100"
      >
        "Our AI models achieve cutting-edge accuracy, validated through rigorous clinical and research protocols."
        <span className="block mt-4 text-neuronav-primary not-italic font-bold">— NeuroNav Research Team</span>
      </motion.blockquote>

      {/* Technology/Training Info Panel */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center text-base md:text-lg text-gray-700 bg-white/70 rounded-2xl px-8 py-6 shadow-xl border border-gray-200 backdrop-blur-md"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: 0.4, type: 'spring' }}
      >
        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Our Foundation in AI & Data Science</h3>
        <p className="mb-2">Powered by advanced deep learning architectures like <span className="text-blue-600 font-bold">MobileNetV2</span> and <span className="text-purple-600 font-bold">U-Net</span>, our models are meticulously trained on:</p>
        <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
          <li><span className="font-semibold text-neuronav-primary">BraTS 2020:</span> Comprehensive Brain Tumor Segmentation Challenge Dataset.</li>
          <li><span className="font-semibold text-neuronav-accent">TCIA MRI Datasets:</span> Vast repository of clinically annotated cancer imaging data.</li>
        </ul>
        <p className="mt-4">Optimized for precise tumor segmentation and high-fidelity medical classification accuracy.</p>
      </motion.div>
    </motion.section>
  );
} 