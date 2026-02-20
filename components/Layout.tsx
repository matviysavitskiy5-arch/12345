import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LEVEL_BADGES } from '../constants';
import { LogOut, Book, Award, User as UserIcon, GraduationCap, Zap, Users, PenTool, Moon, Sun } from 'lucide-react';
import { friendsService } from '../services/friendsService';
import { authService } from '../services/authService';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, currentPath, onNavigate, children }) => {
  const [onlineFriendsCount, setOnlineFriendsCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Poll for online friends count AND update own activity status
  useEffect(() => {
    setOnlineFriendsCount(friendsService.getOnlineCount());
    authService.updateActivity();

    const interval = setInterval(() => {
      setOnlineFriendsCount(friendsService.getOnlineCount());
      authService.updateActivity();
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  const currentBadge = LEVEL_BADGES.slice().reverse().find(b => user.xp >= b.xp) || LEVEL_BADGES[0];
  const nextBadge = LEVEL_BADGES.find(b => b.xp > user.xp);
  const progressToNext = nextBadge 
    ? ((user.xp - currentBadge.xp) / (nextBadge.xp - currentBadge.xp)) * 100 
    : 100;

  const NavItem = ({ path, icon: Icon, label, badge }: { path: string, icon: any, label: string, badge?: number | string }) => (
    <button
      onClick={() => onNavigate(path)}
      className={`flex items-center w-full px-4 py-3 rounded-2xl transition-all relative group ${
        currentPath === path 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 transition-transform ${currentPath === path ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="font-bold text-sm flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          currentPath === path 
            ? 'bg-white/20 text-white' 
            : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-800'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col md:flex-row transition-colors duration-300">
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-6 z-20 transition-colors duration-300">
        <div className="flex items-center text-blue-700 dark:text-blue-400 font-black text-2xl mb-10 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3"><GraduationCap className="w-7 h-7" /></div>
          Є-Знання
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white mb-8 shadow-xl shadow-blue-100 dark:shadow-none relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('/profile')}>
           <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
           
           <div className="flex items-center mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border-2 border-white/30 shadow-inner">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                 <p className="font-bold text-sm truncate w-32">{user.username}</p>
                 <div className="flex items-center text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full mt-1 w-fit">
                    <Zap className="w-2.5 h-2.5 mr-1 fill-yellow-400 text-yellow-400" /> {user.streak} ДНІВ
                 </div>
              </div>
           </div>
           
           <div className="space-y-1 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                 <span>Рівень {user.level}</span>
                 <span>{user.xp} XP</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${progressToNext}%` }} />
              </div>
           </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem path="/dashboard" icon={Book} label="Навчання" />
          <NavItem path="/laboratory" icon={PenTool} label="Лабораторія" />
          <NavItem path="/leaderboard" icon={Award} label="Рейтинг" />
          <NavItem path="/friends" icon={Users} label="Друзі" badge={`${onlineFriendsCount} online`} />
          <NavItem path="/profile" icon={UserIcon} label="Профіль" />
        </nav>

        <div className="mt-auto space-y-4">
            <button 
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="flex items-center">
                    {isDarkMode ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
                    {isDarkMode ? 'Темна тема' : 'Світла тема'}
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                </div>
            </button>

            <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-600 font-bold text-sm transition-colors rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5 mr-3" /> Вийти
            </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 relative z-10">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">{children}</div>
      </main>
    </div>
  );
};