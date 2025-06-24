import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, Filter } from 'lucide-react';
import { gameCategories, boardGames } from '../data/games';
import { Game } from '../types/Game';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPlayers: string;
  onMinPlayersChange: (players: string) => void;
  maxPlayers: string;
  onMaxPlayersChange: (players: string) => void;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  isVisible: boolean;
  onClose: () => void;
  onGameSelect: (game: Game) => void;
  isEmbedded?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  minPlayers,
  onMinPlayersChange,
  maxPlayers,
  onMaxPlayersChange,
  difficulty,
  onDifficultyChange,
  isVisible,
  onClose,
  onGameSelect,
  isEmbedded = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setShowRecommendations(false);

    // Simulate realistic search delay
    setTimeout(() => {
      const results = boardGames.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) 
      );

      setSearchResults(results);
      setShowRecommendations(true);
      setIsLoading(false);
    }, 1200); // Intentionally slower for realism
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGameClick = (game: Game) => {
    onGameSelect(game);
    if (!isEmbedded) {
      onClose();
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setShowRecommendations(false);
    }
  }, [searchTerm]);

  if (!isVisible) return null;

  // Embedded version for hero section
  if (isEmbedded) {
    return (
      <div className="w-full space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
            <input
              type="text"
              placeholder="Search for your next board game adventure..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 text-lg border-4 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none bg-white/90 shadow-lg font-medium"
            />
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isLoading}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white py-3 px-8 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              {isLoading ? 'Searching...' : 'Find Games'}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/90 hover:bg-white text-amber-700 py-3 px-6 rounded-lg font-semibold border-2 border-amber-300 transition-colors shadow-lg"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white/90 border-4 border-amber-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-amber-900 mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white"
                >
                  {gameCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => onDifficultyChange(e.target.value)}
                  className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white"
                >
                  <option value="">Any Difficulty</option>
                  <option value="1">Easy (1-2)</option>
                  <option value="2">Medium (3)</option>
                  <option value="3">Hard (4-5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Min Players</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={minPlayers}
                  onChange={(e) => onMinPlayersChange(e.target.value)}
                  placeholder="Any"
                  className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Max Players</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={maxPlayers}
                  onChange={(e) => onMaxPlayersChange(e.target.value)}
                  placeholder="Any"
                  className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Search Loading */}
        {isLoading && (
          <div className="text-center py-8 bg-white/90 border-4 border-amber-200 rounded-xl shadow-lg">
            <div className="animate-spin w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-amber-700 font-medium">Finding the perfect games for you...</p>
          </div>
        )}

        {/* Search Results */}
        {showRecommendations && searchResults.length > 0 && (
          <div className="bg-white/90 border-4 border-amber-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-amber-900 mb-4">
              Found {searchResults.length} game{searchResults.length !== 1 ? 's' : ''}:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.slice(0, 4).map((game) => (
                <div
                  key={game.id}
                  className="bg-white border-2 border-amber-100 rounded-lg p-4 hover:border-amber-300 transition-colors cursor-pointer hover:shadow-lg"
                  onClick={() => handleGameClick(game)}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-900 hover:text-amber-700">
                          {game.name}
                        </h4>
                        <ExternalLink size={16} className="text-amber-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{game.players} players</span>
                        <span>{game.playTime}</span>
                        <span>★ {game.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {searchResults.length > 4 && (
              <p className="text-center text-amber-700 mt-4 font-medium">
                And {searchResults.length - 4} more games below...
              </p>
            )}
          </div>
        )}

        {showRecommendations && searchResults.length === 0 && (
          <div className="text-center py-8 bg-white/90 border-4 border-amber-200 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎲</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">No games found</h3>
            <p className="text-amber-700">
              Try searching for different keywords or browse our featured games below.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Original modal version (kept for compatibility)
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-2xl max-w-2xl w-full mx-4 border-4 border-amber-200 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <h2 className="text-2xl font-bold text-amber-900 font-serif">Discover Games</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-amber-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for games and press Enter..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/80"
                />
              </div>
              
              <button
                onClick={handleSearch}
                disabled={!searchTerm.trim() || isLoading}
                className="mt-3 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search Games'}
              </button>
            </div>

            {/* Search Results */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-amber-700 font-medium">Finding the perfect games for you...</p>
              </div>
            )}

            {showRecommendations && searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-900">
                  Found {searchResults.length} game{searchResults.length !== 1 ? 's' : ''}:
                </h3>
                <div className="space-y-3">
                  {searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="bg-white/80 border-2 border-amber-100 rounded-lg p-4 hover:border-amber-300 transition-colors cursor-pointer"
                      onClick={() => handleGameClick(game)}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-amber-900 hover:text-amber-700">
                              {game.name}
                            </h4>
                            <ExternalLink size={16} className="text-amber-600" />
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {game.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{game.players} players</span>
                            <span>{game.playTime}</span>
                            <span>★ {game.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRecommendations && searchResults.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎲</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">No games found</h3>
                <p className="text-amber-700">
                  Try searching for different keywords or browse our featured games below.
                </p>
              </div>
            )}

            {/* Filters */}
            <div className="border-t border-amber-200 pt-6">
              <h3 className="text-lg font-bold text-amber-900 mb-4">Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/80"
                  >
                    {gameCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value)}
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/80"
                  >
                    <option value="">Any Difficulty</option>
                    <option value="1">Easy (1-2)</option>
                    <option value="2">Medium (3)</option>
                    <option value="3">Hard (4-5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Min Players</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={minPlayers}
                    onChange={(e) => onMinPlayersChange(e.target.value)}
                    placeholder="Any"
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Max Players</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={maxPlayers}
                    onChange={(e) => onMaxPlayersChange(e.target.value)}
                    placeholder="Any"
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;