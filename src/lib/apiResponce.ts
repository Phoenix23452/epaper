// lib/apiResponse.ts
import { NextResponse } from "next/server";

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

export function NextError(message: string, err?: any, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: err ?? null,
    },
    { status },
  );
}
