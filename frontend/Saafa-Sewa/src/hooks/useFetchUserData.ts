import { useCurrentUser } from '@/features/auth/useAuth';

/**
 * Hook to fetch and store user data
 * Uses TanStack Query via useCurrentUser from useAuth
 * Automatically syncs with Redux store
 */
export const useFetchUserData = () => {
    return useCurrentUser();
};
