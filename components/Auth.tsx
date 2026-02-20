import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [grade, setGrade] = useState(5);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Введіть email та пароль');
        return;
      }
      const user = authService.login(email, password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Невірний email або пароль.');
      }
    } else {
      if (!username || !email || !password) {
        setError('Заповніть усі поля');
        return;
      }
      
      const nameRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9\s-]+$/;
      if (!nameRegex.test(username)) {
        setError("Ім'я містить недопустимі символи");
        return;
      }
      
      if (password.length < 6) {
        setError('Пароль повинен містити щонайменше 6 символів');
        return;
      }
      // Check if user exists
      const existingUsers = authService.getUsers();
      if (existingUsers.some(u => u.email === email)) {
        setError('Користувач з таким email вже існує');
        return;
      }

      const user = authService.register(username, email, grade, password);
      onAuthSuccess(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
             <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Є-Знання</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Твій персональний простір для навчання</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Вхід
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Реєстрація
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ім'я</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Василь"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Клас</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
              >
                {[5, 6, 7, 8, 9, 10, 11].map(g => (
                  <option key={g} value={g}>{g}-й клас</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            {isLogin ? 'Увійти' : 'Створити акаунт'}
          </button>
        </form>
      </div>
    </div>
  );
};