import React from 'react';
import { Service } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatServicePrice } from "@/lib/utils";

interface ServiceListViewProps {
  service: Service;
  index: number;
}

const ServiceListView: React.FC<ServiceListViewProps> = ({ service, index }) => {
  const rating = service.rating ?? 0;
  const reviewCount = service.review_count ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Image Section */}
            <div className="md:col-span-4 relative">
              <div className="aspect-video md:aspect-square bg-muted">
                {service.media_files && service.media_files.length > 0 ? (
                  <img
                    src={service.media_files[0]}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/400x300/CCCCCC/FFFFFF?text=Service+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <Badge className="absolute top-3 left-3">{service.category}</Badge>
              {service.is_mobile && (
                <Badge variant="secondary" className="absolute top-3 right-3">
                  Mobile
                </Badge>
              )}
            </div>

            {/* Content Section */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      <Link to={`/services/${service.id}`}>{service.title}</Link>
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={service.user.profile_image || undefined} />
                          <AvatarFallback className="text-xs">{service.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{service.user.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatServicePrice(service.min_price, service.max_price)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/services/${service.id}`}>View Details</Link>
                  </Button>
                </div>
                <Button size="sm" asChild>
                  <Link to={`/services/${service.id}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceListView;