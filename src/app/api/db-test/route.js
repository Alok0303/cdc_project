import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await dbConnect();
    
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      connectionState: states[connectionState],
      dbName: mongoose.connection.name
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}