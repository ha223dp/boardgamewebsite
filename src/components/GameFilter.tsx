import React, { useState } from 'react';
import { FilterOptions, GameCategory } from '../types';
import { useGameContext } from '../context/GameContext';
import { Sliders, Clock, Users, BrainCircuit, X } from 'lucide-react';

const categoryOptions: { value: GameCategory; label: string }[] = [
  { value: 'strategy', label: 'Strategy' },
  { value: 'family', label: 'Family' },
  { value: 'party', label: 'Party' },
  { value: 'card', label: 'Card' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'competitive', label: 'Competitive' },
  { value: 'rpg', label: 'RPG' },
  { value: 'dice', label: 'Dice' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'mystery', label: 'Mystery' },
];

const GameFilter: React.FC = () => {
  const { filterGames, resetFilters, filterOptions } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [localOptions, setLocalOptions] = useState<FilterOptions>({
    players: filterOptions.players || undefined,
    maxTime: filterOptions.maxTime || undefined,
    difficulty: filterOptions.difficulty || undefined,
    complexity: filterOptions.complexity || undefined,
    categories: filterOptions.categories || [],
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FilterOptions) => {
    const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    setLocalOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: GameCategory) => {
    setLocalOptions(prev => {
      const categories = prev.categories || [];
      if (categories.includes(category)) {
        return { ...prev, categories: categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...categories, category] };
      }
    });
  };

  const handleApplyFilters = () => {
    filterGames(localOptions);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setLocalOptions({
      players: undefined,
      maxTime: undefined,
      difficulty: undefined,
      complexity: undefined,
      categories: [],
    });
    resetFilters();
  };

  const countActiveFilters = () => {
    let count = 0;
    if (localOptions.players) count++;
    if (localOptions.maxTime) count++;
    if (localOptions.difficulty) count++;
    if (localOptions.complexity) count++;
    if (localOptions.categories && localOptions.categories.length > 0) count++;
    return count;
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <Sliders className="h-5 w-5 mr-2 text-amber-700" />
          <span className="font-medium">Filters</span>
          {countActiveFilters() > 0 && (
            <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
              {countActiveFilters()}
            </span>
          )}
        </div>
        <span className="text-amber-700">
          {isOpen ? <X className="h-5 w-5" /> : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-gray-100">
          <div className="space-y-6">
            {/* Players filter */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 mr-2 text-amber-700" />
                Number of Players
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={localOptions.players || ''}
                onChange={(e) => handleNumberChange(e, 'players')}
                placeholder="Any"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
              />
            </div>

            {/* Play time filter */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 mr-2 text-amber-700" />
                Maximum Play Time (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="240"
                step="15"
                value={localOptions.maxTime || ''}
                onChange={(e) => handleNumberChange(e, 'maxTime')}
                placeholder="Any"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
              />
            </div>

            {/* Difficulty filter */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BrainCircuit className="h-4 w-4 mr-2 text-amber-700" />
                Maximum Difficulty (1-5)
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setLocalOptions(prev => ({ ...prev, difficulty: level }))}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      localOptions.difficulty === level
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      localOptions.categories?.includes(category.value)
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFilter;