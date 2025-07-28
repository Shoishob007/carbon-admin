"use client";

import { useEffect, useState } from "react";
import { usePublicSubscriptionStore } from "@/store/publicSubscriptions";
import { useMySubscriptionStore } from "@/store/mySubscription";
import { useAuthStore } from "@/store/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// icons for plans
const planIcons = [
  <CheckCircle key="star" className="w-8 h-8 text-blue-400" />,
  <CheckCircle key="check" className="w-8 h-8 text-blue-400" />,
  <CheckCircle key="check2" className="w-8 h-8 text-blue-400" />,
];

export default function Pricing() {
  const { activePlans, loading, error, fetchPublicPlans } =
    usePublicSubscriptionStore();

  const {
    subscription,
    fetchMySubscription,
    updateMySubscription,
    createSubscription,
  } = useMySubscriptionStore();

  const accessToken = useAuthStore((state) => state.accessToken);

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [updatingPlanId, setUpdatingPlanId] = useState<number | null>(null);
  const [hasNoSubscription, setHasNoSubscription] = useState(false);

  useEffect(() => {
    fetchPublicPlans();
    if (accessToken) {
      fetchMySubscription(accessToken).catch((error) => {
        if (
          error?.message === "No subscription found" ||
          (typeof error === "string" && error.includes("No subscription found"))
        ) {
          setHasNoSubscription(true);
        }
      });
    }
  }, [fetchPublicPlans, fetchMySubscription, accessToken]);

  const currentPlanId = subscription?.plan_details.id ?? null;
  const currentPlanPrice = subscription
    ? billing === "yearly"
      ? subscription.plan_details.yearly_price
      : subscription.plan_details.monthly_price
    : 0;

  // Sorted plans
  const sortedPlans = [...activePlans].sort(
    (a, b) => a.monthly_price - b.monthly_price
  );

  const handleInitialSubscription = async (planId: number) => {
    if (!accessToken) {
      toast.error("You must be logged in to subscribe.");
      return;
    }

    try {
      setUpdatingPlanId(planId);
      await createSubscription(accessToken, {
        plan_id: planId,
        payment_frequency: billing,
      });
      toast.success("Subscription created successfully!");
      setHasNoSubscription(false);
      await fetchMySubscription(accessToken);
    } catch (error) {
      console.error("Subscription creation failed:", error);
    } finally {
      setUpdatingPlanId(null);
    }
  };

  // plan change)
  const handlePlanChange = async (planId: number) => {
    if (!accessToken) {
      toast.error("You must be logged in to change plans.");
      return;
    }
    if (!subscription) {
      toast.error("Current subscription is not loaded.");
      return;
    }
    if (planId === currentPlanId) {
      toast("You are already subscribed to this plan.");
      return;
    }

    try {
      setUpdatingPlanId(planId);
      await updateMySubscription(accessToken, {
        plan_id: planId,
        payment_frequency: billing,
      });
      toast.success("Subscription plan updated successfully!");
      await fetchMySubscription(accessToken);
    } catch (error) {
      console.error("Plan change failed:", error);
    } finally {
      setUpdatingPlanId(null);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Subscription Plans
      </h1>

      {/* Billing toggle */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-3 bg-muted p-2 rounded-lg">
          <button
            type="button"
            aria-pressed={billing === "monthly"}
            className={cn(
              "cursor-pointer px-4 py-2 rounded-lg transition",
              billing === "monthly"
                ? "bg-white font-semibold shadow text-foreground"
                : "text-muted-foreground hover:bg-muted hover:shadow"
            )}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={billing === "yearly"}
            className={cn(
              "cursor-pointer px-4 py-2 rounded-lg transition",
              billing === "yearly"
                ? "bg-white font-semibold shadow text-foreground"
                : "text-muted-foreground hover:bg-muted hover:shadow"
            )}
            onClick={() => setBilling("yearly")}
          >
            Yearly{" "}
            <span className="text-xs text-green-600 ml-1">(10% off)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-10 h-10 text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-medium">{error}</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {sortedPlans.map((plan, idx) => {
            const isPopular = idx === 1 && sortedPlans.length > 1;
            const price =
              billing === "yearly"
                ? (plan.yearly_price * 0.9).toFixed(2)
                : plan.monthly_price.toFixed(2);

            const planPriceNumeric =
              billing === "yearly" ? plan.yearly_price : plan.monthly_price;

            const isCurrentPlan = plan.id === currentPlanId;
            const isUpdating = updatingPlanId === plan.id;

            // Button logic
            let actionButton = null;

            if (hasNoSubscription || !subscription) {
              actionButton = (
                <Button
                  variant="default"
                  className="w-full mt-4 mb-6 font-semibold py-2 rounded-lg"
                  onClick={() => handleInitialSubscription(plan.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Subscribing..." : "Subscribe"}
                </Button>
              );
            } else if (isCurrentPlan) {
              actionButton = (
                <Button
                  disabled
                  className="w-full mt-4 mb-6 font-semibold py-2 rounded-lg bg-gray-300 text-gray-700 cursor-not-allowed"
                >
                  Subscribed
                </Button>
              );
            } else {
              // user has subscription
              if (planPriceNumeric > currentPlanPrice) {
                actionButton = (
                  <Button
                    variant="outline"
                    className="w-full mt-4 mb-6 font-semibold py-2 rounded-lg text-green-700 border-green-700 hover:bg-green-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Upgrading..." : "Upgrade"}
                  </Button>
                );
              } else if (planPriceNumeric < currentPlanPrice) {
                actionButton = (
                  <Button
                    variant="outline"
                    className="w-full mt-4 mb-6 font-semibold py-2 rounded-lg text-red-700 border-red-700 hover:bg-red-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Downgrading..." : "Downgrade"}
                  </Button>
                );
              } else {
                actionButton = (
                  <Button
                    variant="outline"
                    className="w-full mt-4 mb-6 font-semibold py-2 rounded-lg text-gray-700 border-gray-400 hover:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Switching..." : "Switch"}
                  </Button>
                );
              }
            }

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-white rounded-2xl shadow-md flex flex-col items-center px-8 pt-10 pb-8 transition-all duration-300",
                  isPopular
                    ? "border-2 border-gray-500 z-10 shadow-lg"
                    : "border-2 border-gray-500",
                  isCurrentPlan &&
                    "border-4 border-blue-600 shadow-xl scale-105"
                )}
                style={{ minHeight: 460 }}
              >
                <div className="absolute left-6 top-6">
                  {planIcons[idx % planIcons.length]}
                </div>
                {isPopular && (
                  <Badge className="absolute right-6 top-6 bg-green-100 text-green-800 font-semibold px-4 py-1 rounded-full text-xs tracking-wide z-20 shadow">
                    POPULAR
                  </Badge>
                )}
                <div className="h-8" />
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <div className="text-muted-foreground mb-4 text-center min-h-11">
                  {plan.description}
                </div>
                <div className="flex items-end mb-1">
                  <span className="text-4xl font-extrabold mr-2 text-foreground">
                    ${price}
                  </span>
                  <span className="text-base text-muted-foreground mb-1">
                    /{billing === "monthly" ? "month" : "year"}
                  </span>
                </div>
                {actionButton}
                <div className="w-full">
                  <div className="font-semibold mb-2 text-foreground">
                    Features
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
