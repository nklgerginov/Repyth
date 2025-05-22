import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Laptop } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Laptop className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-bold">PerfectStack</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`font-medium hover:text-primary-500 transition-colors ${
                  location.pathname === '/' ? 'text-primary-500' : ''
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {user?.name || 'User'}
                </div>
                <Button 
                  variant="outline" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
          
          {/* Theme toggle */}
          <div className="flex space-x-2 border rounded-full p-1">
            <button 
              onClick={() => toggleTheme('light')} 
              className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
              aria-label="Light mode"
            >
              <Sun size={16} />
            </button>
            <button 
              onClick={() => toggleTheme('dark')} 
              className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
              aria-label="Dark mode"
            >
              <Moon size={16} />
            </button>
            <button 
              onClick={() => toggleTheme('system')} 
              className={`p-1.5 rounded-full ${theme === 'system' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
              aria-label="System theme"
            >
              <Laptop size={16} />
            </button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-800 shadow-lg absolute w-full py-4 px-4 transition-all duration-300 ease-in-out">
          <nav className="flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className={`font-medium hover:text-primary-500 transition-colors ${
                    location.pathname === '/' ? 'text-primary-500' : ''
                  }`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <div className="py-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {user?.name || 'User'}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
            
            {/* Theme toggle */}
            <div className="flex justify-center space-x-4 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <button 
                onClick={() => toggleTheme('light')} 
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
                aria-label="Light mode"
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => toggleTheme('dark')} 
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
                aria-label="Dark mode"
              >
                <Moon size={18} />
              </button>
              <button 
                onClick={() => toggleTheme('system')} 
                className={`p-2 rounded-full ${theme === 'system' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
                aria-label="System theme"
              >
                <Laptop size={18} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;