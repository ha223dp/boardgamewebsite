import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Clock, Users, ArrowLeft, BrainCircuit, 
  Youtube, FileText, Share2 
} from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { Game } from '../types';

const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { games, addToFavorites, removeFromFavorites, isFavorite } = useGameContext();
  const [game, setGame] = useState<Game | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources'>('overview');
  
  useEffect(() => {
    if (id) {
      const foundGame = games.find(g => g.id === id);
      if (foundGame) {
        setGame(foundGame);
        setFavorite(isFavorite(foundGame.id));
      }
    }
  }, [id, games, isFavorite]);
  
  if (!game) {
    return (
      <div className="min-h-screen bg-amber-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">Game not found</h1>
          <Link 
            to="/games"
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 mx-auto w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Link>
        </div>
      </div>
    );
  }
  
  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game);
    }
    setFavorite(!favorite);
  };
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  };
  
  const renderDifficultyStars = (level: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full mx-0.5 ${
              i < level ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link 
          to="/games"
          className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Games
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Game Header */}
          <div 
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${game.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-900/90"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
                  <div className="flex flex-wrap gap-2">
                    {game.category.map((cat) => (
                      <span 
                        key={cat} 
                        className="bg-amber-600/80 text-white text-xs px-2 py-1 rounded-full"
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleFavoriteClick}
                  className={`p-3 rounded-full transition-colors ${
                    favorite 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-6 w-6 ${favorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                Learning Resources
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-amber-900 mb-4">About this Game</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="bg-amber-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">Game Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-amber-700 mr-3" />
                        <div>
                          <span className="block text-sm text-gray-600">Players</span>
                          <span className="font-medium">{game.minPlayers}-{game.maxPlayers}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-amber-700 mr-3" />
                        <div>
                          <span className="block text-sm text-gray-600">Play Time</span>
                          <span className="font-medium">{formatTime(game.playTime)}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BrainCircuit className="h-5 w-5 text-amber-700 mr-3" />
                        <div>
                          <span className="block text-sm text-gray-600">Difficulty</span>
                          <div className="flex items-center gap-2">
                            {renderDifficultyStars(game.difficulty)}
                            <span className="font-medium">{game.difficulty}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BrainCircuit className="h-5 w-5 text-amber-700 mr-3" />
                        <div>
                          <span className="block text-sm text-gray-600">Complexity</span>
                          <div className="flex items-center gap-2">
                            {renderDifficultyStars(game.complexity)}
                            <span className="font-medium">{game.complexity}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleFavoriteClick}
                      className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                        favorite 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500' : ''}`} />
                      {favorite ? 'Favorited' : 'Add to Favorites'}
                    </button>
                    <button 
                      className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="sticky top-24">
                    <h2 className="text-xl font-semibold text-amber-900 mb-4">Resources</h2>
                    
                    {game.videoUrl && (
                      <a 
                        href={game.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg mb-4 transition-colors flex items-center gap-3"
                      >
                        <Youtube className="h-6 w-6" />
                        <div>
                          <span className="font-medium block">How to Play</span>
                          <span className="text-sm">Watch on YouTube</span>
                        </div>
                      </a>
                    )}
                    
                    {game.manualUrl && (
                      <a 
                        href={game.manualUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <FileText className="h-6 w-6" />
                        <div>
                          <span className="font-medium block">Game Manual</span>
                          <span className="text-sm">Download PDF</span>
                        </div>
                      </a>
                    )}
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-amber-900 mb-3">Similar Games</h3>
                      <div className="space-y-4">
                        {games
                          .filter(g => 
                            g.id !== game.id && 
                            g.category.some(cat => game.category.includes(cat))
                          )
                          .slice(0, 3)
                          .map(similarGame => (
                            <Link 
                              key={similarGame.id} 
                              to={`/game/${similarGame.id}`}
                              className="block bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <img 
                                  src={similarGame.imageUrl} 
                                  alt={similarGame.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <h4 className="font-medium text-amber-900">{similarGame.name}</h4>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-3 w-3 mr-1" />
                                    {similarGame.minPlayers}-{similarGame.maxPlayers}
                                    <span className="mx-2">•</span>
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(similarGame.playTime)}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-xl font-semibold text-amber-900 mb-4">Video Tutorials</h2>
                  
                  {game.videoUrl ? (
                    <div>
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={game.videoUrl.replace('watch?v=', 'embed/')}
                          title={`${game.name} Tutorial`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      <h3 className="font-medium text-amber-900 mb-2">Official How to Play</h3>
                      <p className="text-gray-700 mb-4">
                        This video will guide you through the basic rules and gameplay mechanics of {game.name}.
                      </p>
                      
                      <a 
                        href={game.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        <Youtube className="h-4 w-4" />
                        Watch on YouTube
                      </a>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600">
                        No video tutorials available for this game yet.
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-amber-900 mb-4">Game Manual & Setup</h2>
                  
                  {game.manualUrl ? (
                    <div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                        <h3 className="font-medium text-amber-900 mb-2">Official Game Manual</h3>
                        <p className="text-gray-700 mb-4">
                          The complete rulebook for {game.name} with detailed explanations of all game mechanics and setup instructions.
                        </p>
                        
                        <a 
                          href={game.manualUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          Download Manual
                        </a>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-6">
                        <h3 className="font-medium text-amber-900 mb-2">Quick Setup Guide</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          <li>Unbox the game and sort all components</li>
                          <li>Place the game board in the center of the table</li>
                          <li>Give each player their starting pieces</li>
                          <li>Shuffle the deck(s) and place them on the designated spots</li>
                          <li>Choose a starting player (youngest goes first)</li>
                          <li>You're ready to play!</li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600">
                        No manual available for this game yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;