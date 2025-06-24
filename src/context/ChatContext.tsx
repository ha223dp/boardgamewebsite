import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Game } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from './GameContext';
import.meta.env.VITE_OPENAI_API_KEY

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  isTyping: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { games } = useGameContext();
  
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      text: "Hello! I'm your AI-powered board game assistant. I can help you find the perfect games based on your preferences, group size, available time, and interests. What kind of gaming experience are you looking for?",
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
      text: "Chat cleared! I'm ready to help you discover your next favorite board game. What would you like to play?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setError(null);
  };

  const callOpenAI = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
    try {
      // Create system prompt with game data
      const systemPrompt = `You are an expert board game recommendation assistant with extensive knowledge of board games. You have access to a curated collection of games:

${JSON.stringify(games, null, 2)}

Your expertise includes:
- Recommending games based on player count, time constraints, complexity preferences, and themes
- Explaining game mechanics and what makes each game special
- Comparing games and helping users choose between options
- Providing context about why certain games work well for specific situations
- Being enthusiastic and knowledgeable about the hobby

Guidelines:
1. Always be helpful, enthusiastic, and knowledgeable
2. When recommending specific games from the collection, mention the game name clearly
3. Explain WHY you're recommending each game
4. Consider the user's specific constraints (time, players, complexity, etc.)
5. Feel free to ask clarifying questions to give better recommendations
6. Keep responses conversational and engaging
7. If asked about games not in your collection, provide general advice but focus on games you have data for

Be the kind of board game expert that makes people excited to try new games!`;

      // Prepare conversation history (keep last 8 messages for context)
      const contextMessages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-8).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: contextMessages,
          max_tokens: 400,
          temperature: 0.8,
          presence_penalty: 0.2,
          frequency_penalty: 0.1,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your OpenAI API key.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 500) {
          throw new Error('OpenAI service is temporarily unavailable. Please try again.');
        } else {
          throw new Error(`API request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to connect to AI service. Please try again.');
    }
  };

  const getFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Simple fallback logic when AI is unavailable
    if (message.includes('strategy')) {
      return "I'm having trouble connecting to my AI brain, but I can suggest some great strategy games: Ticket to Ride for beginners, Azul for medium complexity, or Wingspan for nature lovers!";
    } else if (message.includes('party') || message.includes('fun')) {
      return "While I reconnect to my AI, here are some party favorites: Codenames for word games, Telestrations for laughs, or Just One for creativity!";
    } else if (message.includes('family')) {
      return "My AI is taking a break, but these family games are always winners: Splendor, King of Tokyo, or Sushi Go!";
    } else {
      return "I'm having trouble with my AI connection right now. Could you try asking again, or let me know if you'd like recommendations for strategy games, party games, or family games?";
    }
  };

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);
    
    try {
      // Check if API key is configured
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }

      const aiResponse = await callOpenAI(text, messages);
      
      const botResponse: ChatMessage = {
        id: uuidv4(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setError(errorMessage);
      
      // Provide fallback response
      const fallbackResponse: ChatMessage = {
        id: uuidv4(),
        text: getFallbackResponse(text),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      clearChat,
      isChatOpen,
      toggleChat,
      isTyping,
      error
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