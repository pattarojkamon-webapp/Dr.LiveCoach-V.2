
import { User } from '../types';

const USER_STORAGE_KEY = 'dr_live_coach_users_v2';
const SESSION_KEY = 'dr_live_coach_current_user_v2';

export const authService = {
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  signup: (username: string, name: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = authService.getUsers();
        
        // Check duplicates based on username
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
          reject(new Error('Username already exists.'));
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username,
          name: name || username, // Use username if name is empty
          password, // Note: Not secure for real app
          createdAt: Date.now()
        };

        users.push(newUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 800);
    });
  },

  login: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = authService.getUsers();
        // Simple exact match
        const user = users.find(u => 
          u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );

        if (user) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid username or password.'));
        }
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
