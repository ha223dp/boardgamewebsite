import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dice1 as Dice, Search, Heart } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-amber-900 shadow-md py-2' : 'bg-amber-900 py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-amber-50 transition-transform hover:scale-105"
        >
          <Dice className="h-8 w-8" />
          <span className="text-xl font-bold">Board Game Haven</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-amber-50 hover:text-amber-200 transition-colors ${
              location.pathname === '/' ? 'font-bold border-b-2 border-amber-300' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/games" 
            className={`text-amber-50 hover:text-amber-200 transition-colors ${
              location.pathname === '/games' ? 'font-bold border-b-2 border-amber-300' : ''
            }`}
          >
            Games
          </Link>
          <Link 
            to="/favorites" 
            className={`text-amber-50 hover:text-amber-200 transition-colors flex items-center gap-1 ${
              location.pathname === '/favorites' ? 'font-bold border-b-2 border-amber-300' : ''
            }`}
          >
            <Heart className="h-4 w-4" />
            Favorites
          </Link>
          <Link 
            to="/search" 
            className={`bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${
              location.pathname === '/search' ? 'bg-amber-500' : ''
            }`}
          >
            <Search className="h-4 w-4" />
            Find Games
          </Link>
        </nav>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-amber-50 focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-amber-900">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-amber-50 py-2 ${
                location.pathname === '/' ? 'font-bold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/games" 
              className={`text-amber-50 py-2 ${
                location.pathname === '/games' ? 'font-bold' : ''
              }`}
            >
              Games
            </Link>
            <Link 
              to="/favorites" 
              className={`text-amber-50 py-2 flex items-center gap-2 ${
                location.pathname === '/favorites' ? 'font-bold' : ''
              }`}
            >
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
            <Link 
              to="/search" 
              className={`bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 w-full ${
                location.pathname === '/search' ? 'bg-amber-500' : ''
              }`}
            >
              <Search className="h-4 w-4" />
              Find Games
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;