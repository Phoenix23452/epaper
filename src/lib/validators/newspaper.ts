import { z } from "zod";

export const newspaperSchema = z.object({
  date: z.string().min(1),
  titleId: z.number().int().positive(),
});
