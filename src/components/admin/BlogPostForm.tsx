import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BlogPost } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  featured_image_url: z.string().url({ message: "Please enter a valid URL." }),
  status: z.enum(["draft", "published"]),
});

export type BlogPostFormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  onSubmit: (values: BlogPostFormValues) => void;
  initialData?: Partial<BlogPost>;
  isLoading: boolean;
  submitButtonText?: string;
}

const BlogPostForm = ({ onSubmit, initialData, isLoading, submitButtonText = "Save Post" }: BlogPostFormProps) => {
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      featured_image_url: initialData?.featured_image_url || "",
      status: initialData?.status || "draft",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{initialData?.title ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
            <CardDescription>Fill in the details for the blog post below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Post title" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="excerpt" render={({ field }) => (
              <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea placeholder="A short summary of the post" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem><FormLabel>Content (HTML supported)</FormLabel><FormControl><Textarea placeholder="The full content of the blog post..." rows={10} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Skincare" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="featured_image_url" render={({ field }) => (
                <FormItem><FormLabel>Featured Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select><FormMessage /></FormItem>
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

export default BlogPostForm;