import { prisma } from "@/lib/prisma";
import BaseRepository from "@/repos/BaseRepository";

export default class PageCategoryRepository extends BaseRepository<PageCategory> {
  constructor() {
    super(prisma.pageCategory);
  }
}
