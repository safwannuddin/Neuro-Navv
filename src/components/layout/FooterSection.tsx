import { motion } from 'framer-motion';
import { Linkedin, Github } from 'lucide-react';

export default function FooterSection() {
  const year = new Date().getFullYear();
  const productLinks = [
    { name: 'Upload Scan', href: '/upload' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'For Researchers', href: '/researchers' },
    { name: 'For Clinicians', href: '/clinicians' },
  ];
  const resourceLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Blog', href: '/blog' },
    { name: 'Case Studies', href: '/cases' },
    { name: 'FAQ', href: '/faq' },
  ];
  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="bg-[#f8f9fb] text-gray-800 pt-16 pb-8 border-t border-gray-200 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 w-96 h-96 bg-gradient-to-br from-neuronav-primary/10 to-neuronav-accent/10 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tr from-neuronav-accent/10 to-neuronav-primary/10 rounded-full blur-2xl opacity-30"></div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row md:items-start md:justify-between gap-12 relative z-10">
        <div className="flex-1 min-w-[200px] flex flex-col items-center md:items-start">
          <span className="text-2xl font-bold bg-gradient-to-r from-neuronav-primary to-neuronav-accent bg-clip-text text-transparent mb-2">NeuroNav</span>
          <span className="text-sm text-gray-600 max-w-xs text-center md:text-left mb-4">Revolutionizing neurodiagnostics with intelligent software.</span>
          <div className="flex gap-3 mt-2">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-gray-100 hover:bg-neuronav-primary/10 transition-colors group">
              <Linkedin className="w-6 h-6 text-gray-700 group-hover:text-neuronav-primary transition-colors" />
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-gray-100 hover:bg-neuronav-accent/10 transition-colors group">
              <Github className="w-6 h-6 text-gray-700 group-hover:text-neuronav-accent transition-colors" />
            </a>
          </div>
        </div>
        <div className="flex-1 min-w-[160px]">
          <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
          <ul className="space-y-2">
            {productLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="text-gray-700 hover:text-neuronav-primary transition-colors relative group">
                  <span className="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 transition-all">{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 min-w-[160px]">
          <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
          <ul className="space-y-2">
            {resourceLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="text-gray-700 hover:text-neuronav-accent transition-colors relative group">
                  <span className="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 transition-all">{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 min-w-[160px]">
          <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
          <ul className="space-y-2">
            {companyLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="text-gray-700 hover:text-primary transition-colors relative group">
                  <span className="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 transition-all">{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-12">© {year} NeuroNav. All rights reserved.</div>
    </motion.footer>
  );
} 