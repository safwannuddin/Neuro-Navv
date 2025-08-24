import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileBarChart, Brain, Calendar, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock insights data
const mockInsights = [
  {
    id: 'insight-001',
    scanId: 'scan-001',
    scanName: 'MRI Scan 1',
    date: new Date(2025, 4, 15),
    score: 95,
    mainFindings: 'Normal brain structures with excellent overall health metrics',
    recommendations: 'Continue current cognitive activities and physical exercise'
  },
  {
    id: 'insight-002',
    scanId: 'scan-002',
    scanName: 'MRI Scan 2',
    date: new Date(2025, 4, 8),
    score: 92,
    mainFindings: 'Minor temporal lobe signal variations, within normal parameters',
    recommendations: 'Follow-up scan in 6 months to monitor temporal region'
  },
  {
    id: 'insight-003',
    scanId: 'scan-003',
    scanName: 'CT Scan 1',
    date: new Date(2025, 3, 22),
    score: 91,
    mainFindings: 'Normal brain structures with no significant anomalies',
    recommendations: 'Regular follow-up scan in 12 months'
  },
  {
    id: 'insight-006',
    scanId: 'scan-006',
    scanName: 'MRI Routine',
    date: new Date(2025, 2, 15),
    score: 87,
    mainFindings: 'Mostly normal structures with mild ventricular asymmetry',
    recommendations: 'Follow-up scan in 6 months, increase cognitive exercises'
  },
];

// Chart data
const brainHealthData = [
  { date: 'Feb 2025', score: 87 },
  { date: 'Mar 2025', score: 91 },
  { date: 'Apr 2025', score: 92 },
  { date: 'May 2025', score: 95 },
];

const regionData = [
  { name: 'Frontal', score: 96 },
  { name: 'Temporal', score: 92 },
  { name: 'Parietal', score: 97 },
  { name: 'Occipital', score: 95 },
  { name: 'Cerebellum', score: 98 },
];

export default function DashboardInsights() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter insights based on search term
  const filteredInsights = mockInsights.filter(insight => 
    insight.scanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.mainFindings.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">AI Insights & Analysis</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Brain Health Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileBarChart className="h-5 w-5 mr-2 text-primary" />
              Brain Health Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={brainHealthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
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
              Your brain health score has improved by 8 points over the last 3 months,
              showing positive trends across multiple cognitive dimensions.
            </p>
          </CardContent>
        </Card>
        
        {/* Brain Region Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              Brain Region Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Bar 
                    dataKey="score" 
                    fill="#7C3AED"
                    name="Region Score"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Your cerebellum shows the highest performance at 98%, with strong scores
              across all regions. The temporal lobe shows the most room for improvement.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInsights.length === 0 ? (
            <div className="text-center py-12">
              <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No insights found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'No insights match your search criteria.' : 'Upload a scan to get AI-powered insights.'}
              </p>
              <Button asChild>
                <Link to="/upload">Upload Scan</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInsights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border rounded-lg overflow-hidden">
                    <div className="border-b p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 bg-primary/10 p-2 rounded-full">
                            <FileBarChart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              <Link to={`/insights/${insight.scanId}`} className="hover:text-primary">
                                {insight.scanName} Analysis
                              </Link>
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{insight.date.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-primary/10 px-3 py-1 rounded-full text-xs font-medium text-primary">
                          Score: {insight.score}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                          <p className="text-sm text-muted-foreground">
                            {insight.mainFindings}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                          <p className="text-sm text-muted-foreground">
                            {insight.recommendations}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/insights/${insight.scanId}`}>
                            View Full Analysis
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}