import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class NewspaperRepository extends BaseRepository<
  Newspaper,
  Prisma.NewspaperCreateInput,
  Prisma.NewspaperUpdateInput
> {
  constructor() {
    super(prisma.newspaper);
  }
}
