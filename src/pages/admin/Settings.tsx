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
import { motion } from "framer-motion";
import { Settings, AlertCircle, Globe, DollarSign, CreditCard, Link as LinkIcon, Save, RefreshCw } from "lucide-react";
import ModernPageHeader from "@/components/dashboard/ModernPageHeader";

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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-8">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-destructive/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Error loading settings</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ModernPageHeader 
          title="Admin Settings" 
          description="Configure platform settings and system preferences"
          icon={Settings}
          badge={{
            text: "System Configuration",
            variant: "secondary"
          }}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* General Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">General Settings</CardTitle>
                      <CardDescription>Manage basic site information and configuration</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="site_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Site Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1.5" placeholder="Enter your site name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="support_email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Support Email</FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1.5" placeholder="support@example.com" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Seller Package Prices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Seller Package Prices</CardTitle>
                      <CardDescription>Set the registration price for each seller tier</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="seller_package_price_basic" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Basic Package (Ksh)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="mt-1.5" placeholder="0" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seller_package_price_standard" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Standard Package (Ksh)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="mt-1.5" placeholder="0" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seller_package_price_premium" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Premium Package (Ksh)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="mt-1.5" placeholder="0" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Gateway */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Payment Gateway (M-Pesa)</CardTitle>
                      <CardDescription>Manage M-Pesa API credentials. Leave blank to keep existing values</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="mpesa_consumer_key" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Consumer Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••••••••••" {...field} className="mt-1.5" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="mpesa_consumer_secret" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Consumer Secret</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••••••••••" {...field} className="mt-1.5" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="mpesa_passkey" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Passkey</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••••••••••" {...field} className="mt-1.5" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="mpesa_shortcode" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Shortcode</FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1.5" placeholder="Enter shortcode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Storage Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-500/10 p-2 rounded-lg">
                      <LinkIcon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Storage Link</CardTitle>
                      <CardDescription>Create or recreate the symbolic link for media files</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">
                        This will create a symbolic link essential for media files to be visible on the platform.
                        Ensure your web server user has the necessary permissions to create symlinks.
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleCreateStorageLink} 
                      disabled={createStorageLinkMutation.isPending}
                      className="gap-2"
                      variant="outline"
                    >
                      {createStorageLinkMutation.isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating Link...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-4 w-4" />
                          Create Storage Link
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex justify-end pt-4"
            >
              <Button 
                type="submit" 
                disabled={mutation.isPending || !form.formState.isDirty}
                className="gap-2 px-8"
                size="lg"
              >
                {mutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </motion.div>
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
      </div>
    </div>
  );
};

export default AdminSettings;
