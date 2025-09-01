import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  name: string;
  role: "individual" | "business" | "super_admin";
  is_active: boolean;
  profile_image: string | null;
  bio?: string;
  profile: {
    api_requests_made: number;
    total_requests_limit: number;
  };
  business_profile: {
    company_name: string;
    industry?: string;
    company_size?: string;
    website?: string;
    company_address?: string;
    phone_number?: string;
    contact_person?: string;
    annual_revenue?: string;
    company_registration_number?: string;
  } | null;
  subscription: {
    plan_name: string;
    status: string;
  } | null;
}

interface FilterParams {
  search?: string;
  role?: string;
  is_active?: string;
  payment_type?: string;
  payment_status?: string;
}

interface UpdateUserData {
  name?: string;
  bio?: string;
  business_profile?: {
    company_name?: string;
    industry?: string;
    company_size?: string;
    website?: string;
    company_address?: string;
    phone_number?: string;
    contact_person?: string;
    annual_revenue?: string;
    company_registration_number?: string;
  };
}

interface UsersState {
  apiUsers: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (
    accessToken: string,
    filters?: FilterParams,
    page?: number,
    limit?: number
  ) => Promise<void>;
  createUser: (
    accessToken: string,
    userData: {
      email: string;
      name: string;
      role: "individual" | "business";
      password: string;
    }
  ) => Promise<void>;
  updateUser: (
    accessToken: string,
    userId: number,
    userData: UpdateUserData
  ) => Promise<void>;
  updateUserStatus: (
    accessToken: string,
    userId: number,
    isActive: boolean
  ) => Promise<void>;
  totalCount: number;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      apiUsers: [],
      loading: false,
      error: null,
      totalCount: 0,

      fetchUsers: async (
        accessToken: string,
        filters?: FilterParams,
        page = 1,
        limit = 10
      ) => {
        set({ loading: true, error: null });
        try {
          const url = new URL(
            `${import.meta.env.VITE_API_URL}/api/users/users`
          );

          // parameters
          url.searchParams.append("page", page.toString());
          url.searchParams.append("limit", limit.toString());

          // Add filter parameters
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              if (value && value.trim() !== "") {
                url.searchParams.append(key, value);
              }
            });
          }

          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch users");

          const data = await response.json();

          // Filter out super_admin users
          const filteredUsers = data.users.filter(
            (user: User) => user.role !== "super_admin"
          );

          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;

          set({
            apiUsers: filteredUsers.slice(startIndex, endIndex),
            totalCount: filteredUsers.length,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch users",
          });
        } finally {
          set({ loading: false });
        }
      },
      createUser: async (accessToken, userData) => {
        set({ loading: true, error: null });
        try {
          const url = new URL(
            `${import.meta.env.VITE_API_URL}/api/users/register/`
          );
          const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || errorData.detail || "Failed to create user"
            );
          }

          await get().fetchUsers(accessToken);
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create user",
          });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      updateUser: async (
        accessToken: string,
        userId: number,
        userData: UpdateUserData
      ) => {
        set({ loading: true, error: null });
        try {
          const url = new URL(
            `${import.meta.env.VITE_API_URL}/api/users/profile/${userId}/`
          );
          const response = await fetch(url.toString(), {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || errorData.detail || "Failed to update user"
            );
          }

          // Refresh users list after successful update
          await get().fetchUsers(accessToken);
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update user",
          });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      updateUserStatus: async (
        accessToken: string,
        userId: number,
        isActive: boolean
      ) => {
        set({ loading: true, error: null });
        try {
          const url = new URL(
            `${
              import.meta.env.VITE_API_URL
            }/api/users/admin/users/${userId}/status/`
          );
          const response = await fetch(url.toString(), {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ is_active: isActive }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                errorData.detail ||
                "Failed to update user status"
            );
          }

          // Refresh users list after successful status update
          await get().fetchUsers(accessToken);
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update user status",
          });
          throw error;
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