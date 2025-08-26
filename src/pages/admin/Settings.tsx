import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showSuccess, showError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { ApiError } from "@/types"; // Assuming ApiError is defined in types
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const settingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required."),
  support_email: z.string().email("Invalid email address."),
  seller_package_price_basic: z.coerce.number().min(0),
  seller_package_price_standard: z.coerce.number().min(0),
  seller_package_price_premium: z.coerce.number().min(0),
  mpesa_consumer_key: z.string().optional(),
  mpesa_consumer_secret: z.string().optional(),
  mpesa_passkey: z.string().optional(),
  mpesa_shortcode: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const fetchSettings = async () => {
  const { data } = await api.get("/admin/settings");
  return data.settings;
};

const updateSettings = async (values: SettingsFormValues) => {
  const { data } = await api.put("/admin/settings", values);
  return data;
};

const AdminSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: fetchSettings,
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: "",
      support_email: "",
      seller_package_price_basic: 0,
      seller_package_price_standard: 0,
      seller_package_price_premium: 0,
      mpesa_consumer_key: "",
      mpesa_consumer_secret: "",
      mpesa_passkey: "",
      mpesa_shortcode: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        ...settings,
        mpesa_consumer_key: "", // Always clear sensitive fields on load
        mpesa_consumer_secret: "",
        mpesa_passkey: "",
      });
    }
  }, [settings, form]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      showSuccess(data.message);
      queryClient.setQueryData(["adminSettings"], data.settings);
    },
    onError: (error: AxiosError<ApiError>) => {
      showError(error.response?.data?.message || "Failed to update settings.");
    },
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const createStorageLinkMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/admin/create-storage-link");
      return data;
    },
    onSuccess: (data) => {
      showSuccess(data.message + " Please refresh the page to see the effect of the storage link.");
    },
    onError: (error: AxiosError<ApiError>) => {
      showError(error.response?.data?.message || "Failed to create storage link.");
    },
  });

  function onSubmit(values: SettingsFormValues) {
    if (form.formState.isDirty) {
      const allValues = form.getValues();
      mutation.mutate(allValues);
    }
  }

  const handleCreateStorageLink = () => {
    setShowConfirmDialog(true);
  };

  const confirmCreateStorageLink = () => {
    createStorageLinkMutation.mutate();
    setShowConfirmDialog(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading settings.</div>;
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
            <FormField control={form.control} name="seller_package_price_basic" render={({ field }) => (
              <FormItem><FormLabel>Basic Package (Ksh)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="seller_package_price_standard" render={({ field }) => (
              <FormItem><FormLabel>Standard Package (Ksh)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="seller_package_price_premium" render={({ field }) => (
              <FormItem><FormLabel>Premium Package (Ksh)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway (M-Pesa)</CardTitle>
            <CardDescription>Manage M-Pesa API credentials. Leave blank to keep existing values.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="mpesa_consumer_key" render={({ field }) => (
              <FormItem><FormLabel>Consumer Key</FormLabel><FormControl><Input type="password" placeholder="••••••••••••••••" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mpesa_consumer_secret" render={({ field }) => (
              <FormItem><FormLabel>Consumer Secret</FormLabel><FormControl><Input type="password" placeholder="••••••••••••••••" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mpesa_passkey" render={({ field }) => (
              <FormItem><FormLabel>Passkey</FormLabel><FormControl><Input type="password" placeholder="••••••••••••••••" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mpesa_shortcode" render={({ field }) => (
              <FormItem><FormLabel>Shortcode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Link</CardTitle>
            <CardDescription>Create or recreate the symbolic link for media files.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              type="button" 
              onClick={handleCreateStorageLink} 
              disabled={createStorageLinkMutation.isPending}
            >
              {createStorageLinkMutation.isPending ? "Creating Link..." : "Create Storage Link"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will create a symbolic link essential for media files to be visible. 
              Ensure your web server user has the necessary permissions to create symlinks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCreateStorageLink}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
};

export default AdminSettings;
