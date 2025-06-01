import { NextResponse } from "next/server";
import { z } from "zod";
import UserRepository from "@/repos/UserRepository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password } = updateUserSchema.parse(body);
    const userRepo = new UserRepository();
    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) {
      await userRepo.updatePassword(Number(session.user.id), password);
    }
    if (email) {
      await userRepo.update(Number(session.user.id), { email });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
