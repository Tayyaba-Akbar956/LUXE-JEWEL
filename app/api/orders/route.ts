import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', parseInt(orderId))
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

      return NextResponse.json(data);
    } else if (userId) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'User ID or Order ID is required' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      userId,
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      paymentMethod = 'mock'
    } = await request.json();

    if (!items || items.length === 0 || totalAmount <= 0) {
      return NextResponse.json({ error: 'Valid items and total amount are required' }, { status: 400 });
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 1. Insert the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId || null,
        order_number: orderNumber,
        status: 'pending',
        subtotal: subtotal,
        tax_amount: taxAmount || 0,
        shipping_amount: shippingAmount || 0,
        discount_amount: discountAmount || 0,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
        payment_status: 'paid', // In mock mode, we assume success
        payment_method: paymentMethod
      }])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // 2. Insert order items
    const orderItemsRecord = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsRecord);

    if (itemsError) {
      // Note: Ideally wrap this in a transaction or cleanup order on failure
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // 3. Clear cart if userId is present
    if (userId) {
      await supabase.from('shopping_cart').delete().eq('user_id', userId);
    }

    return NextResponse.json(orderData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: status,
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
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}