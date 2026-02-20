import React from 'react';
import { User } from '../types';
import { LEVEL_BADGES } from '../constants';
import { authService } from '../services/authService';
import { Trophy, Medal, Crown } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const users = authService.getUsers().sort((a, b) => b.xp - a.xp);
  const currentUser = authService.getCurrentUser();

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 md:w-6 md:h-6 text-gray-400 fill-gray-400" />;
      case 2: return <Medal className="w-5 h-5 md:w-6 md:h-6 text-orange-400 fill-orange-400" />;
      default: return <span className="text-gray-500 font-bold w-6 text-center text-sm md:text-base">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 md:p-8 text-white shadow-lg flex items-center justify-between">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 mr-3" />
            Рейтинг учнів
          </h1>
          <p className="opacity-90 mt-2 text-sm md:text-base">Змагайся з іншими, отримуй XP та ставай кращим!</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header - Hidden on very small screens if needed, or simplified */}
        <div className="flex p-4 bg-gray-50 border-b border-gray-200 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <div className="w-10 text-center">#</div>
          <div className="flex-1">Учень</div>
          <div className="w-20 md:w-32 text-right">Рівень</div>
          <div className="w-16 md:w-24 text-right">XP</div>
        </div>

        <div className="divide-y divide-gray-100">
          {users.map((user, idx) => {
             const badge = LEVEL_BADGES.slice().reverse().find(b => user.xp >= b.xp) || LEVEL_BADGES[0];
             const isMe = currentUser?.id === user.id;

             return (
              <div 
                key={user.id} 
                className={`flex p-3 md:p-4 items-center transition-colors ${isMe ? 'bg-blue-50/70 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
              >
                <div className="w-10 flex justify-center flex-shrink-0">{getRankIcon(idx)}</div>
                
                <div className="flex-1 flex items-center min-w-0 pr-2">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs md:text-sm mr-2 md:mr-3 flex-shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-medium truncate text-sm md:text-base ${isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                      {user.username} {isMe && <span className="text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded ml-1 hidden md:inline-block">Ви</span>}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-400 truncate">{user.grade} клас</div>
                  </div>
                </div>

                <div className="w-20 md:w-32 text-right text-xs md:text-sm text-gray-600 flex items-center justify-end">
                   <span className="mr-1 md:mr-2 text-lg">{badge.icon}</span>
                   <span className="hidden md:inline">{badge.name}</span>
                </div>

                <div className="w-16 md:w-24 text-right font-bold text-gray-800 text-sm md:text-base">
                  {user.xp}
                </div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};