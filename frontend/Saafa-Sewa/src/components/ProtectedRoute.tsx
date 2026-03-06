import { Navigate } from 'react-router-dom';
import { useUser } from '@/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks if a user exists in Redux store.
 * If no user exists, redirects to login page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useUser();

    // If no user is found, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User exists, render the protected component
    return <>{children}</>;
};

export default ProtectedRoute;
