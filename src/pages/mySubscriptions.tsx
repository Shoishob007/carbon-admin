"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useMySubscriptionStore } from "@/store/mySubscription";
import { usePublicSubscriptionStore } from "@/store/publicSubscriptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Zap,
  Users,
  FileText,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

export default function MySubscription() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    subscription,
    loading,
    error,
    fetchMySubscription,
    updateMySubscription,
  } = useMySubscriptionStore();
  const { activePlans, fetchPublicPlans } = usePublicSubscriptionStore();
  const [billing, setBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof activePlans)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchMySubscription(accessToken);
      fetchPublicPlans();
    }
  }, [accessToken, fetchMySubscription, fetchPublicPlans]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (subscription) {
      setBilling(subscription.payment_frequency);
    }
  }, [subscription]);

  const handlePlanUpdate = async (planId: number) => {
    if (!accessToken || !subscription) return;

    try {
      setIsUpdating(true);
      await updateMySubscription(accessToken, {
        plan_id: planId,
        payment_frequency: billing,
      });
      toast.success("Subscription updated successfully");
      await fetchMySubscription(accessToken);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update subscription");
    } finally {
      setIsUpdating(false);
    }
  };

  const openPlanDialog = (plan: (typeof activePlans)[0]) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12 h-full">
        <h1 className="text-2xl font-bold mb-2">No Active Subscription</h1>
        <p className="text-muted-foreground mb-6">
          You don't have an active subscription plan
        </p>
        <Link to="/subscriptions/pricing">
        <Button>Browse Plans</Button></Link>
      </div>
    );
  }

  const { plan_details, status, start_date, end_date, payment_frequency } =
    subscription;
  const currentPrice =
    payment_frequency === "monthly"
      ? plan_details.monthly_price
      : plan_details.yearly_price;

  const stats = [
    {
      title: "Users Limit",
      value: plan_details.max_users,
      icon: Users,
      description: "Maximum team members",
    },
    {
      title: "Guides Limit",
      value: plan_details.max_guides,
      icon: FileText,
      description: "Maximum guides you can create",
    },
    {
      title: "Tokens",
      value: plan_details.max_tokens,
      icon: Database,
      description: "Available tokens for AI",
    },
    {
      title: "Requests",
      value: plan_details.total_requests_limit || "Unlimited",
      icon: Zap,
      description: "API requests per month",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Subscription</h1>
        <p className="text-muted-foreground">
          Manage your current plan and explore upgrade options
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Plan Card */}
<Card className="border-primary/30 bg-gradient-to-br from-white to-primary/5 shadow-sm">
  <CardHeader className="pb-3">
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary mt-1 flex-shrink-0"></div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {plan_details.name}
          </span>
          <Badge
            variant={status === "active" ? "default" : "destructive"}
            className={cn(
              "capitalize text-xs py-1 px-2.5",
              status === "active" 
                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                : "bg-red-100 text-red-800 hover:bg-red-100"
            )}
          >
            {status}
          </Badge>
        </CardTitle>
        <CardDescription className="mt-2 text-muted-foreground/80">
          {plan_details.description}
        </CardDescription>
      </div>
      <div className="text-right bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
        <div className="text-2xl font-bold text-primary">
          ${currentPrice.toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground/80 tracking-tight">
          per {payment_frequency === "monthly" ? "month" : "year"}
        </div>
      </div>
    </div>
  </CardHeader>
  
  <CardContent className="pt-0">
    <div className="grid gap-6 md:grid-cols-3">
      {/* Plan Features */}
      <div className="space-y-4 md:col-span-2">
        <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground/80">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Plan Features
        </h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {plan_details.features.map((feature, i) => (
            <li 
              key={i} 
              className="flex items-start gap-3 p-2 hover:bg-muted/30 rounded-lg transition-colors"
            >
              <CheckCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscription Details */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground/80">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Subscription Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
            <span className="text-sm text-muted-foreground">Billing Cycle</span>
            <span className="text-sm font-medium capitalize bg-primary/5 px-2 py-1 rounded-md">
              {payment_frequency}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
            <span className="text-sm text-muted-foreground">Start Date</span>
            <span className="text-sm font-medium">
              {new Date(start_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
            <span className="text-sm text-muted-foreground">Renewal Date</span>
            <span className="text-sm font-medium">
              {end_date ? new Date(end_date).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activePlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "transition-all hover:shadow-md cursor-pointer",
                plan.id === subscription.plan && "border-primary"
              )}
              onClick={() => openPlanDialog(plan)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {plan.name}
                  {plan.id === subscription.plan && (
                    <Badge variant="secondary">Current Plan</Badge>
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-bold">
                    $
                    {billing === "monthly"
                      ? plan.monthly_price.toFixed(2)
                      : (plan.yearly_price * 0.9).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    /{billing === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <Button
                  variant={
                    plan.id === subscription.plan ? "outline" : "default"
                  }
                  className="w-full"
                  disabled={plan.id === subscription.plan}
                >
                  {plan.id === subscription.plan
                    ? "Current Plan"
                    : "View Details"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Plan Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPlan.name}</DialogTitle>
                <DialogDescription>
                  {selectedPlan.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Pricing */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Billing Cycle</h4>
                      <Select
                        value={billing}
                        onValueChange={(value) =>
                          setBilling(value as "monthly" | "yearly")
                        }
                      >
                        <SelectTrigger className="w-[180px] mt-2">
                          <SelectValue placeholder="Select billing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">
                            Yearly (10% off)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">
                        $
                        {billing === "monthly"
                          ? selectedPlan.monthly_price.toFixed(2)
                          : (selectedPlan.yearly_price * 0.9).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {billing === "monthly" ? "month" : "year"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <ul className="space-y-3">
                    {selectedPlan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Max Users</span>
                    </div>
                    <div className="text-xl font-bold">
                      {selectedPlan.max_users}
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Max Guides</span>
                    </div>
                    <div className="text-xl font-bold">
                      {selectedPlan.max_guides}
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Max Tokens</span>
                    </div>
                    <div className="text-xl font-bold">
                      {selectedPlan.max_tokens}
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Requests</span>
                    </div>
                    <div className="text-xl font-bold">
                      {selectedPlan.total_requests_limit || "Unlimited"}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handlePlanUpdate(selectedPlan.id)}
                  disabled={selectedPlan.id === subscription.plan || isUpdating}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedPlan.id === subscription.plan ? (
                    "Current Plan"
                  ) : selectedPlan.monthly_price >
                    plan_details.monthly_price ? (
                    "Upgrade Plan"
                  ) : (
                    "Change Plan"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
