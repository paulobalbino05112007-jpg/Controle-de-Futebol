/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, DollarSign, Shuffle } from 'lucide-react';
import { useStore } from './store';
import DashboardView from './components/DashboardView';
import PlayersView from './components/PlayersView';
import GamesView from './components/GamesView';
import FinanceView from './components/FinanceView';
import TeamsView from './components/TeamsView';
import { cn } from './utils';

type View = 'dashboard' | 'players' | 'games' | 'finance' | 'teams';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'players', label: 'Jogadores', icon: Users },
    { id: 'games', label: 'Jogos', icon: Calendar },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'teams', label: 'Times', icon: Shuffle },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'players': return <PlayersView />;
      case 'games': return <GamesView />;
      case 'finance': return <FinanceView />;
      case 'teams': return <TeamsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900 selection:bg-blue-100 selection:text-blue-700">
      <main className="max-w-md mx-auto min-h-screen relative bg-white shadow-2xl overflow-hidden">
        {/* Content */}
        <div className="pb-24">
          {renderView()}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 border-t border-gray-100 backdrop-blur-xl px-4 py-3 pb-8 z-40 flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative group",
                currentView === item.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                currentView === item.id ? "bg-blue-50" : "group-hover:bg-gray-50"
              )}>
                <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              
              {currentView === item.id && (
                <div className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

