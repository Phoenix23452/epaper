const { parentPort, workerData } = require("worker_threads");
const { PDFDocument } = require("pdf-lib");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { fromBuffer } = require("pdf2pic"); // install pdf2pic first: npm i pdf2pic

(async () => {
  const { uuid, pdfBuffer } = workerData;

  const tmpDir = path.join(os.tmpdir(), uuid);
  fs.mkdirSync(tmpDir, { recursive: true });

  // Load PDF doc to get metadata
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const numPages = pdfDoc.getPageCount();

  // Configure pdf2pic converter with default options
  const converter = fromBuffer(pdfBuffer, {
    density: 150,
    format: "png",
    width: 0, // don't force width
    height: 0, // don't force height
    saveFilename: "",
    savePath: "",
  });

  const thumbnails = [];

  for (let i = 1; i <= numPages; i++) {
    // pdf2pic pages start at 1
    // Convert page to image buffer (png)
    const pageImage = await converter(i, { responseType: "base64" });

    const base64 = pageImage?.base64;

    if (!base64) {
      throw new Error(`Failed to render page ${i} with pdf2pic`);
    }

    const base64Data = pageImage.base64.replace(/^data:image\/\w+;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");

    // 👉 Get original image dimensions
    const image = sharp(imgBuffer);
    const metadata = await image.metadata();

    const percentCropX = 0.06; // 6% from left and right
    const percentCropY = 0.025; // 2.5% from top and bottom

    const cropLeft = Math.floor(metadata.width * percentCropX);
    const cropTop = Math.floor(metadata.height * percentCropY);
    const cropWidth = metadata.width - cropLeft * 2;
    const cropHeight = metadata.height - cropTop * 2;

    const croppedBuffer = await image
      .extract({
        left: cropLeft,
        top: cropTop,
        width: cropWidth,
        height: cropHeight,
      })
      .toBuffer();

    // Use sharp to create full-size webp
    const fullImagePath = path.join(tmpDir, `page-${i}-full.webp`);
    const thumbImagePath = path.join(tmpDir, `page-${i}-thumb.webp`);

    // Resize full image to 2x original size of PDF page (you can tweak this)
    const page = pdfDoc.getPage(i - 1);
    const { width, height } = page.getSize();

    await sharp(croppedBuffer)
      .resize({
        width: Math.floor(width * 2),
        height: Math.floor(height * 2),
        fit: "inside", // 👈 preserves aspect ratio
      })
      .webp({ quality: 100 })
      .toFile(fullImagePath);

    await sharp(croppedBuffer)
      .resize({
        width: 200,
        fit: "inside", // 👈 preserves aspect ratio
      })
      .webp({ quality: 60 })
      .toFile(thumbImagePath);

    thumbnails.push({
      page: i,
      thumbnailUrl: thumbImagePath,
    });
  }

  parentPort?.postMessage({
    uuid,
    thumbnails,
  });
})();
