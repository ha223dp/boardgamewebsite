import React from 'react';
import { Gamepad2, MessageCircle } from 'lucide-react';

interface NavbarProps {
  onChatClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onChatClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-900/95 via-yellow-800/95 to-amber-700/95 backdrop-blur-md border-b-4 border-amber-600 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg shadow-lg flex items-center justify-center transform rotate-12">
              <Gamepad2 size={24} className="text-amber-800" />
            </div>
            <h1 className="text-2xl font-bold text-amber-100 font-serif">
              Game Table
            </h1>
          </div>

          <div className="flex items-center">
            <button
              onClick={onChatClick}
              className="flex items-center space-x-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-lg"
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline">Game Guru</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;