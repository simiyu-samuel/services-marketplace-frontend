import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  console.log("AdminRoute - isLoading:", isLoading);
  console.log("AdminRoute - user:", user);

  if (isLoading) {
    console.log("AdminRoute - Loading state, showing skeleton.");
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("AdminRoute - User is null, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (user.user_type !== 'admin') {
    console.log("AdminRoute - User type is not admin (", user.user_type, "), redirecting to home.");
    return <Navigate to="/" replace />; // Or an unauthorized page
  }

  console.log("AdminRoute - User is admin, rendering Outlet.");
  return <Outlet />;
};

export default AdminRoute;
