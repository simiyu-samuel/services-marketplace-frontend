import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";

const passwordSchema = z.object({
  current_password: z.string().min(1, { message: "Current password is required." }),
  new_password: z.string().min(8, { message: "New password must be at least 8 characters." }),
  confirm_password: z.string(),
}).refine(data => data.new_password === data.confirm_password, {
  message: "New passwords do not match.",
  path: ["confirm_password"],
});

const Settings = () => {
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    console.log("Password change submitted:", values);
    showSuccess("Password updated successfully!");
    passwordForm.reset();
  }

  return (
    <div className="space-y-6">
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
              <FormField control={passwordForm.control} name="confirm_password" render={({ field }) => (
                <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>Update Password</Button>
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
  );
};

export default Settings;