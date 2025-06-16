import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';
import GameFilter from '../components/GameFilter';
import { Search } from 'lucide-react';

const GamesPage: React.FC = () => {
  const { filteredGames } = useGameContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const displayedGames = searchTerm
    ? filteredGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredGames;

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900">All Games</h1>
          <p className="text-gray-600">
            Showing {displayedGames.length} of {filteredGames.length} games
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Search Box */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Filters */}
              <GameFilter />
            </div>
          </aside>
          
          <div className="lg:col-span-3">
            {displayedGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">No games found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more games.
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;