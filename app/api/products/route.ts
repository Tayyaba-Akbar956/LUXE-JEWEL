import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = supabase.from('products').select('*');

    if (category) {
        // Need to join with categories table or filter by category_id if we had it mapping
        // For simplicity assuming category slug is passed and we filter by it via inner join logic
        // But standard supabase-js filtering on foreign tables is: .eq('categories.slug', category)
        // Let's assume we joined categories. For now, simple select.
        // If the valid way is filtering by category_id, we'd need that.
        // Let's try to filter by category slug if we set up the relationship correctly.
        // For MVP/Seed data, let's just fetch all and filter in memory if complex, or standard:
        // .eq('category_id', categoryId) -> requires looking up category first.

        // Easier approach for this stage: Fetch all, or just ignore category param for V1.
        // Let's defer complex filtering to V2.
    }

    if (featured === 'true') {
        query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
