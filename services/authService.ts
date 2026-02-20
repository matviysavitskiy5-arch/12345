
import { User, QuizResult, LearningStyle } from '../types';

const STORAGE_KEY = 'eznannya_users';
const CURRENT_USER_KEY = 'eznannya_current_user';

export const authService = {
  getUsers: (): User[] => {
    const usersJson = localStorage.getItem(STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    return users.map(u => ({ 
      ...u, 
      xp: u.xp || 0,
      level: u.level || 1,
      streak: u.streak || 0,
      quizResults: u.quizResults || [],
      preferredStyle: u.preferredStyle || LearningStyle.SCHOOL
    }));
  },

  saveUser: (user: User) => {
    const users = authService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    // Recalculate level: Base 1000 XP per level
    user.level = Math.floor(user.xp / 1000) + 1;

    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Update current user in storage if it matches
    const current = authService.getCurrentUser();
    if (current && current.id === user.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  },

  register: (username: string, email: string, grade: number, password: string): User => {
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      grade,
      password,
      xp: 0,
      level: 1,
      streak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      lastActiveTimestamp: Date.now(),
      completedTopics: [],
      quizResults: [],
      badges: [],
      preferredStyle: LearningStyle.SCHOOL
    };
    authService.saveUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: (email: string, password: string): User | null => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      if (user.lastLoginDate !== today) {
        // Streak logic
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (user.lastLoginDate === yesterdayStr) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }
        user.lastLoginDate = today;
      }
      user.lastActiveTimestamp = Date.now();
      authService.saveUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); // Ensure current user is set
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson);
  },

  updateActivity: () => {
    const user = authService.getCurrentUser();
    if (!user) return;
    user.lastActiveTimestamp = Date.now();
    authService.saveUser(user);
  },

  getUserById: (id: string): User | undefined => {
    const users = authService.getUsers();
    return users.find(u => u.id === id);
  },

  addXp: (amount: number, topicId?: string) => {
    const user = authService.getCurrentUser();
    if (!user) return;
    user.xp += amount;
    user.lastActiveTimestamp = Date.now(); // Update activity on XP gain
    if (topicId && !user.completedTopics.includes(topicId)) {
      user.completedTopics.push(topicId);
    }
    authService.saveUser(user);
    return user;
  },

  saveQuizResult: (result: QuizResult) => {
    const user = authService.getCurrentUser();
    if (!user) return;
    if (!user.quizResults) user.quizResults = [];
    user.quizResults.push(result);
    user.lastActiveTimestamp = Date.now(); // Update activity on quiz completion
    authService.saveUser(user);
  }
};