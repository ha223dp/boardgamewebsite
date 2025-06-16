import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Game } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from './GameContext';
import { Link } from 'react-router-dom';

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  clearChat: () => void;
  isChatOpen: boolean;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { games } = useGameContext();
  
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      text: "Hello! I'm your board game assistant. Tell me what kind of games you enjoy or how many players you have, and I'll recommend some games for you!",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const clearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      text: "Chat cleared! How can I help you find your next favorite game?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const generateResponse = (userMessage: string): string => {
    userMessage = userMessage.toLowerCase();
    
    const playerCountMatch = userMessage.match(/(\d+)\s*(player|people|person|friend)/);
    let playerCount: number | null = null;
    if (playerCountMatch) {
      playerCount = parseInt(playerCountMatch[1], 10);
    }
    
    const timeMatch = userMessage.match(/(\d+)\s*(minute|hour|min)/);
    let maxTime: number | null = null;
    if (timeMatch) {
      let time = parseInt(timeMatch[1], 10);
      if (timeMatch[2].includes('hour')) {
        time *= 60;
      }
      maxTime = time;
    }
    
    let difficulty: number | null = null;
    if (userMessage.includes('easy') || userMessage.includes('simple') || userMessage.includes('beginner')) {
      difficulty = 2;
    } else if (userMessage.includes('medium') || userMessage.includes('moderate')) {
      difficulty = 3;
    } else if (userMessage.includes('hard') || userMessage.includes('difficult') || userMessage.includes('complex')) {
      difficulty = 4;
    }
    
    const categories = [];
    if (userMessage.includes('strategy') || userMessage.includes('strategic')) {
      categories.push('strategy');
    }
    if (userMessage.includes('family') || userMessage.includes('kid') || userMessage.includes('children')) {
      categories.push('family');
    }
    if (userMessage.includes('party') || userMessage.includes('fun') || userMessage.includes('laugh')) {
      categories.push('party');
    }
    if (userMessage.includes('card') || userMessage.includes('cards')) {
      categories.push('card');
    }
    if (userMessage.includes('cooperative') || userMessage.includes('coop') || userMessage.includes('together')) {
      categories.push('cooperative');
    }
    if (userMessage.includes('competitive') || userMessage.includes('versus') || userMessage.includes('against')) {
      categories.push('competitive');
    }
    
    let filteredGames = [...games];
    
    if (playerCount) {
      filteredGames = filteredGames.filter(game => 
        game.minPlayers <= playerCount! && game.maxPlayers >= playerCount!
      );
    }
    
    if (maxTime) {
      filteredGames = filteredGames.filter(game => game.playTime <= maxTime!);
    }
    
    if (difficulty) {
      filteredGames = filteredGames.filter(game => game.difficulty <= difficulty!);
    }
    
    if (categories.length > 0) {
      filteredGames = filteredGames.filter(game => 
        categories.some(category => game.category.includes(category as any))
      );
    }
    
    if (filteredGames.length > 0) {
      const recommendations = filteredGames.slice(0, 3);
      
      let response = "Based on what you're looking for, I recommend:\n\n";
      recommendations.forEach((game, index) => {
        response += `${index + 1}. **${game.name}** - ${game.description.substring(0, 100)}...\n`;
        response += `   Players: ${game.minPlayers}-${game.maxPlayers}, Time: ${game.playTime} min, Difficulty: ${game.difficulty}/5\n`;
        if (game.funFact) {
          response += `   Fun Fact: ${game.funFact}\n`;
        }
        response += `   Learn more: /game/${game.id}\n\n`;
      });
      
      if (filteredGames.length > 3) {
        response += `I found ${filteredGames.length} games that match your criteria. Check out the game list to see more!`;
      }
      
      return response;
    }
    
    if (userMessage.includes('recommend') || userMessage.includes('suggest')) {
      return "I'd be happy to recommend a game! Could you tell me more about what you're looking for? How many players will be playing? Do you prefer easy or complex games? Are you looking for strategy, party games, or something else?";
    }
    
    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      return "Hi there! I'm your board game assistant. Tell me what kind of games you enjoy, how many players you have, or how much time you want to spend, and I'll recommend some great games for you!";
    }
    
    return "I'm not sure I understand what you're looking for. Could you tell me more about what kind of game you want to play? How many players do you have? How much time do you want to spend? Do you prefer easy or complex games?";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: uuidv4(),
        text: generateResponse(text),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      clearChat,
      isChatOpen,
      toggleChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};