import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import type { CreateCleanupProofInput, UploadProofImageInput } from "../validators/proofValidators.js";

const BOUNTY_UPVOTE_THRESHOLD = Number(process.env.BOUNTY_UPVOTE_THRESHOLD ?? 5);

export const createCleanupProof = async (
  cleanerId: string,
  pinId: string,
  data: CreateCleanupProofInput,
) => {
  try {
    const proof = await prisma.cleanupProof.create({
      data: {
        beforeImage: data.beforeImage,
        afterImage: data.afterImage ?? null,
        description: data.description,
        cleanerId,
        pinId,
      },
    });

    return proof;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw Object.assign(new Error("Cleanup proof already exists for this pin"), {
        statusCode: 409,
      });
    }

    throw err;
  }
};

/**
 * Claim a bounty: creates a CleanupProof with afterImage=null and sets pin to CLAIMED.
 */
export const claimBounty = async (cleanerId: string, pinId: string) => {
  return prisma.$transaction(async (tx) => {
    // Verify the pin exists and is in BOUNTY_OPEN status
    const pin = await tx.wastePin.findUnique({
      where: { id: pinId },
      select: { id: true, status: true, imageUrl: true, cleanupProof: { select: { id: true } } },
    });

    if (!pin) {
      throw Object.assign(new Error("Pin not found"), { statusCode: 404 });
    }

    if (pin.status !== "BOUNTY_OPEN") {
      throw Object.assign(new Error("This pin is not available for claiming"), { statusCode: 400 });
    }

    if (pin.cleanupProof) {
      throw Object.assign(new Error("This pin has already been claimed"), { statusCode: 409 });
    }

    // Create the CleanupProof stub (afterImage is null)
    const proof = await tx.cleanupProof.create({
      data: {
        beforeImage: pin.imageUrl ?? "",
        afterImage: null,
        cleanerId,
        pinId,
      },
    });

    // Set pin status to CLAIMED
    await tx.wastePin.update({
      where: { id: pinId },
      data: { status: "CLAIMED" },
    });

    return proof;
  });
};

/**
 * Upload proof image: fills in afterImage, sets pin to VERIFYING, increments reputation.
 */
export const uploadProofImage = async (cleanerId: string, pinId: string, data: UploadProofImageInput) => {
  return prisma.$transaction(async (tx) => {
    // Find the existing proof and verify ownership
    const proof = await tx.cleanupProof.findUnique({
      where: { pinId },
      select: { id: true, cleanerId: true, afterImage: true },
    });

    if (!proof) {
      throw Object.assign(new Error("No claim found for this pin"), { statusCode: 404 });
    }

    if (proof.cleanerId !== cleanerId) {
      throw Object.assign(new Error("Only the claimer can upload proof"), { statusCode: 403 });
    }

    if (proof.afterImage) {
      throw Object.assign(new Error("Proof image has already been uploaded"), { statusCode: 409 });
    }

    // Update proof with the after image
    const updatedProof = await tx.cleanupProof.update({
      where: { id: proof.id },
      data: {
        afterImage: data.afterImage,
        description: data.description,
      },
    });

    // Set pin status to VERIFYING
    await tx.wastePin.update({
      where: { id: pinId },
      data: { status: "VERIFYING" },
    });

    // Increase cleaner's reputation
    await tx.user.update({
      where: { id: cleanerId },
      data: { reputation: { increment: 10 } },
    });

    return updatedProof;
  });
};

export const upvoteCleanupProof = async (proofId: string) => {
  return prisma.$transaction(async (tx) => {
    const proof = await tx.cleanupProof.update({
      where: { id: proofId },
      data: { upvotes: { increment: 1 } },
      select: {
        id: true,
        upvotes: true,
        cleanerId: true,
        pinId: true,
      },
    });

    console.log(`[DEBUG] Proof ${proofId} upvotes now: ${proof.upvotes}. Threshold: ${BOUNTY_UPVOTE_THRESHOLD}`);

    // Not enough upvotes yet. Return flag as false.
    if (proof.upvotes < BOUNTY_UPVOTE_THRESHOLD) {
      return { ...proof, isNewlyResolved: false };
    }

    const pin = await tx.wastePin.findUnique({
      where: { id: proof.pinId },
      select: { id: true, bountyPool: true, status: true },
    });

    console.log(`[DEBUG] Associated pin ${proof.pinId} status: ${pin?.status}, pool: ${pin?.bountyPool}`);

    if (!pin) {
      throw Object.assign(new Error("Associated pin not found"), { statusCode: 404 });
    }

    // Already resolved.
    if (pin.status === "RESOLVED") {
      return { ...proof, isNewlyResolved: false };
    }

    const claimed = await tx.wastePin.updateMany({
      where: {
        id: pin.id,
        status: { not: "RESOLVED" },
      },
      data: {
        status: "RESOLVED",
        bountyPool: 0,
      },
    });

    // Race condition caught. Someone else resolved it a millisecond ago.
    if (claimed.count === 0) {
      return { ...proof, isNewlyResolved: false };
    }

    // Pay the cleaner only if there's a bounty pool!
    if (pin.bountyPool > 0) {
      await tx.user.update({
        where: { id: proof.cleanerId },
        data: { mockBalance: { increment: pin.bountyPool } },
      });
    }

    // SUCCESS! Return the flag so the frontend knows to celebrate.
    return { 
      ...proof, 
      isNewlyResolved: true, 
      amountClaimed: pin.bountyPool 
    };
  });
};