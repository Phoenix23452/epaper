import { NextResponse } from "next/server";
import UserRepository from "@/repos/UserRepository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "Cannot delete current user" },
      { status: 400 },
    );
  }

  try {
    const userRepo = new UserRepository();
    await userRepo.delete(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
