import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setUser, startLoading, setError } from "@/store/userSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
    profilePic?: string;
    role: "CITIZEN" | "COLLECTOR" | "WARD_OFFICER";
    reputation: number;
    mockBalance: number;
    totalReports: number;
    totalCleanups: number;
    municipality?: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        reportsCreated: number;
        cleanupsDone: number;
    };
}

interface AuthResponse {
    user: AuthUser;
    token: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    municipality: string;
    profilePic?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const persistToken = (token: string) => localStorage.setItem("token", token);

const persistUser = (user: AuthUser) =>
    localStorage.setItem("user", JSON.stringify(user));

const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (payload: LoginPayload) =>
            apiRequest<AuthResponse>("/api/v1/auth/login", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        onSuccess: (data) => {
            persistToken(data.token);
            persistUser(data.user);
            // Update React Query cache with user data
            queryClient.setQueryData(["currentUser"], data.user);
            // Sync immediately to Redux store
            dispatch(setUser({
                ...data.user,
                totalReports: data.user.totalReports ?? 0,
                totalCleanups: data.user.totalCleanups ?? 0,
                municipality: data.user.municipality ?? '',
                createdAt: data.user.createdAt ?? new Date().toISOString(),
                updatedAt: data.user.updatedAt ?? new Date().toISOString(),
                _count: data.user._count ?? { reportsCreated: 0, cleanupsDone: 0 },
            }));
            console.log("✅ Login success", data);
            navigate("/app/dashboard");
        },
        onError: (err: Error) => {
            console.error("❌ Login failed", err.message);
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (payload: RegisterPayload) =>
            apiRequest<AuthResponse>("/api/v1/auth/register", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        onSuccess: (data) => {
            persistToken(data.token);
            persistUser(data.user);
            // Update React Query cache with user data
            queryClient.setQueryData(["currentUser"], data.user);
            // Sync immediately to Redux store
            dispatch(setUser({
                ...data.user,
                totalReports: data.user.totalReports ?? 0,
                totalCleanups: data.user.totalCleanups ?? 0,
                municipality: data.user.municipality ?? '',
                createdAt: data.user.createdAt ?? new Date().toISOString(),
                updatedAt: data.user.updatedAt ?? new Date().toISOString(),
                _count: data.user._count ?? { reportsCreated: 0, cleanupsDone: 0 },
            }));
            console.log("✅ Register success", data);
            navigate("/app/dashboard");
        },
        onError: (err: Error) => {
            console.error("❌ Register failed", err.message);
        },
    });
};

export const useCurrentUser = () => {
    const dispatch = useAppDispatch();

    return useQuery<AuthUser>({
        queryKey: ["currentUser"],
        queryFn: async () => {
            dispatch(startLoading());
            try {
                const response = await apiRequest<AuthResponse>("/api/v1/auth/me", {
                    method: "GET",
                });
                const user = response.user;
                // Sync TanStack Query result with Redux
                dispatch(setUser({
                    ...user,
                    totalReports: user.totalReports ?? 0,
                    totalCleanups: user.totalCleanups ?? 0,
                    municipality: user.municipality ?? '',
                    createdAt: user.createdAt ?? new Date().toISOString(),
                    updatedAt: user.updatedAt ?? new Date().toISOString(),
                    _count: user._count ?? { reportsCreated: 0, cleanupsDone: 0 },
                }));
                persistUser(user);
                return user;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
                dispatch(setError(errorMessage));
                clearAuth();
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // Keep in garbage collection for 10 minutes
        retry: 1,
        // Force fresh fetch on first mount (when user is not in Redux)
        enabled: true,
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    return () => {
        clearAuth();
        navigate("/");
    };
};
