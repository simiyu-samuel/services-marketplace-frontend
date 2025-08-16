import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import PaymentDialog from "@/components/payments/PaymentDialog";

const passwordSchema = z.object({
  current_password: z.string().min(1, { message: "Current password is required." }),
  new_password: z.string().min(8, { message: "New password must be at least 8 characters." }),
  new_password_confirmation: z.string(),
}).refine(data => data.new_password === data.new_password_confirmation, {
  message: "New passwords do not match.",
  path: ["new_password_confirmation"],
});

const packageDetails = {
  basic: { name: "Basic", price: 1000.00 },
  standard: { name: "Standard", price: 1500.00 },
  premium: { name: "Premium", price: 2500.00 },
};

const Settings = () => {
  const { user, changePassword } = useAuth();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", new_password_confirmation: "" },
  });

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      await changePassword(values);
      showSuccess("Password updated successfully!");
      passwordForm.reset();
    } catch (error: any) {
      if (error.response?.status === 422) {
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          passwordForm.setError(field as keyof z.infer<typeof passwordSchema>, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      } else {
        showError(error.response?.data?.message || "Failed to update password.");
      }
    }
  }

  const currentPackageName = user?.seller_package || 'basic';
  const currentPackage = packageDetails[currentPackageName];
  
  const packageOrder: Array<'basic' | 'standard' | 'premium'> = ['basic', 'standard', 'premium'];
  const currentPackageIndex = packageOrder.indexOf(currentPackageName);
  const nextPackageName = currentPackageIndex < 2 ? packageOrder[currentPackageIndex + 1] : null;
  const nextPackage = nextPackageName ? packageDetails[nextPackageName] : null;

  const upgradePrice = nextPackage ? nextPackage.price : 0;

  return (
    <>
      <div className="space-y-6">
        {user?.user_type === 'seller' && (
          <Card>
            <CardHeader>
              <CardTitle>My Subscription</CardTitle>
              <CardDescription>Manage your seller package.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You are currently on the <span className="font-bold text-primary capitalize">{currentPackage?.name}</span> package.</p>
            </CardContent>
            {currentPackageName !== 'premium' && nextPackage && (
              <CardFooter>
                <Button onClick={() => setIsPaymentDialogOpen(true)}>
                  Upgrade to {nextPackage.name} (Ksh {upgradePrice.toLocaleString()})
                </Button>
              </CardFooter>
            )}
          </Card>
        )}

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={passwordForm.control} name="current_password" render={({ field }) => (
                  <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={passwordForm.control} name="new_password" render={({ field }) => (
                  <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={passwordForm.control} name="new_password_confirmation" render={({ field }) => (
                  <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about bookings and promotions.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Get reminders for your upcoming appointments.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="font-medium">Delete your account</p>
            <Button variant="destructive" onClick={() => showError("Feature coming soon!")}>Delete Account</Button>
          </CardContent>
        </Card>
      </div>
      {user?.user_type === 'seller' && nextPackage && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          amount={upgradePrice}
          paymentType="package_upgrade"
          packageType={nextPackage.name as 'standard' | 'premium'}
          onPaymentSuccess={() => setIsPaymentDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Settings;