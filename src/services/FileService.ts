// src/services/FileService.ts
import fs from "fs";
import path from "path";
import { mkdirSync, rmSync } from "fs";

function moveFileSafe(src: string, dest: string) {
  try {
    if (!fs.existsSync(src)) {
      throw new Error(`Source file does not exist: ${src}`);
    }

    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    return new Promise<void>((resolve, reject) => {
      readStream.on("error", reject);
      writeStream.on("error", reject);
      writeStream.on("finish", () => {
        fs.unlink(src, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      readStream.pipe(writeStream);
    });
  } catch (error) {
    console.error(`Error moving file from ${src} to ${dest}:`, error);
    throw error;
  }
}

export class FileService {
  static async moveSelectedPages(uuid: string, date: string, pages: number[]) {
    const tmpDir = path.join("/tmp", uuid);
    const mediaDir = path.join("public/media", date);
    const thumbDir = path.join(mediaDir, "thumbnail");

    mkdirSync(mediaDir, { recursive: true });
    mkdirSync(thumbDir, { recursive: true });

    const movedFiles: any = [];

    for (const page of pages) {
      const fullSrc = path.join(tmpDir, `page-${page}-full.webp`);
      const thumbSrc = path.join(tmpDir, `page-${page}-thumb.webp`);
      const fullDest = path.join(mediaDir, `${uuid}-page-${page}-full.webp`);
      const thumbDest = path.join(thumbDir, `${uuid}-page-${page}-thumb.webp`);

      console.log(`Moving fullSrc: ${fullSrc} to ${fullDest}`);
      console.log(`Moving thumbSrc: ${thumbSrc} to ${thumbDest}`);

      await moveFileSafe(fullSrc, fullDest);
      await moveFileSafe(thumbSrc, thumbDest);

      movedFiles.push({
        image: `/media/${date}/${uuid}-page-${page}-full.webp`,
        thumbnail: `/media/${date}/thumbnail/${uuid}-page-${page}-thumb.webp`,
      });
    }

    rmSync(tmpDir, { recursive: true, force: true });
    return movedFiles;
  }
}
