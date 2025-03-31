
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

// Import components
import Logo from './header/Logo';
import DesktopNav from './header/DesktopNav';
import MobileNav from './header/MobileNav';
import SearchBar from './header/SearchBar';
import HeaderActions from './header/HeaderActions';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    setIsDarkMode(true);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo />
            {isAuthenticated && <DesktopNav />}
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </Button>
              </div>
            )}
            
            {isAuthenticated && (
              <>
                <NotificationCenter />
                <HeaderActions 
                  searchOpen={searchOpen}
                  setSearchOpen={setSearchOpen}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={() => {}}
                />
              </>
            )}
            
            {/* Mobile menu toggle - only show for authenticated users */}
            {isMobile && isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white" 
                onClick={() => setMobileMenuOpen(prev => !prev)}
              >
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </Button>
            )}
          </div>
        </div>

        <SearchBar isOpen={searchOpen} />
        
        {isAuthenticated && <MobileNav isOpen={mobileMenuOpen} />}
      </div>
    </div>
  );
};

export default Header;
