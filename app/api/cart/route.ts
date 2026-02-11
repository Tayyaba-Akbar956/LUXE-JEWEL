import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = request.headers.get('x-session-id');
    const userId = searchParams.get('userId');

    let query = supabase.from('shopping_cart').select('*, products(*)');

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else {
      return NextResponse.json({ error: 'User ID or Session ID is required' }, { status: 400 });
    }

    const { data, error } = await query.order('added_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1, userId, sessionId, variantId } = await request.json();

    if (!productId || quantity <= 0) {
      return NextResponse.json({ error: 'Valid product ID and quantity are required' }, { status: 400 });
    }

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'User ID or Session ID is required' }, { status: 400 });
    }

    // Check if item already exists in cart
    let query = supabase.from('shopping_cart').select('*').eq('product_id', productId);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    if (variantId) {
      query = query.eq('variant_id', variantId);
    }

    const { data: existingItems, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existingItems && existingItems.length > 0) {
      // Update quantity
      const { data, error } = await supabase
        .from('shopping_cart')
        .update({
          quantity: existingItems[0].quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItems[0].id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('shopping_cart')
        .insert([{
          user_id: userId || null,
          session_id: sessionId || null,
          product_id: productId,
          variant_id: variantId || null,
          quantity: quantity
        }])
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, quantity } = await request.json();

    if (!id || quantity < 0) {
      return NextResponse.json({ error: 'Valid cart item ID and quantity are required' }, { status: 400 });
    }

    if (quantity === 0) {
      const { error } = await supabase.from('shopping_cart').delete().eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ message: 'Item removed' });
    } else {
      const { data, error } = await supabase
        .from('shopping_cart')
        .update({
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (id) {
      const { error } = await supabase.from('shopping_cart').delete().eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (userId || sessionId) {
      let query = supabase.from('shopping_cart').delete();
      if (userId) query = query.eq('user_id', userId);
      else query = query.eq('session_id', sessionId);

      const { error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'ID, User ID, or Session ID is required' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Cart cleared or item removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}