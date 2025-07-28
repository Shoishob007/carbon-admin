"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useMySubscriptionStore } from "@/store/mySubscription";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MySubscription() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    subscription,
    loading,
    error,
    fetchMySubscription,
    updateMySubscription,
  } = useMySubscriptionStore();

  // Local state for editing
  const [planIdInput, setPlanIdInput] = useState<number | "">(
    subscription?.plan ?? ""
  );
  const [paymentFrequencyInput, setPaymentFrequencyInput] = useState<string>(
    subscription?.payment_frequency ?? "monthly"
  );

  // Sync inputs when subscription changes
  useEffect(() => {
    setPlanIdInput(subscription?.plan ?? "");
    setPaymentFrequencyInput(subscription?.payment_frequency ?? "monthly");
  }, [subscription]);

  useEffect(() => {
    if (accessToken) {
      fetchMySubscription(accessToken);
    }
  }, [accessToken, fetchMySubscription]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleUpdate = async () => {
    if (!planIdInput || !paymentFrequencyInput || !accessToken) {
      toast.error("Please provide a valid plan ID and payment frequency");
      return;
    }
    try {
      await updateMySubscription(accessToken, {
        plan_id: planIdInput,
        payment_frequency: paymentFrequencyInput,
      });
      toast.success(
        `Plan successfully changed to ${
          subscription?.plan_details.name ?? "selected plan"
        }`
      );
    } catch {
      // Errors handled via store error and toast
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
        <span className="ml-2 text-gray-600">Loading subscription...</span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center text-muted-foreground max-w-xl mx-auto p-6">
        <p>You do not have an active subscription plan.</p>
        <p>
          Use the form below to start a subscription by providing a plan ID and
          payment frequency.
        </p>
        <div className="mt-4 space-y-4">
          <Input
            type="number"
            placeholder="Plan ID (e.g., 1)"
            value={planIdInput}
            onChange={(e) => setPlanIdInput(Number(e.target.value) || "")}
          />
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={paymentFrequencyInput}
            onChange={(e) => setPaymentFrequencyInput(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button onClick={handleUpdate} className="w-full">
            Subscribe
          </Button>
        </div>
      </div>
    );
  }

  const { plan_details, status, start_date, end_date, payment_frequency } =
    subscription;

  return (
    <Card className="max-w-3xl mx-auto space-y-6">
      <CardHeader>
        <CardTitle>Your Current Subscription</CardTitle>
        <CardDescription>
          Details of your active subscription plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{plan_details.name}</h2>
            <p className="text-sm text-muted-foreground">
              {plan_details.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <span className="font-semibold">Price:</span>{" "}
              {payment_frequency === "monthly"
                ? `$${plan_details.monthly_price} / month`
                : `$${plan_details.yearly_price} / year`}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <Badge
                variant={status === "active" ? "default" : "destructive"}
                className={status === "active" ? "bg-green-500" : "bg-red-500"}
              >
                {status}
              </Badge>
            </div>
            <div>
              <span className="font-semibold">Start Date:</span>{" "}
              {new Date(start_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">End Date:</span>{" "}
              {end_date ? new Date(end_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Max Users:</span>{" "}
              {plan_details.max_users}
            </div>
            <div>
              <span className="font-semibold">Max Guides:</span>{" "}
              {plan_details.max_guides}
            </div>
            <div>
              <span className="font-semibold">Max Tokens:</span>{" "}
              {plan_details.max_tokens}
            </div>
            <div>
              <span className="font-semibold">Features:</span>{" "}
              {plan_details.features.length > 0
                ? plan_details.features.join(", ")
                : "No features listed"}
            </div>
          </div>

          {/* Editable subscription update form */}
          <div className="mt-8 border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Update Subscription</h3>
            <div className="space-y-4 max-w-xs">
              <label
                htmlFor="planIdInput"
                className="block text-sm font-medium text-gray-700"
              >
                Plan ID
              </label>
              <Input
                id="planIdInput"
                type="number"
                placeholder="Plan ID"
                value={planIdInput}
                onChange={(e) => setPlanIdInput(Number(e.target.value) || "")}
              />

              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={paymentFrequencyInput}
                onChange={(e) => setPaymentFrequencyInput(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Updating..." : "Update Subscription"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
