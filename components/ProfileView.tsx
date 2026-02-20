import React, { useState } from 'react';
import { User, LearningStyle } from '../types';
import { authService } from '../services/authService';
import { User as UserIcon, Save, Mail, GraduationCap, Trophy, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [grade, setGrade] = useState(user.grade);
  const [preferredStyle, setPreferredStyle] = useState<LearningStyle>(user.preferredStyle || LearningStyle.SCHOOL);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateUsername = (name: string) => {
    if (!name.trim()) {
        setError("Ім'я не може бути порожнім");
        return false;
    }
    const validRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9\s-]+$/;
    if (!validRegex.test(name)) {
        setError("Ім'я містить недопустимі символи.");
        return false;
    }
    if (name.length < 2) {
        setError("Ім'я повинно містити щонайменше 2 символи");
        return false;
    }
    setError('');
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      setUsername(newVal);
      if (error) validateUsername(newVal);
  };

  const handleSave = () => {
    if (!validateUsername(username)) return;

    setIsSaving(true);
    const updatedUser: User = { 
      ...user, 
      username: username.trim(), 
      grade,
      preferredStyle 
    };
    authService.saveUser(updatedUser);
    onUpdate(updatedUser);
    
    setTimeout(() => {
        setIsSaving(false);
        setMessage('Профіль успішно оновлено!');
        setTimeout(() => setMessage(''), 3000);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8 border-b border-gray-100 pb-8">
           <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
              {username.charAt(0).toUpperCase()}
           </div>
           <div className="text-center md:text-left">
             <h2 className="text-2xl font-bold text-gray-800">Налаштування профілю</h2>
             <p className="text-gray-500 mt-1 text-sm">Керуйте своїми персональними даними</p>
           </div>
        </div>

        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-2 text-gray-400"/>
                    Ім'я користувача
                </label>
                <input 
                    type="text" 
                    value={username}
                    onChange={handleUsernameChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                        error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ваше ім'я"
                />
                {error && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />{error}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="w-4 h-4 inline mr-2 text-gray-400"/>
                        Клас навчання
                    </label>
                    <select 
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        {[5, 6, 7, 8, 9, 10, 11].map(g => (
                            <option key={g} value={g}>{g}-й клас</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Sparkles className="w-4 h-4 inline mr-2 text-purple-400"/>
                        Бажаний стиль навчання
                    </label>
                    <select 
                        value={preferredStyle}
                        onChange={(e) => setPreferredStyle(e.target.value as LearningStyle)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-blue-600"
                    >
                        {Object.values(LearningStyle).map((style) => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2 text-gray-400"/>
                    Електронна пошта
                </label>
                <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl cursor-not-allowed"
                />
            </div>

            <p className="text-xs text-blue-500 mt-2 ml-1 flex items-center">
                <BookOpen className="w-3 h-3 mr-1" />
                Зміна налаштувань оновить вашу програму та стиль пояснень АІ.
            </p>

            <div className="pt-4 space-y-3">
                <button 
                    onClick={handleSave}
                    disabled={isSaving || !!error || !username.trim()}
                    className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center
                        ${isSaving || !!error || !username.trim() 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                        }`}
                >
                    {isSaving ? 'Збереження...' : <><Save className="w-5 h-5 mr-2" /> Зберегти зміни</>}
                </button>
            </div>

            {message && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-center font-medium animate-in fade-in">
                    {message}
                </div>
            )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                  <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                  <p className="text-gray-500 text-sm font-medium">Ваш досвід</p>
                  <p className="text-2xl font-bold text-gray-800">{user.xp} XP</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                  <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div>
                  <p className="text-gray-500 text-sm font-medium">Вивчено тем</p>
                  <p className="text-2xl font-bold text-gray-800">{user.completedTopics.length}</p>
              </div>
          </div>
      </div>
    </div>
  );
};