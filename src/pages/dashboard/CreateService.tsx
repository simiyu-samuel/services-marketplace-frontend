import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import ServiceForm, { ServiceFormValues } from "@/components/services/ServiceForm";
import { showSuccess, showError } from "@/utils/toast";

const createService = async (data: FormData) => {
  const { data: response } = await api.post('/services', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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
    const formData = new FormData();
    
    (Object.keys(values) as Array<keyof ServiceFormValues>).forEach(key => {
        const value = values[key];
        if (key === 'media_files' && value instanceof FileList) {
            for (let i = 0; i < value.length; i++) {
                formData.append('media_files[]', value[i]);
            }
        } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    mutation.mutate(formData);
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