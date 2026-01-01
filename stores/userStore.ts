  import { create } from 'zustand';
  import { persist, createJSONStorage } from 'zustand/middleware';
  import * as SecureStore from 'expo-secure-store';
  import axios from 'axios';

  interface User {
    clerkId: string;
    email: string;
    firstName: string;
    lastName?: string;
    image: string;
    sports: string[];
    provider?: string;
    playpals: string[];
    gameCount: number;
  }

  const fetchUser = async (clerkId: string, set: (state: Partial<UserStore>) => void) => {
    try {
      const response = await axios.get(`http://192.168.0.100:3001/api/users/${clerkId}`);
      if (response.status === 200) {
        set({ user: response.data.user });
      }
    } catch (error) {
      console.error('Failed to fetch user from backend:', error);
      set({ user: null });
    }
  };

  interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: (clerkId: string) => Promise<void>;
    clearUser: () => void;
    refreshUser: (clerkId: string) => Promise<void>;
  }

  export const useUserStore = create<UserStore>()(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        fetchUser: async (clerkId) => await fetchUser(clerkId, set),
        clearUser: () => set({ user: null }),
        refreshUser: async (clerkId) => await fetchUser(clerkId, set),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => ({
          getItem: async (name: string) => {
            const value = await SecureStore.getItemAsync(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: async (name: string, value: any) => {
            await SecureStore.setItemAsync(name, JSON.stringify(value));
          },
          removeItem: async (name: string) => {
            await SecureStore.deleteItemAsync(name);
          },
        })),
      }
    )
  );
  