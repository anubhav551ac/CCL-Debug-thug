import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Pin {
    id: string;
    latitude: number;
    longitude: number;
    municipality: string;
    wasteType: string[];
    wasteSize: string;
    description?: string;
    status: 'PENDING_GOV' | 'BOUNTY_OPEN' | 'CLAIMED' | 'VERIFYING' | 'RESOLVED';
    bountyPool: number;
    upvotes: number;
    reporterId: string;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    reporter?: {
        id: string;
        name: string;
        email: string;
        profilePic?: string;
    };
}

interface CreatePinPayload {
    latitude: number;
    longitude: number;
    municipality: string;
    wasteType: string[];
    wasteSize: string;
    description?: string;
    imageUrl?: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useCreatePin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePinPayload) =>
            apiRequest<{ success: boolean; data: Pin }>("/api/v1/pins", {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        onSuccess: () => {
            // Invalidate the pins query to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            console.log("✅ Pin created successfully");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to create pin", err.message);
        },
    });
};

export const useAgePinDev = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiRequest<{ success: boolean; data: Pin }>(`/api/dev/age-report/${id}`, {
                method: "POST",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            console.log("✅ Pin aged by 8 days successfully for dev demo");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to age pin", err.message);
        },
    });
};

export const useFetchPins = () => {
    return useQuery<Pin[]>({
        queryKey: ["pins"],
        queryFn: () => apiRequest<Pin[]>("/api/v1/pins", { method: "GET" }),
        staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    });
};

export const useUpvotePin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (pinId: string) =>
            apiRequest<Pin>(`/api/v1/pins/${pinId}/upvote`, {
                method: "POST",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            console.log("✅ Pin upvoted successfully");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to upvote pin", err.message);
        },
    });
};

export const useRemoveUpvotePin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (pinId: string) =>
            apiRequest<Pin>(`/api/v1/pins/${pinId}/upvote`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            console.log("✅ Pin upvote removed successfully");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to remove upvote", err.message);
        },
    });
};
