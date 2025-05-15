// lib/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findAll(options?: {
    where?: any;
    include?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  }): Promise<T[]> {
    return this.model.findMany({ ...options });
  }

  async findById(id: number, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: number, data: any): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
