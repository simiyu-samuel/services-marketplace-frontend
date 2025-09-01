import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ServiceForm, { ServiceFormValues } from "@/components/services/ServiceForm";
import { showSuccess, showError } from "@/utils/toast";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { UserPackageInfo } from "@/types";
import { packageConfigs } from "@/config/packageConfig"; // Import from shared config
import { useState } from "react"; // Import useState

interface ErrorResponse {
  message?: string;
  errors?: { [key: string]: string[] };
}

const createService = async (data: FormData) => {
  const { data: response } = await api.post('/services', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const CreateService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: userData } = useQuery<UserPackageInfo>({
    queryKey: ['currentUserPackageInfo'],
    queryFn: async () => {
      const { data } = await api.get('/user');
      return data.user;
    },
    enabled: !!user,
  });

  const currentPackageKey = userData?.seller_package;
  const currentPackageConfig = currentPackageKey ? packageConfigs.seller_packages[currentPackageKey as keyof typeof packageConfigs.seller_packages] : packageConfigs.seller_packages.basic;
  const mediaLimits = {
    photos_per_service: currentPackageConfig?.photos_per_service,
    videos_per_service: currentPackageConfig?.video_per_service,
  };

  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      showSuccess("Service created successfully!");
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      navigate("/dashboard/services");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Failed to create service.";
      showError(errorMessage);
    },
  });

  const handleFormSubmit = (values: ServiceFormValues) => {
    const formData = new FormData();

    // Construct location from county and specific location
    const constructedLocation = `${values.county.trim()}, ${values.specific_location.trim()}`;

    (Object.keys(values) as Array<keyof ServiceFormValues>).forEach(key => {
        const value = values[key];
        if (key === 'media_files' && value instanceof FileList) {
            // Client-side validation for media limits
            for (let i = 0; i < value.length; i++) {
                formData.append('media_files[]', value[i]);
            }
        } else if (key === 'county' || key === 'specific_location') {
            // Skip these as we'll use the constructed location instead
            return;
        } else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0'); // Send 1 for true, 0 for false
        } else if (value !== undefined && value !== null) {
            // Special handling for subcategory - send empty string as null for backend
            if (key === 'subcategory' && value === '') {
                // Don't append empty subcategory, let backend handle it as null
                return;
            }
            // Ensure category is properly trimmed string
            if (key === 'category') {
                const trimmedValue = String(value).trim();
                if (trimmedValue) {
                    formData.append(key, trimmedValue);
                }
            } else {
                formData.append(key, String(value));
            }
        }
    });

    // Add the constructed location
    formData.append('location', constructedLocation);

    mutation.mutate(formData);
  };

  return (
    <ServiceForm
      onSubmit={handleFormSubmit}
      isLoading={mutation.isPending}
      submitButtonText="Create Service"
      photosPerService={mediaLimits?.photos_per_service}
      videosPerService={mediaLimits?.videos_per_service}
    />
  );
};

export default CreateService;
