// src/workers/pdfProcessor.ts
import { parentPort, workerData } from "worker_threads";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

interface JobData {
  uuid: string;
  pdfBuffer: Buffer;
}

(async () => {
  const { uuid, pdfBuffer } = workerData as JobData;

  const tmpDir = path.join(os.tmpdir(), uuid);
  fs.mkdirSync(tmpDir, { recursive: true });

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const numPages = pdfDoc.getPageCount();

  const thumbnails = [];

  for (let i = 0; i < numPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:0;">
          <img src="data:image/png;base64," style="width:100%;height:auto;" />
        </div>
      </foreignObject>
    </svg>`;

    const svgBuffer = Buffer.from(svg);
    const fullImagePath = path.join(tmpDir, `page-${i + 1}-full.webp`);
    const thumbImagePath = path.join(tmpDir, `page-${i + 1}-thumb.webp`);

    await sharp(svgBuffer)
      .resize({ width: Math.floor(width * 2), height: Math.floor(height * 2) })
      .webp({ quality: 90 })
      .toFile(fullImagePath);

    await sharp(svgBuffer)
      .resize({ width: 200 })
      .webp({ quality: 60 })
      .toFile(thumbImagePath);

    thumbnails.push({
      page: i + 1,
      thumbnailUrl: thumbImagePath,
    });
  }

  parentPort?.postMessage({
    uuid,
    thumbnails,
  });
})();
