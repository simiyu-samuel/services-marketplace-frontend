import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/hooks/use-payment";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  phone_number: z.string().regex(/^2547\d{8}$/, "Phone number must be in the format 2547XXXXXXXX."),
});

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  paymentType: 'seller_registration' | 'package_upgrade' | 'service_payment';
  packageType?: 'basic' | 'standard' | 'premium';
  onPaymentSuccess?: () => void;
  initialPhoneNumber: string; // Added initialPhoneNumber
}

const PaymentDialog = ({ isOpen, onOpenChange, amount, paymentType, packageType, onPaymentSuccess, initialPhoneNumber }: PaymentDialogProps) => {
  const { status, error, initiatePayment } = usePayment(); // Destructure error here

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone_number: initialPhoneNumber || "2547" },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    initiatePayment({
      amount,
      phone_number: values.phone_number,
      payment_type: paymentType,
      package_type: packageType,
    });
  };

  // Call onPaymentSuccess when status is completed
  if (status === 'completed') {
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    // Close the dialog after a successful payment
    onOpenChange(false);
  }

  const isLoading = status === 'initiating' || status === 'polling';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            You are about to pay <span className="font-bold">Ksh {amount.toLocaleString()}</span> for {paymentType.replace('_', ' ')}.
          </DialogDescription>
        </DialogHeader>
        {status === 'polling' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold">Processing Payment...</p>
            <p className="text-sm text-muted-foreground text-center">Please check your phone to enter your M-Pesa PIN.</p>
          </div>
        ) : status === 'timed_out' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="font-semibold text-yellow-500">Payment Timed Out</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Payment is taking longer than expected. Please check your M-Pesa for a confirmation message. You can also check your payment history for updates.
            </p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">Close</Button>
          </div>
        ) : status === 'failed' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="font-semibold text-red-500">Payment Failed</p>
            <p className="text-sm text-muted-foreground text-center mt-2">{error || 'An error occurred during payment.'}</p> {/* Use the error state here */}
            <Button onClick={() => onOpenChange(false)} className="mt-4">Close</Button>
          </div>
        ) : status === 'cancelled' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="font-semibold text-blue-500">Payment Cancelled</p>
            <p className="text-sm text-muted-foreground text-center mt-2">Your payment was cancelled. Please try again or contact support.</p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">Close</Button>
          </div>
        ) : status === 'completed' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="font-semibold text-green-500">Payment Successful!</p>
            <p className="text-sm text-muted-foreground text-center mt-2">Your payment has been processed successfully.</p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">Close</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>M-Pesa Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="2547XXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : `Pay Ksh ${amount.toLocaleString()}`}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
