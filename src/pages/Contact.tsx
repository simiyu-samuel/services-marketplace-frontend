import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import { motion } from "framer-motion";

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

  const contactInfo = [
    { icon: Mail, title: "Email", value: "support@themabinti.com" },
    { icon: Phone, title: "Phone", value: "+254 712 345 678" },
    { icon: MapPin, title: "Office", value: "123 Glamour Lane, Nairobi, Kenya" },
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="container pt-32 pb-16">
        <div className="text-center mb-16">
          <AnimatedWrapper>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Get in Touch
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              We'd love to hear from you. Fill out the form below or use our contact details.
            </p>
          </AnimatedWrapper>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <Card className="bg-muted/40 border-border/40 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} className="h-12 bg-background" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} className="h-12 bg-background" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="What is your message about?" {...field} className="h-12 bg-background" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message here..." rows={6} {...field} className="bg-background" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" size="lg" className="w-full group" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="bg-primary/10 text-primary p-4 rounded-xl"><item.icon className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-semibold text-xl">{item.title}</h3>
                    <p className="text-muted-foreground text-base">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted mt-6 border border-border/40 shadow-lg">
              <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/map-placeholder.svg')"}} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
