import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Demo Data
const initialBillings = [
  {
    id: 1,
    customer: "EcoTech Solutions",
    plan: "Professional Carbon",
    status: "active",
    method: "Credit Card",
    nextInvoice: "2025-08-15",
    amount: 89,
  },
  {
    id: 2,
    customer: "Green Manufacturing Co",
    plan: "Enterprise Sustainability",
    status: "active",
    method: "Wire Transfer",
    nextInvoice: "2025-08-12",
    amount: 299,
  },
  {
    id: 3,
    customer: "Sustainable Logistics Ltd",
    plan: "Starter Green",
    status: "inactive",
    method: "Credit Card",
    nextInvoice: "-",
    amount: 0,
  },
];

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
  const [billings, setBillings] = useState(initialBillings);
  const [invoices, setInvoices] = useState(initialInvoices);

  const [newBilling, setNewBilling] = useState({
    customer: "",
    plan: "",
    status: "active",
    method: "Credit Card",
    amount: 0,
    nextInvoice: "",
  });

  const [editBillingId, setEditBillingId] = useState<number | null>(null);
  const [editBilling, setEditBilling] = useState({
    customer: "",
    plan: "",
    status: "active",
    method: "Credit Card",
    amount: 0,
    nextInvoice: "",
  });

  // Statistics
  const totalCustomers = billings.length;
  const activeCustomers = billings.filter((b) => b.status === "active").length;
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.status === "paid" ? inv.amount : 0),
    0
  );

  // CRUD Logic for Customer Billing
  const handleCreateBilling = () => {
    if (!newBilling.customer.trim() || !newBilling.plan.trim()) return;
    setBillings([
      ...billings,
      {
        ...newBilling,
        id: Math.max(0, ...billings.map((b) => b.id)) + 1,
      },
    ]);
    setNewBilling({
      customer: "",
      plan: "",
      status: "active",
      method: "Credit Card",
      amount: 0,
      nextInvoice: "",
    });
  };

  const openEditBilling = (billing: typeof billings[0]) => {
    setEditBillingId(billing.id);
    setEditBilling({
      customer: billing.customer,
      plan: billing.plan,
      status: billing.status,
      method: billing.method,
      amount: billing.amount,
      nextInvoice: billing.nextInvoice,
    });
  };

  const handleSaveEditBilling = () => {
    if (editBillingId === null) return;
    setBillings((prev) =>
      prev.map((billing) =>
        billing.id === editBillingId
          ? {
              ...billing,
              ...editBilling,
            }
          : billing
      )
    );
    setEditBillingId(null);
  };

  const handleDeleteBilling = (id: number) => {
    setBillings(billings.filter((billing) => billing.id !== id));
  };

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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-carbon-gradient hover:bg-carbon-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Billing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-background border">
            <DialogHeader className="text-center">
              <DialogTitle>Add Customer Billing</DialogTitle>
              <DialogDescription>
                Add a new billing setup for a customer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
              <div className="space-y-2">
                <Label htmlFor="billing-customer">Customer Name</Label>
                <Input
                  id="billing-customer"
                  value={newBilling.customer}
                  onChange={(e) =>
                    setNewBilling({ ...newBilling, customer: e.target.value })
                  }
                  placeholder="e.g., EcoTech Solutions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-plan">Plan</Label>
                <Input
                  id="billing-plan"
                  value={newBilling.plan}
                  onChange={(e) =>
                    setNewBilling({ ...newBilling, plan: e.target.value })
                  }
                  placeholder="Subscription Plan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-amount">Monthly Amount ($)</Label>
                <Input
                  id="billing-amount"
                  type="number"
                  value={newBilling.amount}
                  onChange={(e) =>
                    setNewBilling({
                      ...newBilling,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="89"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-next">Next Invoice Date</Label>
                <Input
                  id="billing-next"
                  type="date"
                  value={newBilling.nextInvoice}
                  onChange={(e) =>
                    setNewBilling({ ...newBilling, nextInvoice: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-method">Payment Method</Label>
                <Select
                  value={newBilling.method}
                  onValueChange={(value) =>
                    setNewBilling({ ...newBilling, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border">
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-status">Status</Label>
                <Select
                  value={newBilling.status}
                  onValueChange={(value) =>
                    setNewBilling({ ...newBilling, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center px-4 pb-4">
              <Button
                onClick={handleCreateBilling}
                className="bg-carbon-gradient w-full"
              >
                Add Billing
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <CardTitle className="text-sm font-medium">Paid Revenue (This Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue from paid invoices
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

      {/* Customer Billings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Billings</CardTitle>
          <CardDescription>
            Manage customer billing information and payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Invoice</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billings.map((billing) => (
                <TableRow key={billing.id}>
                  <TableCell className="font-medium">{billing.customer}</TableCell>
                  <TableCell>{billing.plan}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        billing.status === "active"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        billing.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    >
                      {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{billing.method}</TableCell>
                  <TableCell>
                    {billing.amount > 0 ? `$${billing.amount}` : "-"}
                  </TableCell>
                  <TableCell>
                    {billing.nextInvoice !== "-" && billing.nextInvoice ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {billing.nextInvoice}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Edit */}
                      <Dialog
                        open={editBillingId === billing.id}
                        onOpenChange={(open) => !open && setEditBillingId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditBilling(billing)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-background border">
                          <DialogHeader className="text-center">
                            <DialogTitle>Edit Billing</DialogTitle>
                            <DialogDescription>
                              Update customer billing details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-billing-customer">Customer Name</Label>
                              <Input
                                id="edit-billing-customer"
                                value={editBilling.customer}
                                onChange={(e) =>
                                  setEditBilling({
                                    ...editBilling,
                                    customer: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-billing-plan">Plan</Label>
                              <Input
                                id="edit-billing-plan"
                                value={editBilling.plan}
                                onChange={(e) =>
                                  setEditBilling({
                                    ...editBilling,
                                    plan: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-billing-amount">Monthly Amount ($)</Label>
                              <Input
                                id="edit-billing-amount"
                                type="number"
                                value={editBilling.amount}
                                onChange={(e) =>
                                  setEditBilling({
                                    ...editBilling,
                                    amount: parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-billing-next">Next Invoice Date</Label>
                              <Input
                                id="edit-billing-next"
                                type="date"
                                value={editBilling.nextInvoice}
                                onChange={(e) =>
                                  setEditBilling({
                                    ...editBilling,
                                    nextInvoice: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-billing-method">Payment Method</Label>
                              <Select
                                value={editBilling.method}
                                onValueChange={(value) =>
                                  setEditBilling({ ...editBilling, method: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border">
                                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                                  <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                                  <SelectItem value="PayPal">PayPal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-billing-status">Status</Label>
                              <Select
                                value={editBilling.status}
                                onValueChange={(value) =>
                                  setEditBilling({ ...editBilling, status: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border">
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-center px-4 pb-4 gap-2">
                            <Button
                              onClick={handleSaveEditBilling}
                              className="bg-carbon-gradient w-full"
                            >
                              Save Changes
                            </Button>
                            <DialogClose asChild>
                              <Button variant="outline" className="w-full">
                                Cancel
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBilling(billing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {billings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No customer billings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoices Table */}
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
                  <TableCell className="font-mono">{inv.invoiceNumber}</TableCell>
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
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