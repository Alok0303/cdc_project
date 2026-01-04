// src/lib/auth.js
import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import dbConnect from './mongodb';
import Admin from '@/models/Admin';

export const authenticate = async (request) => {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return { authenticated: false, error: 'No token provided' };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return { authenticated: false, error: 'Invalid or expired token' };
    }

    await dbConnect();

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return { authenticated: false, error: 'Admin not found or inactive' };
    }

    return { authenticated: true, admin };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed' };
  }
};

export const requireAuth = async (request) => {
  const auth = await authenticate(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: 401 }
    );
  }

  return auth;
};