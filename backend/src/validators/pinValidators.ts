import { z } from "zod";

export const createPinSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    wardNumber: z.number().int().min(1).max(33),
    wasteType: z.enum(["ORGANIC", "PLASTIC", "METAL", "PAPER", "ELECTRONIC", "MEDICAL", "HAZARDOUS"]),
    wasteSize: z.enum(["HANDFUL", "BAGFUL", "RICKSHAWFUL", "TRUCKFUL"]),
    description: z.string().optional(),
});

export const pledgeSchema = z.object({
    amount: z.number().int().positive("Amount must be positive"),
});

export type CreatePinInput = z.infer<typeof createPinSchema>;
export type PledgeInput = z.infer<typeof pledgeSchema>;
