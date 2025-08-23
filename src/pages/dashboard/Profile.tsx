import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { showSuccess, showError } from "@/utils/toast";
import api from "@/lib/api";
import { ChangePasswordPayload } from "@/types"; // Import ChangePasswordPayload
import { isAxiosError } from "axios"; // Import isAxiosError

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
  location: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, { message: "Current password is required." }),
  password: z.string().min(8, { message: "New password must be at least 8 characters." }),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match.",
  path: ["password_confirmation"],
});

const Profile = () => {
  const { user, updateUserProfile, changePassword } = useAuth(); // Destructure changePassword
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone_number: user?.phone_number || "",
      location: user?.location || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone_number: user.phone_number,
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      await updateUserProfile(values);
      showSuccess("Profile updated successfully!");
    } catch (error: unknown) { // Changed to unknown
       if (isAxiosError(error) && error.response?.status === 422) { // Type guard for AxiosError
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          form.setError(field as keyof z.infer<typeof profileSchema>, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      } else {
        showError("Failed to update profile. Please try again.");
      }
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      await changePassword(values as ChangePasswordPayload);
      showSuccess("Password updated successfully!");
      passwordForm.reset(); // Clear form on success
    } catch (error: unknown) { // Changed to unknown
      if (isAxiosError(error) && error.response?.status === 422) { // Type guard for AxiosError
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          passwordForm.setError(field as keyof z.infer<typeof passwordSchema>, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      } else if (isAxiosError(error) && error.response?.status === 400) { // Type guard for AxiosError
        showError(error.response.data.message || "Failed to change password. Please check your current password.");
      } else {
        showError("Failed to change password. Please try again.");
      }
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);
    setIsUploading(true);

    try {
      const response = await api.post('/user/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await updateUserProfile({ profile_image: response.data.profile_image_url });
      showSuccess("Profile image updated!");
    } catch (error: unknown) { // Changed to unknown
      showError("Failed to upload image. Please ensure it's a valid image file.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 py-6 sm:py-8 lg:py-10"> {/* Added responsive padding */}
      <Card className="bg-card border-border shadow-md"> {/* Enhanced card styling */}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Profile Picture</CardTitle> {/* Enhanced title */}
          <CardDescription className="text-muted-foreground">Update your avatar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6"> {/* Responsive layout */}
          <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-sm"> {/* Larger avatar with border */}
            <AvatarImage src={user.profile_image || undefined} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback> {/* Larger fallback text */}
          </Avatar>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" // Enhanced button styling
          >
            {isUploading ? "Uploading..." : "Upload New Picture"}
          </Button>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> {/* Added space-y-8 for consistency */}
          <Card className="bg-card border-border shadow-md"> {/* Enhanced card styling */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Personal Information</CardTitle> {/* Enhanced title */}
              <CardDescription className="text-muted-foreground">Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Responsive grid layout */}
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl><Input value={user.email} disabled className="bg-muted/30" /></FormControl> {/* Styled disabled input */}
                <p className="text-sm text-muted-foreground">Email address cannot be changed.</p>
              </FormItem>
              <FormField control={form.control} name="phone_number" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="0712345678" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Kilimani, Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel>Bio</FormLabel><FormControl><Textarea placeholder="Tell us a little about yourself or your business" {...field} rows={4} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
            <CardFooter className="border-t border-border/50 px-6 py-4"> {/* Enhanced footer styling */}
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground"> {/* Enhanced button styling */}
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8"> {/* Added space-y-8 for consistency */}
          <Card className="bg-card border-border shadow-md"> {/* Enhanced card styling */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Change Password</CardTitle> {/* Enhanced title */}
              <CardDescription className="text-muted-foreground">Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Responsive grid layout */}
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
            <CardFooter className="border-t border-border/50 px-6 py-4"> {/* Enhanced footer styling */}
              <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground"> {/* Enhanced button styling */}
                {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
