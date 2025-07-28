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
  Zap,
  Users,
  FileText,
  Database,
  Crown,
  Calendar,
  CreditCard,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function MySubscription() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    subscription,
    loading,
    error,
    fetchMySubscription,
    updateMySubscription,
    createSubscription,
  } = useMySubscriptionStore();
  const { activePlans, fetchPublicPlans } = usePublicSubscriptionStore();
  const [billing, setBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<(typeof activePlans)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasNoSubscription, setHasNoSubscription] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchPublicPlans();
      fetchMySubscription(accessToken)
        .then(() => setHasNoSubscription(false))
        .catch((error) => {
          if (error?.message === "No subscription found") {
            setHasNoSubscription(true);
          }
        });
    }
  }, [accessToken, fetchMySubscription, fetchPublicPlans]);

  useEffect(() => {
    if (error && error !== "No subscription found") {
      toast.error(error);
    }
  }, [error]);

  // Set initial billing frequency when dialog opens
  useEffect(() => {
    if (isDialogOpen && subscription) {
      setBilling(subscription.payment_frequency);
    }
  }, [isDialogOpen, subscription]);

  const handleSubscriptionAction = async (planId: number) => {
    if (!accessToken) {
      toast.error("You must be logged in to subscribe.");
      return;
    }

    try {
      setIsUpdating(true);
      
      if (hasNoSubscription) {
        // Create new subscription
        await createSubscription(accessToken, {
          plan_id: planId,
          payment_frequency: billing,
        });
        toast.success("Subscription created successfully!");
        setHasNoSubscription(false);
      } else if (subscription) {
        // Update existing subscription
        await updateMySubscription(accessToken, {
          plan_id: planId,
          payment_frequency: billing,
        });
        toast.success("Subscription updated successfully!");
      }
      
      await fetchMySubscription(accessToken);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process subscription");
    } finally {
      setIsUpdating(false);
    }
  };

  const openPlanDialog = (plan: (typeof activePlans)[0]) => {
    setSelectedPlan(plan);
    // Set billing frequency to current subscription frequency if changing plans
    if (subscription) {
      setBilling(subscription.payment_frequency);
    }
    setIsDialogOpen(true);
  };

  // Check if user is changing frequency or plan
  const isFrequencyChange = selectedPlan && subscription && 
    selectedPlan.id === subscription.plan && 
    billing !== subscription.payment_frequency;

  const isPlanChange = selectedPlan && subscription && 
    selectedPlan.id !== subscription.plan;

  const shouldEnableButton = hasNoSubscription || isFrequencyChange || isPlanChange;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  // Default values when no subscription exists
  const plan_details = subscription?.plan_details || {
    name: "No Active Plan",
    description: "You don't have an active subscription",
    monthly_price: 0,
    yearly_price: 0,
    max_users: 0,
    max_guides: 0,
    max_tokens: 0,
    total_requests_limit: 0,
    features: ["Subscribe to unlock all features"],
  };

  const currentPrice = billing === "monthly" 
    ? plan_details.monthly_price 
    : plan_details.yearly_price;

  const stats = [
    {
      title: "Team Members",
      value: plan_details.max_users || 0,
      icon: Users,
      description: "Maximum users allowed",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Content Guides",
      value: plan_details.max_guides || 0,
      icon: FileText,
      description: "Guides you can create",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "AI Tokens",
      value: (plan_details.max_tokens || 0).toLocaleString(),
      icon: Database,
      description: "Monthly token allocation",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "API Requests",
      value: (plan_details.total_requests_limit || 0).toLocaleString(),
      icon: Zap,
      description: "Monthly request limit",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Subscription Management</h1>
            <p className="text-sm text-muted-foreground">
              {hasNoSubscription 
                ? "Choose a plan that fits your needs" 
                : "Manage your subscription and explore upgrade options"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className={cn(
                    "text-lg font-semibold",
                    hasNoSubscription ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={cn(
                  "p-2.5 rounded-lg",
                  hasNoSubscription ? "bg-muted" : stat.bgColor
                )}>
                  <stat.icon className={cn(
                    "h-4 w-4",
                    hasNoSubscription ? "text-muted-foreground" : stat.color
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Subscription Card */}
      <Card className={cn(
        "border-0 shadow-sm bg-gradient-to-br from-white via-white to-primary/[0.02]",
        !hasNoSubscription && "ring-1 ring-primary/10"
      )}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  hasNoSubscription ? "bg-muted-foreground" : "bg-green-500"
                )} />
                <CardTitle className="text-2xl font-semibold text-foreground">
                  {plan_details.name}
                </CardTitle>
                {!hasNoSubscription && (
                  <Badge
                    variant="secondary"
                    className="capitalize text-xs bg-green-100 text-green-700 border-green-200"
                  >
                    {subscription?.status || "inactive"}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm text-muted-foreground max-w-2xl">
                {plan_details.description}
              </CardDescription>
            </div>
            {!hasNoSubscription && (
              <div className="text-right bg-primary/5 rounded-lg px-4 py-3 border border-primary/10">
                <div className="text-xl font-bold text-primary">
                  ${currentPrice.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  per {billing === "monthly" ? "month" : "year"}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {hasNoSubscription ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="p-4 bg-muted/50 rounded-full">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium">No Active Subscription</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Get started with one of our subscription plans to unlock all features and capabilities
                </p>
              </div>
              <Link to="/subscriptions/pricing">
                <Button className="mt-2">
                  <Crown className="h-4 w-4 mr-2" />
                  Browse Plans
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Plan Features */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Plan Features
                    </h3>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {plan_details.features.map((feature, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 px-2 py-1.5 hover:bg-muted/30 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Billing Details
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Billing Cycle</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {subscription?.payment_frequency}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <span className="text-sm text-muted-foreground">Started</span>
                      <span className="text-sm font-medium">
                        {subscription?.start_date ? new Date(subscription.start_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <span className="text-sm text-muted-foreground">Next Billing</span>
                      <span className="text-sm font-medium">
                        {subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Available Plans</h2>
            <p className="text-sm text-muted-foreground">
              {hasNoSubscription ? "Choose the perfect plan for your needs" : "Upgrade or change your current plan"}
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activePlans.map((plan) => {
            const isCurrentPlan = !hasNoSubscription && plan.id === subscription?.plan;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative transition-all hover:shadow-md cursor-pointer shadow-sm",
                  isCurrentPlan && "ring-2 ring-primary/20 bg-primary/[0.02]"
                )}
                onClick={() => openPlanDialog(plan)}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-2 left-4">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Current Plan
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-semibold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">
                        ${billing === "monthly" 
                          ? plan.monthly_price.toFixed(2) 
                          : (plan.yearly_price * 0.9).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{billing === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    {billing === "yearly" && (
                      <p className="text-xs text-green-600">Save 10% with yearly billing</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Users</p>
                      <p className="font-medium">{plan.max_users}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Guides</p>
                      <p className="font-medium">{plan.max_guides}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Tokens</p>
                      <p className="font-medium">{plan.max_tokens.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Requests</p>
                      <p className="font-medium">{plan.total_requests_limit?.toLocaleString() || "∞"}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant={isCurrentPlan ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                  >
                    {isCurrentPlan ? "Manage Plan" : "View Details"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Plan Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-6">
          {selectedPlan && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-semibold">
                  {selectedPlan.name}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {selectedPlan.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Pricing Section */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Billing Frequency</h4>
                      <Select
                        value={billing}
                        onValueChange={(value) => setBilling(value as "monthly" | "yearly")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly (Save 10%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold">
                        ${billing === "monthly" 
                          ? selectedPlan.monthly_price.toFixed(2) 
                          : (selectedPlan.yearly_price * 0.9).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {billing === "monthly" ? "month" : "year"}
                      </div>
                      {billing === "yearly" && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Original Price ${(selectedPlan.yearly_price * 0.1 * 10).toFixed(0)}/year
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    Plan Features
                  </h4>
                  <div className="grid gap-2 max-h-32 overflow-y-auto">
                    {selectedPlan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 px-2 py-1.5 hover:bg-muted/30 rounded-lg transition-colors">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Limits */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    Resource Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Users, label: "Max Users", value: selectedPlan.max_users },
                      { icon: FileText, label: "Max Guides", value: selectedPlan.max_guides },
                      { icon: Database, label: "Max Tokens", value: selectedPlan.max_tokens.toLocaleString() },
                      { icon: Zap, label: "API Requests", value: selectedPlan.total_requests_limit?.toLocaleString() || "Unlimited" },
                    ].map((item, i) => (
                      <div key={i} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                        </div>
                        <div className="text-lg font-semibold">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    onClick={() => handleSubscriptionAction(selectedPlan.id)}
                    disabled={!shouldEnableButton || isUpdating}
                    className="w-full"
                    size="lg"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : hasNoSubscription ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Subscribe Now
                      </>
                    ) : isFrequencyChange ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Update Billing Frequency
                      </>
                    ) : selectedPlan.id === subscription?.plan ? (
                      "Current Plan"
                    ) : selectedPlan.monthly_price > (subscription?.plan_details.monthly_price || 0) ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </>
                    ) : (
                      "Change Plan"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}