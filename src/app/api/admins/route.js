// src/app/api/admins/route.js
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';

// GET - Fetch all admins
export async function GET(request) {
  try {
    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await dbConnect();

    const admins = await Admin.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: admins,
      count: admins.length,
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

// POST - Add new admin
export async function POST(request) {
  try {
    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await dbConnect();

    const { name, email, password, role } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, email, and password' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin',
      createdBy: auth.admin._id,
    });

    // Remove password from response
    const adminData = admin.toObject();
    delete adminData.password;

    return NextResponse.json(
      { success: true, data: adminData, message: 'Admin added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add admin error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add admin' },
      { status: 500 }
    );
  }
}