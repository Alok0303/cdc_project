// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth.js';

export async function GET(request) {
  try {
    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) {
      return auth; // Return error response if not authenticated
    }

    return NextResponse.json({
      success: true,
      data: auth.admin,
    });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get admin details' },
      { status: 500 }
    );
  }
}