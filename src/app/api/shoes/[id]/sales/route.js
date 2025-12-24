import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shoe from '@/models/Shoe';

// DELETE - Delete a sale from sales history
export async function DELETE(request, { params }) {
  const { id } = await params;
  
  try {
    await dbConnect();
    
    const body = await request.json();
    const { saleIndex, newTotalSales, updatedSalesHistory } = body;

    if (saleIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Sale index is required' },
        { status: 400 }
      );
    }

    // Find the shoe
    const shoe = await Shoe.findById(id);

    if (!shoe) {
      return NextResponse.json(
        { success: false, error: 'Shoe not found' },
        { status: 404 }
      );
    }

    // Update the shoe with new sales history and total
    shoe.salesHistory = updatedSalesHistory;
    shoe.sales = newTotalSales;

    await shoe.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Sale entry deleted successfully',
      data: shoe 
    });
  } catch (error) {
    console.error('DELETE Sale Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete sale entry' 
      },
      { status: 500 }
    );
  }
}