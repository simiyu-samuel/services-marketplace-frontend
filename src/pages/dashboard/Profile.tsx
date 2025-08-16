import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
});

const Profile = () => {
  const { user, updateUser } = useAuth();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone_number: user?.phone_number || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone_number: user.phone_number,
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      // Mock API call
      console.log("Updating profile with:", values);
      // await api.put('/user/profile', values);

      // Update user in context to reflect changes immediately
      updateUser(values);
      showSuccess("Profile updated successfully!");
    } catch (error) {
      showError("Failed to update profile. Please try again.");
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your avatar.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profile_image_url} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button onClick={() => showError("Feature coming soon!")}>Upload New Picture</Button>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl><Input value={user.email} disabled /></FormControl>
                <p className="text-sm text-muted-foreground">Email address cannot be changed.</p>
              </FormItem>
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input placeholder="0712345678" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Profile;