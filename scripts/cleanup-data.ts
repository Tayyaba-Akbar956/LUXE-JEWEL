import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log('🧹 Cleaning up extra products...');

    const originalSlugs = [
        'gold-chain-necklace',
        'pearl-drop-earrings',
        'silver-bangles-set',
        'sapphire-halo-ring'
    ];

    // Delete products not in the original list
    const { data: deletedProducts, error: prodError } = await supabase
        .from('products')
        .delete()
        .not('slug', 'in', `(${originalSlugs.join(',')})`)
        .select();

    if (prodError) {
        console.error('Error deleting products:', prodError.message);
    } else {
        console.log(`✅ Removed ${deletedProducts?.length || 0} extra products.`);
    }

    console.log('🧹 Cleaning up extra categories...');
    const extraCategories = ['bangles', 'anklets'];

    const { data: deletedCats, error: catError } = await supabase
        .from('categories')
        .delete()
        .in('slug', extraCategories)
        .select();

    if (catError) {
        console.error('Error deleting categories:', catError.message);
    } else {
        console.log(`✅ Removed ${deletedCats?.length || 0} extra categories.`);
    }

    console.log('✨ Cleanup complete!');
}

cleanup().catch(console.error);
