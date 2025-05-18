import { prisma } from "@/lib/prisma";
import BaseRepository from "@/repos/BaseRepository";

export default class NewsPageRepository extends BaseRepository<NewsPage> {
  constructor() {
    super(prisma.newsPage);
  }
}
