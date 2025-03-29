
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Generate initials for avatar
  const getInitials = () => {
    if (!user.name) return user.email.substring(0, 2).toUpperCase();
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
            <AvatarFallback className="bg-purple-100 text-purple-800">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name || user.username || 'Insider Member'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/profile-setup">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {user.isNewUser ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-md">
              <p className="font-medium text-amber-800 dark:text-amber-300">Complete your profile setup</p>
              <p className="mt-1">Add your referral links to start tracking your impact.</p>
              <Button className="mt-2 bg-amber-600 hover:bg-amber-700" size="sm" asChild>
                <Link to="/profile-setup">
                  Complete Setup
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              <p className="font-medium">Your Referral Status</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>InsiderLife: {user.referralLinks.insiderlife ? 'Active' : 'Not Set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>InsiderDAO: {user.referralLinks.insiderdao ? 'Active' : 'Not Set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Societi: {user.referralLinks.societi ? 'Active' : 'Not Set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>AIFC: {user.referralLinks.aifc ? 'Active' : 'Not Set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
