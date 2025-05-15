import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/error';

// Validation schema for creating/updating NewspaperCategory
const newspaperCategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  order: z.number().int().optional(),
});

// GET: Retrieve all newspaper categories, sorted by order
export async function GET() {
  try {
    const categories = await prisma.newspaperCategory.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST: Create a new newspaper category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug } = newspaperCategorySchema.parse(body);
    const maxOrder = await prisma.newspaperCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const newOrder = (maxOrder?.order ?? 0) + 1;
    const category = await prisma.newspaperCategory.create({
      data: { title, slug, order: newOrder },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}