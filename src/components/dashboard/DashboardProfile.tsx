import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Pencil, Save, X, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function DashboardProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: 'Neurologist',
    institution: 'Memorial Hospital',
    location: 'Boston, MA',
    bio: 'Specializing in neurological disorders with 10+ years of clinical experience. Focused on leveraging advanced imaging techniques for improved patient outcomes.',
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle edit mode
  const toggleEditing = () => {
    setEditing(!editing);
    if (editing) {
      // Reset form data if canceling edit
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        role: 'Neurologist',
        institution: 'Memorial Hospital',
        location: 'Boston, MA',
        bio: 'Specializing in neurological disorders with 10+ years of clinical experience. Focused on leveraging advanced imaging techniques for improved patient outcomes.',
      });
    }
  };
  
  // Save profile changes
  const saveProfile = () => {
    // In a real app, this would send the data to an API
    setEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
      variant: "default",
    });
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        
        {editing ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={toggleEditing}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="gradient" onClick={saveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={toggleEditing}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full overflow-hidden">
                  <img
                    src={user?.avatarUrl || "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200"}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                </div>
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-xl font-bold mb-1 text-center border-b border-border bg-transparent focus:outline-none focus:border-primary"
                />
              ) : (
                <h3 className="text-xl font-bold mb-1">{formData.name}</h3>
              )}
              
              {editing ? (
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="text-sm text-muted-foreground mb-4 text-center border-b border-border bg-transparent focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-sm text-muted-foreground mb-4">{formData.role}</p>
              )}
              
              <div className="w-full space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="flex-grow text-sm border-b border-border bg-transparent focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <span className="text-sm">{formData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground mr-3" />
                  {editing ? (
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      className="flex-grow text-sm border-b border-border bg-transparent focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <span className="text-sm">{formData.institution}</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="flex-grow text-sm border-b border-border bg-transparent focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <span className="text-sm">{formData.location}</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="text-sm">Member since May 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-input p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              ) : (
                <p className="text-muted-foreground">{formData.bio}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Scans</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Storage Used</p>
                  <p className="text-2xl font-bold">1.2 GB</p>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Plan Type</p>
                  <p className="text-2xl font-bold">Pro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">Last updated 2 months ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Enhance your account security</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Active Sessions</h3>
                    <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}