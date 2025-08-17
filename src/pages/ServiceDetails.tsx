import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, MessageSquare, CalendarPlus } from "lucide-react";
import NotFound from "./NotFound";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { BookingDialog } from "@/components/services/BookingDialog";
import ReviewSummary from "@/components/services/ReviewSummary";
import ReviewCard from "@/components/sellers/ReviewCard";
import { mockReviews } from "@/data/mock";
import ImageGallery from "@/components/services/ImageGallery";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { showError } from "@/utils/toast";

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
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { data: service, isLoading, isError } = useQuery<Service>({
    queryKey: ['service', id],
    queryFn: () => fetchService(id!),
    enabled: !!id,
  });

  const { data: allServices } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  if (isLoading) {
    return (
      <div className="container py-8 px-4 md:px-0">
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

  const otherServices = allServices?.filter(s => s.user.id === service.user.id && s.id !== service.id) || [];
  const whatsappNumber = service.user.phone_number;
  const message = `Hello, I'm interested in booking the "${service.title}" service.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  const rating = service.rating ?? 0;
  const reviewCount = service.review_count ?? 0;
  const sampleReviews = mockReviews.slice(0, 3);

  return (
    <>
      <BookingDialog serviceId={service.id} isOpen={isBookingOpen} onOpenChange={setIsBookingOpen} />
      <div className="container py-8 px-4 md:px-0 mt-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{service.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
                <span className="ml-1">({reviewCount} reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{service.location}</span>
              </div>
            </div>

            <ImageGallery mediaFiles={service.media_files} serviceTitle={service.title} />

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">About this service</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>{service.description}</p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reviews</h2>
              {reviewCount > 0 ? (
                <div className="space-y-6">
                  <ReviewSummary rating={rating} reviewCount={reviewCount} />
                  <div className="space-y-4 mt-6">
                    {sampleReviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews for this service yet.</p>
              )}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Leave a Review</h2>
              {user ? (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Textarea placeholder="Share your experience with this service..." />
                    <Button onClick={() => showError("Review submission coming soon!")}>Submit Review</Button>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-muted-foreground">
                  You must be <Link to="/login" className="text-primary underline">logged in</Link> to leave a review.
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-20 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold text-primary">
                    Ksh {parseFloat(service.price).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Duration: {service.duration} minutes</span>
                  </div>
                  {service.is_mobile && <Badge>Mobile Service Available</Badge>}
                  <div className="grid grid-cols-1 gap-2">
                    <Button size="lg" className="w-full gap-2" onClick={() => setIsBookingOpen(true)}>
                      <CalendarPlus className="h-5 w-5" />
                      Book Appointment
                    </Button>
                    <Button size="lg" variant="outline" className="w-full gap-2" asChild>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="h-5 w-5" />
                        Contact via WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About the Seller</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Link to={`/sellers/${service.user.id}`}>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={service.user.profile_image || undefined} />
                      <AvatarFallback>{service.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link to={`/sellers/${service.user.id}`} className="font-bold text-lg hover:underline">
                      {service.user.name}
                    </Link>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link to={`/sellers/${service.user.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {otherServices.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">More from {service.user.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map(otherService => (
                <ServiceCard key={otherService.id} service={otherService} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceDetails;
