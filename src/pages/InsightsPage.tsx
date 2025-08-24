import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Download, Share, Printer, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

// Mock data for charts
const brainRegionData = [
  { name: 'Frontal Lobe', score: 96, average: 95 },
  { name: 'Temporal Lobe', score: 92, average: 94 },
  { name: 'Parietal Lobe', score: 98, average: 93 },
  { name: 'Occipital Lobe', score: 97, average: 95 },
  { name: 'Cerebellum', score: 99, average: 96 },
  { name: 'Brainstem', score: 95, average: 94 },
];

const activityData = [
  { time: '0s', activity: 10 },
  { time: '5s', activity: 25 },
  { time: '10s', activity: 15 },
  { time: '15s', activity: 40 },
  { time: '20s', activity: 25 },
  { time: '25s', activity: 35 },
  { time: '30s', activity: 55 },
];

const trendData = [
  { month: 'Jan', score: 87 },
  { month: 'Feb', score: 89 },
  { month: 'Mar', score: 91 },
  { month: 'Apr', score: 92 },
  { month: 'May', score: 94 },
  { month: 'Jun', score: 95 },
];

export default function InsightsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();
  
  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(`https://neuronav.app/insights/${id}`);
    toast({
      title: "Link Copied",
      description: "Insights link has been copied to clipboard",
      variant: "default",
    });
  };
  
  // Handle download
  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Your PDF report will be downloaded shortly",
      variant: "default",
    });
  };
  
  // Handle print
  const handlePrint = () => {
    toast({
      title: "Preparing Print",
      description: "Opening print dialog...",
      variant: "default",
    });
    window.print();
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
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
            <Link to={`/results/${id}`} className="hover:text-primary transition-colors">
              Scan Results
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">AI Insights</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                AI Analysis Insights
              </h1>
              <p className="text-muted-foreground">
                Scan ID: {id} • Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="gradient" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis Summary</CardTitle>
                  <CardDescription>
                    Overall assessment based on your brain scan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="mr-4 bg-primary/10 p-3 rounded-full">
                        <Brain className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Healthy Brain Profile</h3>
                        <p className="text-sm text-muted-foreground">Overall match: 96% with healthy baseline</p>
                      </div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      No Significant Concerns
                    </div>
                  </div>
                  
                  <div className="prose max-w-none dark:prose-invert">
                    <p>
                      Based on our AI analysis, your brain scan shows overall normal structural patterns
                      consistent with healthy individuals in your demographic group. There are two minor
                      areas of interest that fall within normal variation but are worth noting:
                    </p>
                    
                    <ul className="mt-4 space-y-2">
                      <li>
                        <strong>Temporal Lobe:</strong> A slight increase in signal intensity was detected in the
                        left temporal region. This is a common finding and may be related to recent cognitive activity.
                        No clinical action is suggested at this time.
                      </li>
                      <li>
                        <strong>Hippocampal Region:</strong> There is a minor (4%) volume asymmetry between left and
                        right hippocampus, which falls within the normal range of variation seen in healthy brains.
                      </li>
                    </ul>
                    
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h4 className="text-md font-medium mb-2">Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        No follow-up actions are medically indicated based on this scan. Routine follow-up
                        scan recommended in 12-18 months as part of regular health monitoring.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Brain Region Analysis</CardTitle>
                  <CardDescription>
                    Comparative scores across major brain regions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={brainRegionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[75, 100]} />
                        <Tooltip />
                        <Bar name="Your Score" dataKey="score" fill="#7C3AED" />
                        <Bar name="Healthy Average" dataKey="average" fill="#94A3B8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    The chart above compares your brain metrics against healthy population averages.
                    All regions score within normal parameters, with particularly strong results in
                    the parietal lobe and cerebellum.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Key Observations</CardTitle>
                  <CardDescription>
                    Notable findings from your brain scan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-30 p-2 rounded-full mr-4 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Normal Cortical Thickness</h3>
                        <p className="text-sm text-muted-foreground">
                          Your cerebral cortex shows normal thickness throughout all measured regions,
                          indicating healthy neural density and organization.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-30 p-2 rounded-full mr-4 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Balanced Hemispheric Symmetry</h3>
                        <p className="text-sm text-muted-foreground">
                          Your brain exhibits excellent symmetry between left and right hemispheres,
                          with minimal structural variations within the normal range.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 p-2 rounded-full mr-4 mt-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Slight Signal Enhancement</h3>
                        <p className="text-sm text-muted-foreground">
                          A minor increase in signal intensity was observed in the left temporal region.
                          This is likely a normal variation and not indicative of any pathology.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Structural Analysis</CardTitle>
                  <CardDescription>
                    Comprehensive evaluation of brain structures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Cortical Structures</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Frontal Lobe</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Volume</span>
                            <span className="text-sm font-medium">95% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Normal frontal lobe volume with expected sulcal patterns.
                            Executive function areas show typical development.
                          </p>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Temporal Lobe</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Volume</span>
                            <span className="text-sm font-medium">92% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Left temporal lobe shows slight signal enhancement.
                            Memory and language centers appear structurally normal.
                          </p>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Parietal Lobe</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Volume</span>
                            <span className="text-sm font-medium">98% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '98%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Excellent structural integrity in sensory integration areas.
                            No abnormalities detected in spatial processing regions.
                          </p>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Occipital Lobe</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Volume</span>
                            <span className="text-sm font-medium">97% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '97%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Visual processing regions show normal development.
                            Primary and secondary visual cortex have expected structure.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Subcortical Structures</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Hippocampus</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Symmetry</span>
                            <span className="text-sm font-medium">96% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '96%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            4% volume asymmetry between left and right hippocampus,
                            which falls within normal variation range.
                          </p>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Amygdala</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Volume</span>
                            <span className="text-sm font-medium">99% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '99%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Emotion processing centers appear normal with
                            excellent bilateral symmetry and expected volume.
                          </p>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Cerebellum</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Structure</span>
                            <span className="text-sm font-medium">98% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '98%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Motor coordination and balance centers show excellent
                            development with normal cerebellar foliation.
                          </p>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Basal Ganglia</h4>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Volume</span>
                            <span className="text-sm font-medium">97% match</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mb-3">
                            <div className="bg-neuronav-primary h-2 rounded-full" style={{ width: '97%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Movement control systems appear normal with expected
                            structure in caudate, putamen and globus pallidus.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Neural Activity Visualization</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={activityData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="activity" 
                              stroke="#7C3AED" 
                              fillOpacity={1} 
                              fill="url(#colorActivity)" 
                              name="Neural Activity"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        This chart represents relative neural activity levels across the temporal
                        sequence of your scan. The peaks indicate moments of higher detected activity,
                        particularly in frontal and parietal regions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Technical Measurements</CardTitle>
                  <CardDescription>
                    Quantitative metrics from your brain scan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Structure</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Volume (cm³)</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Thickness (mm)</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Signal Intensity</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Percentile</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Frontal Lobe (L)</td>
                          <td className="py-3 px-4">170.3</td>
                          <td className="py-3 px-4">2.8</td>
                          <td className="py-3 px-4">Normal</td>
                          <td className="py-3 px-4">65th</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Frontal Lobe (R)</td>
                          <td className="py-3 px-4">169.8</td>
                          <td className="py-3 px-4">2.7</td>
                          <td className="py-3 px-4">Normal</td>
                          <td className="py-3 px-4">63rd</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Temporal Lobe (L)</td>
                          <td className="py-3 px-4">124.2</td>
                          <td className="py-3 px-4">3.1</td>
                          <td className="py-3 px-4">Slightly Enhanced</td>
                          <td className="py-3 px-4">58th</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Temporal Lobe (R)</td>
                          <td className="py-3 px-4">123.9</td>
                          <td className="py-3 px-4">3.0</td>
                          <td className="py-3 px-4">Normal</td>
                          <td className="py-3 px-4">57th</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Hippocampus (L)</td>
                          <td className="py-3 px-4">4.2</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4">Normal</td>
                          <td className="py-3 px-4">72nd</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Hippocampus (R)</td>
                          <td className="py-3 px-4">4.0</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4">Normal</td>
                          <td className="py-3 px-4">68th</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    All measurements fall within expected ranges for your demographic group.
                    The slight left-right asymmetry observed in hippocampal volumes (4% difference)
                    is within normal variation and not clinically significant.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Longitudinal Analysis</CardTitle>
                  <CardDescription>
                    Brain health trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="mb-4">
                      This chart shows the progression of your brain health score over the past 6 months.
                      The score is calculated based on multiple structural and functional indicators.
                    </p>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trendData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[80, 100]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#7C3AED" 
                            strokeWidth={2}
                            dot={{ r: 6 }}
                            activeDot={{ r: 8 }}
                            name="Brain Health Score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Your brain health score has shown gradual improvement over the past 6 months,
                      indicating positive adaptive changes. The most recent score of 95 represents
                      excellent brain health for your demographic.
                    </p>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Key Trends & Observations</h3>
                    <div className="space-y-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Improving Temporal Function
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your temporal lobe scores have improved by 8% over the past 6 months,
                          suggesting enhanced memory and language processing capabilities.
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Stable Frontal Activity
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Executive function indicators have remained consistently strong,
                          with frontal lobe metrics showing excellent stability over time.
                        </p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          Normalized Brain Symmetry
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          The slight asymmetry previously observed in hippocampal volumes has
                          remained stable and continues to fall within normal parameters.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Future Projections</CardTitle>
                  <CardDescription>
                    AI-powered brain health forecasting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg mb-6">
                    <div className="flex items-start">
                      <div className="mr-4 bg-primary/20 p-2 rounded-full">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Optimized Brain Health Trajectory</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on current data and trends, our AI projects continued optimal
                          brain health with minimal age-related changes over the next 12-24 months.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-medium">Regular Follow-up Scan</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Schedule your next brain scan in 12-18 months to continue monitoring
                          brain health and establish a comprehensive baseline for future comparison.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cognitive Enhancement Activities</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Continue with activities that challenge different cognitive domains:
                          memory tasks, problem-solving, and creative exercises to maintain
                          neural plasticity and cognitive resilience.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-medium">Physical Exercise</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Regular aerobic exercise has been shown to enhance brain health and
                          protect against age-related decline. Aim for at least 150 minutes
                          of moderate activity per week.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}