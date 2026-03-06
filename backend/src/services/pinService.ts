import prisma from "../utils/prisma.js";
import type { CreatePinInput, PledgeInput } from "../validators/pinValidators.js";

export const getPins = async () => {
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
    return await prisma.wastePin.update({
        where: { id: pinId },
        data: { upvotes: { increment: 1 } },
    });
};

export const removeUpvotePin = async (pinId: string) => {
    return await prisma.wastePin.update({
        where: { id: pinId },
        data: { upvotes: { decrement: 1 } },
    });
};
