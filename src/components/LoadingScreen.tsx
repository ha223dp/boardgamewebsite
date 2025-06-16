import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [currentDice, setCurrentDice] = useState(0);
  const [rollCount, setRollCount] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentDice(Math.floor(Math.random() * 6));
      setRollCount(prev => prev + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const DiceIcon = diceIcons[currentDice];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-700 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-amber-100 rounded-lg shadow-2xl border-4 border-amber-600 flex items-center justify-center transform rotate-3 animate-bounce">
            <DiceIcon size={48} className="text-amber-800" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        
        <h2 className="text-4xl font-bold text-amber-100 mb-4 font-serif">
          Opening the Game Box...
        </h2>
        
        <div className="flex justify-center space-x-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 bg-amber-200 rounded-full animate-pulse ${
                i === rollCount % 3 ? 'animate-bounce' : ''
              }`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        <p className="text-xl text-amber-200 font-light">
          Shuffling cards, rolling dice, setting up the board...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;