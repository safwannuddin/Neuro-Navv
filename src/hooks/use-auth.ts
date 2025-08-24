import { useState, useEffect } from 'react';

// Mock user types for demo
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

// Mock user data
const MOCK_USER: User = {
  id: '123',
  name: 'Dr. Jane Smith',
  email: 'jane.smith@hospital.org',
  role: 'user',
  avatarUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80'
};

const MOCK_ADMIN: User = {
  id: '456',
  name: 'Admin User',
  email: 'admin@neuronav.org',
  role: 'admin',
  avatarUrl: 'https://images.pexels.com/photos/5615665/pexels-photo-5615665.jpeg?auto=compress&cs=tinysrgb&w=80'
};

export function useAuth() {
  // In a real app, you'd check localStorage, cookies, or a backend auth service
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, default to true
  const [user, setUser] = useState<User | null>(MOCK_USER); // For demo purposes, use mock user
  
  const login = (email: string, password: string) => {
    // Mock authentication logic
    if (email === 'admin@neuronav.org') {
      setUser(MOCK_ADMIN);
    } else {
      setUser(MOCK_USER);
    }
    setIsAuthenticated(true);
    return Promise.resolve();
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    return Promise.resolve();
  };
  
  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
}