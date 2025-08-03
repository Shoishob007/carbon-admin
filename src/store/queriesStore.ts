import { create } from 'zustand';

interface Query {
  id: number;
  user_email: string;
  user_name: string;
  interests: string;
  message: string;
  status: 'in_progress' | 'completed' | 'new';
  created_at: string;
  updated_at: string;
}

interface QueriesStore {
  queries: Query[];
  loading: boolean;
  error: string | null;
  fetchQueries: (accessToken: string) => Promise<void>;
}

export const useQueriesStore = create<QueriesStore>((set) => ({
  queries: [],
  loading: false,
  error: null,
  fetchQueries: async (accessToken) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/issues/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({ queries: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch queries',
        loading: false 
      });
    }
  },
}));