import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const subscriptionPlans = [
  {
    id: 1,
    name: "Starter Green",
    description: "Perfect for small businesses beginning their carbon tracking journey",
    price: 29,
    interval: "month",
    features: ["Up to 100 emissions entries", "Basic reporting", "Email support", "1 user account"],
    subscribers: 234,
    active: true
  },
  {
    id: 2,
    name: "Professional Carbon",
    description: "Comprehensive solution for growing companies with sustainability goals",
    price: 89,
    interval: "month",
    features: ["Unlimited emissions tracking", "Advanced analytics", "Priority support", "Up to 10 users", "API access"],
    subscribers: 156,
    active: true
  },
  {
    id: 3,
    name: "Enterprise Sustainability",
    description: "Full-featured platform for large organizations with complex needs",
    price: 299,
    interval: "month",
    features: ["Everything in Professional", "Custom integrations", "Dedicated account manager", "Unlimited users", "White-label options"],
    subscribers: 47,
    active: true
  },
  {
    id: 4,
    name: "Legacy Basic",
    description: "Deprecated basic plan - no longer available for new subscribers",
    price: 19,
    interval: "month",
    features: ["Limited features", "Basic support"],
    subscribers: 89,
    active: false
  }
];

const recentSubscriptions = [
  {
    id: 1,
    customer: "EcoTech Solutions",
    plan: "Professional Carbon",
    amount: 89,
    status: "active",
    startDate: "2024-06-15",
    nextBilling: "2024-07-15"
  },
  {
    id: 2,
    customer: "Green Manufacturing Co",
    plan: "Enterprise Sustainability",
    amount: 299,
    status: "active",
    startDate: "2024-06-12",
    nextBilling: "2024-07-12"
  },
  {
    id: 3,
    customer: "Sustainable Logistics Ltd",
    plan: "Starter Green",
    amount: 29,
    status: "cancelled",
    startDate: "2024-05-20",
    nextBilling: "2024-06-20"
  },
  {
    id: 4,
    customer: "CleanEnergy Corp",
    plan: "Professional Carbon",
    amount: 89,
    status: "pending",
    startDate: "2024-06-16",
    nextBilling: "2024-07-16"
  }
];

export default function Subscriptions() {
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: 0,
    interval: "month",
    features: [""]
  });

  const totalRevenue = recentSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscribers = recentSubscriptions.filter(sub => sub.status === 'active').length;

  const handleCreatePlan = () => {
    console.log("Creating new plan:", newPlan);
  };

  const handleEditPlan = (id: number) => {
    console.log("Editing plan:", id);
  };

  const handleDeletePlan = (id: number) => {
    console.log("Deleting plan:", id);
  };

  const handleTogglePlan = (id: number) => {
    console.log("Toggling plan status:", id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage subscription plans and monitor customer subscriptions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-carbon-gradient hover:bg-carbon-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-background border">
            <DialogHeader className="text-center">
              <DialogTitle>Create New Subscription Plan</DialogTitle>
              <DialogDescription>
                Design a new subscription plan for carbon tracking services
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="e.g., Professional Green"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
                    placeholder="29"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interval">Billing</Label>
                  <Select value={newPlan.interval} onValueChange={(value) => setNewPlan({...newPlan, interval: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border">
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-center px-4 pb-4">
              <Button onClick={handleCreatePlan} className="bg-carbon-gradient w-full">
                Create Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">{subscriptionPlans.length}</div>
            <p className="text-xs text-muted-foreground">
              {subscriptionPlans.filter(plan => plan.active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {subscriptionPlans.reduce((sum, plan) => sum + plan.subscribers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeSubscribers} active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage and configure subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${plan.price}/{plan.interval}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {plan.subscribers}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.active}
                        onCheckedChange={() => handleTogglePlan(plan.id)}
                      />
                      <Badge 
                        variant={plan.active ? 'default' : 'secondary'}
                        className={plan.active ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {plan.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPlan(plan.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest subscription activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.customer}</TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>${subscription.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        subscription.status === 'active' ? 'default' :
                        subscription.status === 'pending' ? 'secondary' :
                        'destructive'
                      }
                      className={
                        subscription.status === 'active' ? 'bg-green-500' :
                        subscription.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }
                    >
                      {subscription.status === 'active' ? <CheckCircle className="mr-1 h-3 w-3" /> :
                       subscription.status === 'cancelled' ? <XCircle className="mr-1 h-3 w-3" /> :
                       <Calendar className="mr-1 h-3 w-3" />}
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{subscription.startDate}</TableCell>
                  <TableCell>{subscription.nextBilling}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}