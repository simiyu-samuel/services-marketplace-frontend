import React, { useState } from 'react';
import ServiceForm from '@/components/services/ServiceForm';
import { showSuccess, showError } from "@/utils/toast";
import api from "@/lib/api";
import { useNavigate } from 'react-router-dom';
import { ServiceFormValues } from '@/components/services/ServiceForm';
import { AxiosError } from 'axios'; // Import AxiosError
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth


const CreateAdminService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  

  const onSubmit = async (values: ServiceFormValues) => { // Use ServiceFormValues
    setIsLoading(true);
    try {
      // Replace 'YOUR_ADMIN_USER_ID' with the actual admin ID
      const adminId = user?.id?.toString();
      
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
      
      const response = await api.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        showSuccess("Service created successfully.");
        navigate('/admin/my-services'); // Redirect to the service list page
      } else {
        showError("Failed to create service.");
      }
    } catch (error: unknown) { // Use unknown
      console.error("Error creating service:", error);
      if (error instanceof AxiosError) { // Type guard for AxiosError
        showError(error.response?.data?.message || "Failed to create service.");
      } else {
        showError("Failed to create service.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create New Admin Service</h1>
      <ServiceForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateAdminService;
