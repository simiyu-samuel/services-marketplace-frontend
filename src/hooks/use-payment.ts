import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Payment } from '@/types';

type PaymentStatus = 'idle' | 'initiating' | 'polling' | 'completed' | 'failed' | 'cancelled' | 'timed_out';

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
        // If status is 'pending', log the response and let it poll again.
        console.log('Payment status:', payment.status, 'Message:', data.message);
      } catch (err: unknown) {
        clearInterval(interval);
        dismissToast(toastId);
        if (isAxiosError(err)) {
          if (err.response?.status === 401) {
            setStatus('failed');
            showError('Session expired. Please log in again.');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          } else if (err.response?.status === 404) {
            setStatus('failed');
            showError(err.response?.data?.message || 'Payment record not found.');
            console.error("Payment polling error: 404 Not Found", err);
          } else {
            setStatus('failed');
            showError('An error occurred while checking payment status.');
            console.error("Payment polling error:", err);
          }
        } else {
          setStatus('failed');
          showError('An unexpected error occurred.');
          console.error("Unexpected payment polling error:", err);
        }
      }
    }, 5000); // Poll every 5 seconds

    // Timeout after 1 minute
    setTimeout(() => {
      if (status === 'polling') {
        clearInterval(interval);
        setStatus('timed_out');
        dismissToast(toastId);
        showError('Payment is taking longer than expected. Please check your M-Pesa for a confirmation message. You can also check your payment history for updates.');
      }
    }, 60000); // 60000 milliseconds = 1 minute
  };

  const initiatePayment = async (payload: InitiatePaymentPayload) => {
    setStatus('initiating');
    setError(null);
    const toastId = showLoading('Initiating payment...');

    try {
      const { data } = await api.post('/payments/initiate', payload);
      dismissToast(toastId.toString());
      showSuccess('Payment initiated. Please check your phone to complete the transaction.');
      const pollingToastId = showLoading('Waiting for payment confirmation...');
      pollPaymentStatus(data.checkout_request_id, pollingToastId.toString());
    } catch (err: unknown) {
      dismissToast(toastId.toString());
      if (isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Failed to initiate payment.';
        setError(errorMessage);
        setStatus('failed');
        showError(errorMessage);
      } else {
        setError('An unexpected error occurred.');
        setStatus('failed');
        showError('An unexpected error occurred.');
      }
    }
  };

  return { status, error, initiatePayment };
};
