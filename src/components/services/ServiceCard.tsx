import { Service } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const rating = service.rating ?? 0;
  const reviewCount = service.review_count ?? 0;

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 group border">
      <div className="relative">
        <Badge className="absolute top-2 left-2 z-10">{service.category}</Badge>
        <Carousel className="w-full">
          <CarouselContent>
            {service.media_files.length > 0 ? service.media_files.map((mediaUrl, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video bg-muted">
                  {mediaUrl.endsWith('.mp4') ? (
                    <video src={mediaUrl} className="object-cover w-full h-full" controls />
                  ) : (
                    <img src={mediaUrl} alt={service.title} className="object-cover w-full h-full" />
                  )}
                </div>
              </CarouselItem>
            )) : (
              <CarouselItem>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img src="/placeholder.svg" alt="Placeholder" className="w-1/2 h-1/2 opacity-50" />
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {service.media_files.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 transition-opacity opacity-0 group-hover:opacity-100" />
              <CarouselNext className="absolute right-2 transition-opacity opacity-0 group-hover:opacity-100" />
            </>
          )}
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={service.user.profile_image || undefined} />
              <AvatarFallback>{service.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground">{service.user.name}</span>
          </div>
          {service.is_mobile && <Badge variant="secondary">Mobile</Badge>}
        </div>
        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
          <Link to={`/services/${service.id}`}>{service.title}</Link>
        </h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-foreground mr-1">{rating.toFixed(1)}</span>
            <span>({reviewCount} reviews)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{service.location}</span>
          </div>
        </div>
        <div className="flex items-end justify-between pt-2">
          <p className="text-2xl font-extrabold text-primary">
            Ksh {parseFloat(service.price).toLocaleString()}
          </p>
          <Button asChild size="sm">
            <Link to={`/services/${service.id}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;