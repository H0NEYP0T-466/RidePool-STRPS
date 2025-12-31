import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, UserCreate, UserLogin } from '../types';
import * as authService from '../services/auth';
import { setToken, setUser, getToken, getUser, clearAuth } from '../utils/helpers';
import socketService from '../services/socket';
import { DUMMY_USERS } from '../data/dummyData';
import { API_URL } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendAvailable: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if backend is available
const checkBackendAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// Dummy login for frontend-only mode
const dummyLogin = (credentials: UserLogin): User | null => {
  const dummyUser = DUMMY_USERS[credentials.email];
  if (dummyUser && dummyUser.password === credentials.password) {
    const { password: _, ...userWithoutPassword } = dummyUser;
    return userWithoutPassword;
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  const checkBackend = useCallback(async () => {
    const available = await checkBackendAvailable();
    setIsBackendAvailable(available);
    return available;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getUser();
      
      // Check backend availability
      const backendAvailable = await checkBackend();
      
      if (token && savedUser) {
        if (backendAvailable) {
          try {
            const currentUser = await authService.getCurrentUser();
            setUserState(currentUser);
            setUser(currentUser);
            socketService.connect();
            socketService.joinRoom(currentUser.id, currentUser.role as 'user' | 'driver');
          } catch {
            // If backend call fails, try to use saved user in demo mode
            setUserState(savedUser);
          }
        } else {
          // Backend not available, use saved user
          setUserState(savedUser);
        }
      }
      setIsLoading(false);
    };

    initAuth();
    
    // Periodically check backend status
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, [checkBackend]);

  const login = async (credentials: UserLogin) => {
    // First check if backend is available
    const backendAvailable = await checkBackend();
    
    if (backendAvailable) {
      try {
        const response = await authService.login(credentials);
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        socketService.connect();
        socketService.joinRoom(response.user.id, response.user.role as 'user' | 'driver');
        return;
      } catch (error) {
        // If backend fails, fall through to dummy login
        const available = await checkBackend();
        if (available) {
          // Backend is available but login failed - throw the error
          throw error;
        }
      }
    }
    
    // Backend not available, use dummy login
    const dummyUser = dummyLogin(credentials);
    if (dummyUser) {
      setToken('dummy-token-' + Date.now());
      setUser(dummyUser);
      setUserState(dummyUser);
    } else {
      throw new Error('Invalid credentials. Try: user1@ridepool.pk, driver1@ridepool.pk, or admin1@ridepool.pk with password: password123');
    }
  };

  const register = async (userData: UserCreate) => {
    const backendAvailable = await checkBackend();
    
    if (backendAvailable) {
      try {
        const response = await authService.register(userData);
        setToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        socketService.connect();
        socketService.joinRoom(response.user.id, response.user.role as 'user' | 'driver');
        return;
      } catch (error) {
        const available = await checkBackend();
        if (available) throw error;
      }
    }
    
    // Backend not available, can't register in demo mode
    throw new Error('Registration not available in demo mode. Please use test credentials: user1@ridepool.pk / password123');
  };

  const logout = async () => {
    try {
      if (isBackendAvailable) {
        await authService.logout();
      }
    } catch {
      // Ignore logout errors
    }
    socketService.disconnect();
    clearAuth();
    setUserState(null);
  };

  const updateUser = async (data: Partial<User>) => {
    if (isBackendAvailable) {
      try {
        const updatedUser = await authService.updateProfile(data);
        setUser(updatedUser);
        setUserState(updatedUser);
        return;
      } catch {
        // Fallback to local update
      }
    }
    
    // Demo mode: update locally
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      setUserState(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isBackendAvailable,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
