"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useSubscriptionStore } from "@/store/subscriptions";
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
  CreditCard,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { recentSubscriptions } from "@/data/mockSubscribers";

export default function Subscriptions() {
  const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const {
    activePlans,
    inactivePlans,
    loading,
    error,
    fetchPlans,
    fetchPublicPlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
  } = useSubscriptionStore();
  // console.log("activePlans :: ", activePlans)

  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    monthly_price: 0,
    yearly_price: 0,
    duration_in_days: 30,
    features: [] as string[],
    total_requests_limit: 250,
    max_users: 1,
    max_guides: 5,
    max_tokens: 10000,
  });
  const [currentFeature, setCurrentFeature] = useState("");
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (role === "business" || role === "individual") {
      fetchPublicPlans();
    } else if (accessToken) {
      fetchPlans(accessToken);
    }
  }, [role, accessToken, fetchPlans, fetchPublicPlans]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCreatePlan = async () => {
    try {
      await createPlan(accessToken!, newPlan);
      toast.success("Plan created successfully");
      setNewPlan({
        name: "",
        description: "",
        monthly_price: 0,
        yearly_price: 0,
        duration_in_days: 30,
        features: [],
        total_requests_limit: 250,
        max_users: 1,
        max_guides: 5,
        max_tokens: 10000,
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create plan");
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan) return;

    try {
      await updatePlan(accessToken!, editingPlan.id, editingPlan);
      toast.success("Plan updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update plan");
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await deletePlan(accessToken!, id);
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleTogglePlan = async (id: number, isActive: boolean) => {
    try {
      await togglePlanStatus(accessToken!, id, isActive);
      toast.success(`Plan ${isActive ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to toggle plan status");
    }
  };

  const addFeature = (isEdit: boolean = false) => {
    if (!currentFeature.trim()) return;

    if (isEdit && editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, currentFeature.trim()],
      });
    } else {
      setNewPlan({
        ...newPlan,
        features: [...newPlan.features, currentFeature.trim()],
      });
    }
    setCurrentFeature("");
  };

  const removeFeature = (index: number, isEdit: boolean = false) => {
    if (isEdit && editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: editingPlan.features.filter((_, i) => i !== index),
      });
    } else {
      setNewPlan({
        ...newPlan,
        features: newPlan.features.filter((_, i) => i !== index),
      });
    }
  };

  const openEditDialog = (plan: SubscriptionPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditDialogOpen(true);
  };

  const allPlans = [...activePlans, ...inactivePlans];
  const activeSubscribers = allPlans.reduce(
    (sum, plan) => sum + (plan.is_active ? 1 : 0),
    0
  );
  const totalRevenue = allPlans.reduce(
    (sum, plan) => sum + plan.monthly_price * 10,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Subscription Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage subscription plans and monitor customer subscriptions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, name: e.target.value })
                    }
                    placeholder="e.g., Professional Green"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPlan.description}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, description: e.target.value })
                    }
                    placeholder="Plan description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly_price">Monthly Price ($)</Label>
                    <Input
                      id="monthly_price"
                      type="number"
                      value={newPlan.monthly_price}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          monthly_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="29.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearly_price">Yearly Price ($)</Label>
                    <Input
                      id="yearly_price"
                      type="number"
                      value={newPlan.yearly_price}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          yearly_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="299.99"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyDown={(e) => e.key === "Enter" && addFeature(false)}
                    />
                    <Button type="button" onClick={() => addFeature(false)}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {newPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index, false)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_users">Max Users</Label>
                    <Input
                      id="max_users"
                      type="number"
                      value={newPlan.max_users}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          max_users: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_guides">Max Guides</Label>
                    <Input
                      id="max_guides"
                      type="number"
                      value={newPlan.max_guides}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          max_guides: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_tokens">Max Tokens</Label>
                    <Input
                      id="max_tokens"
                      type="number"
                      value={newPlan.max_tokens}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          max_tokens: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requests_limit">Requests Limit</Label>
                    <Input
                      id="requests_limit"
                      type="number"
                      value={newPlan.total_requests_limit}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          total_requests_limit: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center px-4 pb-4">
              <Button
                onClick={handleCreatePlan}
                className="bg-carbon-gradient w-full"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Plan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-background border">
            <DialogHeader className="text-center">
              <DialogTitle>Edit Subscription Plan</DialogTitle>
              <DialogDescription>
                Update the subscription plan details
              </DialogDescription>
            </DialogHeader>
            {editingPlan && (
              <>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Plan Name</Label>
                      <Input
                        id="edit-name"
                        value={editingPlan.name}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Input
                        id="edit-description"
                        value={editingPlan.description}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-monthly">Monthly Price ($)</Label>
                        <Input
                          id="edit-monthly"
                          type="number"
                          value={editingPlan.monthly_price}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              monthly_price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-yearly">Yearly Price ($)</Label>
                        <Input
                          id="edit-yearly"
                          type="number"
                          value={editingPlan.yearly_price}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              yearly_price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Features</Label>
                      <div className="flex gap-2">
                        <Input
                          value={currentFeature}
                          onChange={(e) => setCurrentFeature(e.target.value)}
                          placeholder="Add a feature"
                          onKeyDown={(e) =>
                            e.key === "Enter" && addFeature(true)
                          }
                        />
                        <Button type="button" onClick={() => addFeature(true)}>
                          Add
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {editingPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm">{feature}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(index, true)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-max-users">Max Users</Label>
                        <Input
                          id="edit-max-users"
                          type="number"
                          value={editingPlan.max_users}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              max_users: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-max-guides">Max Guides</Label>
                        <Input
                          id="edit-max-guides"
                          type="number"
                          value={editingPlan.max_guides}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              max_guides: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-max-tokens">Max Tokens</Label>
                        <Input
                          id="edit-max-tokens"
                          type="number"
                          value={editingPlan.max_tokens}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              max_tokens: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-requests">Requests Limit</Label>
                        <Input
                          id="edit-requests"
                          type="number"
                          value={editingPlan.total_requests_limit}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              total_requests_limit:
                                parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center px-4 pb-4">
                  <Button
                    onClick={handleEditPlan}
                    className="bg-carbon-gradient w-full"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Plan"}
                  </Button>
                </div>
              </>
            )}
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
            <div className="text-2xl font-bold text-carbon-700">
              {allPlans.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activePlans.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {activeSubscribers}
            </div>
            <p className="text-xs text-muted-foreground">
              +{(activeSubscribers * 0.15).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{(totalRevenue * 0.1).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Manage and configure subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPlans.map((plan) => (
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
                      ${plan.monthly_price}/month
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${plan.yearly_price}/year
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {plan.features.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.is_active}
                        onCheckedChange={(checked) =>
                          handleTogglePlan(plan.id, checked)
                        }
                        disabled={loading}
                      />
                      <Badge
                        variant={plan.is_active ? "default" : "secondary"}
                        className={
                          plan.is_active ? "bg-green-500" : "bg-gray-500"
                        }
                      >
                        {plan.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(plan)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={loading}
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>
            Latest subscription activities and changes
          </CardDescription>
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
                  <TableCell className="font-medium">
                    {subscription.customer}
                  </TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>${subscription.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subscription.status === "active"
                          ? "default"
                          : subscription.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        subscription.status === "active"
                          ? "bg-green-500"
                          : subscription.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {subscription.status === "active" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : subscription.status === "cancelled" ? (
                        <XCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <Calendar className="mr-1 h-3 w-3" />
                      )}
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

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  duration_in_days: number | null;
  features: string[];
  total_requests_limit: number;
  max_users: number;
  max_guides: number;
  max_tokens: number;
  is_active: boolean;
  created_at: string;
}
