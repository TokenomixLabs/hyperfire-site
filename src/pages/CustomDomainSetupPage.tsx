
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CustomDomainSetup from '@/components/community/CustomDomainSetup';

const CustomDomainSetupPage = () => {
  const navigate = useNavigate();
  
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
        
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-6">Custom Domain Setup</h1>
          <p className="text-gray-300 mb-8">
            Connect your own domain to your HyperFIRE site using the instructions below.
          </p>
          
          <CustomDomainSetup />
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

export default CustomDomainSetupPage;
