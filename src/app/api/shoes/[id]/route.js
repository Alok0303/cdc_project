// src/app/api/shoes/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shoe from '@/models/Shoe';

// GET - Fetch single shoe by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const shoe = await Shoe.findById(id).lean();
    
    if (!shoe) {
      return NextResponse.json(
        { success: false, error: 'Shoe not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: shoe 
    });
  } catch (error) {
    console.error('GET single shoe error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update shoe by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const formData = await request.formData();
    
    // Extract fields
    const updateData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: parseFloat(formData.get('price')),
      discount: parseFloat(formData.get('discount')) || 0,
      stock: parseInt(formData.get('stock')),
      category: formData.get('category'),
      sales: formData.get('sales'),
    };
    
    // Handle images if provided
    const newImages = formData.getAll('images');
    if (newImages.length > 0 && newImages[0].size > 0) {
      // If new images uploaded, handle them
      // For now, we'll keep existing images
      // You can add image upload logic here similar to POST route
    }
    
    const shoe = await Shoe.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!shoe) {
      return NextResponse.json(
        { success: false, error: 'Shoe not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: shoe 
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete shoe by ID
export async function DELETE(request, { params }) {
  try {
    console.log('DELETE request for shoe:', params.id);
    await dbConnect();
    
    const { id } = params;
    
    const shoe = await Shoe.findByIdAndDelete(id);
    
    if (!shoe) {
      return NextResponse.json(
        { success: false, error: 'Shoe not found' },
        { status: 404 }
      );
    }
    
    console.log('Shoe deleted successfully:', id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Shoe deleted successfully',
      data: shoe 
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}