import React, { useState } from 'react';
import { useStore } from '../store';
import { Users, Shuffle, Check, X, Save, Trash2 } from 'lucide-react';
import { Player, Team } from '../types';

import { cn } from '../utils';

export default function TeamsView() {
  const { players } = useStore();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [numTeams, setNumTeams] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState<Team[]>([]);

  const activePlayers = players.filter(p => p.status === 'Active');

  const handleTogglePlayer = (id: string) => {
    setSelectedPlayers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerateTeams = () => {
    if (selectedPlayers.length < numTeams) return alert('Selecione mais jogadores!');
    
    const playersToSplit = activePlayers.filter(p => selectedPlayers.includes(p.id));
    
    // Random shuffle
    playersToSplit.sort(() => Math.random() - 0.5);

    const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: `Time ${i + 1}`,
      players: []
    }));

    playersToSplit.forEach((player, index) => {
      const teamIndex = index % numTeams;
      teams[teamIndex].players.push(player);
    });

    setGeneratedTeams(teams);
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Gerador de Times</h1>
        <p className="text-sm text-gray-500">Equilibre as partidas automaticamente</p>
      </header>

      {generatedTeams.length === 0 ? (
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 transition-colors">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Número de Times</label>
                <div className="bg-gray-100 flex items-center gap-2 p-1 rounded-xl">
                  {[2, 3, 4].map(n => (
                    <button 
                      key={n}
                      onClick={() => setNumTeams(n)}
                      className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        numTeams === n 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-gray-500'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold text-gray-500 uppercase">Selecionar Jogadores ({selectedPlayers.length})</label>
                <button 
                  onClick={() => setSelectedPlayers(selectedPlayers.length === activePlayers.length ? [] : activePlayers.map(p => p.id))}
                  className="text-xs font-bold text-primary-600"
                >
                  {selectedPlayers.length === activePlayers.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activePlayers.map(player => (
                  <button 
                    key={player.id}
                    onClick={() => handleTogglePlayer(player.id)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl border transition-all",
                      selectedPlayers.includes(player.id) 
                        ? 'bg-primary-50 border-primary-200' 
                        : 'bg-white border-gray-100'
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                      selectedPlayers.includes(player.id) 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-500'
                    )}>
                      {player.name.charAt(0)}
                    </div>
                    <span className={cn(
                      "text-xs font-semibold truncate",
                      selectedPlayers.includes(player.id) 
                        ? 'text-primary-900' 
                        : 'text-gray-700'
                    )}>{player.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerateTeams}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-200 transition-all mt-4 flex items-center justify-center gap-2"
            >
              <Shuffle size={20} />
              Gerar Times
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex gap-2">
            <button 
              onClick={handleGenerateTeams}
              className="bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 flex-1 font-bold py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Shuffle size={18} />
              Embaralhar
            </button>
            <button 
              onClick={() => setGeneratedTeams([])}
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex-1 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Limpar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {generatedTeams.map((team, idx) => (
              <div key={team.id} className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className={cn(
                  "p-4 flex justify-between items-center text-white",
                  idx === 0 ? 'bg-primary-600' : idx === 1 ? 'bg-red-600' : idx === 2 ? 'bg-green-600' : 'bg-purple-600'
                )}>
                  <h3 className="font-black uppercase tracking-widest">{team.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold opacity-80">
                    <Users size={14} />
                    {team.players.length} Jogadores
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {team.players.map(p => (
                    <div key={p.id} className="border-b border-gray-50 last:border-0 flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 text-gray-600 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
