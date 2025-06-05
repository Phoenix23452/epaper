// src/app/api/v9/pdf-uploads/save-selections/route.ts
import { NextRequest } from "next/server";
import { FileService } from "@/services/FileService";
import NewsPageRepository from "@/repos/NewsPageRepsitory";
import { NextError, NextSuccess } from "@/lib/apiResponse";

export async function POST(req: NextRequest) {
  const { uuid, date, pages } = await req.json();

  const repo = new NewsPageRepository();

  if (!uuid || !date || !Array.isArray(pages)) {
    return NextError("Invalid input", "Missing uuid, date, or pages[]", 400);
  }

  try {
    const movedFiles: NewsPage[] = await FileService.moveSelectedPages(
      uuid,
      date,
      pages,
    );
    console.log(movedFiles);

    for (const file of movedFiles) {
      await repo.create({
        date,
        image: file.image,
        thumbnail: file.thumbnail,
      });
    }

    return NextSuccess("Pages saved successfully");
  } catch (err: any) {
    console.error("Error in save-selections:", err);

    return NextError(
      "Failed to save selections",
      err?.stack || err.toString(),
      500,
    );
  }
}
