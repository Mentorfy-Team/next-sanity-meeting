import type { Json } from '@/@types/supabase/v2.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Room {
  appointment_date: string | null
  appointment_finished_at: string | null
  attendees: any | null
  configs: any | null
  date_created: string | null
  date_updated: string | null
  duration: string | null
  friendly_id: string | null
  id: string
  invite_url: string | null
  owner_id: string
  recording_url: string | null
  room_name: string | null
  sort: number | null
  status: string
  type: string | null
  url: string | null
}

interface UserState {
  id: string;
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  setApiKey: (apiKey: string) => void;
  token: string;
  apiKey: string;
  isModerator: boolean;
  setIsModerator: (isModerator: boolean) => void;
  setMeetingId: (meetingId: string) => void;
  meetingId: string;
  room: Room | null;
  setRoom: (room: Room | null) => void;
}

const generateRandomId = () => Math.floor(Math.random() * 1000000).toString();

const isBrowser = typeof window !== 'undefined';

const getLocalStorage = (key: string) => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string) => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: generateRandomId(),
      name: '',
      email: '',
      setName: (name: string) => {
        set({ name });
        setLocalStorage('userName', name);
        setLocalStorage('userNameExpiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      },
      setEmail: (email: string) => {
        set({ email });
        setLocalStorage('userEmail', email);
        setLocalStorage('userEmailExpiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      },
      setToken: (token: string) => set({ token }),
      setApiKey: (apiKey: string) => set({ apiKey }),
      token: '',
      apiKey: '',
      isModerator: false,
      setIsModerator: (isModerator: boolean) => set({ isModerator }),
      setMeetingId: (meetingId: string) => set({ meetingId }),
      meetingId: '',
      room: null,
      setRoom: (room: Room | null) => set({ room }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ name: state.name, email: state.email }),
      storage: {
        getItem: (name) => {
          const str = getLocalStorage(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => setLocalStorage(name, JSON.stringify(value)),
        removeItem: (name) => {
          if (isBrowser) {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

// Add this function to check and load preserved data
const loadPreservedData = () => {
  if (isBrowser) {
    const now = Date.now();
    const userName = getLocalStorage('userName');
    const userNameExpiry = getLocalStorage('userNameExpiry');
    const userEmail = getLocalStorage('userEmail');
    const userEmailExpiry = getLocalStorage('userEmailExpiry');

    if (userName && userNameExpiry && now < parseInt(userNameExpiry)) {
      useUserStore.getState().setName(userName);
    }
    if (userEmail && userEmailExpiry && now < parseInt(userEmailExpiry)) {
      useUserStore.getState().setEmail(userEmail);
    }
  }
};

// Call this function when your app initializes
if (isBrowser) {
  loadPreservedData();
}
