import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock3,
  AlertTriangle,
  Brain,
  ArrowUpDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock scan data
const mockScans = [
  {
    id: 'scan-001',
    name: 'MRI Scan 1',
    date: new Date(2025, 4, 15),
    status: 'completed',
    type: 'MRI',
    size: '128 MB',
    score: 95
  },
  {
    id: 'scan-002',
    name: 'MRI Scan 2',
    date: new Date(2025, 4, 8),
    status: 'completed',
    type: 'MRI',
    size: '145 MB',
    score: 92
  },
  {
    id: 'scan-003',
    name: 'CT Scan 1',
    date: new Date(2025, 3, 22),
    status: 'completed',
    type: 'CT',
    size: '84 MB',
    score: 91
  },
  {
    id: 'scan-004',
    name: 'MRI Follow-up',
    date: new Date(2025, 3, 12),
    status: 'processing',
    type: 'MRI',
    size: '132 MB',
    score: null
  },
  {
    id: 'scan-005',
    name: 'SPECT Scan',
    date: new Date(2025, 2, 28),
    status: 'error',
    type: 'SPECT',
    size: '94 MB',
    score: null
  },
  {
    id: 'scan-006',
    name: 'MRI Routine',
    date: new Date(2025, 2, 15),
    status: 'completed',
    type: 'MRI',
    size: '138 MB',
    score: 87
  },
];

export default function DashboardScans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort scans
  const filteredScans = mockScans
    .filter(scan => 
      scan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'score') {
        if (a.score === null) return sortOrder === 'asc' ? -1 : 1;
        if (b.score === null) return sortOrder === 'asc' ? 1 : -1;
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
      }
      return 0;
    });
  
  // Toggle sort
  const handleSort = (field: 'date' | 'name' | 'score') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <Clock3 className="h-4 w-4 mr-1" />
            <span>Processing</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Error</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">My Brain Scans</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search scans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-input pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>
          
          <Button variant="outline" size="icon" aria-label="Filter">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button asChild variant="default">
            <Link to="/upload">
              Upload New
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredScans.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No scans found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'No scans match your search criteria.' : 'Upload your first brain scan to get started.'}
              </p>
              <Button asChild>
                <Link to="/upload">Upload First Scan</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => handleSort('name')}
                      >
                        Scan Name
                        {sortBy === 'name' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => handleSort('date')}
                      >
                        Date
                        {sortBy === 'date' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => handleSort('score')}
                      >
                        Health Score
                        {sortBy === 'score' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Size</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.map((scan) => (
                    <motion.tr 
                      key={scan.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-primary flex items-center gap-2">
                        <Brain className="h-5 w-5 text-muted-foreground" />
                        {scan.status === 'completed' ? (
                          <Link to={`/results/${scan.id}`} className="hover:underline">
                            {scan.name}
                          </Link>
                        ) : (
                          <span>{scan.name}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">{scan.type}</td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{scan.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{scan.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <StatusIndicator status={scan.status} />
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {scan.score ? (
                          <div className="flex items-center">
                            <div className="w-12 h-2 bg-muted rounded-full mr-2">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-neuronav-primary to-neuronav-accent"
                                style={{ width: `${scan.score}%` }}
                              ></div>
                            </div>
                            <span>{scan.score}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">{scan.size}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {scan.status === 'completed' && (
                            <Button variant="ghost" size="icon" aria-label="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" aria-label="More options">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}