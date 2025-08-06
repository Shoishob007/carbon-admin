import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddInvoicePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (payment: {
    amount: string;
    transaction_id: string;
    notes: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  invoiceNumber?: string;
}

export default function AddInvoicePaymentDialog({
  isOpen,
  onClose,
  onAddPayment,
  isSubmitting,
  invoiceNumber,
}: AddInvoicePaymentDialogProps) {
  const [newInvoicePayment, setNewInvoicePayment] = useState({
    amount: "",
    transaction_id: "",
    notes: "",
  });

  const handleSubmit = async () => {
    await onAddPayment(newInvoicePayment);
    setNewInvoicePayment({
      amount: "",
      transaction_id: "",
      notes: "",
    });
  };

  const handleClose = () => {
    setNewInvoicePayment({
      amount: "",
      transaction_id: "",
      notes: "",
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setNewInvoicePayment({
        amount: "",
        transaction_id: "",
        notes: "",
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-background border">
        <DialogHeader>
          <DialogTitle>Add Payment to Invoice</DialogTitle>
          <DialogDescription>
            Add a payment to invoice #{invoiceNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invoice-amount">Amount</Label>
            <Input
              id="invoice-amount"
              type="number"
              value={newInvoicePayment.amount}
              onChange={(e) =>
                setNewInvoicePayment({
                  ...newInvoicePayment,
                  amount: e.target.value,
                })
              }
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice-transaction-id">Transaction ID</Label>
            <Input
              id="invoice-transaction-id"
              value={newInvoicePayment.transaction_id}
              onChange={(e) =>
                setNewInvoicePayment({
                  ...newInvoicePayment,
                  transaction_id: e.target.value,
                })
              }
              placeholder="Enter transaction ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice-notes">Notes</Label>
            <Input
              id="invoice-notes"
              value={newInvoicePayment.notes}
              onChange={(e) =>
                setNewInvoicePayment({
                  ...newInvoicePayment,
                  notes: e.target.value,
                })
              }
              placeholder="Enter payment notes"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !newInvoicePayment.amount ||
              !newInvoicePayment.transaction_id
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Payment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
