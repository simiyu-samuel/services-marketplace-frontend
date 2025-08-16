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
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <Carousel className="w-full">
        <CarouselContent>
          {service.media.map((m) => (
            <CarouselItem key={m.id}>
              <div className="aspect-w-16 aspect-h-9">
                <img src={m.url} alt={service.title} className="object-cover w-full h-full" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {service.media.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 transition-opacity opacity-0 group-hover:opacity-100" />
            <CarouselNext className="absolute right-2 transition-opacity opacity-0 group-hover:opacity-100" />
          </>
        )}
      </Carousel>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={service.seller.profile_image_url} />
            <AvatarFallback>{service.seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-muted-foreground">{service.seller.name}</span>
        </div>
        <h3 className="font-semibold text-lg truncate group-hover:text-primary">
          <Link to={`/services/${service.id}`}>{service.title}</Link>
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-foreground mr-1">{service.rating}</span>
          <span>({service.review_count} reviews)</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{service.location}</span>
          {service.is_mobile && <Badge variant="secondary" className="ml-2">Mobile</Badge>}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-primary">
            Ksh {service.price.toLocaleString()}
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