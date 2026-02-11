import { NextResponse } from 'next/server';
import { Product, products } from '@/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'relevance'; // relevance, price-low, price-high, newest, rating
    
    if (!query && !category && !minPrice && !maxPrice) {
      return NextResponse.json({ error: 'At least one search parameter is required' }, { status: 400 });
    }

    // Start with all products or filter by category if specified
    let filteredProducts = [...products];
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Apply price filters if specified
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(product => product.price >= min);
      }
    }
    
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(product => product.price <= max);
      }
    }
    
    // Apply text search if query is provided
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.shortDescription.toLowerCase().includes(searchTerm) ||
        product.material.toLowerCase().includes(searchTerm) ||
        (product.gemstone && product.gemstone.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Since we don't have a date field in our mock data, we'll sort by ID (assuming newer items have higher IDs)
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.ratingAverage - a.ratingAverage);
        break;
      case 'relevance':
      default:
        // For now, we'll just return the filtered results as-is
        // In a real implementation with full-text search, we'd calculate relevance scores
        break;
    }

    // In a real implementation, we would query Supabase:
    /*
    let queryBuilder = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (category) {
      queryBuilder = queryBuilder.eq('category_id', category); // Assuming category is an ID
    }

    if (minPrice) {
      queryBuilder = queryBuilder.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.lte('price', parseFloat(maxPrice));
    }

    if (query) {
      // Full-text search on name and description
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`,
        { referencedTable: 'products' }
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        queryBuilder = queryBuilder.order('price', { ascending: true });
        break;
      case 'price-high':
        queryBuilder = queryBuilder.order('price', { ascending: false });
        break;
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
      case 'rating':
        queryBuilder = queryBuilder.order('rating_average', { ascending: false });
        break;
      default:
        // Default ordering
        break;
    }

    const { data, error } = await queryBuilder;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    */

    return NextResponse.json({
      results: filteredProducts,
      count: filteredProducts.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}