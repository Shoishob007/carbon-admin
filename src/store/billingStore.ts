/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SubscriptionDetails {
  id: number;
  plan_name: string;
  payment_frequency: string;
  status: string;
}

interface Payment {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  subscription: number;
  subscription_details: SubscriptionDetails;
  amount: string;
  payment_date: string;
  payment_status: string;
  payment_method: string | null;
  payment_method_details: any | null;
  transaction_id: string;
}

interface PaymentDetailsResponse {
  user_email: string;
  user_name: string;
  payments: Payment[];
  total_count: number;
  filter_applied: {
    status: string;
  };
}

interface BillingState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  selectedPayment: PaymentDetailsResponse | null;
  fetchPayments: (accessToken: string, role: string) => Promise<void>;
  fetchPaymentById: (id: number, accessToken: string, role: string) => Promise<void>;
  updatePaymentStatus: (
    paymentId: number,
    status: string,
    accessToken: string
  ) => Promise<void>;
  clearSelectedPayment: () => void;
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      payments: [],
      loading: false,
      error: null,
      selectedPayment: null,

      fetchPayments: async (accessToken: string, role: string) => {
        set({ loading: true, error: null });
        try {
          let url;
          if (role === "business") {
            url = `${import.meta.env.VITE_API_URL}/api/subscription/my-payments/`;
          } else {
            url = `${import.meta.env.VITE_API_URL}/api/subscription/admin/payments/`;
          }

          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch payments");
          }

          const data = await response.json();
          set({ payments: data.payments || [] });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch payments",
          });
        } finally {
          set({ loading: false });
        }
      },

      fetchPaymentById: async (id: number, accessToken: string, role: string) => {
        set({ loading: true, error: null });
        try {
          let url;
          if (role === "business") {
            url = `${import.meta.env.VITE_API_URL}/api/subscription/my-payments/`;
          } else {
            url = `${import.meta.env.VITE_API_URL}/api/subscription/admin/users/${id}/payments/`;
          }

          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch payment details");
          }

          const data = await response.json();
          set({ selectedPayment: data });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch payment details",
          });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updatePaymentStatus: async (paymentId, status, accessToken) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/subscription/admin/payments/${paymentId}/status/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ payment_status: status }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update payment status");
          }

          // Refresh payments after update
          const { fetchPayments } = useBillingStore.getState();
          await fetchPayments(accessToken, "admin");
        } catch (error) {
          console.error("Error updating payment status:", error);
          throw error;
        }
      },

      clearSelectedPayment: () => {
        set({ selectedPayment: null });
      },
    }),
    {
      name: "billing-storage",
    }
  )
);