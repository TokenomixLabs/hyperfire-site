
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
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
            <span className="text-2xl">⚖️</span>
            <h1 className="text-3xl font-bold text-white">Terms of Use</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">HYPERFIRE Terms of Use</h2>
          
          <p className="text-gray-300 mb-6">
            <strong>Effective Date:</strong> {effectiveDate}
          </p>
          
          <p className="text-gray-300 mb-6">
            These Terms of Use govern your access to and use of the HyperFIRE platform (the "Service"), 
            including InsiderLife.com, its applications, and subdomains.
          </p>
          
          <p className="text-gray-300 mb-6">
            By using the Service, you agree to the following:
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">1. Use of the Platform</h3>
            <p className="text-gray-300 mb-2">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-1">
              <li>Use the Service only for lawful purposes</li>
              <li>Not share your account or misuse access</li>
              <li>Respect community guidelines and contributor content</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">2. Subscriptions</h3>
            <p className="text-gray-300">
              Some features are free. Paid plans include additional capabilities and are billed monthly. 
              Payments are processed via Stripe. You may cancel anytime; refunds are not guaranteed but 
              will be reviewed on a case-by-case basis.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">3. Intellectual Property</h3>
            <p className="text-gray-300 mb-3">
              All content, tools, dashboards, and assets provided by HyperFIRE remain the property of 
              HyperFIRE and/or its contributors unless explicitly stated otherwise.
            </p>
            <p className="text-gray-300">
              You may not reproduce, distribute, or repurpose without permission.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">4. Community Contributions</h3>
            <p className="text-gray-300">
              By contributing content, you grant us a license to display and share it across the platform 
              while maintaining your ownership.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">5. Modifications</h3>
            <p className="text-gray-300">
              We reserve the right to update these Terms at any time. Continued use of the platform 
              constitutes acceptance of changes.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">6. Disclaimer</h3>
            <p className="text-gray-300">
              We provide the Service "as-is" and make no guarantees regarding results, earnings, or outcomes.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">7. Contact</h3>
            <p className="text-gray-300">
              For questions, concerns, or disputes, please email:<br />
              <a href="mailto:support@insiderlife.com" className="text-purple-400 hover:underline">📬 support@insiderlife.com</a>
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
            <a 
              onClick={() => navigate('/terms-of-use')} 
              className="text-gray-400 hover:text-purple-400 text-sm cursor-pointer"
            >
              Terms
            </a>
            <a 
              onClick={() => navigate('/privacy-policy')} 
              className="text-gray-400 hover:text-purple-400 text-sm cursor-pointer"
            >
              Privacy
            </a>
            <a 
              href="mailto:support@insiderlife.com" 
              className="text-gray-400 hover:text-purple-400 text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUse;
