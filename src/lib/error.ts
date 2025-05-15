import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function handleApiError(error: unknown, defaultMessage = 'Internal server error'): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Unique constraint violation' }, { status: 409 });
    }
    if (error.message.includes('Record to update not found') || error.message.includes('Record to delete not found')) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
  }
  return NextResponse.json({ error: defaultMessage }, { status: 500 });
}
