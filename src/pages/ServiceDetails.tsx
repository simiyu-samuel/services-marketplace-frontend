import { useParams } from "react-router-dom";

const ServiceDetails = () => {
  const { id } = useParams();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Service Details for ID: {id}</h1>
      <p>This page will show detailed information about a specific service, including an image gallery, booking form, and reviews.</p>
    </div>
  );
};

export default ServiceDetails;