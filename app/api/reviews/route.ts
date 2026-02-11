import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    let query = supabase
      .from('reviews')
      .select('*, profiles(username, avatar_url)');

    if (productId) {
      query = query.eq('product_id', parseInt(productId));
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else {
      return NextResponse.json({ error: 'Product ID or User ID is required' }, { status: 400 });
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, userId, rating, comment } = await request.json();

    if (!productId || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid product ID and rating (1-5) are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: parseInt(productId),
        user_id: userId,
        rating: rating,
        comment: comment || '',
        is_approved: true // Auto-approving for now, could be false by default
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Note: In a full production app, we'd use a trigger to update products.rating_average
    // or run a manual update here.

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, rating, comment } = await request.json();

    if (!id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Review ID and valid rating (1-5) are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: rating,
        comment: comment,
        created_at: new Date().toISOString() // Assuming we want to track update time
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}