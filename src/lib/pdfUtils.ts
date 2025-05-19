import path from "path";
import fs from "fs/promises";
import { fromBuffer } from "pdf2pic";

export async function convertPDFToImages(pdfBuffer: Buffer) {
  const tempDir = path.join(process.cwd(), "public/temp");
  await fs.mkdir(tempDir, { recursive: true });

  const imagesDir = path.join(tempDir, "images");
  await fs.mkdir(imagesDir, { recursive: true });

  const convert = fromBuffer(pdfBuffer, {
    density: 150,
    saveFilename: "page",
    savePath: imagesDir,
    format: "jpeg",
    width: 1024,
    height: 1448,
  });

  const pagesConverted = await convert.bulk(-1);

  const thumbnails: string[] = [];

  for (const img of pagesConverted) {
    const imagePath = img.path;
    const fileName = path.basename(imagePath!);
    const thumbPath = path.join(tempDir, "thumbnails", "thumb-" + fileName);

    await fs.mkdir(path.dirname(thumbPath), { recursive: true });

    await import("sharp").then((sharp) =>
      sharp
        .default(imagePath)
        .resize({ width: 300 })
        .jpeg({ quality: 80 })
        .toFile(thumbPath),
    );

    thumbnails.push("/temp/thumbnails/thumb-" + fileName);
  }

  return thumbnails;
}
