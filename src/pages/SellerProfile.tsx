import { useParams } from "react-router-dom";
import { mockServices } from "@/data/mock";
import NotFound from "./NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ServiceCard from "@/components/services/ServiceCard";

const SellerProfile = () => {
  const { id } = useParams();
  const sellerId = Number(id);

  const sellerServices = mockServices.filter(s => s.seller.id === sellerId);
  const seller = sellerServices.length > 0 ? sellerServices[0].seller : null;

  if (!seller) {
    return <NotFound />;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={seller.profile_image_url} />
          <AvatarFallback className="text-3xl">{seller.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-extrabold tracking-tight">{seller.name}</h1>
        <p className="text-muted-foreground mt-2">
          Explore all services offered by {seller.name}.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Services</h2>
        {sellerServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No Services Found</h3>
            <p className="text-muted-foreground mt-2">This seller has not listed any services yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;