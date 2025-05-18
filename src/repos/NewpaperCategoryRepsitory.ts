import { prisma } from "@/lib/prisma";
import BaseRepository from "@/repos/BaseRepository";

export default class NewspaperCategoryRepository extends BaseRepository<NewspaperCategory> {
  constructor() {
    super(prisma.newspaperCategory);
  }
}
