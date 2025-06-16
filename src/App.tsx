import React, { useState, useEffect } from 'react';
import { Game } from './types/Game';
import { boardGames as initialGames } from './data/games';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import GameCard from './components/GameCard';
import SearchFilter from './components/SearchFilter';
import GameDetail from './components/GameDetail';
import ChatBot from './components/ChatBot';

function App() {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [filteredGames, setFilteredGames] = useState<Game[]>(initialGames);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGameDetail, setShowGameDetail] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Games');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) 
       
      );
    }

    if (selectedCategory !== 'All Games') {
      filtered = filtered.filter(game =>
        game.category.includes(selectedCategory)
      );
    }

    if (minPlayers) {
      filtered = filtered.filter(game => {
        const playerRange = game.players.split('-');
        const minGamePlayers = parseInt(playerRange[0]);
        return minGamePlayers >= parseInt(minPlayers);
      });
    }

    if (maxPlayers) {
      filtered = filtered.filter(game => {
        const playerRange = game.players.split('-');
        const maxGamePlayers = parseInt(playerRange[playerRange.length - 1].replace('+', ''));
        return maxGamePlayers <= parseInt(maxPlayers);
      });
    }

    if (difficulty) {
      const difficultyFilter = parseInt(difficulty);
      if (difficultyFilter === 1) {
        filtered = filtered.filter(game => game.difficulty <= 2);
      } else if (difficultyFilter === 2) {
        filtered = filtered.filter(game => game.difficulty === 3);
      } else if (difficultyFilter === 3) {
        filtered = filtered.filter(game => game.difficulty >= 4);
      }
    }

    setFilteredGames(filtered);
  }, [games, searchTerm, selectedCategory, minPlayers, maxPlayers, difficulty]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setShowGameDetail(true);
  };

  const handleChatGameSelect = (game: Game) => {
    setSelectedGame(game);
    setShowGameDetail(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Games');
    setMinPlayers('');
    setMaxPlayers('');
    setDifficulty('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200">
      <LoadingScreen isLoading={isLoading} />
      
      <Navbar
        onChatClick={() => setShowChat(true)}
      />

      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section with Integrated Search */}
          <div className="text-center mb-12 py-8">
            <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-4 font-serif">
              Welcome to the Game Table
            </h1>
            <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover your next favorite board game adventure. From strategic masterpieces to party favorites, 
              find the perfect game for every occasion and every group.
            </p>
            
            {/* Integrated Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                minPlayers={minPlayers}
                onMinPlayersChange={setMinPlayers}
                maxPlayers={maxPlayers}
                onMaxPlayersChange={setMaxPlayers}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                isVisible={true}
                onClose={() => {}}
                onGameSelect={handleGameClick}
                isEmbedded={true}
              />
            </div>

            <div className="mt-8">
              <button
                onClick={() => setShowChat(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                Get AI Recommendations
              </button>
            </div>
          </div>

          {/* Games Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-amber-900 font-serif">
                Featured Games
              </h2>
              <div className="text-amber-700">
                {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {filteredGames.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">
                  No games found
                </h3>
                <p className="text-amber-700 mb-6">
                  Try adjusting your search criteria or browse our featured games.
                </p>
                {(searchTerm || selectedCategory !== 'All Games' || difficulty || minPlayers || maxPlayers) && (
                  <button
                    onClick={resetFilters}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onGameClick={handleGameClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <GameDetail
        game={selectedGame}
        isVisible={showGameDetail}
        onClose={() => setShowGameDetail(false)}
      />

      <ChatBot
        isVisible={showChat}
        onClose={() => setShowChat(false)}
        onGameSelect={handleChatGameSelect}
      />
    </div>
  );
}

export default App;