import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, FilterOptions } from '../types';
import { gamesData } from '../data/games';

interface GameContextType {
  games: Game[];
  filteredGames: Game[];
  favorites: Game[];
  addToFavorites: (game: Game) => void;
  removeFromFavorites: (gameId: string) => void;
  isFavorite: (gameId: string) => boolean;
  filterGames: (options: FilterOptions) => void;
  filterOptions: FilterOptions;
  resetFilters: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games] = useState<Game[]>(gamesData);
  const [filteredGames, setFilteredGames] = useState<Game[]>(games);
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  // Initialize favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('boardGameFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        // Filter out any favorites that don't exist in our games data
        const validFavorites = parsedFavorites.filter((favId: string) => 
          games.some(game => game.id === favId)
        );
        
        setFavorites(games.filter(game => validFavorites.includes(game.id)));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, [games]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('boardGameFavorites', JSON.stringify(favorites.map(fav => fav.id)));
  }, [favorites]);

  const addToFavorites = (game: Game) => {
    if (!favorites.some(fav => fav.id === game.id)) {
      setFavorites([...favorites, game]);
    }
  };

  const removeFromFavorites = (gameId: string) => {
    setFavorites(favorites.filter(game => game.id !== gameId));
  };

  const isFavorite = (gameId: string) => {
    return favorites.some(game => game.id === gameId);
  };

  const filterGames = (options: FilterOptions) => {
    setFilterOptions(options);
    
    let filtered = [...games];
    
    if (options.players) {
      filtered = filtered.filter(game => 
        game.minPlayers <= options.players! && game.maxPlayers >= options.players!
      );
    }
    
    if (options.maxTime) {
      filtered = filtered.filter(game => game.playTime <= options.maxTime!);
    }
    
    if (options.difficulty) {
      filtered = filtered.filter(game => game.difficulty <= options.difficulty!);
    }
    
    if (options.complexity) {
      filtered = filtered.filter(game => game.complexity <= options.complexity!);
    }
    
    if (options.categories && options.categories.length > 0) {
      filtered = filtered.filter(game => 
        options.categories!.some(category => game.category.includes(category))
      );
    }
    
    setFilteredGames(filtered);
  };

  const resetFilters = () => {
    setFilterOptions({});
    setFilteredGames(games);
  };

  return (
    <GameContext.Provider value={{
      games,
      filteredGames,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      filterGames,
      filterOptions,
      resetFilters
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};