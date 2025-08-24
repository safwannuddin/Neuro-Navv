import { useState, useRef, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Download, Share, AlertCircle, FileBarChart, CheckCircle, Loader2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BrainModel } from '@/components/3d/BrainModel';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  id: string;
  date: Date;
  predictionResult: {
    predicted_class: string;
    confidence: number;
    all_probabilities: {
      [key: string]: number;
    };
    heatmap_url?: string;
    message?: string;
  };
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<'standard' | 'anomaly'>('standard');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Assuming we fetch scan result data from an API endpoint
  // For now, we'll mock this data
  const [scanResult, setScanResult] = useState<ScanResult>({
    id: id || 'unknown',
    date: new Date(),
    predictionResult: {
      predicted_class: 'glioma',
      confidence: 0.92,
      all_probabilities: {
        glioma: 0.92,
        meningioma: 0.05,
        notumor: 0.02,
        pituitary: 0.01
      },
      heatmap_url: '/debug_heatmap.png'
    }
  });
  
  // Mock function to simulate different results for testing
  const toggleNoTumor = () => {
    if (scanResult.predictionResult.predicted_class === 'notumor') {
      setScanResult({
        ...scanResult,
        predictionResult: {
          predicted_class: 'glioma',
          confidence: 0.92,
          all_probabilities: {
            glioma: 0.92,
            meningioma: 0.05,
            notumor: 0.02,
            pituitary: 0.01
          },
          heatmap_url: '/debug_heatmap.png'
        }
      });
    } else {
      setScanResult({
        ...scanResult,
        predictionResult: {
          predicted_class: 'notumor',
          confidence: 0.96,
          all_probabilities: {
            glioma: 0.01,
            meningioma: 0.02,
            notumor: 0.96,
            pituitary: 0.01
          },
          message: 'No suspicious regions detected.'
        }
      });
    }
  };
  
  // Mock anomaly data - only show if not "notumor"
  const anomalies = scanResult.predictionResult.predicted_class !== 'notumor' ? [
    {
      id: 'anomaly-1',
      name: 'Frontal Lobe',
      severity: 'Low',
      description: 'Minor structural variations detected in the right frontal lobe, commonly seen in 15% of the population.',
      coordinates: { x: 25, y: 60, z: 15 },
    },
    {
      id: 'anomaly-2',
      name: 'Temporal Lobe',
      severity: 'Moderate',
      description: 'Increased signal intensity observed in the left temporal lobe, may indicate recent activity or minor inflammation.',
      coordinates: { x: -30, y: 10, z: 5 },
    },
    {
      id: 'anomaly-3',
      name: 'Hippocampus',
      severity: 'Low',
      description: 'Slight volume difference between left and right hippocampus (4%), within normal asymmetry range.',
      coordinates: { x: 0, y: 10, z: -5 },
    },
  ] : [];
  
  // Handle region selection
  const handleRegionClick = (id: string) => {
    setSelectedRegion(id === selectedRegion ? null : id);
  };
  
  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(`https://neuronav.app/results/${id}`);
    toast({
      title: "Link Copied",
      description: "Results link has been copied to clipboard.",
      variant: "default",
    });
  };
  
  // Handle download
  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Your report will be downloaded shortly.",
      variant: "default",
    });
  };
  
  // Adjust canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Any additional canvas adjustments if needed
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/dashboard/scans" className="hover:text-primary transition-colors">
              Scans
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Scan Results</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Brain Scan Results
              </h1>
              <p className="text-muted-foreground">
                Scan ID: {id} • Processed on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link to={`/insights/${id}`}>
                  <FileBarChart className="h-4 w-4 mr-2" />
                  View AI Insights
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Brain Model Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>3D Brain Model</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className={viewMode === 'standard' ? 'text-muted-foreground' : 'text-primary font-medium'}>
                    Highlight Anomalies
                  </span>
                  <Switch
                    checked={viewMode === 'anomaly'}
                    onCheckedChange={(checked) => setViewMode(checked ? 'anomaly' : 'standard')}
                  />
                </div>
              </CardHeader>
              <CardContent>                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-md"
                  ref={canvasRef}
                >
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <span>Loading 3D model...</span>
                      </div>
                    </div>
                  }>
                    <Canvas camera={{ position: [0, 0, 75], fov: 45 }}>
                      <ambientLight intensity={0.5} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                      <pointLight position={[-10, -10, -10]} />
                      
                      <BrainModel 
                        viewMode={viewMode} 
                        selectedRegion={selectedRegion}
                        anomalies={anomalies}
                      />
                      
                      <OrbitControls 
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        autoRotate={false}
                      />
                    </Canvas>
                  </Suspense>
                  
                  <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
                    Click and drag to rotate • Scroll to zoom
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
          
          {/* Anomalies Section */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {scanResult.predictionResult.predicted_class === 'notumor' 
                    ? 'Analysis Results' 
                    : 'Detected Anomalies'}
                </CardTitle>
                {/* For testing purposes - remove in production */}
                <Button variant="ghost" size="sm" onClick={toggleNoTumor} className="text-xs">
                  Toggle Test Mode
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanResult.predictionResult.predicted_class === 'notumor' ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="font-medium mb-1">No abnormality or tumor detected in this scan.</p>
                      <p className="text-sm text-muted-foreground">
                        Your brain scan appears to be within normal parameters.
                      </p>
                    </div>
                  ) : anomalies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-12 w-12 text-primary mb-4" />
                      <p className="font-medium mb-1">No anomalies detected</p>
                      <p className="text-sm text-muted-foreground">
                        Your brain scan appears to be within normal parameters.
                      </p>
                    </div>
                  ) : (
                    anomalies.map((anomaly) => (
                      <motion.div
                        key={anomaly.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedRegion === anomaly.id 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => handleRegionClick(anomaly.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{anomaly.name}</h3>
                          <div className={`
                            px-2 py-0.5 text-xs rounded-full
                            ${anomaly.severity === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400' : ''}
                            ${anomaly.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-400' : ''}
                            ${anomaly.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400' : ''}
                          `}>
                            {anomaly.severity} Severity
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {anomaly.description}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <span className="mr-2">Coordinates:</span>
                            <code className="bg-muted-foreground/10 px-1 py-0.5 rounded text-xs">
                              x:{anomaly.coordinates.x}, y:{anomaly.coordinates.y}, z:{anomaly.coordinates.z}
                            </code>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium mb-3">Comparison with Healthy Brain</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This analysis compares your scan with a database of healthy brains in similar demographic groups.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Overall Match</span>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-gradient-to-r from-neuronav-primary to-neuronav-accent h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Frontal Lobe</span>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className="bg-neuronav-primary h-1.5 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Temporal Lobe</span>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className="bg-neuronav-primary h-1.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Parietal Lobe</span>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className="bg-neuronav-primary h-1.5 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Occipital Lobe</span>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className="bg-neuronav-primary h-1.5 rounded-full" style={{ width: '97%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}