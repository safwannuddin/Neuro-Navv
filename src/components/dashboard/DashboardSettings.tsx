import { useState } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Moon, Sun, Globe, Eye, EyeOff, Shield, Lock, Mail, BellOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/theme-context';

export default function DashboardSettings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      scanCompleted: true,
      newInsights: true,
      productUpdates: false,
      marketingEmails: false,
    },
    privacy: {
      shareData: false,
      anonymousAnalytics: true,
      showProfile: true,
    },
    preferences: {
      highContrastMode: false,
      autoPlayVideos: true,
      showTutorials: true,
    }
  });
  
  // Handle toggle changes
  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[keyof typeof prev]],
      }
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
      variant: "default",
    });
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        
        <Button variant="gradient" onClick={saveSettings}>
          Save Changes
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 mr-2 text-primary" />
              ) : (
                <Sun className="h-5 w-5 mr-2 text-primary" />
              )}
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how NeuroNav looks for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center">
                  <Sun className="h-4 w-4 mr-2" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-4 w-4 ml-2" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">High Contrast Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={settings.preferences.highContrastMode}
                  onCheckedChange={() => handleToggle('preferences', 'highContrastMode')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-Play Videos</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically play tutorial videos
                  </p>
                </div>
                <Switch
                  checked={settings.preferences.autoPlayVideos}
                  onCheckedChange={() => handleToggle('preferences', 'autoPlayVideos')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Tutorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Display tutorial hints and tips
                  </p>
                </div>
                <Switch
                  checked={settings.preferences.showTutorials}
                  onCheckedChange={() => handleToggle('preferences', 'showTutorials')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellRing className="h-5 w-5 mr-2 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={() => handleToggle('notifications', 'emailNotifications')}
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Scan Completed</p>
                      <p className="text-xs text-muted-foreground">
                        When your brain scan processing is complete
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.scanCompleted}
                      onCheckedChange={() => handleToggle('notifications', 'scanCompleted')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">New AI Insights</p>
                      <p className="text-xs text-muted-foreground">
                        When new insights are generated for your scans
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newInsights}
                      onCheckedChange={() => handleToggle('notifications', 'newInsights')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Product Updates</p>
                      <p className="text-xs text-muted-foreground">
                        New features and platform improvements
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.productUpdates}
                      onCheckedChange={() => handleToggle('notifications', 'productUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Marketing Emails</p>
                      <p className="text-xs text-muted-foreground">
                        Promotional content and special offers
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketingEmails}
                      onCheckedChange={() => handleToggle('notifications', 'marketingEmails')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your data privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Share Data for Research</h3>
                  <p className="text-sm text-muted-foreground">
                    Anonymously share scan data to improve AI analysis
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareData}
                  onCheckedChange={() => handleToggle('privacy', 'shareData')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Anonymous Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Help improve our platform with usage data
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.anonymousAnalytics}
                  onCheckedChange={() => handleToggle('privacy', 'anonymousAnalytics')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Public Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow other users to see your profile
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.showProfile}
                  onCheckedChange={() => handleToggle('privacy', 'showProfile')}
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Security Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Update Email Address
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Setup Two-Factor Authentication
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                    <BellOff className="h-4 w-4 mr-2" />
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}