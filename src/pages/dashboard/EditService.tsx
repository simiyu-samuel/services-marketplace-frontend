import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import ServiceForm, { ServiceFormValues } from "@/components/services/ServiceForm";
import { showSuccess, showError } from "@/utils/toast";
import { Service } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceMediaManager from "@/components/services/ServiceMediaManager";

const fetchService = async (id: string) => {
  const { data } = await api.get(`/services/${id}`);
  return data.data as Service;
};

const updateService = async ({ id, data }: { id: string, data: ServiceFormValues }) => {
  const { data: response } = await api.put(`/services/${id}`, data);
  return response.data;
};

const EditService = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: service, isLoading: isQueryLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      showSuccess("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      queryClient.invalidateQueries({ queryKey: ['service', id] });
      navigate("/dashboard/services");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update service.";
      showError(errorMessage);
    },
  });

  const handleFormSubmit = (values: ServiceFormValues) => {
    if (!id) return;
    mutation.mutate({ id, data: values });
  };

  if (isQueryLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  if (!service) {
    return <p>Service not found.</p>;
  }

  return (
    <div className="space-y-6">
      <ServiceForm 
        onSubmit={handleFormSubmit} 
        isLoading={mutation.isPending}
        initialData={service}
        submitButtonText="Update Service"
      />
      <ServiceMediaManager service={service} />
    </div>
  );
};

export default EditService;