import { AppError } from '@/lib/errors/appError';
import { NextResponse } from 'next/server';

export function handleApiError(error: unknown) {
    if (error instanceof AppError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
