import React from 'react';
import { Clock, Users, Star, ExternalLink, FileText, Youtube } from 'lucide-react';
import { Game } from '../types/Game';
import.meta.env.VITE_OPENAI_API_KEY

interface GameCardProps {
  game: Game;
  onGameClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameClick }) => {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600';
    if (difficulty <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    return 'Hard';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on buttons/links
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    onGameClick(game);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onGameClick(game);
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-amber-200 overflow-hidden group game-card cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${game.name}`}
    >
      <div className="relative">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 game-image"
        />
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 bg-amber-800 text-white px-2 py-1 rounded-full text-sm font-medium">
            <Star size={14} />
            <span>{game.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-amber-900 transition-colors">
            {game.name}
          </h3>
        
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{game.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users size={16} />
            <span>{game.players} players</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock size={16} />
            <span>{game.playTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            <span className="text-gray-500">Difficulty: </span>
            <span className={`font-semibold ${getDifficultyColor(game.difficulty)}`}>
              {getDifficultyText(game.difficulty)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Learning: </span>
            <span className={`font-semibold ${getDifficultyColor(game.learningCurve)}`}>
              {getDifficultyText(game.learningCurve)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {game.category.map((cat, index) => (
            <span
              key={index}
              className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between space-x-2">
          <a
            href={game.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Youtube size={16} />
            <span>Watch</span>
          </a>
          <a
            href={game.manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={16} />
            <span>Rules</span>
          </a>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
        </div>
      </div>
    </div>
  );
};

export default GameCard;