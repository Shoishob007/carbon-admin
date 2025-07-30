import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  email: string;
  name: string;
  role: string;
  id: number;
  profile_image: string | null;
  [key: string]: unknown;
}

interface RegisterData {
  email: string;
  name: string;
  role: "individual" | "business" | string;
  password: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  profile_update : boolean,
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      profile_update: false,
      login: async (email: string, password: string) => {
        try {
          const resp = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/login/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          if (!resp.ok) throw new Error("Invalid credentials");

          const data = await resp.json();
          //   console.log("User i got i response: ", data)

          set({
            user: {
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              profile_update : data.user.profile_update,
              id:
                data.user.id ?? data.user.user_id ?? data.user.profile?.id ?? 0,
              profile_image: data.user.profile_image,
              ...data.user,
            },
            accessToken: data.token.access,
            refreshToken: data.token.refresh,
            isAuthenticated: true,
          });
        } catch (err) {
          set({
            user: null,
            profile_update: false,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw err;
        }
      },
      register: async (userData: RegisterData) => {
        try {
          const resp = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/register/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            }
          );

          if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({}));
            throw new Error(errorData.message || "Registration failed");
          }

          const data = await resp.json();
          console.log("Registration Response Data:", data);

          //   if (data.user && data.token?.access && data.token?.refresh) {
          //     set({
          //       user: {
          //         email: data.user.email,
          //         name: data.user.name,
          //         role: data.user.role,
          //         id: data.user.id ?? data.user.user_id ?? data.user.profile?.id ?? 0,
          //         profile_image: data.user.profile_image,
          //         ...data.user,
          //       },
          //       accessToken: data.token.access,
          //       refreshToken: data.token.refresh,
          //       isAuthenticated: true,
          //     });
          //     return;
          //   }
          return;
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Registration failed. Please try again.";

          throw new Error(errorMessage);
        }
      },
      logout: async () => {
        const accessToken = get().accessToken;
        try {
          if (accessToken) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout/`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Logout failed. Please try again.";
          throw new Error(errorMessage);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
