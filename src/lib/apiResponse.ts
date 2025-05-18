import { NextResponse } from "next/server";

/**
 * Returns a standardized success response
 */
export function NextSuccess(message: string, data?: any, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

/**
 * Returns a standardized error response
 * Includes full raw error and formatted summary (e.g. Prisma validation errors)
 */

/**
 * Cleans and formats a long stack-like error string for readable output
 */
function formatMultilineError(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Extracts a useful summary line from a stack error
 */
function extractSummary(lines: string[]): string | null {
  return (
    lines.find(
      (line) =>
        line.toLowerCase().includes("argument") ||
        line.toLowerCase().includes("missing"),
    ) ||
    lines[lines.length - 1] ||
    null
  );
}

/**
 * Returns a standardized error response
 * Includes:
 * - raw: original error string or object
 * - formatted: multiline formatted version (for devs)
 * - summary: short user-facing summary (for toasts)
 */
export function NextError(message: string, err?: any, status = 400) {
  let formatted: string[] | null = null;
  let summary: string | null = null;

  if (typeof err === "string" && err.includes("\n")) {
    formatted = formatMultilineError(err);
    summary = extractSummary(formatted);
  }

  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        formatted,
        summary,
      },
    },
    { status },
  );
}
