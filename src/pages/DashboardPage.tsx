import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BrainCircuit,
  FileBarChart, 
  User, 
  Settings,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardScans from '@/components/dashboard/DashboardScans';
import DashboardInsights from '@/components/dashboard/DashboardInsights';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on URL path
    if (location.pathname.includes('/insights')) return 'insights';
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'scans';
  });
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name || 'Guest'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search scans..."
                  className="rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <Button variant="outline" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button asChild variant="gradient">
                <Link to="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scan
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Brain Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 from previous scan
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 days ago</div>
              <p className="text-xs text-muted-foreground mt-1">
                May 15, 2025
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2 GB</div>
              <p className="text-xs text-muted-foreground mt-1">
                of 5 GB (24%)
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Navigation + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <Link
                    to="/dashboard"
                    className={`flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                      activeTab === 'scans'
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    My Scans
                  </Link>
                  <Link
                    to="/dashboard/insights"
                    className={`flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                      activeTab === 'insights'
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileBarChart className="mr-2 h-4 w-4" />
                    AI Insights
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className={`flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className={`flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </nav>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="rounded-xl bg-muted p-4">
                    <h3 className="font-medium mb-2">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get assistance with scans or understanding your results.
                    </p>
                    <Button variant="outline" className="w-full text-sm" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden mb-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="scans" asChild>
                  <Link to="/dashboard" className="flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    Scans
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="insights" asChild>
                  <Link to="/dashboard/insights" className="flex items-center justify-center">
                    <FileBarChart className="h-4 w-4 mr-2" />
                    Insights
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="profile" asChild>
                  <Link to="/dashboard/profile" className="flex items-center justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="settings" asChild>
                  <Link to="/dashboard/settings" className="flex items-center justify-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route index element={<DashboardScans />} />
                <Route path="insights" element={<DashboardInsights />} />
                <Route path="profile" element={<DashboardProfile />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Routes>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}