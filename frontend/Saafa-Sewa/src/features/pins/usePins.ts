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
    cleanupProof?: {
        id: string;
        cleanerId: string;
        afterImage: string | null;
        beforeImage: string;
        description?: string;
        upvotes: number;
        createdAt: string;
        cleaner: {
            id: string;
            name: string;
            profilePic?: string;
        };
    } | null;
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
        refetchInterval: 15000, // Short polling every 10 seconds for real-time feel
    });
};

export const useUpvotePin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (pinId: string) =>
            apiRequest<Pin>(`/api/v1/pins/${pinId}/upvote`, {
                method: "POST",
            }),
        onSuccess: (updatedPin: Pin) => {
            // Update the pins list in the cache without refetching
            queryClient.setQueryData<Pin[]>(["pins"], (oldPins) => {
                if (!oldPins) return [];
                return oldPins.map((pin) =>
                    pin.id === updatedPin.id ? { ...pin, upvotes: updatedPin.upvotes } : pin
                );
            });
            console.log("✅ Pin upvoted successfully", updatedPin);
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
        onSuccess: (updatedPin: Pin) => {
            // Update the pins list in the cache without refetching
            queryClient.setQueryData<Pin[]>(["pins"], (oldPins) => {
                if (!oldPins) return [];
                return oldPins.map((pin) =>
                    pin.id === updatedPin.id ? { ...pin, upvotes: updatedPin.upvotes } : pin
                );
            });
            console.log("✅ Pin upvote removed successfully", updatedPin);
        },
        onError: (err: Error) => {
            console.error("❌ Failed to remove upvote", err.message);
        },
    });
};

export const usePledgePin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { pinId: string; amount: number }) =>
            apiRequest<{ id: string; amount: number; userId: string; pinId: string; createdAt: string }>(
                `/api/v1/pins/${payload.pinId}/pledge`,
                {
                    method: "POST",
                    body: JSON.stringify({ amount: payload.amount }),
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            console.log("✅ Pledge created successfully");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to create pledge", err.message);
        },
    });
};

export interface PledgeResponse {
    id: string;
    amount: number;
    userId: string;
    pinId: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        profilePic?: string;
    };
}

export const usePledgesForPin = (pinId: string) => {
    return useQuery<PledgeResponse[]>({
        queryKey: ["pledges", pinId],
        queryFn: () => apiRequest<PledgeResponse[]>(`/api/v1/pins/${pinId}/pledges`, { method: "GET" }),
        enabled: !!pinId,
        refetchInterval: 10000, // Short polling for real-time pledges
    });
};
