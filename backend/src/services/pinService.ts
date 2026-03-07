import prisma from "../utils/prisma.js";
import type { CreatePinInput, PledgeInput } from "../validators/pinValidators.js";

export const getPins = async () => {
    // Logic to update PinStatus from PENDING_GOV to BOUNTY_OPEN after 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Update pins that have aged past 7 days
    await prisma.wastePin.updateMany({
        where: {
            status: 'PENDING_GOV',
            createdAt: { lt: sevenDaysAgo }
        },
        data: {
            status: 'BOUNTY_OPEN'
        }
    });

    return await prisma.wastePin.findMany({
        include: {
            reporter: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePic: true,
                },
            },
            cleanupProof: {
                select: {
                    id: true,
                    cleanerId: true,
                    afterImage: true,
                    beforeImage: true,
                    description: true,
                    upvotes: true,
                    createdAt: true,
                    cleaner: {
                        select: {
                            id: true,
                            name: true,
                            profilePic: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const agePinDev = async (id: string) => {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    return await prisma.wastePin.update({
        where: { id },
        data: { createdAt: eightDaysAgo }
    });
};

export const createPin = async (userId: string, data: CreatePinInput) => {
    return await prisma.wastePin.create({
        data: {
            ...data,
            reporterId: userId,
        },
    });
};

export const createPledge = async (userId: string, pinId: string, data: PledgeInput) => {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw Object.assign(new Error("User not found"), { statusCode: 404 });
        }

        if (user.mockBalance < data.amount) {
            throw Object.assign(new Error("Insufficient balance"), { statusCode: 400 });
        }

        const pin = await tx.wastePin.findUnique({ where: { id: pinId }, select: { id: true } });
        if (!pin) {
            throw Object.assign(new Error("Pin not found"), { statusCode: 404 });
        }

        // Deduct from user
        await tx.user.update({
            where: { id: userId },
            data: { mockBalance: { decrement: data.amount } },
        });

        // Add to pin bounty
        await tx.wastePin.update({
            where: { id: pinId },
            data: { bountyPool: { increment: data.amount } },
        });

        // Create pledge
        const pledge = await tx.pledge.create({
            data: {
                amount: data.amount,
                userId: userId,
                pinId: pinId,
            },
        });

        return pledge;
    });
};

export const upvotePin = async (pinId: string) => {
    const existing = await prisma.wastePin.findUnique({ where: { id: pinId } });
    if (!existing) {
        throw Object.assign(new Error("Pin not found"), { statusCode: 404 });
    }
    
    console.log(`[DEBUG] Upvoting pin ${pinId}. Current upvotes: ${existing.upvotes}`);
    
    const updated = await prisma.wastePin.update({
        where: { id: pinId },
        data: { upvotes: { increment: 1 } },
    });
    
    console.log(`[DEBUG] Pin ${pinId} upvoted. New upvotes: ${updated.upvotes}`);
    return updated;
};

export const removeUpvotePin = async (pinId: string) => {
    const existing = await prisma.wastePin.findUnique({ where: { id: pinId } });
    if (!existing) {
        throw Object.assign(new Error("Pin not found"), { statusCode: 404 });
    }

    // Ensure upvotes don't go below 0
    const newUpvotes = Math.max((existing.upvotes || 0) - 1, 0);
    
    console.log(`[DEBUG] Removing upvote for pin ${pinId}. Current: ${existing.upvotes}, New: ${newUpvotes}`);

    return await prisma.wastePin.update({
        where: { id: pinId },
        data: { upvotes: newUpvotes },
    });
};

export const getPledgesForPin = async (pinId: string) => {
    return await prisma.pledge.findMany({
        where: { pinId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePic: true,
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const getPinRankings = async () => {
    const topPins = await prisma.wastePin.findMany({
        where: {
            status: { not: 'RESOLVED' }
        },
        take: 4,
        orderBy: { bountyPool: 'desc' }
    });

    return topPins.map(pin => {
        const progress = Math.min((pin.bountyPool / 1000) * 100, 100);
        let priority: 'Low' | 'Medium' | 'High' = 'Low';
        if (progress >= 70) priority = 'High';
        else if (progress >= 30) priority = 'Medium';

        return {
            ...pin,
            progress,
            priority
        };
    });
};
