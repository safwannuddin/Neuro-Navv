import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <Brain className="w-16 h-16 text-neuronav-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been moved, deleted, or never existed in the first place.
        </p>
        <div className="space-y-4">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Need help?</p>
          <p>If you believe this is an error, please contact our support team.</p>
          <a 
            href="mailto:support@neuronav.io" 
            className="text-primary hover:underline"
          >
            support@neuronav.io
          </a>
        </div>
      </motion.div>
    </div>
  );
}