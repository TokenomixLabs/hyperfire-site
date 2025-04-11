
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ArrowLeft } from 'lucide-react';
import useReferralTracking from '@/hooks/useReferralTracking';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const Signup = () => {
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentReferrer } = useReferralTracking();

  // Get referral code from URL if present
  const urlParams = new URLSearchParams(location.search);
  const referralCode = urlParams.get('ref');

  useEffect(() => {
    // Log referral code if present for debugging
    if (referralCode) {
      console.log('✅ Referral detected:', referralCode);
    }
  }, [referralCode]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setGeneralError(null);
    try {
      setIsSubmitting(true);
      // Pass referral code to signup function
      await signup(values.email, values.password, referralCode);
      console.log('✅ Registration successful');
    } catch (error) {
      console.error('Signup error:', error);
      setGeneralError(error instanceof Error ? error.message : "Registration failed. Please try again.");
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
              Join InsiderLife
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Create your account to access exclusive content and features
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {generalError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                {generalError}
              </div>
            )}
            
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Sign up"}
                  </Button>
                </div>
              </form>
            </Form>

            <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold leading-6 text-purple-600 hover:text-purple-500">
                Log in
              </Link>
            </p>
            
            {referralCode && (
              <div className="mt-4 p-2 bg-purple-100 dark:bg-purple-800/30 rounded-md">
                <p className="text-center text-xs text-purple-700 dark:text-purple-300">
                  You were referred by: {referralCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default Signup;
