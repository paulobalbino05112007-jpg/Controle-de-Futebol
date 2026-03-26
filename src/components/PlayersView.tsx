import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId, cn } from '../utils';
import { UserPlus, Search, Phone, Trash2, Edit2, X, Check } from 'lucide-react';
import { Player, PlayerStatus, PaymentType } from '../types';

export default function PlayersView() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useStore();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const PlayerForm = ({ player, onSave, onCancel }: { player?: Player, onSave: (p: Player) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Partial<Player>>(player || {
      name: '',
      phone: '',
      status: 'Active',
      paymentType: 'Monthly',
      monthlyValue: 50,
      perGameValue: 15
    });

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{player ? 'Editar Jogador' : 'Novo Jogador'}</h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as PlayerStatus })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="Active">Ativo</option>
                  <option value="Inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Pagamento</label>
              <div className="bg-gray-100 grid grid-cols-2 gap-2 p-1 rounded-xl">
                <button 
                  onClick={() => setFormData({ ...formData, paymentType: 'Monthly' })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${formData.paymentType === 'Monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Mensalista
                </button>
                <button 
                  onClick={() => setFormData({ ...formData, paymentType: 'PerGame' })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${formData.paymentType === 'PerGame' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Avulso
                </button>
              </div>
            </div>

            {formData.paymentType === 'Monthly' ? (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor Mensal (R$)</label>
                <input 
                  type="number" 
                  value={formData.monthlyValue}
                  onChange={e => setFormData({ ...formData, monthlyValue: parseFloat(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor por Jogo (R$)</label>
                <input 
                  type="number" 
                  value={formData.perGameValue}
                  onChange={e => setFormData({ ...formData, perGameValue: parseFloat(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            )}

            <button 
              onClick={() => onSave({ ...formData, id: player?.id || generateId() } as Player)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all mt-4 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Salvar Jogador
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmation = ({ player, onConfirm, onCancel }: { player: Player, onConfirm: () => void, onCancel: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Excluir Jogador</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tem certeza que deseja excluir <strong>{player.name}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onCancel}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jogadores</h1>
          <p className="text-sm text-gray-500">{players.length} cadastrados</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
        >
          <UserPlus size={24} />
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar jogador..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        {filteredPlayers.map(player => (
          <div key={player.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${player.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                {player.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{player.name}</h3>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${player.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {player.status === 'Active' ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Phone size={10} /> {player.phone || 'Sem tel.'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingPlayer(player)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => setPlayerToDelete(player)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || editingPlayer) && (
        <PlayerForm 
          player={editingPlayer || undefined}
          onSave={(p) => {
            if (editingPlayer) updatePlayer(p);
            else addPlayer(p);
            setIsAdding(false);
            setEditingPlayer(null);
          }}
          onCancel={() => {
            setIsAdding(false);
            setEditingPlayer(null);
          }}
        />
      )}

      {playerToDelete && (
        <DeleteConfirmation 
          player={playerToDelete}
          onConfirm={() => {
            deletePlayer(playerToDelete.id);
            setPlayerToDelete(null);
          }}
          onCancel={() => setPlayerToDelete(null)}
        />
      )}
    </div>
  );
}
