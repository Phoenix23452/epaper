import { z } from "zod";
import { mapDataSchema } from "./mapData";
import { newsPageSchema } from "./newsPage";
import { newspaperSchema } from "./newspaper";
import { categorySchema } from "./category";

export const schemaRegistry: Record<string, z.ZodSchema<any>> = {
  category: categorySchema,
  mapData: mapDataSchema,
  newsPage: newsPageSchema,
  newspaper: newspaperSchema,
};
