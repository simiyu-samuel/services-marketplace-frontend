import { Service } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";
import ImageGalleryModal from "./ImageGalleryModal";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const rating = service.rating ?? 0;
  const reviewCount = service.review_count ?? 0;

  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <Card 
          className="overflow-hidden transition-all duration-300 ease-in-out shadow-lg h-full w-full"
          style={{
              transform: "translateZ(75px)",
              transformStyle: "preserve-3d",
          }}
        >
          <div className="relative">
            <Badge className="absolute top-2 left-2 z-10">{service.category}</Badge>
            <Carousel className="w-full">
              <CarouselContent>
                {service.media_files && service.media_files.length > 0 ? (
                  service.media_files.map((media, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video bg-muted flex items-center justify-center cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                        <img
                          src={media}
                          alt={`Service image ${index + 1}`}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null; // Prevent infinite loop
                            e.currentTarget.src = 'https://placehold.co/800x600/CCCCCC/FFFFFF?text=Service+Image'; // Fallback HD image
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {/* Replace placeholder with actual image */}
                      {service.media_files && service.media_files.length === 0 ? (
                        <img src="/placeholder.svg" alt="Placeholder" className="object-cover w-full h-full" />
                      ) : null}
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              {service.media_files && service.media_files.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
          <CardContent className="p-4 space-y-2 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={service.user?.profile_image || undefined} />
                  <AvatarFallback>{service.user?.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground">{service.user?.name || 'Unknown User'}</span>
              </div>
              {service.is_mobile && <Badge variant="secondary">Mobile</Badge>}
            </div>
            <h3 className="font-bold text-lg truncate">
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
      </motion.div>
      {service.media_files && service.media_files.length > 0 && (
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          mediaFiles={service.media_files}
          serviceTitle={service.title}
        />
      )}
    </>
  );
};

export default ServiceCard;
