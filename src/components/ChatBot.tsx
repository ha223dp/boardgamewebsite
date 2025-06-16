import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, ExternalLink } from 'lucide-react';
import { ChatMessage, Game } from '../types/Game';
import { boardGames } from '../data/games';

interface ChatBotProps {
  isVisible: boolean;
  onClose: () => void;
  onGameSelect: (game: Game) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isVisible, onClose, onGameSelect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Game Guru 🎲 I can help you find the perfect board game based on your preferences. What kind of gaming experience are you looking for today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGameRecommendations = (userMessage: string): { text: string; games: Game[] } => {
    const message = userMessage.toLowerCase();
    let recommendedGames: Game[] = [];
    let responseText = '';

    if (message.includes('party') || message.includes('funny') || message.includes('humor')) {
      recommendedGames = boardGames.filter(game => 
        game.category.includes('Party') || game.category.includes('Humor')
      );
      responseText = "Perfect! For party games that guarantee laughs, I recommend:";
    } else if (message.includes('strategy') || message.includes('complex') || message.includes('thinking')) {
      recommendedGames = boardGames.filter(game => 
        game.category.includes('Strategy') && game.difficulty >= 3
      );
      responseText = "Excellent choice! For strategic games that challenge your mind, I suggest:";
    } else if (message.includes('family') || message.includes('kids') || message.includes('children')) {
      recommendedGames = boardGames.filter(game => 
        game.category.includes('Family') || game.difficulty <= 2
      );
      responseText = "Great for family time! These games are perfect for all ages:";
    } else if (message.includes('quick') || message.includes('short') || message.includes('30')) {
      recommendedGames = boardGames.filter(game => 
        game.playTime.includes('30') || game.playTime.includes('45')
      );
      responseText = "Perfect for shorter gaming sessions! These games are quick but engaging:";
    } else if (message.includes('cooperative') || message.includes('together') || message.includes('team')) {
      recommendedGames = boardGames.filter(game => 
        game.category.includes('Cooperative')
      );
      responseText = "Love working together! These cooperative games are fantastic:";
    } else if (message.includes('two') || message.includes('2 player') || message.includes('couple')) {
      recommendedGames = boardGames.filter(game => 
        game.players.includes('2')
      );
      responseText = "Perfect for two! These games are excellent for couples or pairs:";
    } else {
      // Default recommendations
      recommendedGames = boardGames.slice(0, 3);
      responseText = "Based on popular choices, here are some excellent games to consider:";
    }

    return { text: responseText, games: recommendedGames.slice(0, 3) };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { text, games } = getGameRecommendations(inputText);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: text,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      // Add game recommendations
      games.forEach((game, index) => {
        setTimeout(() => {
          const gameMessage: ChatMessage = {
            id: (Date.now() + index + 10).toString(),
            text: `🎯 **${game.name}** - ${game.description.slice(0, 100)}... Click to learn more!`,
            isUser: false,
            timestamp: new Date(),
            gameLink: game.id
          };
          setMessages(prev => [...prev, gameMessage]);
        }, (index + 1) * 500);
      });

      setIsTyping(false);
    }, 1000);
  };

  const handleGameClick = (gameId: string) => {
    const game = boardGames.find(g => g.id === gameId);
    if (game) {
      onGameSelect(game);
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-2xl w-full max-w-md h-[600px] border-4 border-green-200 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-green-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold">Game Guru</h3>
              <p className="text-xs opacity-80">Your board game assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {message.isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                </div>
                <div className={`p-3 rounded-xl ${
                  message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-sm' 
                    : 'bg-white border-2 border-green-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.gameLink && (
                    <button
                      onClick={() => handleGameClick(message.gameLink!)}
                      className="mt-2 flex items-center space-x-1 text-green-600 hover:text-green-700 text-xs font-medium"
                    >
                      <span>View Game</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border-2 border-green-100 p-3 rounded-xl rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-green-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about board games..."
              className="flex-1 p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none bg-white/80"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;