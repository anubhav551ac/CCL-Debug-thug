import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

interface CleanupProof {
    id: string;
    beforeImage: string;
    afterImage: string | null;
    description?: string;
    upvotes: number;
    cleanerId: string;
    pinId: string;
    createdAt: string;
}

export interface UpvoteProofResponse extends CleanupProof {
    isNewlyResolved?: boolean;
    amountClaimed?: number;
}

/**
 * Claim a bounty on a pin. Creates a CleanupProof stub and sets pin to CLAIMED.
 */
export const useClaimBounty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (pinId: string) =>
            apiRequest<CleanupProof>(`/api/v1/pins/${pinId}/claim`, {
                method: "POST",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            console.log("✅ Bounty claimed successfully");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to claim bounty", err.message);
        },
    });
};

/**
 * Upload proof image for a claimed pin. Sets pin to VERIFYING + increments reputation.
 */
export const useUploadProofImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { pinId: string; afterImage: string; description?: string }) =>
            apiRequest<CleanupProof>(`/api/v1/pins/${payload.pinId}/proof`, {
                method: "PUT",
                body: JSON.stringify({
                    afterImage: payload.afterImage,
                    description: payload.description,
                }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            console.log("✅ Cleanup proof uploaded successfully");
        },
        onError: (err: Error) => {
            console.error("❌ Failed to upload proof", err.message);
        },
    });
};

/**
 * Upvote a cleanup proof to help verify it.
 */
export const useUpvoteProof = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (proofId: string) =>
            apiRequest<UpvoteProofResponse>(`/api/v1/proofs/${proofId}/upvote`, {
                method: "POST",
            }),
        onMutate: async (proofId) => {
            // Cancel outgoing refetches so they don't overwrite optimistic update
            await queryClient.cancelQueries({ queryKey: ["pins"] });

            // Snapshot the previous value
            const previousPins = queryClient.getQueryData(["pins"]);

            // Optimistically update the proof upvote count inside the pins array
            queryClient.setQueryData(["pins"], (oldPins: any) => {
                if (!oldPins) return oldPins;
                return oldPins.map((pin: any) => {
                    if (pin.cleanupProof && pin.cleanupProof.id === proofId) {
                        return {
                            ...pin,
                            cleanupProof: {
                                ...pin.cleanupProof,
                                upvotes: pin.cleanupProof.upvotes + 1,
                            },
                        };
                    }
                    return pin;
                });
            });

            return { previousPins };
        },
        onSuccess: (data) => {
            // Invalidate 'pins' to sync up
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            console.log(`isNewlyResolved: ${data.isNewlyResolved}, amountClaimed: ${data.amountClaimed}`);

            if (data.isNewlyResolved) {
                // Highly visible success toast
                toast.success(`🎉 Bounty Unlocked! Rs. ${data.amountClaimed || 0} awarded to the cleaner!`, {
                    duration: 6000,
                    position: "top-center",
                });

                // Immediately refetch requested dependencies
                // 'pins' is already invalidated unconditionally above
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            } else {
                toast.success("✅ Proof upvoted successfully");
            }
        },
        onError: (err: Error, _proofId, context: any) => {
            console.error("❌ Failed to upvote proof", err.message);
            toast.error("Failed to upvote proof: " + err.message);

            // Rollback optimistic update
            if (context?.previousPins) {
                queryClient.setQueryData(["pins"], context.previousPins);
            }
        },
    });
};
