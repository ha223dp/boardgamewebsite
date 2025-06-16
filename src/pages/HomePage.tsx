import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Clock, Users, BrainCircuit } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';

const HomePage: React.FC = () => {
  const { games } = useGameContext();
  const featuredGames = games.filter(game => game.isFeatured);
  
  return (
    <>
      {/* Hero section */}
      <section className="relative min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        >
          <div className="absolute inset-0 bg-amber-900/70 backdrop-blur-sm"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 py-20 md:py-0">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Next Favorite Board Game
            </h1>
            <p className="text-xl text-amber-100 mb-8">
              Explore, learn, and find the perfect games for game night with friends and family.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/games" 
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Browse Games
              </Link>
              <Link 
                to="/search" 
                className="bg-white hover:bg-amber-100 text-amber-900 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Find Games
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
              <div className="text-center text-amber-100">
                <div className="bg-amber-800/50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Player Count</h3>
              </div>
              <div className="text-center text-amber-100">
                <div className="bg-amber-800/50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Play Time</h3>
              </div>
              <div className="text-center text-amber-100">
                <div className="bg-amber-800/50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="font-medium">Difficulty</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 text-center z-10">
          <button 
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
            className="animate-bounce bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            aria-label="Scroll down"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>
      
      {/* Featured games section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900">
              Featured Games
            </h2>
            <Link 
              to="/games" 
              className="text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors"
            >
              View all games
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-16">
            Find Your Perfect Game
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-amber-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Search & Filter</h3>
              <p className="text-gray-600">
                Find games based on player count, time, difficulty, and categories that match your preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BrainCircuit className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Learn the Rules</h3>
              <p className="text-gray-600">
                Access videos, manuals, and setup guides to quickly learn how to play any game.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Save Favorites</h3>
              <p className="text-gray-600">
                Build your collection by saving games you love or want to try in the future.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/search" 
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Exploring
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter section */}
      <section className="py-20 bg-amber-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Stay Updated with New Games
            </h2>
            <p className="text-amber-100 mb-8">
              Subscribe to our newsletter to receive updates on new game additions, gaming tips, and exclusive content.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg bg-amber-700 border border-amber-600 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                type="submit" 
                className="bg-white text-amber-900 hover:bg-amber-100 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;