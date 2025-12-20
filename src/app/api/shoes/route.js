import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Shoe from '@/models/Shoe';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET - Fetch all shoes
export async function GET() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected, fetching shoes...');
    
    const shoes = await Shoe.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Found ${shoes.length} shoes`);
    
    return NextResponse.json({ 
      success: true, 
      data: shoes 
    }, { 
      status: 200 
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch shoes' 
      },
      { status: 500 }
    );
  }
}

// POST - Add new shoe
export async function POST(request) {
  try {
    console.log('Starting POST request...');
    await dbConnect();
    console.log('Database connected');

    const formData = await request.formData();
    console.log('Form data received');
    
    // Extract fields
    const name = formData.get('name');
    const brand = formData.get('brand');
    const price = parseFloat(formData.get('price'));
    const discount = parseFloat(formData.get('discount')) || 0;
    const stock = parseInt(formData.get('stock'));
    const category = formData.get('category');
    
    console.log('Extracted fields:', { name, brand, price, discount, stock, category });
    
    // Validate required fields
    if (!name || !brand || !price || !stock || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get all image files
    const images = formData.getAll('images');
    console.log(`Processing ${images.length} images`);
    
    // Upload images to Cloudinary
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image && image.size > 0) {
        try {
          console.log(`Uploading image ${i + 1}/${images.length}...`);
          
          // Convert File to buffer
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Convert buffer to base64
          const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
          
          // Upload to Cloudinary
          const uploadedUrl = await uploadToCloudinary(base64Image);
          imageUrls.push(uploadedUrl);
          console.log(`Image ${i + 1} uploaded successfully`);
        } catch (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          // Continue with other images even if one fails
        }
      }
    }

    console.log(`${imageUrls.length} images uploaded successfully`);

    // Create shoe in database
    const shoe = await Shoe.create({
      name,
      brand,
      price,
      discount,
      stock,
      category,
      images: imageUrls,
    });

    console.log('Shoe created successfully:', shoe._id);

    return NextResponse.json(
      { success: true, data: shoe },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to add shoe',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}