
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 to-gray-900 text-white pt-20">
      <main className="flex-1 flex flex-col items-start px-4 py-8 max-w-4xl mx-auto w-full">
        <Button 
          variant="ghost" 
          className="mb-6 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔒</span>
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">[HYPERFIRE] Privacy Policy</h2>
          
          <p className="text-gray-300 mb-6">
            <strong>Effective Date:</strong> {effectiveDate}
          </p>
          
          <p className="text-gray-300 mb-6">
            This Privacy Policy explains how HyperFIRE ("we," "our," or "us") collects, uses, and safeguards your information 
            when you visit or use our platform, including InsiderLife.com, app.insiderlife.com, and any subdomains 
            (collectively, the "Platform").
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">1. Information We Collect</h3>
            <p className="text-gray-300 mb-2">We may collect the following information:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>Personal info (name, email, etc.)</li>
              <li>Account credentials</li>
              <li>Payment details (via Stripe or trusted processor)</li>
              <li>Usage data (clicks, tool usage, preferences)</li>
              <li>Referral and affiliate activity</li>
              <li>Device/browser information</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">2. How We Use It</h3>
            <p className="text-gray-300 mb-2">We use your data to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>Provide access to AI tools, community dashboards, and member features</li>
              <li>Customize your experience and content delivery</li>
              <li>Process transactions and subscriptions securely</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">3. Sharing Your Info</h3>
            <p className="text-gray-300 mb-2">We never sell your data. We may share it with:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>Trusted service providers (Stripe, analytics, etc.)</li>
              <li>Community contributors or admins (only where relevant to platform engagement)</li>
              <li>Legal authorities (if required by law)</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">4. Cookies & Tracking</h3>
            <p className="text-gray-300">
              We use cookies and analytics tools to enhance user experience and track usage data for product improvement.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">5. Data Security</h3>
            <p className="text-gray-300">
              We use industry-standard encryption and security protocols to protect your data.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">6. Your Rights</h3>
            <p className="text-gray-300 mb-2">You may:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>Access or update your information</li>
              <li>Request deletion of your account</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Email <a href="mailto:support@insiderlife.com" className="text-purple-400 hover:underline">support@insiderlife.com</a> for any data-related requests.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 InsiderLife. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">
              Terms
            </a>
            <a 
              onClick={() => navigate('/privacy-policy')} 
              className="text-gray-400 hover:text-purple-400 text-sm cursor-pointer"
            >
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
