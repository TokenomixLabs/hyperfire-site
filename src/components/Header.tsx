
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BrandSelector from './BrandSelector';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-subtle' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-insider-700 to-insider-500 dark:from-insider-400 dark:to-insider-300">
                InsiderLife
              </span>
              <div className="hidden md:flex px-2 py-1 text-xs font-medium rounded-full bg-insider-100 dark:bg-insider-800 text-insider-700 dark:text-insider-300">
                CMS
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-insider-600 dark:hover:text-insider-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/content" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/content' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-insider-600 dark:hover:text-insider-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
              }`}
            >
              Content Library
            </Link>
            <Link 
              to="/live" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/live' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-insider-600 dark:hover:text-insider-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
              }`}
            >
              Live Events
            </Link>
            <Link 
              to="/documents" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/documents' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-insider-600 dark:hover:text-insider-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
              }`}
            >
              Document Vault
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <BrandSelector />

            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className={`mt-4 transition-all duration-300 overflow-hidden ${
            searchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              className="pl-10 w-full glass-input" 
              placeholder="Search content, documents, and events..." 
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
          <nav className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/content" 
              className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/content' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Content Library
            </Link>
            <Link 
              to="/live" 
              className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/live' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Live Events
            </Link>
            <Link 
              to="/documents" 
              className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/documents' 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Document Vault
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
