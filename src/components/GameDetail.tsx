import React from 'react';
import { X, Users, Clock, Star, Calendar, User, ExternalLink, Youtube, FileText } from 'lucide-react';
import { Game } from '../types/Game';
import.meta.env.VITE_OPENAI_API_KEY

interface GameDetailProps {
  game: Game | null;
  isVisible: boolean;
  onClose: () => void;
}

const GameDetail: React.FC<GameDetailProps> = ({ game, isVisible, onClose }) => {
  if (!isVisible || !game) return null;

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600 bg-green-50';
    if (difficulty <= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    return 'Hard';
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-amber-200">
        <div className="relative">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-amber-800 text-white px-3 py-2 rounded-full">
              {renderStars(game.rating)}
              <span className="ml-2 font-medium">{game.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 font-serif mb-2">{game.name}</h1>
              <p className="text-gray-600 flex items-center space-x-4">
                
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/60 p-4 rounded-lg border-2 border-amber-100">
              <div className="flex items-center space-x-2 text-amber-800 mb-2">
                <Users size={20} />
                <span className="font-semibold">Players</span>
              </div>
              <p className="text-2xl font-bold text-amber-900">{game.players}</p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border-2 border-amber-100">
              <div className="flex items-center space-x-2 text-amber-800 mb-2">
                <Clock size={20} />
                <span className="font-semibold">Play Time</span>
              </div>
              <p className="text-2xl font-bold text-amber-900">{game.playTime}</p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border-2 border-amber-100">
              <div className="flex items-center space-x-2 text-amber-800 mb-2">
                <span className="font-semibold">Difficulty</span>
              </div>
              <div className="space-y-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.difficulty)}`}>
                  Learning: {getDifficultyText(game.difficulty)}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.learningCurve)}`}>
                  Complexity: {getDifficultyText(game.learningCurve)}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-amber-900 mb-3">About the Game</h2>
            <p className="text-gray-700 leading-relaxed">{game.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-amber-900 mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {game.category.map((cat, index) => (
                <span
                  key={index}
                  className="bg-amber-100 text-amber-800 px-3 py-2 rounded-full font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-amber-900 mb-3">Where to Get It</h2>
            
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={game.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
            >
              <Youtube size={20} />
              <span>Watch How to Play</span>
              <ExternalLink size={16} />
            </a>
            <a
              href={game.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
            >
              <FileText size={20} />
              <span>Download Rules</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;