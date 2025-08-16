import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Payment } from '@/types';

type PaymentStatus = 'idle' | 'initiating' | 'polling' | 'completed' | 'failed' | 'cancelled';

interface InitiatePaymentPayload {
  amount: number;
  phone_number: string;
  payment_type: 'seller_registration' | 'package_upgrade' | 'service_payment';
  package_type?: 'basic' | 'standard' | 'premium';
  service_id?: number;
  appointment_id?: number;
}

export const usePayment = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const pollPaymentStatus = (checkoutRequestId: string, toastId: string) => {
    setStatus('polling');
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/payments/status/${checkoutRequestId}`);
        const payment: Payment = data.payment;

        if (payment.status === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          dismissToast(toastId);
          showSuccess('Payment completed successfully!');
          queryClient.invalidateQueries({ queryKey: ['user'] }); // Refetch user to update package info
          queryClient.invalidateQueries({ queryKey: ['payments'] });
        } else if (payment.status === 'failed' || payment.status === 'cancelled') {
          clearInterval(interval);
          setStatus(payment.status);
          dismissToast(toastId);
          showError(data.message || 'Payment failed or was cancelled.');
        }
        // If status is 'pending', do nothing and let it poll again.
      } catch (err) {
        clearInterval(interval);
        setStatus('failed');
        dismissToast(toastId);
        showError('An error occurred while checking payment status.');
      }
    }, 5000); // Poll every 5 seconds

    // Timeout after 2 minutes
    setTimeout(() => {
      if (status === 'polling') {
        clearInterval(interval);
        setStatus('failed');
        dismissToast(toastId);
        showError('Payment check timed out. Please check your payment history.');
      }
    }, 120000);
  };

  const initiatePayment = async (payload: InitiatePaymentPayload) => {
    setStatus('initiating');
    setError(null);
    try {
      const { data } = await api.post('/payments/initiate', payload);
      const toastId = showLoading('STK push sent. Please enter your M-Pesa PIN. Polling for confirmation...');
      pollPaymentStatus(data.checkout_request_id, toastId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to initiate payment.';
      setError(errorMessage);
      setStatus('failed');
      showError(errorMessage);
    }
  };

  return { status, error, initiatePayment };
};