import { NextRequest, NextResponse } from "next/server";
import { join, resolve } from "path";
import { promises as fs } from "fs";

const TMP_DIR = "/tmp";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawFileName = searchParams.get("file");

    if (!rawFileName) {
      return new NextResponse("Missing 'file' parameter", { status: 400 });
    }

    const fileName = decodeURIComponent(rawFileName);

    // Construct and resolve path to ensure it's within /tmp
    const filePath = join(TMP_DIR, fileName);
    const resolvedPath = resolve(filePath);

    if (!resolvedPath.startsWith(TMP_DIR)) {
      return new NextResponse("Invalid file path", { status: 400 });
    }

    const fileBuffer = await fs.readFile(resolvedPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp", // or adjust based on actual output
        "Content-Disposition": `inline; filename="${fileName.split("/").pop()}"`,
      },
    });
  } catch (err) {
    console.error("Error serving tmp file:", err);
    return new NextResponse("File not found or error reading file", {
      status: 404,
    });
  }
}
