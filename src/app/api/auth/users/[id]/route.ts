import { NextResponse } from "next/server";
import UserRepository from "@/repos/UserRepository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.id === id) {
    return NextResponse.json(
      { error: "Cannot delete current user" },
      { status: 400 },
    );
  }

  try {
    const userRepo = new UserRepository();
    await userRepo.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
