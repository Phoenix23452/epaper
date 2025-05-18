import { prisma } from "@/lib/prisma";
import BaseRepository from "@/repos/BaseRepository";

export default class NewspaperRepository extends BaseRepository<Newspaper> {
  constructor() {
    super(prisma.newspaper);
  }
}
