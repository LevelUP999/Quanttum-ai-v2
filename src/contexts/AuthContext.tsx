import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

interface UserData {
  users: {
    [email: string]: {
      name: string;
      password: string;
      points: number;
      routes?: any[];
      notes?: any[];
    };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  userData: any;
  saveUserData: (data: any) => Promise<void>;
}

const BIN_ID = '6860519f8561e97a502da4d8';
const API_KEY = '$2a$10$/d.H4HKnTMnggg1u.rxGd.xeVbKHu0B9qmS5.a0R7ZiNttDAqUQUq';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const fetchBin = async (): Promise<UserData> => {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });
    const json = await res.json();
    return json.record?.users ? json.record : { users: {} }; // ✅ garante formato padrão
  };


  const updateBin = async (record: UserData) => {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify(record),
    });
  };

  const login = async (email: string, password: string) => {
    const data = await fetchBin();
    const found = data.users[email];
    if (!found) throw new Error('Usuário não encontrado');
    if (found.password !== password) throw new Error('Senha incorreta');

    const userObj = {
      id: email,
      name: found.name,
      email,
      points: found.points || 0,
    };
    setUser(userObj);
    setUserData(found);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await fetchBin();
    if (data.users[email]) throw new Error('Usuário já existe');

    data.users[email] = {
      name,
      password,
      points: 0,
      notes: [],
      routes: [],
    };

    await updateBin(data);

    const userObj = {
      id: email,
      name,
      email,
      points: 0,
    };
    setUser(userObj);
    setUserData(data.users[email]);
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
  };

  const updateUserPoints = async (points: number) => {
    if (!user) return;
    const data = await fetchBin();
    const current = data.users[user.email];
    current.points += points;
    await updateBin(data);
    setUser({ ...user, points: current.points });
    setUserData(current);
  };

  const saveUserData = async (newData: any) => {
    if (!user) return;
    const data = await fetchBin();
    data.users[user.email] = {
      ...data.users[user.email],
      ...newData,
    };
    await updateBin(data);
    setUserData(data.users[user.email]);
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
