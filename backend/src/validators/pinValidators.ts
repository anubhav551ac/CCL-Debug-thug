import { z } from "zod";

export const createPinSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    municipality: z.string().min(1),
    wasteType: z.array(z.enum(["ORGANIC", "PLASTIC", "METAL", "PAPER", "ELECTRONIC", "MEDICAL", "HAZARDOUS"])).min(1),
    wasteSize: z.enum(["HANDFUL", "BAGFUL", "RICKSHAWFUL", "TRUCKFUL"]),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
});

export const pledgeSchema = z.object({
    amount: z.number().int().positive("Amount must be positive"),
});

export type CreatePinInput = z.infer<typeof createPinSchema>;
export type PledgeInput = z.infer<typeof pledgeSchema>;
