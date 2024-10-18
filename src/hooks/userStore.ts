import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  id: string;
  name: string;
  setName: (name: string) => void;
}

const generateRandomId = () => Math.floor(Math.random() * 1000000).toString();

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: generateRandomId(),
      name: '',
      setName: (name: string) => set({ name }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);