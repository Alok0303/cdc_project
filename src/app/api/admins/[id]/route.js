// src/app/api/admins/[id]/route.js
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';

// DELETE - Delete admin
export async function DELETE(request, { params }) {
  const { id } = await params;
  
  try {
    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await dbConnect();

    // Prevent deleting yourself
    if (auth.admin._id.toString() === id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}

// PUT - Update admin status
export async function PUT(request, { params }) {
  const { id } = await params;
  
  try {
    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await dbConnect();

    const { isActive } = await request.json();

    // Prevent deactivating yourself
    if (auth.admin._id.toString() === id) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin' },
      { status: 500 }
    );
  }
}