import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { showError } from "@/utils/toast";

const settingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required."),
  support_email: z.string().email("Invalid email address."),
  package_basic_price: z.coerce.number().min(0),
  package_standard_price: z.coerce.number().min(0),
  package_premium_price: z.coerce.number().min(0),
  mpesa_consumer_key: z.string().optional(),
  mpesa_consumer_secret: z.string().optional(),
  maintenance_mode: z.boolean().default(false),
});

const AdminSettings = () => {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    // Mock default values as there's no API to fetch them from
    defaultValues: {
      site_name: "Themabinti",
      support_email: "support@themabinti.com",
      package_basic_price: 1000,
      package_standard_price: 1500,
      package_premium_price: 2500,
      mpesa_consumer_key: "",
      mpesa_consumer_secret: "",
      maintenance_mode: false,
    },
  });

  // Since there's no API endpoint, the submit handler will be a placeholder.
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values);
    showError("Saving admin settings is not yet implemented in the API.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage basic site information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="site_name" render={({ field }) => (
              <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="support_email" render={({ field }) => (
              <FormItem><FormLabel>Support Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Package Prices</CardTitle>
            <CardDescription>Set the registration price for each seller tier.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="package_basic_price" render={({ field }) => (
              <FormItem><FormLabel>Basic Package (Ksh)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="package_standard_price" render={({ field }) => (
              <FormItem><FormLabel>Standard Package (Ksh)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="package_premium_price" render={({ field }) => (
              <FormItem><FormLabel>Premium Package (Ksh)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway</CardTitle>
            <CardDescription>Manage M-Pesa API credentials. Leave blank to keep existing values.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="mpesa_consumer_key" render={({ field }) => (
              <FormItem><FormLabel>Consumer Key</FormLabel><FormControl><Input type="password" placeholder="••••••••••••••••" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mpesa_consumer_secret" render={({ field }) => (
              <FormItem><FormLabel>Consumer Secret</FormLabel><FormControl><Input type="password" placeholder="••••••••••••••••" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="maintenance_mode" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Maintenance Mode</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to take the site offline for visitors. Admins will still have access.
                  </p>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminSettings;