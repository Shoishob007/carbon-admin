import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Users,
  Receipt,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  DollarSign,
  Loader2,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBillingStore } from "@/store/billingStore";
import { useAuthStore } from "@/store/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/Pagination";
import PaymentDetailsDialog from "@/components/PaymentDetailsDialogue";

interface SubscriptionDetails {
  plan_name?: string;
  payment_frequency?: string;
  status?: string;
}

interface Payment {
  id: number;
  user: number;
  user_name?: string;
  user_email?: string;
  amount: string;
  payment_date?: string;
  payment_status: string;
  transaction_id?: string;
  payment_method?: string;
  subscription_details?: SubscriptionDetails;
}

interface Invoice {
  id: number;
  customer: string;
  date: string;
  due: string;
  amount: number;
  status: "paid" | "due" | "overdue";
  invoiceNumber: string;
  url: string;
}

// Demo Data for invoices
const initialInvoices: Invoice[] = [
  {
    id: 101,
    customer: "EcoTech Solutions",
    date: "2025-07-15",
    due: "2025-08-15",
    amount: 89,
    status: "paid",
    invoiceNumber: "INV-2025-0715-01",
    url: "#",
  },
  {
    id: 102,
    customer: "Green Manufacturing Co",
    date: "2025-07-12",
    due: "2025-08-12",
    amount: 299,
    status: "due",
    invoiceNumber: "INV-2025-0712-01",
    url: "#",
  },
  {
    id: 103,
    customer: "Sustainable Logistics Ltd",
    date: "2025-06-20",
    due: "2025-07-20",
    amount: 29,
    status: "overdue",
    invoiceNumber: "INV-2025-0620-01",
    url: "#",
  },
  {
    id: 104,
    customer: "Renewable Energy Inc",
    date: "2025-08-01",
    due: "2025-09-01",
    amount: 150,
    status: "paid",
    invoiceNumber: "INV-2025-0801-01",
    url: "#",
  },
  {
    id: 105,
    customer: "Clean Water Systems",
    date: "2025-07-25",
    due: "2025-08-25",
    amount: 75,
    status: "due",
    invoiceNumber: "INV-2025-0725-01",
    url: "#",
  },
  {
    id: 106,
    customer: "Solar Power Co",
    date: "2025-06-15",
    due: "2025-07-15",
    amount: 200,
    status: "overdue",
    invoiceNumber: "INV-2025-0615-01",
    url: "#",
  },
  {
    id: 107,
    customer: "Wind Energy Ltd",
    date: "2025-08-05",
    due: "2025-09-05",
    amount: 180,
    status: "paid",
    invoiceNumber: "INV-2025-0805-01",
    url: "#",
  },
  {
    id: 108,
    customer: "Eco Packaging",
    date: "2025-07-18",
    due: "2025-08-18",
    amount: 95,
    status: "due",
    invoiceNumber: "INV-2025-0718-01",
    url: "#",
  },
  {
    id: 109,
    customer: "Green Construction",
    date: "2025-06-30",
    due: "2025-07-30",
    amount: 350,
    status: "overdue",
    invoiceNumber: "INV-2025-0630-01",
    url: "#",
  },
  {
    id: 110,
    customer: "Organic Farms",
    date: "2025-08-10",
    due: "2025-09-10",
    amount: 120,
    status: "paid",
    invoiceNumber: "INV-2025-0810-01",
    url: "#",
  },
];

export default function Billing() {
  const {
    payments,
    loading,
    error,
    selectedPayment,
    fetchPayments,
    fetchPaymentById,
    clearSelectedPayment,
    updatePaymentStatus,
  } = useBillingStore();
  const { accessToken } = useAuthStore();
  const role = useAuthStore((state) => state.user?.role);
  const [invoices] = useState(initialInvoices);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    user: "",
    amount: "",
    transaction_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // pagination for payments
  const {
    currentPage: paymentsCurrentPage,
    itemsPerPage: paymentsItemsPerPage,
    paginate: paginatePayments,
    goToPage: goToPaymentsPage,
    handleItemsPerPageChange: handlePaymentsItemsPerPageChange,
    getPageNumbers: getPaymentsPageNumbers,
  } = usePagination<Payment>(10)

  // for invoices
  const {
    currentPage: invoicesCurrentPage,
    itemsPerPage: invoicesItemsPerPage,
    paginate: paginateInvoices,
    goToPage: goToInvoicesPage,
    handleItemsPerPageChange: handleInvoicesItemsPerPageChange,
    getPageNumbers: getInvoicesPageNumbers,
  } =  usePagination<Invoice>(5);

  // Get paginated payments
  const {
    paginatedItems: paginatedPayments,
    totalItems: totalPaymentsCount,
    totalPages: totalPaymentsPages,
    startIndex: paymentsStartIndex,
    endIndex: paymentsEndIndex,
  } = paginatePayments(payments);

  // Get paginated invoices
  const {
    paginatedItems: paginatedInvoices,
    totalItems: totalInvoicesCount,
    totalPages: totalInvoicesPages,
    startIndex: invoicesStartIndex,
    endIndex: invoicesEndIndex,
  } = paginateInvoices(invoices);

  // Fetch payments on component mount
  useEffect(() => {
    if (accessToken && role) {
      fetchPayments(accessToken, role);
    }
  }, [accessToken, role, fetchPayments]);

  const pendingPayments = payments.filter(
    (p) => p.payment_status === "pending"
  ).length;

  const totalRevenue = payments
    .filter((p) => p.payment_status === "completed")
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const handleStatusChange = async (paymentId: number, newStatus: string) => {
    try {
      if (role === "super_admin" && accessToken) {
        await updatePaymentStatus(paymentId, newStatus, accessToken);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleViewPaymentDetails = async (id: number) => {
    if (accessToken && role) {
      await fetchPaymentById(id, accessToken, role);
      setIsPaymentDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsPaymentDialogOpen(false);
    clearSelectedPayment();
  };

  const handleAddPayment = async () => {
    if (!accessToken || role !== "super_admin") return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subscription/admin/payments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: parseInt(newPayment.user),
            amount: parseFloat(newPayment.amount),
            transaction_id: newPayment.transaction_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add payment");
      }

      // Refresh payments
      await fetchPayments(accessToken, role);
      setIsAddPaymentDialogOpen(false);
      setNewPayment({
        user: "",
        amount: "",
        transaction_id: "",
      });
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {role === "business" ? "My Billing" : "Billing & Invoices"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {role === "business"
              ? "View your payment history and invoices"
              : "Manage customer billing information and review invoices"}
          </p>
        </div>
        {role === "super_admin" && (
          <Dialog
            open={isAddPaymentDialogOpen}
            onOpenChange={setIsAddPaymentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-carbon-gradient hover:bg-carbon-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background border">
              <DialogHeader className="text-center">
                <DialogTitle>Add New Payment</DialogTitle>
                <DialogDescription>
                  Create a new payment record for a customer
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
                <div className="space-y-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input
                    id="user-id"
                    type="number"
                    value={newPayment.user}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, user: e.target.value })
                    }
                    placeholder="Enter user ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: e.target.value })
                    }
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Transaction ID</Label>
                  <Input
                    id="transaction-id"
                    value={newPayment.transaction_id}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        transaction_id: e.target.value,
                      })
                    }
                    placeholder="Enter transaction ID"
                  />
                </div>
              </div>
              <div className="flex justify-center px-4 pb-4">
                <Button
                  onClick={handleAddPayment}
                  className="bg-carbon-gradient w-full"
                  disabled={
                    isSubmitting ||
                    !newPayment.user ||
                    !newPayment.amount ||
                    !newPayment.transaction_id
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Payment"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {role === "super_admin" ? (
              <CardTitle className="text-sm font-medium">
                Total Payments
              </CardTitle>
            ) : (
              <CardTitle className="text-sm font-medium">My Payments</CardTitle>
            )}
            <Receipt className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {payments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === "super_admin" ? "Paid Revenue" : "Total Paid"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {role === "super_admin"
                ? "Total completed payments"
                : "My payments"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {invoices.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((i) => i.status === "due").length} due,{" "}
              {invoices.filter((i) => i.status === "overdue").length} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {role === "business" ? "My Payments" : "Customer Payments"}
          </CardTitle>
          <CardDescription>
            {role === "business"
              ? "View your payment history"
              : "View and manage customer payment records"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {role !== "business" && <TableHead>Customer</TableHead>}
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  {role !== "business" && (
                    <TableCell className="font-medium">
                      <div>{payment.user_name || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.user_email || "N/A"}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    {payment.subscription_details?.plan_name || "N/A"}
                    <div className="text-sm text-muted-foreground">
                      {payment.subscription_details?.payment_frequency || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>${payment.amount || "0.00"}</TableCell>
                  <TableCell>
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {role === "super_admin" ? (
                      <Select
                        value={payment.payment_status}
                        onValueChange={(value) =>
                          handleStatusChange(payment.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={
                          payment.payment_status === "completed"
                            ? "default"
                            : payment.payment_status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          payment.payment_status === "completed"
                            ? "bg-green-500"
                            : payment.payment_status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {payment.payment_status
                          ? payment.payment_status.charAt(0).toUpperCase() +
                            payment.payment_status.slice(1)
                          : "N/A"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPaymentDetails(payment.user)}
                    >
                      <FileText className="h-4 w-4" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={role === "business" ? 6 : 7}
                    className="text-center text-muted-foreground"
                  >
                    No payment records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Payments Pagination */}
          {payments.length > 0 && (
            <Pagination
              currentPage={paymentsCurrentPage}
              totalPages={totalPaymentsPages}
              onPageChange={goToPaymentsPage}
              onItemsPerPageChange={handlePaymentsItemsPerPageChange}
              itemsPerPage={paymentsItemsPerPage}
              totalItems={totalPaymentsCount}
              startIndex={paymentsStartIndex}
              endIndex={paymentsEndIndex}
              showItemsPerPage={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Payment Details Dialog Component */}
      <PaymentDetailsDialog
        isOpen={isPaymentDialogOpen}
        onClose={handleCloseDialog}
        selectedPayment={selectedPayment}
        loading={loading}
        role={role}
      />

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            {role === "business"
              ? "View your invoices"
              : "View and manage invoices for all customers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.due}</TableCell>
                  <TableCell>${inv.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === "paid"
                          ? "default"
                          : inv.status === "due"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        inv.status === "paid"
                          ? "bg-green-500"
                          : inv.status === "due"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {inv.status === "paid" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      ) : inv.status === "due" ? (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" /> Due
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Overdue
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      disabled={inv.url === "#"}
                    >
                      <a href={inv.url} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Invoices Pagination */}
          {invoices.length > 0 && (
            <Pagination
              currentPage={invoicesCurrentPage}
              totalPages={totalInvoicesPages}
              onPageChange={goToInvoicesPage}
              onItemsPerPageChange={handleInvoicesItemsPerPageChange}
              itemsPerPage={invoicesItemsPerPage}
              totalItems={totalInvoicesCount}
              startIndex={invoicesStartIndex}
              endIndex={invoicesEndIndex}
              showItemsPerPage={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}