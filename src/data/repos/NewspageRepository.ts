import { Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

export class NewsPageRepository extends BaseRepository<NewsPage> {
  constructor() {
    super(prisma.newsPage);
  }

  async findAllWithRelations(options?: {
    where?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  }) {
    return this.findAll({
      ...options,
      include: {
        title: true,
        mapData: true,
        newspapers: {
          include: {
            newspaper: {
              include: {
                title: true,
              },
            },
          },
        },
      },
    });
  }
}
