
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Shield } from 'lucide-react';

const AdminLoginTest = () => {
  const { user, login, ensureAdminExists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure admin account exists
    ensureAdminExists();
    console.log('✅ Admin login test page loaded');
  }, [ensureAdminExists]);

  const testAdminLogin = async () => {
    try {
      await login('admin@insiderlife.com', '773Pdq8908$#');
      console.log('✅ Admin login test successful');
    } catch (error) {
      console.error('❌ Admin login test failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-purple-600" />
            Admin Login Test
          </CardTitle>
          <CardDescription>
            Verify admin account is properly configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="font-medium">Admin Account:</div>
            <div className="ml-auto">
              {user?.role === 'admin' ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Logged in as admin</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Not logged in as admin</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="font-medium">Credentials:</div>
            <div className="ml-auto">
              <div className="text-sm text-gray-500">admin@insiderlife.com</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={testAdminLogin}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Test Admin Login
          </Button>
          
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="w-full"
          >
            Go to Admin Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginTest;
