// app/api/page-categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import NewspaperCategoryRepository from "@/repos/NewpaperCategoryRepsitory";

const repo = new NewspaperCategoryRepository();

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await repo.getById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const updated = await repo.update(Number(params.id), body);
  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const deleted = await repo.delete(Number(params.id));
  return NextResponse.json(deleted);
}
