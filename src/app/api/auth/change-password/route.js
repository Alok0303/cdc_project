// src/app/api/auth/change-password/route.js
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';

export async function PUT(request) {
  try {
    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) {
      return auth; // Return error response if not authenticated
    }

    await dbConnect();

    const {  newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: 'Please provide new password' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Get admin with password
    const admin = await Admin.findById(auth.admin._id).select('+password');

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}