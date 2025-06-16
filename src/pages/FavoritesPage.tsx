import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';

const FavoritesPage: React.FC = () => {
  const { favorites } = useGameContext();
  
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Your Favorites</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center max-w-lg mx-auto">
            <div className="bg-amber-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-amber-700" />
            </div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-3">No Favorites Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't added any games to your favorites yet. Browse our collection and click the heart icon to save games you love.
            </p>
            <Link 
              to="/games" 
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              Browse Games
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;