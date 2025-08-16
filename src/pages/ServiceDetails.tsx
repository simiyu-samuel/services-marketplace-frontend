import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, MessageSquare } from "lucide-react";
import NotFound from "./NotFound";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";

const fetchService = async (id: string) => {
  const { data } = await api.get(`/services/${id}`);
  return data;
};

const fetchServices = async () => {
  const { data } = await api.get('/services');
  return data.data;
};

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: service, isLoading, isError } = useQuery<Service>({
    queryKey: ['service', id],
    queryFn: () => fetchService(id!),
    enabled: !!id,
  });

  // Fetch all services to find others from the same seller
  const { data: allServices } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <ServiceCardSkeleton />
          </div>
          <div className="md:col-span-1 space-y-4">
            <ServiceCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return <NotFound />;
  }

  const otherServices = allServices?.filter(
    s => s.seller.id === service.seller.id && s.id !== service.id
  ) || [];

  const whatsappNumber = service.seller.phone_number;
  const message = `Hello, I'm interested in booking the "${service.title}" service.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{service.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-1 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-foreground">{service.rating}</span>
              <span className="ml-1">({service.review_count} reviews)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{service.location}</span>
            </div>
          </div>

          <Carousel className="w-full mb-8 rounded-lg overflow-hidden">
            <CarouselContent>
              {service.media && service.media.length > 0 ? service.media.map((m) => (
                <CarouselItem key={m.id}>
                  <div className="aspect-w-16 aspect-h-9 bg-muted">
                    <img src={m.url} alt={service.title} className="object-cover w-full h-full" />
                  </div>
                </CarouselItem>
              )) : (
                <CarouselItem>
                  <div className="aspect-w-16 aspect-h-9 bg-muted">
                    <img src="/placeholder.svg" alt="Placeholder" className="object-cover w-full h-full" />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4" />
            <CarouselNext className="absolute right-4" />
          </Carousel>

          <h2 className="text-2xl font-bold mb-4 border-b pb-2">About this service</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>{service.description}</p>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reviews</h2>
            <p className="text-muted-foreground">Reviews feature coming soon.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-primary">
                  Ksh {service.price.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Duration: {service.duration} minutes</span>
                </div>
                {service.is_mobile && <Badge>Mobile Service Available</Badge>}
                <Button size="lg" className="w-full gap-2" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-5 w-5" />
                    Book via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About the Seller</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Link to={`/sellers/${service.seller.id}`}>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={service.seller.profile_image_url} />
                    <AvatarFallback>{service.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/sellers/${service.seller.id}`} className="font-bold text-lg hover:underline">{service.seller.name}</Link>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to={`/sellers/${service.seller.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {otherServices.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More from {service.seller.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map(otherService => (
              <ServiceCard key={otherService.id} service={otherService} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;