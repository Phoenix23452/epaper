import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/utils";
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
  async delete(id: number): Promise<NewsPage> {
    // Fetch the page with related mapData first
    const newsPage = await prisma.newsPage.findUnique({
      where: { id },
      include: { mapData: true },
    });

    if (!newsPage) {
      throw new Error(`NewsPage with ID ${id} not found`);
    }

    const date = newsPage.date;
    const mediaFolder = path.join(process.cwd(), "public", "media", date);

    try {
      // Delete related mapData media files
      for (const map of newsPage.mapData) {
        if (map.croppedImage) {
          const croppedImagePath = path.join(
            process.cwd(),
            "public",
            map.croppedImage,
          );
          await deleteFile(croppedImagePath);
        }
      }

      // Delete thumbnail and image from disk
      if (newsPage.thumbnail) {
        await deleteFile(
          path.join(process.cwd(), "public", newsPage.thumbnail),
        );
      }

      if (newsPage.image) {
        await deleteFile(path.join(process.cwd(), "public", newsPage.image));
      }

      // Delete mapData records from DB
      await prisma.mapData.deleteMany({ where: { newsPageId: id } });

      // Finally delete the newsPage itself
      return await super.delete(id);
    } catch (error) {
      console.error(`Failed to fully delete NewsPage ID ${id}`, error);
      throw error;
    }
  }
}
