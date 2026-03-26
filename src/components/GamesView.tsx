import React, { useState } from 'react';
import { useStore } from '../store';
import { generateId } from '../utils';
import { Calendar, Plus, Users, Check, X, Clock } from 'lucide-react';
import { Game } from '../types';

import { cn } from '../utils';

export default function GamesView() {
  const { games, players, addGame } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]);

  const activePlayers = players.filter(p => p.status === 'Active');

  const handleTogglePlayer = (id: string) => {
    setSelectedPlayers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSaveGame = () => {
    if (selectedPlayers.length === 0) return alert('Selecione pelo menos um jogador!');
    
    const newGame: Game = {
      id: generateId(),
      date: gameDate,
      participants: selectedPlayers
    };
    
    addGame(newGame);
    setIsAdding(false);
    setSelectedPlayers([]);
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
          <p className="text-sm text-gray-500">{games.length} partidas registradas</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {games.length === 0 ? (
          <div className="bg-white border border-gray-200 border-dashed p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Calendar size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Nenhum jogo ainda.</p>
            <p className="text-xs text-gray-400 mt-1">Clique no + para registrar sua primeira partida!</p>
          </div>
        ) : (
          games.sort((a, b) => b.date.localeCompare(a.date)).map(game => (
            <div key={game.id} className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-50 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(game.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {game.date}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Users size={12} className="text-gray-500" />
                  <span className="text-xs font-bold text-gray-600">{game.participants.length}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {game.participants.slice(0, 5).map(pid => {
                  const p = players.find(player => player.id === pid);
                  return p ? (
                    <div key={pid} className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded-lg text-[10px] font-medium">
                      {p.name.split(' ')[0]}
                    </div>
                  ) : null;
                })}
                {game.participants.length > 5 && (
                  <div className="bg-gray-50 text-gray-400 border border-gray-100 px-2 py-1 rounded-lg text-[10px] font-bold">
                    +{game.participants.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white text-gray-900 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Novo Jogo</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 rounded-full transition-colors hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data da Partida</label>
                <input 
                  type="date" 
                  value={gameDate}
                  onChange={e => setGameDate(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 border-gray-100 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Selecionar Jogadores ({selectedPlayers.length})</label>
                <div className="space-y-2">
                  {activePlayers.map(player => (
                    <button 
                      key={player.id}
                      onClick={() => handleTogglePlayer(player.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        selectedPlayers.includes(player.id) 
                          ? 'bg-primary-50 border-primary-200' 
                          : 'bg-white border-gray-100'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                          selectedPlayers.includes(player.id) 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-100 text-gray-500'
                        )}>
                          {player.name.charAt(0)}
                        </div>
                        <span className={cn(
                          "text-sm font-semibold",
                          selectedPlayers.includes(player.id) 
                            ? 'text-primary-900' 
                            : 'text-gray-700'
                        )}>{player.name}</span>
                      </div>
                      {selectedPlayers.includes(player.id) && <Check size={16} className="text-primary-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveGame}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-200 transition-all mt-6 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Confirmar Jogo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
