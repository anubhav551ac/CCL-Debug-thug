import { Navigate } from 'react-router-dom';
import { useUser } from '@/store';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks if a user exists in Redux store.
 * If no user exists, redirects to login page.
 * Fetches fresh user data on mount to ensure it's always up-to-date.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useUser();
    // Call this to ensure fresh user data is fetched on app load
    useFetchUserData();

    // Show a loading state while fetching or hydrating
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest animate-pulse">
                    System Initializing...
                </p>
            </div>
        );
    }

    // If no user is found after loading, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User exists, render the protected component
    return <>{children}</>;
};

export default ProtectedRoute;
