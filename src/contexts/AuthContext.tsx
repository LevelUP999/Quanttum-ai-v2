import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPoints: (points: number) => Promise<void>;
  userData: any;
  saveUserData: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login inválido');

    const data = await res.json();
    setUser(data.user);
    setUserData(data.userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error('Erro ao registrar');

    const data = await res.json();
    setUser(data.user);
    setUserData(data.userData);
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
  };

  const updateUserPoints = async (points: number) => {
    if (!user) return;
    const res = await fetch('/api/update-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, points }),
    });

    if (!res.ok) throw new Error('Erro ao atualizar pontos');
    const updated = await res.json();
    setUser({ ...user, points: updated.points });
    setUserData(updated);
  };

  const saveUserData = async (newData: any) => {
    if (!user) return;
    const res = await fetch('/api/save-user-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, newData }),
    });

    if (!res.ok) throw new Error('Erro ao salvar dados');
    const updated = await res.json();
    setUserData(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserPoints,
        userData,
        saveUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
