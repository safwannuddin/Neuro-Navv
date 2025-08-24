import { useState, useCallback, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, X, Loader2, Brain, Image as ImageIcon, FileBarChart, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadFile } from '@/lib/storage';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BrainModel } from '@/components/3d/BrainModel';

interface BackendPredictionResult {
  predicted_class: string;
  confidence: number;
  all_probabilities: {
    [key: string]: number;
  };
  heatmap_url?: string; // URL to the generated heatmap image
}

interface BackendScanResults {
  scan_id: string;
  status: string;
  progress: number;
  results?: {
    prediction?: BackendPredictionResult;
  };
  created_at: string;
}

interface DisplayPredictionResult {
    predicted_class: string;
    confidence: number;
    all_probabilities: { [key: string]: number };
    heatmap_url?: string;
}

const POLLING_INTERVAL = 5000;
const MAX_POLLING_ATTEMPTS = 60;
const MIN_PROCESSING_TIME = 16000; // 16 seconds minimum processing time
const PROCESSING_INTERVAL = 300; // Update progress every 300ms

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<DisplayPredictionResult | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [showChat, setShowChat] = useState(false);
  
  // Processing stages with weights
  const stages = [
    { name: 'Initializing scan data', weight: 10 },
    { name: 'Preprocessing image', weight: 15 },
    { name: 'Analyzing brain regions', weight: 20 },
    { name: 'Running AI model', weight: 25 },
    { name: 'Generating predictions', weight: 20 },
    { name: 'Compiling results', weight: 10 },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const selectedFile = acceptedFiles[0];
    console.log('File selected:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: new Date(selectedFile.lastModified).toLocaleString()
    });
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setPredictionResult(null);
    setScanId(null);
    setBackendStatus(null);
    setPollingAttempts(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/zip': ['.zip'],
      'application/octet-stream': ['.nii', '.dcm'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
    setPredictionResult(null);
    setScanId(null);
    setBackendStatus(null);
    setPollingAttempts(0);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setBackendStatus('Uploading...');
    setPredictionResult(null);
    setScanId(null);
    setPollingAttempts(0);
    setStartTime(Date.now());
    setActiveTab('processing');
    
    try {
      console.log('Starting upload process...');
      const uploadResult = await uploadFile(file);
      
      console.log('Upload result:', uploadResult);
      
      if (uploadResult.id) {
        setScanId(uploadResult.id);
        setBackendStatus('Processing...');
      } else {
          throw new Error("Upload successful but no scan ID received.");
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setLoading(false);
      setBackendStatus('Failed');
      setStartTime(null);
    }
  };

  useEffect(() => {
    let pollingTimer: NodeJS.Timeout;
    
    const pollResults = async () => {
      if (!scanId || !startTime) return;
      
      // Only poll for results after minimum processing time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_PROCESSING_TIME) {
        pollingTimer = setTimeout(pollResults, PROCESSING_INTERVAL);
        return;
      }
      
      console.log(`Polling for results for scan ID: ${scanId} (Attempt ${pollingAttempts + 1}/${MAX_POLLING_ATTEMPTS})`);
      
      try {
        const response = await fetch(`http://localhost:8000/api/v1/results/${scanId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BackendScanResults = await response.json();
        console.log('Polling response data:', data);
        
        setBackendStatus(data.status);
        
        if (data.status === 'completed') {
          console.log('Backend processing completed.', data.results?.prediction);
          setLoading(false);
          
          if (data.results?.prediction) {
            setPredictionResult(data.results.prediction);
          } else {
            setError("Processing completed, but no prediction results found.");
          }
        } else if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
             console.warn('Max polling attempts reached.');
             setError('Processing taking too long. Please try again later.');
             setLoading(false);
             setBackendStatus('Timeout');
        } else {
          setPollingAttempts(prev => prev + 1);
          pollingTimer = setTimeout(pollResults, POLLING_INTERVAL);
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError(`Failed to fetch results: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
        setBackendStatus('Polling Failed');
      }
    };
    
    if (scanId && backendStatus !== 'completed' && backendStatus !== 'Failed' && backendStatus !== 'Timeout') {
       pollingTimer = setTimeout(pollResults, PROCESSING_INTERVAL);
    }
    
    return () => {
      clearTimeout(pollingTimer);
    };
  }, [scanId, backendStatus, pollingAttempts, startTime]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    let stageIndex = 0;
    let stageProgress = 0;
    let interval: ReturnType<typeof setInterval>;
    
    const simulateProcessing = () => {
      if (!scanId || backendStatus !== 'Processing...' || !startTime) return;
      
      interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const timeProgress = Math.min((elapsedTime / MIN_PROCESSING_TIME) * 100, 100);
        
        if (stageIndex >= stages.length) {
          // Only clear interval if we've reached minimum processing time
          if (elapsedTime >= MIN_PROCESSING_TIME) {
            clearInterval(interval);
            return;
          }
          // Otherwise, keep the last stage
          stageIndex = stages.length - 1;
        }
        
        const currentStage = stages[stageIndex];
        setStage(currentStage.name);
        
        // Calculate stage progress based on time
        const stageDuration = MIN_PROCESSING_TIME / stages.length;
        const stageElapsedTime = elapsedTime - (stageIndex * stageDuration);
        stageProgress = Math.min((stageElapsedTime / stageDuration) * 100, 100);
        
        if (stageProgress >= 100 && elapsedTime >= (stageIndex + 1) * stageDuration) {
          stageProgress = 0;
          stageIndex++;
        }
        
        // Calculate overall progress based on completed stages and current stage progress
        const completedWeight = stages
          .slice(0, stageIndex)
          .reduce((sum, stage) => sum + stage.weight, 0);
        
        const currentWeight = stageProgress * (currentStage?.weight || 0) / 100;
        const totalProgress = Math.min(completedWeight + currentWeight, timeProgress);
        
        setProgress(Math.min(Math.round(totalProgress), 100));
      }, PROCESSING_INTERVAL);
    };
    
    if (backendStatus === 'Processing...' && startTime) {
      simulateProcessing();
    } else {
      setProgress(0);
      setStage('Initializing');
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [scanId, backendStatus, startTime]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-7xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Upload Medical Scan / Image</CardTitle>
              <CardDescription>
                Upload a brain MRI image or medical scan for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!file ? (
                   <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center py-6">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        {isDragActive ? (
                          <p className="text-lg font-medium">Drop your file here...</p>
                        ) : (
                          <>
                            <p className="text-lg font-medium mb-2">
                              Drag & drop your file or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Supports images (.jpg, .png) and medical scans (.dcm, .nii, .nii.gz)
                            </p>
                            <Button variant="outline" className="mt-2">
                              <Upload className="h-4 w-4 mr-2" />
                              Select File
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Uploaded Image
                      </TabsTrigger>
                      <TabsTrigger value="processing" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Processing
                      </TabsTrigger>
                      <TabsTrigger value="model" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        3D Model
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Card className="h-full">
                            <CardHeader>
                              <CardTitle>Upload Medical Scan / Image</CardTitle>
                              <CardDescription>Upload a brain MRI image or medical scan for analysis.</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary/70'}`}
                              >
                                <input {...getInputProps()} />
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                {isDragActive ? (
                                  <p className="text-primary">Drop the files here ...</p>
                                ) : (
                                  <p>Drag 'n' drop some files here, or click to select files</p>
                                )}
                                <p className="text-sm text-muted-foreground mt-2">(PNG, JPG, JPEG, NII, DCM or ZIP of images)</p>
                              </div>
                              {file && (
                                <div className="mt-4 p-4 border rounded-lg flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <span>{file.name}</span>
                                    <span className="text-sm text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={clearFile}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                              {error && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-destructive text-sm mt-4 p-3 bg-destructive/10 rounded-md flex items-center gap-2"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  {error}
                                </motion.div>
                              )}
                              <Button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="w-full mt-6 py-2 text-lg"
                              >
                                {loading ? (
                                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                  <Upload className="h-5 w-5 mr-2" />
                                )}
                                {loading ? backendStatus : "Upload & Analyze"}
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                        <div>
                          {preview ? (
                            <Card className="h-full">
                              <CardHeader>
                                <CardTitle>Image Preview</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <img src={preview} alt="Scan Preview" className="max-w-full h-auto rounded-md object-contain" />
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className="h-full flex items-center justify-center">
                              <CardContent className="text-center text-muted-foreground py-8">
                                <ImageIcon className="mx-auto h-16 w-16 mb-4" />
                                <p>No image selected for preview.</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="processing" className="mt-4">
                      {backendStatus === 'completed' && predictionResult ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="flex justify-center items-start w-full"
                        >
                          <Card className="w-full max-w-6xl mx-auto rounded-2xl shadow-2xl bg-[#1e1e2e] border border-[#232336] text-[#e0e0e0] p-0">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                                <Brain className="h-7 w-7 text-primary" />
                                AI Diagnostic Report
                              </CardTitle>
                              <CardDescription className="text-[#cccccc]">
                                The following analysis is based on the highlighted regions in your scan.
                              </CardDescription>
                            </CardHeader>
                            <div className="flex flex-col md:flex-row gap-10 items-start px-12 pb-12">
                              {/* Heatmap Section */}
                              <div className="relative flex-shrink-0 w-full max-w-[420px]">
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-[#232336] bg-[#232336]">
                                  {predictionResult.predicted_class === "notumor" || !predictionResult.heatmap_url ? (
                                    <div className="w-full h-[350px] flex flex-col items-center justify-center p-6 text-center">
                                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                                      <p className="text-lg font-semibold text-white mb-2">No abnormality or tumor detected in this scan.</p>
                                      <p className="text-sm text-[#cccccc]">
                                        The AI analysis did not identify any suspicious regions that require highlighting.
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      <img
                                        src={predictionResult.heatmap_url}
                                        alt="Disease Region Heatmap"
                                        className="w-full h-auto object-contain"
                                        style={{ minHeight: 320, maxHeight: 420 }}
                                      />
                                      <div className="absolute bottom-3 left-3 bg-[#232336]/80 backdrop-blur-sm p-2 rounded-md text-xs shadow text-[#e0e0e0]">
                                        Red regions indicate areas of interest
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="mt-3 text-xs text-[#cccccc] text-center">
                                  {predictionResult.predicted_class === "notumor" || !predictionResult.heatmap_url ? (
                                    "Original scan shown without overlay as no suspicious regions were detected."
                                  ) : (
                                    <>
                                      This heatmap highlights regions most associated with the predicted condition.
                                      <div className="mt-3" />
                                      <div className="flex flex-col items-center gap-2">
                                        <span className="text-xs font-semibold">Red regions indicate areas of interest</span>
                                        <div className="flex items-center justify-center gap-4 mt-1">
                                          <span className="flex items-center gap-1 text-xs"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> High AI focus</span>
                                          <span className="flex items-center gap-1 text-xs"><span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span> Moderate</span>
                                          <span className="flex items-center gap-1 text-xs"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Low</span>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Combined AI Analysis Result + Probability Distribution */}
                              <div className="flex-1 flex flex-col gap-6 w-full">
                                <div className="flex flex-col md:flex-row gap-6 w-full">
                                  {/* Combined Card with divider */}
                                  <div className="flex-1 bg-[#232336] rounded-xl p-6 border border-primary/20 flex flex-col md:flex-row gap-0 items-stretch shadow-lg">
                                    {/* AI Analysis Result */}
                                    <div className="flex-1 flex flex-col justify-center pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-[#35354a] mb-6 md:mb-0">
                                      <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-base text-white">AI Analysis Result</span>
                                      </div>
                                      <div className="text-2xl font-bold text-primary mb-1">{predictionResult.predicted_class}</div>
                                      <div className="text-base text-[#cccccc] mb-1">Confidence: <span className="text-white font-semibold">{(predictionResult.confidence * 100).toFixed(2)}%</span></div>
                                      <div className="text-sm text-[#cccccc]">This is the most likely diagnosis based on your scan.</div>
                                    </div>
                                    {/* Divider for desktop */}
                                    <div className="hidden md:block w-px bg-[#35354a] mx-6" />
                                    {/* Probability Distribution */}
                                    <div className="flex-1 flex flex-col justify-center pl-0 md:pl-8">
                                      <div className="flex items-center gap-2 mb-2">
                                        <FileBarChart className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-base text-white">Probability Distribution</span>
                                      </div>
                                      <div className="space-y-3">
                                        {Object.entries(predictionResult.all_probabilities)
                                          .sort(([, a], [, b]) => (b as number) - (a as number))
                                          .map(([key, value]) => (
                                            <div key={key}>
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm capitalize text-[#cccccc]">{key}:</span>
                                                <span className="text-sm font-medium text-[#e0e0e0]">{(value as number * 100).toFixed(2)}%</span>
                                              </div>
                                              <Progress value={(value as number) * 100} className="w-full h-2 rounded-full" />
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Medical Insights */}
                                <div className="bg-gradient-to-br from-[#2e2e4d] via-[#232336] to-[#2e2e4d] rounded-xl p-5 border border-[#2a2a3a] relative overflow-hidden">
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 0.15, y: 0 }}
                                    transition={{ duration: 1.2, delay: 0.7 }}
                                    className="absolute right-4 top-4 text-[80px] text-primary/80 pointer-events-none select-none"
                                  >
                                    {predictionResult.predicted_class === "notumor" ? (
                                      <CheckCircle className="w-20 h-20" />
                                    ) : (
                                      <AlertCircle className="w-20 h-20" />
                                    )}
                                  </motion.div>
                                  <div className="flex items-center gap-2 mb-2 relative z-10">
                                    {predictionResult.predicted_class === "notumor" ? (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 text-warning" />
                                    )}
                                    <span className="font-semibold text-base text-white">Medical Insights</span>
                                  </div>
                                  {predictionResult.predicted_class === "notumor" ? (
                                    <p className="text-[#cccccc] mb-3 relative z-10">
                                      Based on the AI analysis, this scan shows characteristics of a <span className="font-semibold text-green-500">healthy brain</span> with <span className="font-semibold text-green-500">no tumor detected</span>. The confidence score of <span className="font-semibold text-green-500">{(predictionResult.confidence * 100).toFixed(2)}%</span> suggests a high likelihood of this assessment being accurate.
                                    </p>
                                  ) : (
                                    <p className="text-[#cccccc] mb-3 relative z-10">
                                      Based on the AI analysis, this scan shows characteristics consistent with <span className="font-semibold text-primary">{predictionResult.predicted_class}</span>. The high confidence score of <span className="font-semibold text-primary">{(predictionResult.confidence * 100).toFixed(2)}%</span> suggests a strong likelihood of this diagnosis.
                                    </p>
                                  )}
                                  <div className="inline-block bg-primary/10 text-primary font-semibold text-xs px-3 py-1 rounded-full mb-2 relative z-10">Recommendations</div>
                                  {predictionResult.predicted_class === "notumor" ? (
                                    <ul className="list-disc pl-5 text-sm text-[#e0e0e0] space-y-1 relative z-10">
                                      <li>Continue with regular health check-ups as recommended by your healthcare provider</li>
                                      <li>Maintain a brain-healthy lifestyle with adequate sleep, nutrition, and exercise</li>
                                      <li>Consider a routine follow-up scan in 12-18 months as part of preventative care</li>
                                    </ul>
                                  ) : (
                                    <ul className="list-disc pl-5 text-sm text-[#e0e0e0] space-y-1 relative z-10">
                                      <li>Consult with a medical professional for a comprehensive evaluation</li>
                                      <li>Consider additional imaging studies if recommended by your healthcare provider</li>
                                      <li>Schedule a follow-up scan in 3-6 months to monitor any changes</li>
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center">
                          {loading && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="flex flex-col items-center"
                            >
                              {/* Animated Brain Pulse/Rotate */}
                              <div className="relative h-48 flex items-center justify-center mb-8">
                                <motion.div
                                  animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                  className="absolute inset-0 rounded-full bg-gradient-to-r from-neuronav-primary/20 to-neuronav-accent/20 blur-xl"
                                />
                                <motion.div
                                  animate={{ rotateY: [0, 360] }}
                                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                  className="relative z-10"
                                >
                                  <Brain className="h-24 w-24 text-primary" />
                                </motion.div>
                              </div>
                              <p className="text-2xl font-bold mb-2">Analyzing your brain scan</p>
                              <p className="text-lg text-muted-foreground mb-6">
                                {stage}
                                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="inline-block">.</motion.span>
                                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} className="inline-block">.</motion.span>
                                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} className="inline-block">.</motion.span>
                              </p>
                              <div className="mb-6 w-full max-w-md mx-auto">
                                <Progress value={progress} className="h-2 mb-2 rounded-full" />
                                <p className="text-sm text-muted-foreground">{progress}% complete</p>
                              </div>
                              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Our AI is carefully analyzing your scan. This typically takes 2-3 minutes, but may take longer for higher resolution scans.
                              </p>
                            </motion.div>
                          )}
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-destructive text-center mt-8 p-4 bg-destructive/10 rounded-md"
                            >
                              <AlertCircle className="h-8 w-8 mb-2 mx-auto" />
                              <p className="font-medium mb-1">Processing Error</p>
                              <p className="text-sm">{error}</p>
                              <Button onClick={() => {
                                clearFile();
                                setActiveTab('upload');
                              }} className="mt-4">Try Another Scan</Button>
                            </motion.div>
                          )}
                          {!loading && !error && !predictionResult && (
                            <div className="text-muted-foreground">
                              <Brain className="h-16 w-16 mb-4 mx-auto" />
                              <p className="text-xl font-medium">Awaiting scan upload to begin processing.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="model" className="mt-4">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>3D Brain Model (Interactive)</CardTitle>
                          <CardDescription>Explore the 3D model of the brain scan.</CardDescription>
                        </CardHeader>
                        <CardContent>                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-[4/3] w-full overflow-hidden rounded-md h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px]"
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
                                <BrainModel viewMode="standard" />
                                <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} autoRotate={false} />
                              </Canvas>
                            </Suspense>
                            <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
                              Click and drag to rotate • Scroll to zoom
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Error: {error}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Floating Chat Button (bottom right) */}
      {backendStatus === 'completed' && predictionResult && (
        <>
          <motion.button
            onClick={() => setShowChat(true)}
            className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full shadow-lg p-4 hover:bg-primary/90 transition-all"
            aria-label="Open Chatbot"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          >
            <MessageCircle className="h-7 w-7" />
          </motion.button>
          {showChat && (
            <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30">
              <div className="relative m-8 rounded-2xl border border-[#232336] bg-[#232336] shadow-2xl overflow-hidden w-full max-w-md h-[600px]">
                <button
                  onClick={() => setShowChat(false)}
                  className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-1"
                  aria-label="Close Chatbot"
                >
                  ✕
                </button>
                <iframe
                  src="https://app.supportfast.ai/chatbot-iframe/bot-7cgal7t9e5"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', background: '#232336' }}
                  title="NeuroNav Assistant Chatbot"
                  allow="clipboard-write"
                ></iframe>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}