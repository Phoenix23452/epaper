// src/app/api/v9/pdf-uploads/upload/route.ts
import { NextRequest } from "next/server";
import { PdfService } from "@/services/PdfService";
import { uuidv4 } from "@/lib/uuid";
import { Buffer } from "buffer";
import { NextSuccess, NextError } from "@/lib/apiResponse"; // adjust if needed

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextError("Invalid file type", "Expected a PDF upload", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);
    const uuid = uuidv4();

    const result = await PdfService.runPdfToImagesWorker(uuid, pdfBuffer);

    return NextSuccess("PDF processed successfully", {
      uuid,
      thumbnails: result.thumbnails.map((thumb: any) => ({
        page: thumb.page,
        thumbnailUrl: `/api/v9/tmp?file=${encodeURIComponent(
          thumb.thumbnailUrl.replace("/tmp/", ""),
        )}`,
      })),
    });
  } catch (err: any) {
    console.error("Error in PDF upload:", err);
    return NextError(
      "PDF processing failed",
      err?.stack || err.toString(),
      500,
    );
  }
}
