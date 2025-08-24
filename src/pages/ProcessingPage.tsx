import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import pituitaryAdenoma from '/images/pituitary-adenoma.jpg';

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing');
  const navigate = useNavigate();
  
  // Processing stages with weights
  const stages = [
    { name: 'Initializing scan data', weight: 10 },
    { name: 'Preprocessing MRI', weight: 15 },
    { name: 'Segmenting brain regions', weight: 20 },
    { name: 'Generating 3D model', weight: 25 },
    { name: 'Running AI analysis', weight: 20 },
    { name: 'Compiling results', weight: 10 },
  ];
  
  useEffect(() => {
    let stageIndex = 0;
    let stageProgress = 0;
    let interval: ReturnType<typeof setInterval>;
    
    const simulateProcessing = () => {
      interval = setInterval(() => {
        if (stageIndex >= stages.length) {
          clearInterval(interval);
          setTimeout(() => {
            // Redirect to results page with a mock scan ID
            navigate('/results/mock-scan-123');
          }, 1000);
          return;
        }
        
        const currentStage = stages[stageIndex];
        setStage(currentStage.name);
        
        stageProgress += Math.random() * 5;
        if (stageProgress >= 100) {
          stageProgress = 0;
          stageIndex++;
        }
        
        // Calculate overall progress based on completed stages and current stage progress
        const completedWeight = stages
          .slice(0, stageIndex)
          .reduce((sum, stage) => sum + stage.weight, 0);
        
        const currentWeight = stageProgress * (currentStage?.weight || 0) / 100;
        const totalProgress = completedWeight + currentWeight;
        
        setProgress(Math.min(Math.round(totalProgress), 100));
      }, 300);
    };
    
    simulateProcessing();
    
    return () => {
      clearInterval(interval);
    };
  }, [navigate]);
  
  // Animations
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };
  
  const imageAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 }
    }
  };
  
  const glowAnimation = {
    animate: {
      boxShadow: [
        "0px 0px 5px rgba(66, 153, 225, 0.3)",
        "0px 0px 15px rgba(66, 153, 225, 0.6)",
        "0px 0px 5px rgba(66, 153, 225, 0.3)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Enhanced Image */}
          <motion.div 
            initial="initial"
            animate="animate"
            whileHover="hover"
            variants={imageAnimation}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg overflow-hidden border border-blue-100"
          >
            <div className="p-4 bg-blue-600 text-white border-b border-blue-700">
              <h3 className="font-medium text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-200" />
                Pituitary Adenoma Case Study
              </h3>
            </div>
            <div className="p-6 flex flex-col items-center">
              <motion.div 
                className="rounded-lg overflow-hidden mb-4"
                animate={glowAnimation}
              >
                <motion.img 
                  src={pituitaryAdenoma} 
                  alt="Pituitary Adenoma Scan" 
                  className="w-full h-auto object-contain rounded-lg max-h-80"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <motion.p 
                className="text-sm text-blue-600 mt-3 text-center font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                This high-resolution MRI scan shows the characteristic features of a pituitary adenoma
              </motion.p>
              <motion.div
                className="mt-4 text-center bg-blue-50 p-3 rounded-lg border border-blue-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Diagnostic Confidence:</span> 99.96%
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Processing Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 text-center"
          >
            <div className="space-y-2">
              <motion.div
                animate={pulseAnimation}
                className="inline-block"
              >
                <Brain className="w-16 h-16 text-primary mx-auto" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight">
                Analyzing Your Brain Scan
              </h1>
              <p className="text-lg text-muted-foreground">
                {stage}...
              </p>
            </div>
            
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground max-w-md mx-auto text-center">
                Our AI is carefully analyzing your scan. This typically takes 2-3 minutes, 
                but may take longer for higher resolution scans.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}