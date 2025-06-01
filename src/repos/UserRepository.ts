import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super(prisma.user);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return super.create(data);
  }
  async updatePassword(id: number, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return super.update(id, { password: hashedPassword });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.modelClient.findUnique({
      where: { email },
    });
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
