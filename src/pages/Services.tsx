import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import { mockServices } from "@/data/mock";

const Services = () => {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Find Your Next Experience</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-2">
          Browse through our curated list of premium beauty, health, and lifestyle services.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <ServiceFilters />
          </div>
        </aside>
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          {/* Pagination will go here */}
        </main>
      </div>
    </div>
  );
};

export default Services;