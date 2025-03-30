import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import new components
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

  const toggleDarkMode = () => {
    // Keep this function for interface compatibility, but we won't use it
    // as we're forcing dark mode
  };

  return (
    <HeaderContainer isScrolled={isScrolled}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>

        <DesktopNav />

        <HeaderActions
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      <SearchBar isOpen={searchOpen} />
      
      <MobileNav isOpen={mobileMenuOpen} />
    </HeaderContainer>
  );
};

export default Header;
