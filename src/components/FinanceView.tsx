import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, generateId } from '../utils';
import { DollarSign, Filter, CheckCircle2, AlertCircle, Download, MessageSquare, Plus, X } from 'lucide-react';
import { Payment } from '../types';

import { cn } from '../utils';

export default function FinanceView() {
  const { players, payments, addPayment, deletePayment } = useStore();
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().substring(0, 7));
  const [isAdding, setIsAdding] = useState(false);

  const filteredPayments = payments.filter(p => p.month === monthFilter);
  const totalReceived = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const activeMonthlyPlayers = players.filter(p => p.status === 'Active' && p.paymentType === 'Monthly');
  const paidMonthlyPlayerIds = filteredPayments.filter(p => p.type === 'Monthly').map(p => p.playerId);
  const pendingPlayers = activeMonthlyPlayers.filter(p => !paidMonthlyPlayerIds.includes(p.id));

  const handleExportCSV = () => {
    const headers = ['Data', 'Jogador', 'Valor', 'Tipo', 'Mês'];
    const rows = filteredPayments.map(p => [
      p.date,
      players.find(player => player.id === p.playerId)?.name || 'Desconhecido',
      p.amount.toString(),
      p.type,
      p.month
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financeiro_${monthFilter}.csv`;
    link.click();
  };

  const handleWhatsAppBilling = (player: any) => {
    const message = `Olá ${player.name}, vimos que o pagamento da mensalidade de futebol (${monthFilter}) ainda está pendente. Valor: ${formatCurrency(player.monthlyValue)}.`;
    const url = `https://wa.me/${player.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const PaymentForm = ({ onSave, onCancel }: { onSave: (p: Payment) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Partial<Payment>>({
      playerId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      month: monthFilter,
      type: 'Monthly'
    });

    const selectedPlayer = players.find(p => p.id === formData.playerId);

    const handlePlayerChange = (id: string) => {
      const p = players.find(player => player.id === id);
      setFormData({
        ...formData,
        playerId: id,
        amount: p?.paymentType === 'Monthly' ? p.monthlyValue : p?.perGameValue,
        type: p?.paymentType as any
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white text-gray-900 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Registrar Pagamento</h2>
            <button onClick={onCancel} className="p-2 rounded-full transition-colors hover:bg-gray-100">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jogador</label>
              <select 
                value={formData.playerId}
                onChange={e => handlePlayerChange(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 border-gray-100"
              >
                <option value="">Selecione um jogador</option>
                {players.filter(p => p.status === 'Active').map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.paymentType === 'Monthly' ? 'Mensalista' : 'Avulso'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 border-gray-100 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value, month: e.target.value.substring(0, 7) })}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 border-gray-100 focus:bg-white"
                />
              </div>
            </div>

            <button 
              onClick={() => onSave({ ...formData, id: generateId() } as Payment)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all mt-4 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              Confirmar Recebimento
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
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500">Controle de entradas e pendências</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-green-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 text-primary-600 p-2 rounded-xl">
            <Filter size={18} />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-gray-700">Período</span>
        </div>
        <input 
          type="month" 
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className="bg-gray-50 text-primary-600 border-0 rounded-xl px-3 py-2 text-sm font-bold focus:ring-0 outline-none"
        />
      </div>

      <div className="bg-primary-600 p-6 rounded-3xl shadow-xl shadow-primary-100 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-1">Total Arrecadado</p>
          <h2 className="text-4xl font-black">{formatCurrency(totalReceived)}</h2>
          <div className="flex items-center gap-2 mt-4 text-primary-100 text-xs">
            <CheckCircle2 size={14} />
            <span>{filteredPayments.length} pagamentos realizados</span>
          </div>
        </div>
        <DollarSign className="absolute -right-4 -bottom-4 text-primary-500/30" size={120} />
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <AlertCircle size={18} className="text-red-500" />
              Pendentes ({pendingPlayers.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingPlayers.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center py-4">Tudo em dia!</p>
            ) : (
              pendingPlayers.map(p => (
                <div key={p.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Mensalista • {formatCurrency(p.monthlyValue || 0)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleWhatsAppBilling(p)}
                    className="bg-green-50 text-green-600 hover:bg-green-100 p-3 rounded-xl transition-all"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <CheckCircle2 size={18} className="text-green-500" />
            Histórico do Mês
          </h3>
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center py-4">Nenhum pagamento registrado.</p>
            ) : (
              filteredPayments.sort((a, b) => b.date.localeCompare(a.date)).map(p => {
                const player = players.find(pl => pl.id === p.playerId);
                return (
                  <div key={p.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 text-green-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                        {player?.name.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{player?.name || 'Desconhecido'}</p>
                        <p className="text-xs text-gray-500">{p.type === 'Monthly' ? 'Mensalidade' : 'Avulso'} • {p.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{formatCurrency(p.amount)}</p>
                      <button 
                        onClick={() => {
                          if(confirm('Excluir este pagamento?')) deletePayment(p.id);
                        }}
                        className="text-[10px] font-bold text-gray-300 hover:text-red-400 uppercase tracking-widest mt-1"
                      >
                        Estornar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {isAdding && (
        <PaymentForm 
          onSave={(p) => {
            addPayment(p);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  );
}
