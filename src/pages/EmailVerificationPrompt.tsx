import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from 'lucide-react';

const EmailVerificationPrompt = () => {
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    navigate("/seller-onboarding/payment");
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md bg-background shadow-xl border text-center">
        <CardHeader>
          <MailCheck className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            A verification email has been sent to your registered email address. Please check your inbox (and spam folder) to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You need to verify your email to activate your account and proceed with the seller onboarding.
          </p>
          <Button onClick={handleProceedToPayment} className="w-full">
            Proceed to Payment
          </Button>
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or <Link to="/resend-verification" className="text-primary hover:underline">resend it</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPrompt;
