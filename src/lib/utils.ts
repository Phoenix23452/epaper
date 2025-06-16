import { clsx, type ClassValue } from "clsx";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleError<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: any) {
    // Optional: Customize error logging
    console.error("Database operation failed:", error);

    // Optional: Normalize known Prisma errors
    if (error.code === "P2002") {
      throw new Error(
        `Unique constraint failed on the field: ${error.meta?.target}`,
      );
    }

    throw new Error(error.message || "Unexpected error occurred");
  }
}
// lib/utils/slugify.ts
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/--+/g, "-"); // remove multiple dashes
}

export function getDateString(date?: Date): string | undefined {
  if (!date) return undefined;
  return date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}
export async function deleteFile(filePath: string): Promise<void> {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.warn(`File not found, skipping: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
    // Optional: throw or silently fail
    throw new Error(`Error deleting file: ${filePath}`);
  }
}
