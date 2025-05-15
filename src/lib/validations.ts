import { z } from "zod";




// Validation schema for creating/updating NewspaperCategory
export const newspaperCategorySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
  });

  // Validation schema for creating/updating PageCategory
export const pageCategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
});