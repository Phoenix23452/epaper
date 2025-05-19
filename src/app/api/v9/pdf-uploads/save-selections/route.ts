// File: /app/api/v9/pdf-uploads/save-selections/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { selected, date }: { selected: string[]; date: string } =
      await req.json();

    const baseMediaPath = path.join(process.cwd(), "public", "media", date);
    const imagesPath = path.join(baseMediaPath, "images");
    const thumbsPath = path.join(imagesPath, "thumbnails");

    await fs.mkdir(imagesPath, { recursive: true });
    await fs.mkdir(thumbsPath, { recursive: true });

    const saved: string[] = [];

    for (const tempThumbUrl of selected) {
      const decodedPath = decodeURIComponent(tempThumbUrl.split("file=")[1]);
      const fileName = uuidv4()+ ".png";

      const targetPath = path.join(thumbsPath, fileName);

      // Move file to final thumbnails folder
      await fs.copyFile(decodedPath, targetPath);

      // Here you could also move the full image if needed (we'd store mapping between them)
      // For now, we just save thumbnails as required.

      saved.push(`/media/${date}/images/thumbnails/${fileName}`);

      // Clean up temp file
      await fs.unlink(decodedPath);
    }

    // Example: Save metadata to DB (pseudo code)
    // await db.insert("pdf_images", saved.map((url, i) => ({ order: i+1, url, date })))

    return NextResponse.json({ success: true, saved });
  } catch (e) {
    console.error("Save error:", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
