import { type PrismaClient } from "@prisma/client/extension";
const DEFAULT_ORDER_BY = {
  id: "desc",
};

const MAX_RECORDS_LIMIT = 100;

export default abstract class BaseRepository<A> {
  constructor(protected modelClient: PrismaClient) {}

  getAll(options: Record<string, any> = {}): Promise<Array<A>> {
    if (!options.orderBy) {
      options.orderBy = DEFAULT_ORDER_BY;
    }

    if (!options.take || options.take > MAX_RECORDS_LIMIT) {
      options.take = MAX_RECORDS_LIMIT;
    }

    return this.modelClient.findMany(options);
  }

  getById(id: number): Promise<A> {
    return this.modelClient.findUnique({
      where: { id },
    });
  }

  create(data: Partial<A>): Promise<A> {
    return this.modelClient.create({
      data,
    });
  }

  update(id: number, data: Partial<A>): Promise<A> {
    return this.modelClient.update({
      where: { id },
      data,
    });
  }

  delete(id: number): Promise<A> {
    return this.modelClient.delete({
      where: { id },
    });
  }
}
