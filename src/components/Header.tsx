
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import components
import HeaderContainer from './header/HeaderContainer';
import Logo from './header/Logo';
import DesktopNav from './header/DesktopNav';
import MobileNav from './header/MobileNav';
import SearchBar from './header/SearchBar';
import HeaderActions from './header/HeaderActions';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

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
    <HeaderContainer isScrolled={isScrolled}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          {isAuthenticated && <DesktopNav />}
        </div>

        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => location.pathname !== '/login' && window.location.assign('/login')}>
                Log in
              </Button>
              <Button onClick={() => location.pathname !== '/signup' && window.location.assign('/signup')}>
                Sign up
              </Button>
            </div>
          )}
          
          {isAuthenticated && (
            <HeaderActions 
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              isDarkMode={isDarkMode}
              toggleDarkMode={() => {}}
            />
          )}
        </div>
      </div>

      <SearchBar isOpen={searchOpen} />
      
      <MobileNav isOpen={mobileMenuOpen} />
    </HeaderContainer>
  );
};

export default Header;
