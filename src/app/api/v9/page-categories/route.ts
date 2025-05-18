// GET: Retrieve all page categories

import { prisma } from "@/lib/prisma";
import { pageCategorySchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


export async function GET() {
    try {
      const categories = await prisma.pageCategory.findMany();
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // POST: Create a new page category
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { title, slug } = pageCategorySchema.parse(body);
      const category = await prisma.pageCategory.create({
        data: { title, slug },
      });
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  