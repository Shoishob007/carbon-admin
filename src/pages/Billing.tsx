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
import {
  FileText,
  Receipt,
  CheckCircle,
  XCircle,
  DollarSign,
  Loader2,
  Plus,
  CreditCard,
  Edit,
} from "lucide-react";
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
import { useInvoiceStore } from "@/store/invoiceStore";
import InvoiceDetailsDialog from "@/components/InvoiceDetailsDialogue";
import { Invoice } from "@/types/billing";
import AddPaymentDialog from "@/components/AddPaymentDialogue";
import AddInvoicePaymentDialog from "@/components/AddInvoicePaymentDialogue";
import UpdateInvoiceDialog from "@/components/UpdateInvoiceDialogue";
import CreateInvoiceDialog from "@/components/CreateInvoiceDialogue";

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

export default function Billing() {
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    selectedPayment,
    fetchPayments,
    fetchPaymentById,
    clearSelectedPayment,
    updatePaymentStatus,
    addPayment,
  } = useBillingStore();

  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
    selectedInvoice,
    fetchInvoices,
    fetchInvoiceById,
    clearSelectedInvoice,
    updateInvoicePayment,
    updateInvoiceInfo,
    createInvoice,
  } = useInvoiceStore();

  const { accessToken } = useAuthStore();
  const role = useAuthStore((state) => state.user?.role);

  // Dialog states
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isAddInvoicePaymentDialogOpen, setIsAddInvoicePaymentDialogOpen] =
    useState(false);
  const [isUpdateInvoiceDialogOpen, setIsUpdateInvoiceDialogOpen] =
    useState(false);
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState(false);

  // Current states
  const [currentInvoiceId, setCurrentInvoiceId] = useState<number | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // pagination for payments
  const {
    currentPage: paymentsCurrentPage,
    itemsPerPage: paymentsItemsPerPage,
    paginate: paginatePayments,
    goToPage: goToPaymentsPage,
    handleItemsPerPageChange: handlePaymentsItemsPerPageChange,
  } = usePagination<Payment>(5);

  // for invoices
  const {
    currentPage: invoicesCurrentPage,
    itemsPerPage: invoicesItemsPerPage,
    paginate: paginateInvoices,
    goToPage: goToInvoicesPage,
    handleItemsPerPageChange: handleInvoicesItemsPerPageChange,
  } = usePagination<Invoice>(5);

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
      fetchInvoices(accessToken, role);
    }
  }, [accessToken, role, fetchPayments, fetchInvoices]);

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

  const handleViewInvoiceDetails = async (invoiceId: number) => {
    if (accessToken) {
      console.log("invoiceId :: ", invoiceId);
      await fetchInvoiceById(invoiceId, accessToken);
      setIsInvoiceDialogOpen(true);
    }
  };

  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    clearSelectedPayment();
  };

  const handleCloseInvoiceDialog = () => {
    setIsInvoiceDialogOpen(false);
    clearSelectedInvoice();
  };

  // Payment handlers
  const handleAddPayment = async (payment: {
    user: string;
    amount: string;
    transaction_id: string;
  }) => {
    if (!accessToken) return;

    setIsSubmitting(true);
    try {
      await addPayment(
        payment.user,
        payment.amount,
        payment.transaction_id,
        accessToken,
        role
      );
      setIsAddPaymentDialogOpen(false);
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Invoice payment handlers
  const handleAddInvoicePayment = async (payment: {
    amount: string;
    transaction_id: string;
    notes: string;
  }) => {
    if (!accessToken || role !== "super_admin" || !currentInvoiceId) return;

    setIsSubmitting(true);
    try {
      await updateInvoicePayment(
        currentInvoiceId,
        payment.amount,
        payment.transaction_id,
        payment.notes,
        accessToken
      );
      setIsAddInvoicePaymentDialogOpen(false);
      setCurrentInvoiceId(null);
    } catch (error) {
      console.error("Error adding invoice payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddInvoicePayment = (invoice: Invoice) => {
    setCurrentInvoiceId(invoice.id);
    setIsAddInvoicePaymentDialogOpen(true);
  };

  // Update invoice handlers
  const handleUpdateInvoice = async (invoiceData: {
    total_amount: string;
    due_date: string;
    description: string;
    message: string;
    status: string;
  }) => {
    if (!accessToken || role !== "super_admin" || !currentInvoiceId) return;

    setIsSubmitting(true);
    try {
      await updateInvoiceInfo(currentInvoiceId, invoiceData, accessToken);
      setIsUpdateInvoiceDialogOpen(false);
      setCurrentInvoiceId(null);
      setCurrentInvoice(null);
    } catch (error) {
      console.error("Error updating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenUpdateInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setCurrentInvoiceId(invoice.id);
    setIsUpdateInvoiceDialogOpen(true);
  };

  // Create invoice handlers
  const handleCreateInvoice = async (invoiceData: {
    user: number;
    subscription: number;
    total_amount: string;
    due_date: string;
    description: string;
    message: string;
    status: string;
  }) => {
    if (!accessToken || role !== "super_admin") return;

    setIsSubmitting(true);
    try {
      await createInvoice(invoiceData, accessToken);
      setIsCreateInvoiceDialogOpen(false);
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    (paymentsLoading || invoicesLoading) &&
    (payments.length === 0 || invoices.length === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (paymentsError || invoicesError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {paymentsError || invoicesError}
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
        <div className="flex gap-2">
          {role === "super_admin" && (
            <>
              <Button
                onClick={() => setIsAddPaymentDialogOpen(true)}
                className="bg-carbon-gradient hover:bg-carbon-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Payment
              </Button>
              <Button
                onClick={() => setIsCreateInvoiceDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </>
          )}
        </div>
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
                <TableHead>Plan</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>
                    <div>{invoice.user_email}</div>
                    <div className="text-sm text-muted-foreground">
                      User ID: {invoice.user}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.subscription_plan}</TableCell>
                  <TableCell>${invoice.total_amount}</TableCell>
                  <TableCell>
                    ${invoice.paid_amount} (
                    {invoice.payment_percentage.toFixed(0)}%)
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.is_fully_paid
                          ? "default"
                          : invoice.status === "partial"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        invoice.is_fully_paid
                          ? "bg-green-500"
                          : invoice.status === "partial"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {invoice.is_fully_paid ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      ) : invoice.status === "partial" ? (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" /> Partial
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Unpaid
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewInvoiceDetails(invoice.id)}
                    >
                      <FileText className="h-4 w-4" />
                      Details
                    </Button>
                    {role === "super_admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenUpdateInvoice(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                        Update
                      </Button>
                    )}
                    {!invoice.is_fully_paid && role === "super_admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenAddInvoicePayment(invoice)}
                      >
                        <CreditCard className="h-4 w-4" />
                        Add Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
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

      {/* All Dialog Components */}
      <PaymentDetailsDialog
        isOpen={isPaymentDialogOpen}
        onClose={handleClosePaymentDialog}
        selectedPayment={selectedPayment}
        loading={paymentsLoading}
        role={role}
      />

      <InvoiceDetailsDialog
        isOpen={isInvoiceDialogOpen}
        onClose={handleCloseInvoiceDialog}
        selectedInvoice={selectedInvoice}
        loading={invoicesLoading}
        role={role}
      />

      <AddPaymentDialog
        isOpen={isAddPaymentDialogOpen}
        onClose={() => setIsAddPaymentDialogOpen(false)}
        onAddPayment={handleAddPayment}
        isSubmitting={isSubmitting}
      />

      <AddInvoicePaymentDialog
        isOpen={isAddInvoicePaymentDialogOpen}
        onClose={() => {
          setIsAddInvoicePaymentDialogOpen(false);
          setCurrentInvoiceId(null);
        }}
        onAddPayment={handleAddInvoicePayment}
        isSubmitting={isSubmitting}
        invoiceNumber={
          invoices.find((inv) => inv.id === currentInvoiceId)?.invoice_number
        }
      />

      <UpdateInvoiceDialog
        isOpen={isUpdateInvoiceDialogOpen}
        onClose={() => {
          setIsUpdateInvoiceDialogOpen(false);
          setCurrentInvoiceId(null);
          setCurrentInvoice(null);
        }}
        onUpdateInvoice={handleUpdateInvoice}
        isSubmitting={isSubmitting}
        invoice={currentInvoice}
      />

      <CreateInvoiceDialog
        isOpen={isCreateInvoiceDialogOpen}
        onClose={() => setIsCreateInvoiceDialogOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
