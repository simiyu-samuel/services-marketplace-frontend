import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Service } from "@/types";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(5000),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().max(255).optional(),
  price: z.coerce.number().min(0, "Price must be positive").max(1000000),
  duration: z.coerce.number().int().min(5, "Duration must be at least 5 minutes").max(1440, "Duration cannot exceed 24 hours"),
  location: z.string().min(1, "Location is required").max(255),
  is_mobile: z.boolean().default(false),
  media_files: z.instanceof(FileList).optional(),
});

export type ServiceFormValues = z.infer<typeof formSchema>;

const categories = [
  "Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", 
  "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub",
  "Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", 
  "Complete Hair Care", "African Wear", "Maasai Wear", "Crotchet/Wear"
];

interface ServiceFormProps {
  onSubmit: (values: ServiceFormValues) => void;
  initialData?: Service;
  isLoading: boolean;
  submitButtonText?: string;
}

const ServiceForm = ({ onSubmit, initialData, isLoading, submitButtonText = "Save Service" }: ServiceFormProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      price: initialData ? parseFloat(initialData.price) : 0,
      duration: initialData?.duration || 30,
      location: initialData?.location || "",
      is_mobile: initialData?.is_mobile || false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (files: FileList | null) => void) => {
    const files = e.target.files;
    fieldChange(files);
    if (files) {
        const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    } else {
        setPreviews([]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? "Edit Service" : "Create a New Service"}</CardTitle>
            <CardDescription>Fill in the details below to list your service on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem className="md:col-span-2"><FormLabel>Service Title</FormLabel><FormControl><Input placeholder="e.g., Gel Manicure with Nail Art" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe your service in detail..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="subcategory" render={({ field }) => (
              <FormItem><FormLabel>Subcategory (Optional)</FormLabel><FormControl><Input placeholder="e.g., Nails, Skin Care" {...field} /></FormControl><FormMessage /></FormMessage>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem><FormLabel>Price (Ksh)</FormLabel><FormControl><Input type="number" placeholder="1500" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="duration" render={({ field }) => (
              <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" placeholder="60" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem className="md:col-span-2"><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Westlands, Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            {!initialData && (
              <FormField control={form.control} name="media_files" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Service Media (Images/Videos)</FormLabel>
                  <FormControl>
                    <Input type="file" multiple accept="image/*,video/*" onChange={(e) => handleFileChange(e, field.onChange)} />
                  </FormControl>
                  <FormMessage />
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                      {previews.map((src, index) => (
                        <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                      ))}
                    </div>
                  )}
                </FormItem>
              )} />
            )}
            <FormField control={form.control} name="is_mobile" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2"><div className="space-y-0.5"><FormLabel>Mobile Service</FormLabel><p className="text-sm text-muted-foreground">Do you offer this service at the client's location?</p></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
            )} />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : submitButtonText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ServiceForm;