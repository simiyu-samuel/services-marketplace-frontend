import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('customer' | 'seller' | 'admin')[];
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false, 
  allowedRoles = [], 
  fallbackPath = '/login' 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have the right role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.user_type)) {
    // Redirect based on user type
    const redirectPath = user.user_type === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;