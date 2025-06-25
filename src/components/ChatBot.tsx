import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, ExternalLink, AlertCircle } from 'lucide-react';
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
      text: "Hello! I'm your AI-powered Game Guru! I can help you find the perfect board game based on your preferences, group size, time constraints, and more. What kind of gaming experience are you looking for today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findGamesByName = (text: string): Game[] => {
    const foundGames: Game[] = [];
    const usedGameIds = new Set<string>();
    
    // Look for exact game name matches (case insensitive)
    boardGames.forEach(game => {
      const gameName = game.name.toLowerCase();
      const textLower = text.toLowerCase();
      
      // Check for exact name match or if the game name appears as a complete word
      const nameRegex = new RegExp(`\\b${gameName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (nameRegex.test(textLower) && !usedGameIds.has(game.id)) {
        foundGames.push(game);
        usedGameIds.add(game.id);
      }
    });

    return foundGames;
  };

  const callOpenAI = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
    try {
      // Use import.meta.env for Vite projects
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      // Debug logging
      console.log('API Key exists:', !!apiKey);
      console.log('API Key prefix:', apiKey?.substring(0, 7));
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables');
      }
      
      if (!apiKey.startsWith('sk-')) {
        throw new Error('Invalid OpenAI API key format. Key should start with "sk-"');
      }

      // Prepare conversation context for OpenAI
      const systemPrompt = `You are an expert board game recommendation assistant. You have access to a curated collection of board games with the following data:

${JSON.stringify(boardGames, null, 2)}

Your role is to:
1. Recommend games based on user preferences (player count, time, complexity, theme, etc.)
2. Explain WHY each game fits their criteria
3. Provide helpful details about gameplay, mechanics, and what makes each game special
4. Be conversational and enthusiastic about board games
5. When recommending games, mention their exact names clearly so users can learn more

IMPORTANT: When mentioning specific games from the collection, use their EXACT names as they appear in the data. This helps users identify and learn more about the games.

Be helpful, knowledgeable, and passionate about board games!`;

      // Convert conversation history to OpenAI format
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit reached. Please wait 60 seconds before trying again.');
        } else if (response.status === 402) {
          throw new Error('OpenAI account has insufficient credits. Please check your billing.');
        } else if (response.status >= 500) {
          throw new Error('OpenAI servers are experiencing issues. Please try again later.');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get AI response. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    // Check if API key is configured
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setError('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponse = await callOpenAI(inputText, messages);

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      // Find games mentioned in the AI response and add clickable cards
      const mentionedGames = findGamesByName(aiResponse);
      
      // Add game cards for mentioned games (with a slight delay for better UX)
      mentionedGames.forEach((game, index) => {
        setTimeout(() => {
          const gameMessage: ChatMessage = {
            id: `game-${Date.now()}-${index}`,
            text: `🎯 **${game.name}** (${game.players} players, ${game.playTime}, Difficulty: ${game.difficulty}/5)\n${game.description.slice(0, 120)}...`,
            isUser: false,
            timestamp: new Date(),
            gameLink: game.id
          };
          setMessages(prev => [...prev, gameMessage]);
        }, (index + 1) * 300);
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      
      // Add fallback response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my AI brain right now. Let me give you some popular recommendations while I recover: Ticket to Ride for families, Azul for strategy lovers, and Codenames for parties!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGameClick = (gameId: string) => {
    const game = boardGames.find(g => g.id === gameId);
    if (game) {
      onGameSelect(game);
      onClose();
    }
  };

  const clearError = () => setError(null);

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
              <h3 className="font-bold">AI Game Guru</h3>
              <p className="text-xs opacity-80">Powered by OpenAI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-2 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {message.isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                </div>
                <div className={`p-3 rounded-xl ${
                  message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-sm' 
                    : 'bg-white border-2 border-green-100 text-gray-800 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  {message.gameLink && (
                    <button
                      onClick={() => handleGameClick(message.gameLink!)}
                      className="mt-2 flex items-center space-x-1 text-green-600 hover:text-green-700 text-xs font-medium hover:bg-green-50 px-2 py-1 rounded transition-colors"
                    >
                      <span>View Game Details</span>
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
                <div className="bg-white border-2 border-green-100 p-3 rounded-xl rounded-bl-sm shadow-sm">
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
              className="flex-1 p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none bg-white/80 text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by OpenAI • Be specific for better recommendations!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;