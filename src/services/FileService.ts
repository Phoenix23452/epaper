// src/services/FileService.ts
import fs from "fs";
import path from "path";
import { mkdirSync, rmSync } from "fs";

function moveFileSafe(src: string, dest: string) {
  fs.copyFileSync(src, dest); // copy
  fs.unlinkSync(src); // delete
}
export class FileService {
  static moveSelectedPages(uuid: string, date: string, pages: number[]) {
    const tmpDir = path.join("/tmp", uuid);
    const mediaDir = path.join("public/media", date);
    const thumbDir = path.join(mediaDir, "thumbnail");

    mkdirSync(mediaDir, { recursive: true });
    mkdirSync(thumbDir, { recursive: true });

    const movedFiles: any = [];

    pages.forEach((page) => {
      const fullSrc = path.join(tmpDir, `page-${page}-full.webp`);
      const thumbSrc = path.join(tmpDir, `page-${page}-thumb.webp`);
      const fullDest = path.join(mediaDir, `${uuid}-page-${page}-full.webp`);
      const thumbDest = path.join(thumbDir, `${uuid}-page-${page}-thumb.webp`);

      moveFileSafe(fullSrc, fullDest);
      moveFileSafe(thumbSrc, thumbDest);

      movedFiles.push({
        image: `/media/${date}/${uuid}-page-${page}-full.webp`,
        thumbnail: `/media/${date}/thumbnail/${uuid}-page-${page}-thumb.webp`,
      });
    });

    rmSync(tmpDir, { recursive: true, force: true });
    return movedFiles;
  }
}
