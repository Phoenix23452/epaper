import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class NewsPageRepository extends BaseRepository<
  NewsPage,
  Prisma.NewsPageCreateInput,
  Prisma.NewsPageUpdateInput
> {
  constructor() {
    super(prisma.newsPage);
  }
}
