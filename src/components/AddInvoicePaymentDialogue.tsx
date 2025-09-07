import { useState, useEffect, useRef } from "react";
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
import { Loader2, Upload, FileText } from "lucide-react";

interface AddInvoicePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (payment: {
    amount: string;
    transaction_id: string;
    notes: string;
    payment_file: File | null;
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
    payment_file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    await onAddPayment(newInvoicePayment);
    setNewInvoicePayment({
      amount: "",
      transaction_id: "",
      notes: "",
      payment_file: null,
    });
  };

  const handleClose = () => {
    setNewInvoicePayment({
      amount: "",
      transaction_id: "",
      notes: "",
      payment_file: null,
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewInvoicePayment({
      ...newInvoicePayment,
      payment_file: file,
    });
  };

  const removeFile = () => {
    setNewInvoicePayment({
      ...newInvoicePayment,
      payment_file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setNewInvoicePayment({
        amount: "",
        transaction_id: "",
        notes: "",
        payment_file: null,
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
            <Label htmlFor="invoice-amount">Amount *</Label>
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice-transaction-id">Transaction ID *</Label>
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
              required
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
          <div className="space-y-2">
            <Label htmlFor="invoice-payment-file">Payment Receipt</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="invoice-payment-file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {newInvoicePayment.payment_file && (
                <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[200px]">
                      {newInvoicePayment.payment_file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
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
