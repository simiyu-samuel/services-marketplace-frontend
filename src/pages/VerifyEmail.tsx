import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import api from '@/lib/api';

const VerifyEmail = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Attempt to get email from navigation state, fallback to a generic message
  const email = location.state?.email || 'your email address';

  const handleResend = async () => {
    if (email === 'your email address') {
      showError("Could not find your email. Please try logging in to resend the link.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/email/resend', { email });
      showSuccess("A new verification link has been sent!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend link. Please try again.";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <MailCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or click the button below to resend it.
          </p>
          <Button onClick={handleResend} disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Resend Verification Link'}
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;