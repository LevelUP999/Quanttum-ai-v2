import React, { createContext, useContext, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://jfrybckxwmqryfaewikr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcnliY2t4d21xcnlmYWV3aWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzcyNTksImV4cCI6MjA2NzA1MzI1OX0.VXJI3M-_CToOC-5chRYmOYGuhsyFp1yZEcTc6qGaOFc';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
    if (error || !data) throw new Error('Login inválido');

    const currentUser = { id: data.id, name: data.name, email: data.email, points: data.points };
    setUser(currentUser);
    await fetchUserData(currentUser);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.from('users').insert([{ name, email, password, points: 0 }]).select().single();
    if (error || !data) throw new Error('Erro ao registrar');

    const newUser = { id: data.id, name: data.name, email: data.email, points: data.points };
    setUser(newUser);
    await fetchUserData(newUser);
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
  };

  const updateUserPoints = async (points: number) => {
    if (!user) return;
    const { data, error } = await supabase.from('users').update({ points }).eq('id', user.id).select().single();
    if (error || !data) throw new Error('Erro ao atualizar pontos');
    setUser({ ...user, points: data.points });
  };

  const fetchUserData = async (userObj: User) => {
    const { data: routes, error: routesError } = await supabase.from('routes').select('*').eq('user_id', userObj.id);
    const { data: notes, error: notesError } = await supabase.from('notes').select('*').eq('user_id', userObj.id);

    if (routesError || notesError) throw new Error('Erro ao carregar dados');
    setUserData({ ...userObj, routes, notes });
  };

  const saveUserData = async (newData: any) => {
    if (!user) return;

    if (newData.routes) {
      for (const route of newData.routes) {
        await supabase.from('routes').insert([{ ...route, user_id: user.id }]);
      }
    }

    if (newData.notes) {
      for (const note of newData.notes) {
        await supabase.from('notes').insert([{ content: note.content, user_id: user.id }]);
      }
    }

    await fetchUserData(user);
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
