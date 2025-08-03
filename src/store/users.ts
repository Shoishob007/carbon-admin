import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  name: string;
  role: "individual" | "business" | "super_admin";
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
          const url = new URL(
            `${import.meta.env.VITE_API_URL}/api/users/users`
          );
          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch users");

          const data = await response.json();
          
          const filteredUsers = data.users.filter((user: User) => user.role !== "super_admin");
          
          set({ apiUsers: filteredUsers });
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