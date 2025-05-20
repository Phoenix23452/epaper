import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, rm } from "fs/promises";
import path from "path";
import fs from "fs";

const TMP_DIR = "/tmp";

// Utility: Recursively calculate folder size
async function getFolderSize(dir: string): Promise<number> {
  let total = 0;

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      try {
        if (entry.isDirectory()) {
          total += await getFolderSize(fullPath);
        } else {
          const fileStat = await stat(fullPath);
          total += fileStat.size;
        }
      } catch (innerErr: any) {
        if (innerErr.code === "EACCES" || innerErr.code === "EPERM") {
          console.warn(`Skipping inaccessible file or directory: ${fullPath}`);
          continue;
        } else {
          throw innerErr;
        }
      }
    }
  } catch (err: any) {
    if (err.code === "EACCES" || err.code === "EPERM") {
      console.warn(`Skipping inaccessible directory: ${dir}`);
      return 0;
    }
    throw err;
  }

  return total;
}

export async function GET() {
  try {
    if (!fs.existsSync(TMP_DIR)) {
      return NextResponse.json({ sizeBytes: 0, sizeMB: 0 });
    }

    const sizeBytes = await getFolderSize(TMP_DIR);
    const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);

    return NextResponse.json({ sizeBytes, sizeMB });
  } catch (err) {
    console.error("Error getting tmp folder size:", err);
    return new NextResponse("Failed to read tmp usage", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const entries = await readdir(TMP_DIR, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(TMP_DIR, entry.name);
        await rm(fullPath, { recursive: true, force: true });
      }),
    );

    return NextResponse.json({ message: "All tmp content deleted" });
  } catch (err) {
    console.error("Error deleting tmp folder content:", err);
    return new NextResponse("Failed to clean tmp directory", { status: 500 });
  }
}
