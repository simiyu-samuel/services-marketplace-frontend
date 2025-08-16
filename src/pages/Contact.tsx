import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form submitted:", values);
      showSuccess("Your message has been sent successfully!");
      form.reset();
    } catch (error) {
      showError("Failed to send message. Please try again later.");
    }
  }

  return (
    <div className="bg-muted">
      <div className="container py-16">
        <div className="text-center mb-12">
          <AnimatedWrapper>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Get in Touch</h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-2">
              We'd love to hear from you. Fill out the form below or use our contact details.
            </p>
          </AnimatedWrapper>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <AnimatedWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="What is your message about?" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message here..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </AnimatedWrapper>
          <AnimatedWrapper delay={0.2}>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-muted-foreground mt-2">
                  You can also reach us through the following channels. We're available during business hours to assist you.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-4 rounded-full"><Mail className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-muted-foreground">support@themabinti.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-4 rounded-full"><Phone className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-muted-foreground">+254 712 345 678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-4 rounded-full"><MapPin className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-semibold text-lg">Office</h3>
                    <p className="text-muted-foreground">123 Glamour Lane, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted mt-6 border">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-cover bg-center" style={{backgroundImage: "url('/map-placeholder.svg')"}}>
                  {/* Static map image placeholder */}
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
};

export default Contact;