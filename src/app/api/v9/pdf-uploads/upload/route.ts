import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import sharp from "sharp";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function convertPdfPageToPng(
  pdfPath: string,
  page: number,
  outputPath: string,
) {
  // Use pdftoppm from poppler-utils to convert a specific page to PNG
  // -singlefile: output single file
  // -png: output format PNG
  // -f: first page to convert
  // -l: last page to convert
  // So here f=l=page to convert single page only
  await execFileAsync("pdftoppm", [
    "-f",
    page.toString(),
    "-l",
    page.toString(),
    "-singlefile",
    "-png",
    pdfPath,
    outputPath.replace(/\.png$/, ""),
  ]);
}

async function generateImagesAndThumbnails(
  pdfPath: string,
  tempDir: string,
  pageCount: number,
) {
  const fullImages: string[] = [];
  const thumbnails: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const fullImagePath = path.join(tempDir, `page-${i}.png`);
    const thumbImagePath = path.join(tempDir, `thumb-page-${i}.png`);

    // Convert page to full image (PNG)
    await convertPdfPageToPng(pdfPath, i, fullImagePath);

    // Compress full image with sharp (lossless-ish)
    await sharp(fullImagePath)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(fullImagePath + ".compressed.png");

    await fs.rename(fullImagePath + ".compressed.png", fullImagePath);

    // Create thumbnail (width 200px) with good quality and compression
    await sharp(fullImagePath)
      .resize(200)
      .png({ quality: 75, compressionLevel: 9 })
      .toFile(thumbImagePath);

    fullImages.push(fullImagePath);
    thumbnails.push(thumbImagePath);
  }

  return { fullImages, thumbnails };
}

async function getPdfPageCount(pdfPath: string): Promise<number> {
  // Using pdfinfo command from poppler-utils
  const { stdout } = await execFileAsync("pdfinfo", [pdfPath]);
  const match = stdout.match(/Pages:\s+(\d+)/);
  if (!match) throw new Error("Unable to get page count");
  return parseInt(match[1], 10);
}

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm();

  // Parse form with promise wrapper
  const data: any = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files.file;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.mimetype !== "application/pdf") {
    return NextResponse.json(
      { error: "Uploaded file is not a PDF" },
      { status: 400 },
    );
  }

  try {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const uploadTempDir = path.join(
      process.cwd(),
      "tmp",
      "uploads",
      `${now.getTime()}`,
    );
    await fs.mkdir(uploadTempDir, { recursive: true });

    const pdfTempPath = path.join(uploadTempDir, "upload.pdf");
    await fs.copyFile(file.filepath, pdfTempPath);

    // Get PDF page count
    const pageCount = await getPdfPageCount(pdfTempPath);

    // Generate images and thumbnails
    const { fullImages, thumbnails } = await generateImagesAndThumbnails(
      pdfTempPath,
      uploadTempDir,
      pageCount,
    );

    // Return URLs (we'll serve from /api/temp-files?path=...)
    // For simplicity, just return relative paths for now
    const thumbnailsUrls = thumbnails.map(
      (p) => `/api/temp-files?file=${encodeURIComponent(p)}`,
    );

    return NextResponse.json({ thumbnails: thumbnailsUrls, pageCount });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
