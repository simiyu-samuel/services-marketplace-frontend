import { Search, Calendar, Smile } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Services",
    description: "Browse through hundreds of services from top-rated professionals near you.",
  },
  {
    icon: Calendar,
    title: "Book & Connect",
    description: "Choose a time that works for you and connect directly with the seller via WhatsApp.",
  },
  {
    icon: Smile,
    title: "Enjoy & Relax",
    description: "Sit back and enjoy your premium service experience. It's that simple!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/40 dark:bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-2">
            Getting your next beauty or wellness treatment is as easy as 1, 2, 3.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;