import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Loader2 } from "lucide-react";

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

interface PaymentDetails {
  user_name?: string;
  user_email?: string;
  payments: Payment[];
  total_count?: number;
}

interface PaymentDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPayment: PaymentDetails | null;
  loading: boolean;
  role?: string;
}

export default function PaymentDetailsDialog({
  isOpen,
  onClose,
  selectedPayment,
  loading,
  role,
}: PaymentDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Detailed information about this payment record
          </DialogDescription>
        </DialogHeader>

        {selectedPayment ? (
          <div className="flex-1 overflow-y-auto">
            {/* Customer Information */}
            {role !== "business" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Customer Name
                  </Label>
                  <p className="text-sm mt-1 font-medium">
                    {selectedPayment.user_name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Customer Email
                  </Label>
                  <p className="text-sm mt-1 font-medium">
                    {selectedPayment.user_email || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Details */}
            {selectedPayment.payments &&
            selectedPayment.payments.length > 0 ? (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-3">
                    Payment Information
                  </h4>

                  {selectedPayment.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg overflow-y-auto border-b-2"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Subscription Plan
                          </Label>
                          <p className="text-sm mt-1 font-medium">
                            {payment.subscription_details?.plan_name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.subscription_details
                              ?.payment_frequency || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Subscription Status
                          </Label>
                          <div className="mt-1">
                            <Badge
                              variant={
                                payment.subscription_details?.status ===
                                "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                payment.subscription_details?.status ===
                                "active"
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
                          <Label className="text-sm font-medium text-gray-700">
                            Amount
                          </Label>
                          <p className="text-sm mt-1 font-bold text-green-600">
                            ${parseFloat(payment.amount || "0").toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Payment Status
                          </Label>
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
                                ? payment.payment_status
                                    .charAt(0)
                                    .toUpperCase() +
                                  payment.payment_status.slice(1)
                                : "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Payment Date
                          </Label>
                          <p className="text-sm mt-1 font-medium">
                            {payment.payment_date
                              ? new Date(
                                  payment.payment_date
                                ).toLocaleDateString("en-US", {
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
                          <Label className="text-sm font-medium text-gray-700">
                            Transaction ID
                          </Label>
                          <p className="text-sm mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                            {payment.transaction_id || "N/A"}
                          </p>
                        </div>
                      </div>

                      {payment.payment_method && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Payment Method
                            </Label>
                            <p className="text-sm mt-1 font-medium">
                              {payment.payment_method}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              User ID
                            </Label>
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
                      <Label className="text-sm font-medium text-gray-700">
                        Total Payments
                      </Label>
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
                <p>No payment details available</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}