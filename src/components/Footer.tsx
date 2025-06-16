import React from 'react';
import { Link } from 'react-router-dom';
import { Dice1 as Dice, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-900 text-amber-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-amber-50 mb-4">
              <Dice className="h-8 w-8" />
              <span className="text-xl font-bold">Board Game Haven</span>
            </Link>
            <p className="text-sm text-amber-200 mb-4">
              Discover, learn, and connect through the joy of board games.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-amber-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/games" className="text-amber-300 hover:text-white transition-colors">All Games</Link>
              </li>
              <li>
                <Link to="/favorites" className="text-amber-300 hover:text-white transition-colors">Favorites</Link>
              </li>
              <li>
                <Link to="/search" className="text-amber-300 hover:text-white transition-colors">Find Games</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-100">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/games?category=strategy" className="text-amber-300 hover:text-white transition-colors">Strategy Games</Link>
              </li>
              <li>
                <Link to="/games?category=family" className="text-amber-300 hover:text-white transition-colors">Family Games</Link>
              </li>
              <li>
                <Link to="/games?category=party" className="text-amber-300 hover:text-white transition-colors">Party Games</Link>
              </li>
              <li>
                <Link to="/games?category=card" className="text-amber-300 hover:text-white transition-colors">Card Games</Link>
              </li>
              <li>
                <Link to="/games?category=cooperative" className="text-amber-300 hover:text-white transition-colors">Cooperative Games</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-100">Join Our Community</h3>
            <p className="text-sm text-amber-200 mb-4">
              Subscribe to our newsletter for the latest game recommendations and events.
            </p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-md bg-amber-800 border border-amber-700 text-white placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-amber-800 text-center text-sm text-amber-400">
          <p>© 2025 Board Game Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;