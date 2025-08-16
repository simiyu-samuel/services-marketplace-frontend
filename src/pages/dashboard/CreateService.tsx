import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import ServiceForm, { ServiceFormValues } from "@/components/services/ServiceForm";
import { showSuccess, showError } from "@/utils/toast";

const createService = async (data: ServiceFormValues) => {
  const { data: response } = await api.post('/services', data);
  return response.data;
};

const CreateService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      showSuccess("Service created successfully!");
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      navigate("/dashboard/services");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create service.";
      showError(errorMessage);
    },
  });

  const handleFormSubmit = (values: ServiceFormValues) => {
    mutation.mutate(values);
  };

  return (
    <ServiceForm 
      onSubmit={handleFormSubmit} 
      isLoading={mutation.isPending}
      submitButtonText="Create Service"
    />
  );
};

export default CreateService;