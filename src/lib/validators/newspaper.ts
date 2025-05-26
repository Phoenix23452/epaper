import { z } from "zod";

export const newspaperSchema = z.object({
  titleId: z.number().optional(),
  date: z.string().optional(),
  newspaperPages: z
    .object({
      connect: z.array(z.object({ id: z.number() })).optional(),
      disconnect: z.array(z.object({ id: z.number() })).optional(),
    })
    .optional(),
});
