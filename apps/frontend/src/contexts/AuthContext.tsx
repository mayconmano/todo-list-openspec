import { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  birth_date: string | null;
  avatar_url: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function loadInitialState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (token && userRaw) {
    try {
      return { token, user: JSON.parse(userRaw) as User };
    } catch {
      // corrupted storage — reset
    }
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ token, user });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ token: null, user: null });
  };

  const updateUser = (partial: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
