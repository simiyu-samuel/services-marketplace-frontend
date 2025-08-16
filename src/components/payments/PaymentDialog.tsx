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
}

const PaymentDialog = ({ isOpen, onOpenChange, amount, paymentType, packageType, onPaymentSuccess }: PaymentDialogProps) => {
  const { user } = useAuth();
  const { status, initiatePayment } = usePayment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone_number: user?.phone_number || "2547" },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    initiatePayment({
      amount,
      phone_number: values.phone_number,
      payment_type: paymentType,
      package_type: packageType,
    });
  };

  if (status === 'completed' && onPaymentSuccess) {
    onPaymentSuccess();
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