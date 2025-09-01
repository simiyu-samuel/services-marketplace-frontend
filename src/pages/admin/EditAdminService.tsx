import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import ServiceForm from '@/components/services/ServiceForm';
import api from '@/lib/api';
import { showSuccess, showError } from "@/utils/toast";
import { AxiosError } from 'axios';
import { ServiceFormValues } from '@/components/services/ServiceForm';

const EditAdminService = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/services/${id}`);
        if (response.status === 200) {
          setService(response.data.service);
        } else {
          showError("Failed to fetch service.");
        }
      } catch (error: unknown) {
        console.error("Error fetching service:", error);
        if (error instanceof AxiosError) {
          console.error("Backend error response:", error.response); // Log backend error response
          showError(error.response?.data?.message || "Failed to fetch service.");
          if (error.response?.status === 401 || error.response?.status === 403) {
            // If unauthorized or forbidden, redirect to login
            navigate('/login');
          }
        } else {
          showError("Failed to fetch service.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const onSubmit = async (values: ServiceFormValues) => { // Use ServiceFormValues
    setIsLoading(true);
    try {
      // Ensure proper data formatting
      const formattedData = {
        ...values,
        // Ensure booleans are properly formatted
        is_mobile: Boolean(values.is_mobile),
        // Preserve is_active from existing service
        is_active: service?.is_active || true,
        // Ensure max_price is null if empty
        max_price: values.max_price || null,
      };
      
      console.log('Sending update data:', formattedData); // Debug log
      
      const response = await api.put(`/admin/services/${id}`, formattedData);
      if (response.status === 200) {
        showSuccess("Service updated successfully.");
        navigate('/admin/my-services');
      } else {
        showError("Failed to update service.");
      }
    } catch (error: unknown) { // Use unknown
      console.error("Error updating service:", error);
      if (error instanceof AxiosError) {
        console.error("Backend error response:", error.response?.data); // Debug log
        showError(error.response?.data?.message || "Failed to update service.");
      } else {
        showError("Failed to update service.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Admin Service</h1>
      {isLoading ? (
        <p>Loading service...</p>
      ) : service ? (
        <ServiceForm onSubmit={onSubmit} initialData={service} isLoading={isLoading} submitButtonText="Update Service" />
      ) : (
        <p>Service not found.</p>
      )}
    </div>
  );
};

export default EditAdminService;
