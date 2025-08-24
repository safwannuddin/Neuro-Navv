import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { setupAdminUser } from '@/lib/setup-admin';
import { useToast } from '@/components/ui/use-toast';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSetup = async () => {
    setLoading(true);
    try {
      const { error } = await setupAdminUser();
      
      if (error) {
        console.error('Setup error:', error);
        toast({
          title: "Error",
          description: "Failed to set up admin user. Please check the console for details.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Admin user created successfully. You can now sign in with admin@gmail.com / admin123",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Initial Setup</CardTitle>
            <CardDescription className="text-center">
              Set up the admin user for NeuroNav
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will create an admin user with the following credentials:
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm">
                  <strong>Email:</strong> admin@gmail.com<br />
                  <strong>Password:</strong> admin123
                </p>
              </div>
              <Button
                onClick={handleSetup}
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Set Up Admin User'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 