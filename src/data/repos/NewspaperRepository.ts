import { BaseRepository } from "./BaseRepository";

export class NewspaperRepository extends BaseRepository<Newspaper> {
  constructor() {
    super(prisma.newspaper, prisma);
  }

  async findWithCategory() {
    return this.findAll({
      include: {
        title: true,
        newspaperPages: true,
      },
    });
  }
}
