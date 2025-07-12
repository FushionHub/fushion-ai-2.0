import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tokens: number;
  plan: string;
  isAdmin?: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface AppSettings {
  appName: string;
  logo: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  googleAnalyticsId?: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Chat state
  messages: ChatMessage[];
  isTyping: boolean;
  currentChat: string | null;
  
  // UI state
  sidebarOpen: boolean;
  currentPage: string;
  loading: boolean;
  
  // App settings
  settings: AppSettings;
  
  // Admin state
  users: User[];
  analytics: any;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateUserTokens: (tokens: number) => void;
  setUsers: (users: User[]) => void;
  setAnalytics: (analytics: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      messages: [],
      isTyping: false,
      currentChat: null,
      sidebarOpen: true,
      currentPage: 'chat',
      loading: false,
      settings: {
        appName: 'Fusion AI 2.0',
        logo: '/logo.png',
        theme: 'dark',
        primaryColor: '#667eea',
      },
      users: [],
      analytics: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      setTyping: (typing) => set({ isTyping: typing }),
      
      clearMessages: () => set({ messages: [] }),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setLoading: (loading) => set({ loading }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      updateUserTokens: (tokens) => set((state) => ({
        user: state.user ? { ...state.user, tokens } : null
      })),
      
      setUsers: (users) => set({ users }),
      
      setAnalytics: (analytics) => set({ analytics }),
    }),
    {
      name: 'fusion-ai-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        currentPage: state.currentPage,
      }),
    }
  )
);