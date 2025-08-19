import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, CheckCircle, X } from 'lucide-react';
import { packageConfigs } from '@/config/packageConfig';
import PaymentDialog from '@/components/payments/PaymentDialog'; // Import PaymentDialog

import { UserPackageInfo } from '@/types';

const PackageUpgrade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedPackageKey, setSelectedPackageKey] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentPackageStats, setCurrentPackageStats] = useState<UserPackageInfo | null>(null); // To store user's current package info

  // Fetch user data to get current package and expiry date
  const { data: userData, isLoading: isUserLoading, isError: isUserError, refetch: refetchUser } = useQuery<UserPackageInfo | undefined>({
    queryKey: ['currentUserPackageInfo'],
    queryFn: async () => {
      const { data } = await api.get('/user');
      return data.user;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (userData) {
      setCurrentPackageStats(userData);
    }
  }, [userData]);

  const handleSelectPackage = (pkgKey: string) => {
    setSelectedPackageKey(pkgKey);
    setIsPaymentDialogOpen(true); // Open payment dialog when a package is selected
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Package Activated",
      description: "Your seller package has been successfully activated!",
    });
    refetchUser(); // Re-fetch user data to update package status on dashboard
    navigate('/dashboard'); // Redirect to dashboard
  };

  const selectedPackageInfo = selectedPackageKey ? packageConfigs.seller_packages[selectedPackageKey as keyof typeof packageConfigs.seller_packages] : null;

  if (isUserLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Upgrade Your Package</h1>
        <Skeleton className="h-48 w-full mb-6" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Upgrade Your Package</h1>
        <Card className="border-destructive">
          <CardHeader><CardTitle>Error</CardTitle></CardHeader>
          <CardContent><p>Could not load your package information. Please try again later.</p></CardContent>
        </Card>
      </div>
    );
  }

  const currentPackageKey = userData?.seller_package;
  const currentPackageConfig = currentPackageKey ? packageConfigs.seller_packages[currentPackageKey as keyof typeof packageConfigs.seller_packages] : null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upgrade Your Package</h1>

      {/* Package Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(packageConfigs.seller_packages).map(([pkgKey, pkgConfig]) => {
          const isCurrentPackage = currentPackageKey === pkgKey;
          const isLowerTier = currentPackageKey && 
                              packageConfigs.seller_packages[currentPackageKey as keyof typeof packageConfigs.seller_packages].price > pkgConfig.price;

          let buttonText = 'Select Plan';
          const buttonAction = () => handleSelectPackage(pkgKey);
          let isDisabled = false;

          if (isCurrentPackage) {
            buttonText = 'Renew Plan';
          } else if (isLowerTier) {
            buttonText = 'Cannot Downgrade';
            isDisabled = true;
          }

          return (
            <Card key={pkgKey} className={`relative flex flex-col justify-between p-6 ${isCurrentPackage ? 'border-2 border-primary shadow-lg' : ''}`}>
              {isCurrentPackage && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-lg">
                  Current Plan
                </div>
              )}
              <div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold capitalize">{pkgConfig.name}</CardTitle>
                  <CardDescription className="text-lg">Ksh {pkgConfig.price.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2">
                    {pkgConfig.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <CardFooter className="p-0 mt-6">
                <Button
                  className="w-full"
                  onClick={buttonAction}
                  disabled={isDisabled}
                  variant={isCurrentPackage ? 'outline' : 'default'}
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Payment Modal Trigger */}
      {selectedPackageInfo && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          amount={selectedPackageInfo.price}
          paymentType="package_upgrade"
          packageType={selectedPackageKey as 'basic' | 'standard' | 'premium'}
          onPaymentSuccess={handlePaymentSuccess}
          initialPhoneNumber={userData?.phone_number || ''}
        />
      )}
    </div>
  );
};

export default PackageUpgrade;
