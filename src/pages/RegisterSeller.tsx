import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/utils/toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePackagePrices } from "@/hooks/usePackagePrices";
import PaymentDialog from "@/components/payments/PaymentDialog";
import { RegisterPayload } from "@/types";
import { AxiosError } from "axios";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  password_confirmation: z.string(),
  seller_package: z.enum(["basic", "standard", "premium"], { required_error: "You need to select a package." }),
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords do not match.",
  path: ["password_confirmation"],
});

const packageDetails = {
  basic: { name: "Basic", price: 1000.00 },
  standard: { name: "Standard", price: 1500.00 },
  premium: { name: "Premium", price: 2500.00 },
};

const RegisterSeller = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
    const { data: packagePrices, isLoading: pricesLoading, isError } = usePackagePrices();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    open: boolean;
    amount: number;
    packageType: 'basic' | 'standard' | 'premium';
    email: string;
    userId: number; // Added userId
    phoneNumber: string; // Added phoneNumber
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone_number: "", password: "", password_confirmation: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await register({ ...values, user_type: 'seller' } as RegisterPayload);
      const { user, needs_seller_payment } = response;

      if (needs_seller_payment) {
        const { seller_package, email } = values;
        // Store selected package and price in local storage
        localStorage.setItem('selectedPackage', JSON.stringify({
          name: seller_package,
          price: packagePrices[seller_package as keyof typeof packagePrices],
        }));
        showSuccess("Account created! Please complete the payment to proceed.");
        navigate("/seller-onboarding/payment"); // Redirect to the dedicated payment page
      } else {
        showSuccess("Registration successful!");
        navigate("/dashboard"); // Redirect to dashboard if no payment needed (e.g., if user_type was customer)
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          form.setError(field as keyof z.infer<typeof formSchema>, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      } else {
        const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        showError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // The handlePaymentSuccess is no longer directly used here as the payment dialog
  // is now handled by the SellerOnboardingPayment page.
  // The redirect to dashboard after successful payment will be handled by the
  // useEffect in SellerOnboardingPayment.tsx which observes user.user_type.

  return (
    <>
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md bg-background shadow-xl border">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">Create a Seller Account</CardTitle>
            <CardDescription className="text-center">Grow your business with us.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Business/Full Name</FormLabel><FormControl><Input placeholder="Glamour Studios" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Business Email</FormLabel><FormControl><Input placeholder="contact@glamour.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone_number" render={({ field }) => (
                  <FormItem><FormLabel>Business Phone</FormLabel><FormControl><Input placeholder="0712345678" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password_confirmation" render={({ field }) => (
                  <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="seller_package" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose your starting package</FormLabel>
                    <FormControl>
                      {pricesLoading ? (
                        <p>Loading package prices...</p>
                      ) : isError ? (
                        <p>Error loading package prices.</p>
                      ) : packagePrices ? (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="basic" /></FormControl>
                            <FormLabel className="font-normal">Basic (Ksh {packagePrices.basic.toLocaleString()})</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="standard" /></FormControl>
                            <FormLabel className="font-normal">Standard (Ksh {packagePrices.standard.toLocaleString()})</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="premium" /></FormControl>
                            <FormLabel className="font-normal">Premium (Ksh {packagePrices.premium.toLocaleString()})</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      ) : null}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {pricesLoading ? (
                  <p>Loading package prices...</p>
                ) : isError ? (
                  <p>Error loading package prices.</p>
                ) : packagePrices ? (
                  <Button type="submit" className="w-full" disabled={pricesLoading}>
                    {isLoading ? "Creating Account..." : "Create Account & Proceed"}
                  </Button>
                ) : null}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {/* PaymentDialog is no longer directly rendered here, it's on SellerOnboardingPayment page */}
    </>
  );
};

export default RegisterSeller;
