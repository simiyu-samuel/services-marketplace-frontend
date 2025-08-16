import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
import { mockReviews } from "@/data/mock"; // Reviews still from mock as per API guide
import NotFound from "./NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ServiceCard from "@/components/services/ServiceCard";
import ReviewCard from "@/components/sellers/ReviewCard";
import { Button } from "@/components/ui/button";
import { Star, MapPin, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";

const fetchSellerServices = async (sellerId: number) => {
  const { data } = await api.get('/services', { 
    params: { 'filter[seller_id]': sellerId } 
  });
  return (data as PaginatedResponse<Service>).data;
};

const SellerProfile = () => {
  const { id } = useParams();
  const sellerId = Number(id);

  const { data: sellerServices, isLoading } = useQuery<Service[]>({
    queryKey: ['services', sellerId],
    queryFn: () => fetchSellerServices(sellerId),
    enabled: !!sellerId,
  });

  const seller = sellerServices && sellerServices.length > 0 ? sellerServices[0].seller : null;
  
  // Reviews are still mocked as there's no public endpoint for them in the guide
  const sellerReviews = mockReviews.filter(r => r.sellerId === sellerId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceCardSkeleton />
            <ServiceCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return <NotFound />;
  }

  const totalReviews = sellerReviews.length;
  const averageRating = totalReviews > 0
    ? (sellerReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : "N/A";

  const whatsappNumber = seller.phone_number;
  const message = `Hello ${seller.name}, I'm interested in your services.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <div className="bg-muted/20">
      <div className="container py-8">
        {/* Seller Header */}
        <Card className="mb-8">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
              <AvatarImage src={seller.profile_image_url} />
              <AvatarFallback className="text-4xl">{seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{seller.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground mt-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-yellow-500" />
                  <span className="font-bold text-foreground">{averageRating}</span>
                  <span className="ml-1">({totalReviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{sellerServices && sellerServices.length > 0 ? sellerServices[0].location : 'N/A'}</span>
                </div>
              </div>
              <Button className="mt-4 gap-2" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-5 w-5" />
                  Contact Seller
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Services</h2>
            {sellerServices && sellerServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background rounded-lg">
                <h3 className="text-xl font-semibold">No Services Found</h3>
                <p className="text-muted-foreground mt-2">This seller has not listed any services yet.</p>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            {sellerReviews.length > 0 ? (
              <div className="space-y-4">
                {sellerReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background rounded-lg">
                <h3 className="text-xl font-semibold">No Reviews Yet</h3>
                <p className="text-muted-foreground mt-2">Be the first to review {seller.name}!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;