import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  name: string;
  role: "super_admin" | "individual" | "business";
  is_active: boolean;
  profile_image: string | null;
  profile: {
    api_requests_made: number;
    total_requests_limit: number;
  };
  business_profile: {
    company_name: string;
  } | null;
  subscription: {
    plan_name: string;
    status: string;
  } | null;
}

interface UsersState {
  apiUsers: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (accessToken: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      apiUsers: [],
      loading: false,
      error: null,
      fetchUsers: async (accessToken: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/users`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch users");

          const data = await response.json();
          set({ apiUsers: data.users });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch users",
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "users-storage",
    }
  )
);
