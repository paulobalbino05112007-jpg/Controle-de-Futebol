import { useState, useEffect } from 'react';
import { Player, Game, Payment } from './types';

const STORAGE_KEY = 'controle_futebol_data';

interface AppData {
  players: Player[];
  games: Game[];
  payments: Payment[];
}

const initialData: AppData = {
  players: [
    { id: '1', name: 'João Silva', phone: '11999999999', status: 'Active', paymentType: 'Monthly', monthlyValue: 50 },
    { id: '2', name: 'Pedro Santos', phone: '11888888888', status: 'Active', paymentType: 'PerGame', perGameValue: 15 },
    { id: '3', name: 'Lucas Oliveira', phone: '11777777777', status: 'Active', paymentType: 'Monthly', monthlyValue: 50 },
    { id: '4', name: 'Rafael Costa', phone: '11666666666', status: 'Active', paymentType: 'PerGame', perGameValue: 15 },
    { id: '5', name: 'Mateus Lima', phone: '11555555555', status: 'Inactive', paymentType: 'Monthly', monthlyValue: 50 },
  ],
  games: [],
  payments: [],
};

export function useStore() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Remove theme if it exists in saved data
      const { theme, ...rest } = parsed;
      return rest;
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addPlayer = (player: Player) => {
    setData(prev => ({ ...prev, players: [...prev.players, player] }));
  };

  const updatePlayer = (player: Player) => {
    setData(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === player.id ? player : p)
    }));
  };

  const deletePlayer = (id: string) => {
    setData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const addGame = (game: Game) => {
    setData(prev => ({ ...prev, games: [...prev.games, game] }));
    
    // Automatically add payments for PerGame players
    const perGamePlayers = data.players.filter(p => 
      game.participants.includes(p.id) && p.paymentType === 'PerGame'
    );
    
    const newPayments: Payment[] = perGamePlayers.map(p => ({
      id: Math.random().toString(36).substring(2, 9),
      playerId: p.id,
      amount: p.perGameValue || 0,
      date: game.date,
      month: game.date.substring(0, 7),
      type: 'PerGame',
      gameId: game.id
    }));

    if (newPayments.length > 0) {
      setData(prev => ({ ...prev, payments: [...prev.payments, ...newPayments] }));
    }
  };

  const addPayment = (payment: Payment) => {
    setData(prev => ({ ...prev, payments: [...prev.payments, payment] }));
  };

  const deletePayment = (id: string) => {
    setData(prev => ({
      ...prev,
      payments: prev.payments.filter(p => p.id !== id)
    }));
  };

  return {
    ...data,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addGame,
    addPayment,
    deletePayment,
  };
}
