import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type User = {
  id?: string;
  username?: string;
  usericon?: string | null;
  created_at?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (u: User | null, token?: string | null) => Promise<void>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@app:user');
        if (raw) setUserState(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load user', e);
      }
    })();
  }, []);

  const setUser = async (u: User | null, token?: string | null) => {
    setUserState(u);
    try {
      if (u) {
        await AsyncStorage.setItem('@app:user', JSON.stringify(u));
        if (token) {
          await SecureStore.setItemAsync('@app:token', token);
        }
      } else {
        await AsyncStorage.removeItem('@app:user');
        await SecureStore.deleteItemAsync('@app:token');
      }
    } catch (e) {
      console.warn('Failed to persist user', e);
    }
  };

  const signOut = async () => {
    await setUser(null);
  };

  return <UserContext.Provider value={{ user, setUser, signOut }}>{children}</UserContext.Provider>;
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
