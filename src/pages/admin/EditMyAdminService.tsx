import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Service } from '@/types';
import ServiceForm, { ServiceFormValues } from '@/components/services/ServiceForm';
import api from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';
import { AxiosError } from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceMediaManager from '@/components/services/ServiceMediaManager';

const fetchService = async (id: string) => {
  const { data } = await api.get(`/services/${id}`);
  return data as Service;
};

const updateAdminService = async ({ id, data }: { id: string, data: ServiceFormValues & { is_active: boolean } }) => {
  // Construct location from county and specific location
  const constructedLocation = `${data.county.trim()}, ${data.specific_location.trim()}`;
  
  // Ensure proper data formatting
  const formattedData = {
    ...data,
    // Ensure booleans are properly formatted
    is_mobile: Boolean(data.is_mobile),
    is_active: Boolean(data.is_active),
    // Ensure max_price is null if empty
    max_price: data.max_price || null,
    // Ensure category is properly trimmed string
    category: data.category?.trim(),
    // Use constructed location
    location: constructedLocation,
    // Ensure subcategory is null if empty string
    subcategory: data.subcategory && data.subcategory.trim() !== '' ? data.subcategory.trim() : null,
  };
  
  // Remove county and specific_location from the data sent to backend
  const { county, specific_location, ...backendData } = formattedData;
  
  const { data: response } = await api.put(`/services/${id}`, backendData);
  return response.data;
};

const EditMyAdminService = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: service, isLoading: isQueryLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateAdminService,
    onSuccess: () => {
      showSuccess('Admin service updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['service', id] });
      navigate('/admin/my-services');
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message || 'Failed to update service.';
      showError(errorMessage);
    },
  });

  const handleFormSubmit = (values: ServiceFormValues) => {
    if (!id || !service) return;
    // Preserve the is_active field from the existing service
    const dataWithActiveStatus = {
      ...values,
      is_active: service.is_active
    };
    mutation.mutate({ id, data: dataWithActiveStatus });
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

  if (error || !service) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-destructive">Service not found</h2>
        <p className="text-muted-foreground mt-2">The service you're trying to edit doesn't exist or you don't have permission to edit it.</p>
        <button 
          onClick={() => navigate('/admin/my-services')}
          className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          Back to My Services
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Admin Service</h1>
        <button 
          onClick={() => navigate('/admin/my-services')}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back to My Services
        </button>
      </div>
      
      <ServiceForm 
        onSubmit={handleFormSubmit} 
        isLoading={mutation.isPending}
        initialData={service}
        submitButtonText="Update Service"
      />
      
      <ServiceMediaManager service={service} isAdminMode={true} />
    </div>
  );
};

export default EditMyAdminService;
