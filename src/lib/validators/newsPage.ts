import { z } from "zod";

export const newsPageSchema = z.object({
  date: z.string().min(1), // You might want to validate this as a date string later
  image: z.string().url("Image must be a valid URL"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  titleId: z.number().int().positive().optional().nullable(),
  lastModified: z.string().optional().nullable(), // Could use `z.coerce.date()` if needed
});
