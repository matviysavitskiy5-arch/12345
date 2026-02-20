import React, { useState, useEffect } from 'react';
import { PublicUser, FriendRequest } from '../types';
import { friendsService } from '../services/friendsService';
import { Search, UserPlus, Users, MessageCircle, Clock, Check, X, Shield, Zap } from 'lucide-react';

export const FriendsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'requests' | 'search'>('list');
  const [friends, setFriends] = useState<PublicUser[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-refresh logic for "Online" simulation
  useEffect(() => {
    const loadData = () => {
      setFriends(friendsService.getFriends());
      setRequests(friendsService.getRequests());
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Update every 5s to simulate realtime
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setSearchResults(friendsService.searchUsers(query));
        setIsLoading(false);
      }, 300); // Simulate network delay
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = (user: PublicUser) => {
    friendsService.sendRequest(user);
    alert(`Запит надіслано користувачу ${user.username}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAccept = (req: FriendRequest) => {
    friendsService.acceptRequest(req.id);
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setFriends(friendsService.getFriends()); // Refresh list
  };

  const handleDecline = (req: FriendRequest) => {
    friendsService.declineRequest(req.id);
    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const removeFriend = (id: string) => {
    if(confirm('Видалити користувача з друзів?')) {
        friendsService.removeFriend(id);
        setFriends(prev => prev.filter(f => f.id !== id));
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-indigo-600" />
            Друзі та Спільнота
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Спілкуйся, змагайся та навчайся разом!</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-xl self-stretch md:self-auto">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${activeTab === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Мої друзі
            {friends.length > 0 && <span className="ml-2 bg-indigo-100 text-indigo-600 px-1.5 rounded-md text-xs">{friends.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${activeTab === 'requests' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Запити
            {requests.length > 0 && <span className="ml-2 bg-red-100 text-red-600 px-1.5 rounded-md text-xs animate-pulse">{requests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${activeTab === 'search' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Search className="w-4 h-4 mr-2" />
            Пошук
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        
        {/* TAB: FRIENDS LIST */}
        {activeTab === 'list' && (
          <div className="p-2">
            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-bold">У тебе ще немає друзів.</p>
                <button onClick={() => setActiveTab('search')} className="mt-4 text-indigo-600 hover:underline text-sm font-bold">Знайти когось?</button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {friends.map(friend => (
                  <div key={friend.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group rounded-xl">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${friend.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-800">{friend.username}</h3>
                        <div className="flex items-center text-xs font-medium text-gray-500 mt-0.5">
                          <span className="bg-yellow-100 text-yellow-700 px-1.5 rounded mr-2">LVL {friend.level}</span>
                          {friend.isOnline ? (
                            <span className="text-green-600 flex items-center"><Zap className="w-3 h-3 mr-1 fill-green-500" /> Онлайн</span>
                          ) : (
                            <span className="text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> {friend.lastSeen || 'Був нещодавно'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Написати повідомлення">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => removeFriend(friend.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Видалити з друзів">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: REQUESTS */}
        {activeTab === 'requests' && (
          <div className="p-6">
            {requests.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Немає нових запитів.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map(req => (
                  <div key={req.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                     <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-4">
                           {req.sender.username.charAt(0)}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800">{req.sender.username}</h4>
                           <p className="text-xs text-gray-500">{req.sender.grade} клас • Рівень {req.sender.level}</p>
                           <p className="text-[10px] text-gray-400 mt-1">Надіслано: {new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleAccept(req)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                           <Check className="w-4 h-4 mr-2" /> Прийняти
                        </button>
                        <button onClick={() => handleDecline(req)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-xl transition-colors">
                           <X className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SEARCH */}
        {activeTab === 'search' && (
          <div className="p-6">
             <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Введіть ім'я користувача..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-gray-800"
                />
             </div>

             {isLoading ? (
               <div className="text-center py-10 text-gray-400">
                 <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
                 Пошук...
               </div>
             ) : (
               <div className="space-y-4">
                 {searchQuery && searchResults.length === 0 && (
                   <p className="text-center text-gray-400">Користувачів не знайдено.</p>
                 )}
                 {searchResults.map(user => (
                   <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                         <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold mr-3">
                            {user.username.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-800">{user.username}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                               <span className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 font-bold">{user.grade} клас</span>
                               <span>{user.xp} XP</span>
                            </div>
                         </div>
                      </div>
                      <button 
                        onClick={() => sendFriendRequest(user)}
                        className="flex items-center px-4 py-2 bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl font-bold text-xs transition-all"
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Додати
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};