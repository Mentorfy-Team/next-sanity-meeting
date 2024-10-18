import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  id: string;
  name: string;
  setName: (name: string) => void;
  setToken: (token: string) => void;
  setApiKey: (apiKey: string) => void;
  token: string;
  apiKey: string;
}

const generateRandomId = () => Math.floor(Math.random() * 1000000).toString();

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: generateRandomId(),
      name: '',
      setName: (name: string) => set({ name }),
      setToken: (token: string) => set({ token }),
      setApiKey: (apiKey: string) => set({ apiKey }),
      token: '',
      apiKey: '',
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);