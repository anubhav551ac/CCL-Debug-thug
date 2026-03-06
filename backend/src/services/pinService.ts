import prisma from "../utils/prisma.js";
import type { CreatePinInput, PledgeInput } from "../validators/pinValidators.js";

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
