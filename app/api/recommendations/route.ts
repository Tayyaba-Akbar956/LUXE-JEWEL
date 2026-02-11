import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const count = parseInt(searchParams.get('count') || '4');

        if (productId) {
            // 1. Get the embedding for the current product
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('embedding')
                .eq('id', parseInt(productId))
                .single();

            if (productError || !product?.embedding) {
                // Fallback: Return products in same category
                const { data: currentProduct } = await supabase
                    .from('products')
                    .select('category_id')
                    .eq('id', parseInt(productId))
                    .single();

                const { data: recs, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_id', currentProduct?.category_id)
                    .neq('id', parseInt(productId))
                    .limit(count);

                return NextResponse.json(recs || []);
            }

            // 2. Use vector similarity to find similar items
            const { data: results, error: searchError } = await supabase.rpc('match_products', {
                query_embedding: product.embedding,
                match_threshold: 0.3, // Lower threshold for recommendations
                match_count: count + 1 // +1 because it might include itself
            });

            if (searchError) {
                return NextResponse.json({ error: searchError.message }, { status: 500 });
            }

            // Filter out the current product itself
            const filteredResults = (results || []).filter((p: any) => p.id !== parseInt(productId)).slice(0, count);

            return NextResponse.json(filteredResults);
        } else {
            // General recommendations (e.g., featured items)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_featured', true)
                .limit(count);

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Recommendations Error:', error);
        return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
    }
}
