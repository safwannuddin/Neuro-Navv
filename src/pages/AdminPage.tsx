import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  UserCheck, 
  Brain,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trash2,
  RefreshCw,
  Download,
  MoreHorizontal,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock scan data for admin
const mockScans = [
  {
    id: 'scan-001',
    patientId: 'p-001',
    patientName: 'John Smith',
    date: new Date(2025, 4, 15),
    status: 'completed',
    type: 'MRI',
    size: '128 MB',
  },
  {
    id: 'scan-002',
    patientId: 'p-002',
    patientName: 'Sarah Johnson',
    date: new Date(2025, 4, 10),
    status: 'completed',
    type: 'MRI',
    size: '112 MB',
  },
  {
    id: 'scan-003',
    patientId: 'p-003',
    patientName: 'David Lee',
    date: new Date(2025, 4, 8),
    status: 'processing',
    type: 'CT',
    size: '84 MB',
  },
  {
    id: 'scan-004',
    patientId: 'p-004',
    patientName: 'Maria Garcia',
    date: new Date(2025, 4, 5),
    status: 'error',
    type: 'MRI',
    size: '132 MB',
  },
  {
    id: 'scan-005',
    patientId: 'p-001',
    patientName: 'John Smith',
    date: new Date(2025, 4, 3),
    status: 'completed',
    type: 'SPECT',
    size: '94 MB',
  },
  {
    id: 'scan-006',
    patientId: 'p-005',
    patientName: 'Emily Chen',
    date: new Date(2025, 4, 1),
    status: 'completed',
    type: 'MRI',
    size: '143 MB',
  },
];

// Mock user data for admin
const mockUsers = [
  {
    id: 'p-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Patient',
    status: 'active',
    lastActive: new Date(2025, 4, 15),
    scanCount: 2,
  },
  {
    id: 'p-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Patient',
    status: 'active',
    lastActive: new Date(2025, 4, 10),
    scanCount: 1,
  },
  {
    id: 'p-003',
    name: 'David Lee',
    email: 'david.lee@example.com',
    role: 'Patient',
    status: 'inactive',
    lastActive: new Date(2025, 4, 8),
    scanCount: 1,
  },
  {
    id: 'p-004',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    role: 'Patient',
    status: 'active',
    lastActive: new Date(2025, 4, 5),
    scanCount: 1,
  },
  {
    id: 'p-005',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    role: 'Patient',
    status: 'active',
    lastActive: new Date(2025, 4, 1),
    scanCount: 1,
  },
  {
    id: 'd-001',
    name: 'Dr. Jane Smith',
    email: 'dr.jane@hospital.org',
    role: 'Doctor',
    status: 'active',
    lastActive: new Date(2025, 4, 15),
    scanCount: 8,
  },
];

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'scans' | 'users'>('scans');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { toast } = useToast();
  
  // Filter scans based on search and status
  const filteredScans = mockScans
    .filter(scan => 
      scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(scan => selectedStatus === 'all' || scan.status === selectedStatus);
  
  // Filter users based on search
  const filteredUsers = mockUsers
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  // Simulate scan reprocessing
  const handleReprocess = (id: string) => {
    toast({
      title: "Scan Queued",
      description: `Scan ${id} has been queued for reprocessing.`,
      variant: "default",
    });
  };
  
  // Simulate scan deletion
  const handleDelete = (id: string) => {
    toast({
      title: "Scan Deleted",
      description: `Scan ${id} has been permanently deleted.`,
      variant: "destructive",
    });
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
            <Clock className="h-4 w-4 mr-1" />
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
      case 'active':
        return (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Active</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Inactive</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center mb-2">
              <ShieldAlert className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Manage users, scans, and system settings
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder={activeTab === 'scans' ? "Search scans..." : "Search users..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Button variant="outline" size="icon" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Admin Controls</CardTitle>
                <CardDescription>
                  Manage NeuroNav platform data and users
                </CardDescription>
              </div>
              
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'scans' | 'users')}>
                <TabsList>
                  <TabsTrigger value="scans" className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Scan Management
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    User Management
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {activeTab === 'scans' && (
              <div>
                {/* Scan status filter chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedStatus === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedStatus('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedStatus === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedStatus('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedStatus === 'processing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedStatus('processing')}
                  >
                    Processing
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedStatus === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedStatus('error')}
                  >
                    Error
                  </button>
                </div>
                
                {/* Scans Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Scan ID</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Patient</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Size</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredScans.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center">
                            <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              No scans found matching your criteria
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredScans.map((scan) => (
                          <motion.tr 
                            key={scan.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium text-primary">{scan.id}</td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{scan.patientName}</p>
                                <p className="text-xs text-muted-foreground">{scan.patientId}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">{scan.type}</td>
                            <td className="py-4 px-4">
                              <div>
                                <p>{scan.date.toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {scan.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <StatusIndicator status={scan.status} />
                            </td>
                            <td className="py-4 px-4">{scan.size}</td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  aria-label="Reprocess" 
                                  onClick={() => handleReprocess(scan.id)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" aria-label="Download">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  aria-label="Delete" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(scan.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div>
                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Last Active</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Scans</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center">
                            <UserCheck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              No users found matching your criteria
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <motion.tr 
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium">{user.name}</td>
                            <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'Doctor' 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'bg-muted'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <StatusIndicator status={user.status} />
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p>{user.lastActive.toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {user.lastActive.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">{user.scanCount}</td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end">
                                <Button variant="ghost" size="icon" aria-label="More options">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}