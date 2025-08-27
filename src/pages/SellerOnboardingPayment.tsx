import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentDialog from '@/components/payments/PaymentDialog';
import { usePackagePrices } from "@/hooks/usePackagePrices"; // Import usePackagePrices
import { Loader2 } from 'lucide-react';

const packageDetails = {
  basic: { name: "Basic", price: 1000.00 },
  standard: { name: "Standard", price: 1500.00 },
  premium: { name: "Premium", price: 2500.00 },
};

const SellerOnboardingPayment = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { data: packagePrices, isLoading: pricesLoading, isError: pricesError } = usePackagePrices(); // Fetch prices
  const [paymentInfo, setPaymentInfo] = useState<{
    open: boolean;
    amount: number;
    packageType: 'basic' | 'standard' | 'premium';
    email: string;
    userId: number;
    phoneNumber: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !pricesLoading) { // Wait for both auth and prices to load
      // If user is already a seller, redirect to dashboard
      if (user?.user_type === 'seller' && user?.seller_package) {
        showSuccess("Your seller account is active!");
        navigate('/dashboard');
      } else if (!user) {
        // If not logged in, redirect to login
        showError("Please log in to access this page.");
        navigate('/login');
      }
    }
  }, [user, isAuthLoading, pricesLoading, navigate]);

  const handleInitiatePayment = () => {
    if (user && user.pending_seller_package && packagePrices) {
      const selectedPackageType = user.pending_seller_package;
      const selectedPackagePrice = packagePrices[selectedPackageType];
      if (selectedPackagePrice !== undefined) {
        setPaymentInfo({
          open: true,
          amount: selectedPackagePrice,
          packageType: selectedPackageType,
          email: user.email,
          userId: user.id,
          phoneNumber: user.phone_number,
        });
      } else {
        showError("Selected package price not found. Please try again.");
      }
    } else {
      showError("No pending seller package found for your account or prices not loaded. Please register as a seller first.");
      navigate('/register-seller');
    }
  };

  const handlePaymentSuccess = () => {
    // After successful payment, the AuthContext's user state will be updated
    // by the usePayment hook's query invalidation.
    // The useEffect above will then handle the redirect to dashboard.
    console.log("Payment successful, attempting to update user and redirect.");
    // A small delay to ensure query invalidation and user refetch has time to complete
    setTimeout(() => {
      setPaymentInfo(null);
      // The useEffect will handle the navigation once the user context is updated
    }, 1000); // 1 second delay
  };

  if (isAuthLoading || pricesLoading) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading data...</p>
      </div>
    );
  }

  if (user?.user_type === 'seller' && user?.seller_package) {
    // This case is handled by useEffect redirect, but good to have a fallback UI
    return null;
  }

  // If prices failed to load, display an error
  if (pricesError || !packagePrices) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <p className="text-lg text-red-500">Error loading package prices. Please try again later.</p>
      </div>
    );
  }

  const pendingPackageType = user?.pending_seller_package;
  const pendingPackagePrice = pendingPackageType ? packagePrices[pendingPackageType] : undefined;
  const pendingPackageName = pendingPackageType ? packageDetails[pendingPackageType].name : undefined;


  return (
    <>
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md bg-background shadow-xl border">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">Complete Seller Registration</CardTitle>
            <CardDescription className="text-center">
              Your account is currently in customer mode with a pending seller package.
              Please complete the payment to activate your seller features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {pendingPackageType && pendingPackagePrice !== undefined && pendingPackageName ? (
              <>
                <p className="text-lg font-semibold">
                  Pending Package: <span className="capitalize">{pendingPackageName}</span> (Ksh {pendingPackagePrice.toLocaleString()})
                </p>
                <Button onClick={handleInitiatePayment} className="w-full">
                  Initiate Payment
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground">
                  No pending seller package found. If you intended to register as a seller, please do so.
                </p>
                <Button onClick={() => navigate('/register-seller')} className="w-full">
                  Register as a Seller
                </Button>
              </>
            )}
            <p className="text-sm text-muted-foreground">
              You will remain a customer until payment is successfully completed.
            </p>
          </CardContent>
        </Card>
      </div>
      {paymentInfo && (
        <PaymentDialog
          isOpen={paymentInfo.open}
          onOpenChange={(open) => {
            if (!open) setPaymentInfo(null);
          }}
          amount={paymentInfo.amount}
          paymentType="seller_registration"
          packageType={paymentInfo.packageType}
          onPaymentSuccess={handlePaymentSuccess}
          initialPhoneNumber={paymentInfo.phoneNumber}
        />
      )}
    </>
  );
};

export default SellerOnboardingPayment;
