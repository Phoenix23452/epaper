import { prisma } from "@/lib/prisma";
import BaseRepository from "@/repos/BaseRepository";

export default class MapDataRepository extends BaseRepository<MapData> {
  constructor() {
    super(prisma.mapData);
  }
}
