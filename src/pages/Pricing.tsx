"use client";

import { useEffect, useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Demo icons for plans
const planIcons = [
  <Star key="star" className="w-8 h-8 text-green-500" />,
  <CheckCircle key="check" className="w-8 h-8 text-blue-400" />,
  <CheckCircle key="check2" className="w-8 h-8 text-gray-400" />,
];

export default function Pricing() {
  const {
    activePlans,
    loading,
    error,
    fetchPublicPlans,
  } = useSubscriptionStore();

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    fetchPublicPlans();
  }, [fetchPublicPlans]);

  // Sort plans so the most expensive is in the center (for "POPULAR" badge)
  const sortedPlans = [...activePlans].sort(
    (a, b) => b.monthly_price - a.monthly_price
  );

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Plan</h1>
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-3 bg-muted p-2 rounded-lg">
          <span
            className={cn(
              "cursor-pointer px-3 py-1 rounded transition",
              billing === "monthly" ? "bg-white shadow font-semibold" : ""
            )}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </span>
          <span
            className={cn(
              "cursor-pointer px-3 py-1 rounded transition",
              billing === "yearly" ? "bg-white shadow font-semibold" : ""
            )}
            onClick={() => setBilling("yearly")}
          >
            Yearly <span className="text-xs text-green-600">(10% off)</span>
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {sortedPlans.map((plan, idx) => {
            // Mark the center plan as "POPULAR"
            const isPopular = idx === 1 && sortedPlans.length > 1;
            const price =
              billing === "yearly"
                ? (plan.yearly_price * 0.9).toFixed(2)
                : plan.monthly_price.toFixed(2);

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-white rounded-2xl shadow-md flex flex-col items-center px-8 pt-10 pb-8 transition-all",
                  isPopular
                    ? "border-2 border-green-500 scale-105 z-10 shadow-lg"
                    : "border border-muted"
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
                {/* Subscribe Button */}
                <Button
                  className={cn(
                    "w-full mt-4 mb-6 font-semibold py-2 rounded-lg",
                    isPopular
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-muted text-foreground"
                  )}
                  disabled
                >
                  Subscribe
                </Button>
                {/* Features */}
                <div className="w-full">
                  <div className="font-semibold mb-2 text-foreground">
                    Free features
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