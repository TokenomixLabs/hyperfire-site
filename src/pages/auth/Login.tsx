import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ArrowLeft, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login, ensureAdminExists } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Ensure admin account exists on page load
  useEffect(() => {
    ensureAdminExists();
    console.log('✅ Login page loaded, admin account verified');
  }, [ensureAdminExists]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsSubmitting(true);
      await login(values.email, values.password);
      // If it's the admin account, redirect to admin dashboard
      if (values.email === 'admin@insiderlife.com') {
        console.log('✅ Admin login successful');
        navigate('/admin');
      }
      // Otherwise, navigation is handled in the login function based on user.isNewUser
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setIsSubmitting(true);
      await login('admin@insiderlife.com', '773Pdq8908$#');
      console.log('✅ Quick admin login successful');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900">
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-100/50"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
      </div>
      
      <AnimatedTransition>
        <div className="flex min-h-[calc(100vh-80px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Log in to access your InsiderLife account
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-semibold text-purple-600 hover:text-purple-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                </div>
              </form>
            </Form>

            <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold leading-6 text-purple-600 hover:text-purple-500">
                Sign up
              </Link>
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={handleAdminLogin}
                variant="outline"
                className="w-full mt-2 flex items-center justify-center"
                size="sm"
              >
                <Shield className="mr-2 h-4 w-4 text-amber-500" />
                <span className="text-xs">Admin Access</span>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default Login;
