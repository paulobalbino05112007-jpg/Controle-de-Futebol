import React from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../utils';
import { TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { cn } from '../utils';

export default function DashboardView() {
  const { players, payments, games } = useStore();
  const currentMonth = new Date().toISOString().substring(0, 7);

  const monthlyPayments = payments.filter(p => p.month === currentMonth);
  const totalReceived = monthlyPayments.reduce((acc, p) => acc + p.amount, 0);

  // Calculate pending
  const activeMonthlyPlayers = players.filter(p => p.status === 'Active' && p.paymentType === 'Monthly');
  const paidMonthlyPlayerIds = monthlyPayments.filter(p => p.type === 'Monthly').map(p => p.playerId);
  const pendingMonthly = activeMonthlyPlayers
    .filter(p => !paidMonthlyPlayerIds.includes(p.id))
    .reduce((acc, p) => acc + (p.monthlyValue || 0), 0);

  const stats = [
    { label: 'Recebido (Mês)', value: formatCurrency(totalReceived), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pendente (Mês)', value: formatCurrency(pendingMonthly), icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Jogadores Ativos', value: players.filter(p => p.status === 'Active').length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Jogos Realizados', value: games.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const chartData = [
    { name: 'Recebido', value: totalReceived },
    { name: 'Pendente', value: pendingMonthly },
  ];

  return (
    <div className="space-y-6 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumo financeiro de {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className={cn(stat.bg, stat.color, "w-10 h-10 rounded-xl flex items-center justify-center mb-3")}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Fluxo Financeiro</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inadimplentes</h2>
        <div className="space-y-3">
          {activeMonthlyPlayers.filter(p => !paidMonthlyPlayerIds.includes(p.id)).length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nenhum pagamento pendente!</p>
          ) : (
            activeMonthlyPlayers
              .filter(p => !paidMonthlyPlayerIds.includes(p.id))
              .map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Mensalista</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-red-600">{formatCurrency(p.monthlyValue || 0)}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
