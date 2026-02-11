import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

// Mock the next/link component
vi.mock('next/link', async () => {
  const mod = await vi.importActual('next/link');
  return {
    ...(mod as any),
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href} data-testid="link">{children}</a>
    ),
  };
});

// Mock the next/image component
vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      return <img {...props} data-testid="mock-image" />;
    },
  };
});

// Mock the CartContext
vi.mock('@/context/CartContext', async () => {
  const actual = await vi.importActual('@/context/CartContext');
  return {
    ...(actual as any),
    useCart: () => ({
      addItem: vi.fn(),
      isInCart: vi.fn().mockReturnValue(false),
    }),
  };
});

// Mock the WishlistContext
vi.mock('@/context/WishlistContext', async () => {
  const actual = await vi.importActual('@/context/WishlistContext');
  return {
    ...(actual as any),
    useWishlist: () => ({
      toggleItem: vi.fn(),
      isInWishlist: vi.fn().mockReturnValue(false),
    }),
  };
});

const mockProduct = {
  id: 1,
  name: 'Gilded Solitaire Crystal Ring',
  slug: 'gilded-solitaire-crystal-ring',
  price: 24.99,
  comparePrice: 34.99,
  category: 'rings',
  images: ['https://placehold.co/600x600?text=Ring'],
  featuredImage: 'https://placehold.co/600x600?text=Ring',
  description: 'A stunning solitaire ring featuring a high-quality cubic zirconia crystal in a gold-plated setting.',
  shortDescription: 'Artificial crystal ring with gold plating',
  material: 'Gold-Plated Alloy',
  gemstone: 'Cubic Zirconia',
  weight: '3.5g',
  ratingAverage: 4.8,
  ratingCount: 156,
  inStock: true,
  stockQuantity: 50,
  isFeatured: true,
  isNew: false,
  isSale: false,
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={mockProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    // Check that product name is displayed
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

    // Check that price is displayed
    expect(screen.getByText('$24.99')).toBeInTheDocument();

    // Check that compare price is displayed (if different from regular price)
    expect(screen.getByText('$34.99')).toBeInTheDocument();

    // Check that image is displayed
    const image = screen.getByTestId('mock-image');
    expect(image).toBeInTheDocument();

    // Check that rating information is displayed
    expect(screen.getByText('(156)')).toBeInTheDocument();
  });

  it('displays badges for new and sale products', () => {
    const specialProduct = {
      ...mockProduct,
      isNew: true,
      isSale: true,
    };

    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={specialProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    // Check for "New" badge
    expect(screen.getByText('New')).toBeInTheDocument();

    // Check for discount percentage badge
    expect(screen.getByText('-29%')).toBeInTheDocument();
  });

  it('does not display badges for regular products', () => {
    const regularProduct = {
      ...mockProduct,
      isNew: false,
      isSale: false,
      comparePrice: undefined,
    };

    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={regularProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    // Check that "New" badge is not present
    expect(screen.queryByText('New')).not.toBeInTheDocument();

    // Check that discount badge is not present
    expect(screen.queryByText('-')).not.toBeInTheDocument();
  });

  it('renders short description', () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={mockProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    expect(screen.getByText(mockProduct.shortDescription)).toBeInTheDocument();
  });

  it('renders category', () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={mockProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    expect(screen.getByText('rings')).toBeInTheDocument();
  });

  it('handles add to cart functionality', () => {
    const { useCart } = require('@/context/CartContext');
    const mockAddItem = vi.fn();
    useCart.mockReturnValue({
      addItem: mockAddItem,
      isInCart: vi.fn().mockReturnValue(false),
    });

    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={mockProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    // Find and click the "Add to Cart" button
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    // Verify that the addItem function was called with the correct product ID
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct.id);
  });

  it('handles wishlist toggle functionality', () => {
    const { useWishlist } = require('@/context/WishlistContext');
    const mockToggleItem = vi.fn();
    useWishlist.mockReturnValue({
      toggleItem: mockToggleItem,
      isInWishlist: vi.fn().mockReturnValue(false),
    });

    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={mockProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    // Find and click the wishlist button
    const wishlistButton = screen.getByLabelText('Add to wishlist');
    fireEvent.click(wishlistButton);

    // Verify that the toggleItem function was called with the correct product ID
    expect(mockToggleItem).toHaveBeenCalledWith(mockProduct.id);
  });

  it('displays "In Cart" text when product is in cart', () => {
    const { useCart } = require('@/context/CartContext');
    useCart.mockReturnValue({
      addItem: vi.fn(),
      isInCart: vi.fn().mockReturnValue(true),
    });

    render(
      <CartProvider>
        <WishlistProvider>
          <ProductCard product={mockProduct} />
        </WishlistProvider>
      </CartProvider>
    );

    // Check that "In Cart" text is displayed instead of "Add to Cart"
    expect(screen.getByText('In Cart')).toBeInTheDocument();
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
  });
});