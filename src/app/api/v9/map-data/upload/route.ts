// src/app/api/v9/map-data/upload/route.ts
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const image = formData.get("image");
  const date = formData.get("date");

  if (
    !image ||
    typeof image !== "object" ||
    typeof (image as any).arrayBuffer !== "function"
  ) {
    return new Response(JSON.stringify({ error: "Image file is required" }), {
      status: 400,
    });
  }

  if (typeof date !== "string") {
    return new Response(JSON.stringify({ error: "Date is required" }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await (image as Blob).arrayBuffer());

  const fileName = `cropped-${Date.now()}.jpg`;
  const baseFolder = path.join(
    process.cwd(),
    "public",
    "media",
    date,
    "croppedImages",
  );

  await mkdir(baseFolder, { recursive: true });
  const filePath = path.join(baseFolder, fileName);

  await writeFile(filePath, buffer);

  const relativeUrl = `/media/${date}/croppedImages/${fileName}`;

  return new Response(JSON.stringify({ imageUrl: relativeUrl }), {
    status: 200,
  });
}
