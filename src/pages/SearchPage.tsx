import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';
import GameFilter from '../components/GameFilter';

const SearchPage: React.FC = () => {
  const { games, filteredGames } = useGameContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };
  
  const searchResults = isSearching
    ? filteredGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
  // Get some recommendations based on categories
  const popularCategories = ['strategy', 'family', 'party', 'cooperative'];
  const recommendations = popularCategories.map(category => {
    const categoryGames = games.filter(game => game.category.includes(category as any));
    return {
      category,
      games: categoryGames.slice(0, 4)
    };
  });
  
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-amber-900 text-center mb-6">
            Find Your Perfect Game
          </h1>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for games by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 pr-12 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <GameFilter />
            </div>
          </aside>
          
          <div className="lg:col-span-3">
            {isSearching ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-amber-900">
                    Search Results for "{searchTerm}"
                  </h2>
                  <p className="text-gray-600">{searchResults.length} games found</p>
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {searchResults.map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">No games found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters to find more games.
                    </p>
                    <button 
                      onClick={clearSearch}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-12">
                {recommendations.map(({ category, games }) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-amber-900">
                        Popular {category.charAt(0).toUpperCase() + category.slice(1)} Games
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {games.map(game => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;