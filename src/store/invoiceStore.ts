/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Invoice, InvoicePayment } from "@/types/billing";

interface InvoiceStore {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  fetchInvoices: (accessToken: string, role: string) => Promise<void>;
  fetchInvoiceById: (invoiceId: number, accessToken: string) => Promise<void>;
  clearSelectedInvoice: () => void;
  updateInvoicePayment: (
    invoiceId: number,
    amount: string,
    transactionId: string,
    notes: string,
      payment_file: string,

    accessToken: string
  ) => Promise<void>;
  updateInvoiceInfo: (
    invoiceId: number,
    invoiceData: {
      total_amount: string;
      due_date: string;
      description: string;
      message: string;
      status: string;
    },
    accessToken: string
  ) => Promise<void>;
  createInvoice: (
    invoiceData: {
      user: number;
      subscription: number;
      total_amount: string;
      due_date: string;
      description: string;
      message: string;
      status: string;
    },
    accessToken: string
  ) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,

  fetchInvoices: async (accessToken, role) => {
    try {
      set({ loading: true, error: null });
      const endpoint =
        role === "business"
          ? `${import.meta.env.VITE_API_URL}/api/subscription/my-invoices/`
          : `${import.meta.env.VITE_API_URL}/api/subscription/admin/invoices/`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Try to parse error details from response
        let errorMessage = "Failed to fetch invoices";
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          // ignore parsing errors
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      set({ invoices: data.invoices, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch invoices",
        loading: false,
      });
    }
  },

  fetchInvoiceById: async (invoiceId, accessToken) => {
    try {
      set({ loading: true, error: null });
      const endpoint = `${
        import.meta.env.VITE_API_URL
      }/api/subscription/invoices/${invoiceId}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response invoice :: ", response);

      if (!response.ok) {
        let errorMessage = "Failed to fetch invoice details";
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          // ignore parsing errors
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      set({ selectedInvoice: data.invoice, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch invoice details",
        loading: false,
      });
    }
  },

  clearSelectedInvoice: () => set({ selectedInvoice: null }),

updateInvoicePayment: async (
  invoiceId: string | number,
  amount: string | number,
  transactionId: string,
  notes: string,
  payment_file: string,
  accessToken: string
) => {
  try {
    set({ loading: true, error: null });

    const paymentAmount =
      typeof amount === "number" ? amount.toFixed(2) : amount;

    const payload = {
      payment: {
        amount: paymentAmount,
        transaction_id: transactionId,
        notes,
        payment_file,
      },
    };

    console.log("📤 Sending PATCH request with:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/subscription/admin/invoices/${invoiceId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Failed to add invoice payment";
      try {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // ignore parse errors
      }
      throw new Error(errorMessage);
    }

    await useInvoiceStore.getState().fetchInvoices(accessToken, "super_admin");
    set({ loading: false });
  } catch (error: any) {
    set({
      error: error.message || "Failed to add invoice payment",
      loading: false,
    });
    throw error;
  }
},


  updateInvoiceInfo: async (
    invoiceId: number,
    invoiceData: {
      total_amount: string;
      due_date: string;
      description: string;
      message: string;
      status: string;
    },
    accessToken: string
  ) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/subscription/admin/invoices/${invoiceId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(invoiceData),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to update invoice";
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          // ignoring parse errors
        }
        throw new Error(errorMessage);
      }

      // Refresh invoices list
      await useInvoiceStore
        .getState()
        .fetchInvoices(accessToken, "super_admin");
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to update invoice",
        loading: false,
      });
      throw error;
    }
  },

  createInvoice: async (
    invoiceData: {
      user: number;
      subscription: number;
      total_amount: string;
      due_date: string;
      description: string;
      message: string;
      status: string;
    },
    accessToken: string
  ) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/subscription/admin/invoices/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(invoiceData),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to create invoice";
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          // ignoring parse errors
        }
        throw new Error(errorMessage);
      }

      await useInvoiceStore
        .getState()
        .fetchInvoices(accessToken, "super_admin");
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to create invoice",
        loading: false,
      });
      throw error;
    }
  },
}));
