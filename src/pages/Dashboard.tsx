import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.name}!</p>
                    <p>Your role is: {user.user_type}</p>
                    <Button onClick={handleLogout} className="mt-4">Logout</Button>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Dashboard;