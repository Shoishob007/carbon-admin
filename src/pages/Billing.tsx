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
  Plus,
  Edit,
  Trash2,
  FileText,
  Users,
  Receipt,
  CheckCircle,
  XCircle,
  Calendar,
  Download,
  DollarSign,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBillingStore } from "@/store/billingStore";
import { useAuthStore } from "@/store/auth";

// Demo Data for invoices (keeping as is)
const initialInvoices = [
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
  } = useBillingStore();
  console.log("Selected Payment :: ", selectedPayment);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [invoices] = useState(initialInvoices);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Fetch payments on component mount
  useEffect(() => {
    if (accessToken) {
      fetchPayments(accessToken);
    }
  }, [accessToken, fetchPayments]);

  // Statistics
  const totalCustomers = payments.length;
  const activeCustomers = payments.filter(
    (p) => p.subscription_details.status === "active"
  ).length;
  const totalRevenue = payments
    .filter((p) => p.payment_status === "completed")
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const handleViewPaymentDetails = async (id) => {
    if (accessToken) {
      await fetchPaymentById(id, accessToken);
      setIsPaymentDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsPaymentDialogOpen(false);
    clearSelectedPayment();
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
            Billing & Invoices
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer billing information and review invoices
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total completed payments
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

      {/* Customer Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Payments</CardTitle>
          <CardDescription>
            View and manage customer payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    <div>{payment.user_name || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.user_email || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.subscription_details?.plan_name || "N/A"}
                    <div className="text-sm text-muted-foreground">
                      {payment.subscription_details?.payment_frequency || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.subscription_details?.status === "active"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        payment.subscription_details?.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    >
                      {payment.subscription_details?.status
                        ? payment.subscription_details.status
                            .charAt(0)
                            .toUpperCase() +
                          payment.subscription_details.status.slice(1)
                        : "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>${payment.amount || "0.00"}</TableCell>
                  <TableCell>
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
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
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No payment records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about this payment record
            </DialogDescription>
          </DialogHeader>

          {selectedPayment ? (
            <div className="grid gap-4 py-4">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Customer Name</Label>
                  <p className="text-sm mt-1 font-medium">{selectedPayment.user_name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Customer Email</Label>
                  <p className="text-sm mt-1 font-medium">{selectedPayment.user_email || "N/A"}</p>
                </div>
              </div>

              {/* Payment Details */}
              {selectedPayment.payments && selectedPayment.payments.length > 0 ? (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-3">Payment Information</h4>
                    
                    {selectedPayment.payments.map((payment, index) => (
                      <div key={payment.id} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Subscription Plan</Label>
                            <p className="text-sm mt-1 font-medium">
                              {payment.subscription_details?.plan_name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.subscription_details?.payment_frequency || "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Subscription Status</Label>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  payment.subscription_details?.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  payment.subscription_details?.status === "active"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                                }
                              >
                                {payment.subscription_details?.status
                                  ? payment.subscription_details.status
                                      .charAt(0)
                                      .toUpperCase() +
                                    payment.subscription_details.status.slice(1)
                                  : "N/A"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Amount</Label>
                            <p className="text-sm mt-1 font-bold text-green-600">
                              ${parseFloat(payment.amount || "0").toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Payment Status</Label>
                            <div className="mt-1">
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
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Payment Date</Label>
                            <p className="text-sm mt-1 font-medium">
                              {payment.payment_date
                                ? new Date(payment.payment_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Transaction ID</Label>
                            <p className="text-sm mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                              {payment.transaction_id || "N/A"}
                            </p>
                          </div>
                        </div>

                        {payment.payment_method && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
                              <p className="text-sm mt-1 font-medium">
                                {payment.payment_method}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">User ID</Label>
                              <p className="text-sm mt-1 font-medium">
                                {payment.user}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Information */}
                  <div className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Total Payments</Label>
                        <p className="text-sm mt-1 font-bold">
                          {selectedPayment.total_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No payment details available for this user</p>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={handleCloseDialog}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoices Table (keeping as is) */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            View and manage invoices for all customers
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
              {invoices.map((inv) => (
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
        </CardContent>
        </Card>
    </div>
  );
}