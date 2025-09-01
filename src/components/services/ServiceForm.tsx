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
  min_price: z.coerce.number().min(0, "Min price must be positive").max(1000000),
  max_price: z.coerce.number().min(0, "Max price must be positive").max(1000000).optional().nullable(),
  duration: z.coerce.number().int().min(5, "Duration must be at least 5 minutes").max(1440, "Duration cannot exceed 24 hours"),
  county: z.string().min(1, "County is required"),
  specific_location: z.string().min(1, "Specific location is required").max(200),
  is_mobile: z.boolean().default(false),
  media_files: z.instanceof(FileList).optional(),
}).refine((data) => {
  if (data.max_price !== null && data.max_price !== undefined && data.max_price <= data.min_price) {
    return false;
  }
  return true;
}, {
  message: "Max price must be greater than min price",
  path: ["max_price"],
});

export type ServiceFormValues = z.infer<typeof formSchema>;

// Main categories and their subcategories
const categorySubcategoryMap = {
  "Beauty Services": ["Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub"],
  "Hair Services": ["Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", "Complete Hair Care"],
  "Fashion Services": ["African Wear", "Maasai Wear", "Crotchet/Weaving", "Personal Stylist", "Made in Kenya"],
  "Photography": ["Event", "Lifestyle", "Portrait"],
  "Bridal Services": ["Bridal Makeup", "Bridal Hair", "Bridesmaids for Hire", "Gowns for Hire", "Wedding Cakes"],
  "Health Services": ["Dental", "Skin Consultation", "Reproductive Care", "Maternal Care", "Mental Care"],
  "Celebrate Her": ["Florist", "Decor", "Journey to Motherhood"],
  "Fitness Services": ["Gym", "Personal Trainers", "Nutritionist"],
  "Home & Lifestyles": ["Cleaning Services", "Laundry Services", "Home & Home Decor"],
};

// Extract main categories
const mainCategories = Object.keys(categorySubcategoryMap);

// All 47 Counties in Kenya
const counties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

interface ServiceFormProps {
  onSubmit: (values: ServiceFormValues) => void;
  initialData?: Service;
  isLoading: boolean;
  submitButtonText?: string;
  photosPerService?: number;
  videosPerService?: number;
}

const ServiceForm = ({ onSubmit, initialData, isLoading, submitButtonText = "Save Service", photosPerService, videosPerService }: ServiceFormProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category || "");
  
  // Helper function to parse existing location into county and specific location
  const parseLocation = (location?: string) => {
    if (!location) return { county: "", specific_location: "" };
    const parts = location.split(", ");
    if (parts.length === 2) {
      return { county: parts[0].trim(), specific_location: parts[1].trim() };
    }
    // If it doesn't match the expected format, try to match county from the list
    const foundCounty = counties.find(county => location.toLowerCase().includes(county.toLowerCase()));
    if (foundCounty) {
      const specific = location.replace(foundCounty, "").replace(/,\s*/, "").trim();
      return { county: foundCounty, specific_location: specific || "CBD" };
    }
    return { county: "", specific_location: location };
  };
  
  const { county: initialCounty, specific_location: initialSpecificLocation } = parseLocation(initialData?.location);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      min_price: initialData?.min_price || 0,
      max_price: initialData?.max_price || null,
      duration: initialData?.duration || 30,
      county: initialCounty,
      specific_location: initialSpecificLocation,
      is_mobile: initialData?.is_mobile || false,
    },
  });

  // Get available subcategories based on selected category
  const availableSubcategories = selectedCategory 
    ? (categorySubcategoryMap as any)[selectedCategory] || []
    : [];

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue('category', value);
    // Clear subcategory when category changes - use undefined to avoid empty string
    form.setValue('subcategory', undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (files: FileList | null) => void, photosPerService?: number, videosPerService?: number) => {
    const files = e.target.files;
    if (files) {
      const numPhotos = Array.from(files).filter(file => file.type.startsWith('image')).length;
      const numVideos = Array.from(files).filter(file => file.type.startsWith('video')).length;

      if (photosPerService !== undefined && numPhotos > photosPerService) {
        alert(`You can only upload a maximum of ${photosPerService} images.`);
        fieldChange(null);
        setPreviews([]);
        setImagePreviews([]);
        return;
      }

      if (videosPerService !== undefined && numVideos > videosPerService) {
        alert(`You can only upload a maximum of ${videosPerService} videos.`);
        fieldChange(null);
        setPreviews([]);
        setVideoPreviews([]);
        return;
      }

      const newImagePreviews = Array.from(files).filter(file => file.type.startsWith('image/')).map(file => URL.createObjectURL(file));
      const newVideoPreviews = Array.from(files).filter(file => file.type.startsWith('video/')).map(file => URL.createObjectURL(file));
      setImagePreviews(newImagePreviews);
      setVideoPreviews(newVideoPreviews);
      const newPreviews = [...newImagePreviews, ...newVideoPreviews];
      setPreviews(newPreviews);
      fieldChange(files);
    } else {
      fieldChange(null);
      setPreviews([]);
      setImagePreviews([]);
      setVideoPreviews([]);
    }
  };

  return (
<Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
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
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={handleCategoryChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mainCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="subcategory" render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCategory ? "Select a subcategory" : "Select category first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSubcategories.map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="min_price" render={({ field }) => (
              <FormItem><FormLabel>Min Price (KES)</FormLabel><FormControl><Input type="number" placeholder="1500" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="max_price" render={({ field }) => (
              <FormItem><FormLabel>Max Price (Optional)</FormLabel><FormControl><Input type="number" placeholder="3000" {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} /></FormControl><FormMessage /><p className="text-sm text-muted-foreground">Leave empty if you have a fixed price</p></FormItem>
            )} />
            <FormField control={form.control} name="duration" render={({ field }) => (
              <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" placeholder="60" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="county" render={({ field }) => (
              <FormItem>
                <FormLabel>County</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="specific_location" render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CBD, Town Center, Mall Name..." {...field} />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground">Enter the specific area, neighborhood, or landmark</p>
              </FormItem>
            )} />
            {!initialData && (
              <FormField control={form.control} name="media_files" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Service Media (Images/Videos)</FormLabel>
                  {photosPerService !== undefined && videosPerService !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      Upload up to {photosPerService} images and {videosPerService} videos.
                    </p>
                  )}
                  <FormControl>
                    <Input type="file" multiple accept="image/*,video/*" onChange={(e) => handleFileChange(e, field.onChange, photosPerService, videosPerService)} />
                  </FormControl>
                  <FormMessage />
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                      {imagePreviews.map((src, index) => (
                        <img key={index} src={src} alt={`Image Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                      ))}
                    </div>
                  )}
                  {videoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                      {videoPreviews.map((src, index) => (
                        <video key={index} src={src} className="w-full h-24 object-cover rounded-md" controls />
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
