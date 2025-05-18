import { z } from "zod";

export const mapDataSchema = z.object({
  coordinates: z.string().min(1),
  title: z.string().optional().nullable(),
  croppedImage: z.string().optional().nullable(),
  newsPageId: z.number().int().positive(),
});
