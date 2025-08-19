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
import { packageConfigs } from "@/config/packageConfig"; // Import from shared config
import { ChangePasswordPayload, UserPackageInfo, ApiError } from "@/types"; // Import necessary types
import { AxiosError } from "axios"; // Import AxiosError

const passwordSchema = z.object({
  current_password: z.string().min(1, { message: "Current password is required." }),
  password: z.string().min(8, { message: "New password must be at least 8 characters." }),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "New passwords do not match.",
  path: ["password_confirmation"],
});

const Settings = () => {
  const { user, changePassword } = useAuth();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const passwordForm = useForm<ChangePasswordPayload>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  async function onPasswordSubmit(values: ChangePasswordPayload) {
    try {
      await changePassword(values);
      showSuccess("Password updated successfully!");
      passwordForm.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.status === 422) {
        const apiErrors = axiosError.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          passwordForm.setError(field as keyof ChangePasswordPayload, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      } else {
        showError(axiosError.response?.data?.message || axiosError.message || "Failed to update password.");
      }
    }
  }

  const currentPackageName = user?.seller_package || 'basic';
  const currentPackage = packageConfigs.seller_packages[currentPackageName as keyof typeof packageConfigs.seller_packages];
  
  const packageOrder: Array<'basic' | 'standard' | 'premium'> = ['basic', 'standard', 'premium'];
  const currentPackageIndex = packageOrder.indexOf(currentPackageName);
  const nextPackageName = currentPackageIndex < 2 ? packageOrder[currentPackageIndex + 1] : null;
  const nextPackage = nextPackageName ? packageConfigs.seller_packages[nextPackageName as keyof typeof packageConfigs.seller_packages] : null;

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
              {user?.package_expiry_date && (
                <p className="text-sm text-muted-foreground">Expires on: {new Date(user.package_expiry_date).toLocaleDateString()}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/dashboard/seller/package-upgrade">Upgrade or Renew Package</a>
              </Button>
            </CardFooter>
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
                <FormField control={passwordForm.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={passwordForm.control} name="password_confirmation" render={({ field }) => (
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
          initialPhoneNumber={user?.phone_number || ''}
          onPaymentSuccess={() => {
            setIsPaymentDialogOpen(false);
            // Optionally re-fetch user data or invalidate queries to update package info immediately
          }}
        />
      )}
    </>
  );
};

export default Settings;
