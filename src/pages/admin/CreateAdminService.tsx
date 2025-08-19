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
  
  const isAdmin = user?.user_type === 'admin';

  const onSubmit = async (values: ServiceFormValues) => { // Use ServiceFormValues
    setIsLoading(true);
    try {
      // Replace 'YOUR_ADMIN_USER_ID' with the actual admin ID
      const adminId = user?.id?.toString();
      const response = await api.post('/services', {
        ...values,
        user_id: adminId,
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
