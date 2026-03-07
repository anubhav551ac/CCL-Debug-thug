import { z } from "zod";

export const createCleanupProofSchema = z.object({
  beforeImage: z.string().min(1),
  afterImage: z.string().optional(),
  description: z.string().optional(),
});

export const uploadProofImageSchema = z.object({
  afterImage: z.string().min(1),
  description: z.string().optional(),
});

export type CreateCleanupProofInput = z.infer<typeof createCleanupProofSchema>;
export type UploadProofImageInput = z.infer<typeof uploadProofImageSchema>;
