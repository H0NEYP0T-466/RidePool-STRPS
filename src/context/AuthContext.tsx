import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserCreate, UserLogin } from '../types';
import * as authService from '../services/auth';
import { setToken, setUser, getToken, getUser, clearAuth } from '../utils/helpers';
import socketService from '../services/socket';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUserState(currentUser);
          setUser(currentUser);
          socketService.connect();
          socketService.joinRoom(currentUser.id, currentUser.role as 'user' | 'driver');
        } catch {
          clearAuth();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: UserLogin) => {
    const response = await authService.login(credentials);
    setToken(response.token);
    setUser(response.user);
    setUserState(response.user);
    socketService.connect();
    socketService.joinRoom(response.user.id, response.user.role as 'user' | 'driver');
  };

  const register = async (userData: UserCreate) => {
    const response = await authService.register(userData);
    setToken(response.token);
    setUser(response.user);
    setUserState(response.user);
    socketService.connect();
    socketService.joinRoom(response.user.id, response.user.role as 'user' | 'driver');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    }
    socketService.disconnect();
    clearAuth();
    setUserState(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
    setUserState(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
