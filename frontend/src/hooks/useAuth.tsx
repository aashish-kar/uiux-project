import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI, userAPI, User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        const userData = await userAPI.getProfile();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, logout the user
      logout();
    }
  };

  useEffect(() => {
    // Check if user is already logged in on app start
    console.log('AuthProvider - Checking authentication on mount');
    const currentUser = authAPI.getCurrentUser();
    const isAuth = authAPI.isAuthenticated();
    console.log('AuthProvider - Current user from localStorage:', currentUser);
    console.log('AuthProvider - Is authenticated:', isAuth);
    
    if (currentUser && isAuth) {
      setUser(currentUser);
      console.log('AuthProvider - Setting user from localStorage');
      
      // Refresh user data from backend to get latest role
      refreshUser();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider - Login attempt for:', email);
      const { user: userData } = await authAPI.login({ email, password });
      console.log('AuthProvider - Login successful, setting user:', userData);
      setUser(userData);
    } catch (error) {
      console.error('AuthProvider - Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      console.log('AuthProvider - Signup attempt for:', userData.email);
      await authAPI.signup(userData);
      // Do NOT log in automatically after signup
    } catch (error) {
      console.error('AuthProvider - Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthProvider - Logout called');
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    refreshUser,
  };

  console.log('AuthProvider - Current state:', { user, isAuthenticated: !!user, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 