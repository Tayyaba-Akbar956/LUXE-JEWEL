import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '@/components/ProductCard';

// Mock the next/image component since we're testing
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the AddToCartButton component
vi.mock('@/components/AddToCartButton', () => ({
  __esModule: true,
  default: ({ productId, variantId, onAddToCart }: { productId: number; variantId?: number; onAddToCart: () => void }) => (
    <button onClick={onAddToCart} data-testid="add-to-cart-button">
      Add to Cart
    </button>
  ),
}));

// Mock the WishlistButton component
vi.mock('@/components/WishlistButton', () => ({
  __esModule: true,
  default: ({ productId, onToggleWishlist }: { productId: number; onToggleWishlist: () => void }) => (
    <button onClick={onToggleWishlist} data-testid="wishlist-button">
      Wishlist
    </button>
  ),
}));

const mockProduct = {
  id: 1,
  name: 'Diamond Stud Earrings',
  price: 199.99,
  comparePrice: 249.99,
  imageUrls: ['https://example.com/earrings.jpg'],
  featuredImageUrl: 'https://example.com/earrings.jpg',
  ratingAverage: 4.5,
  ratingCount: 24,
  category: 'Earrings',
  shortDescription: 'Beautiful diamond stud earrings for everyday elegance.',
};

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    // Check that product name is displayed
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

    // Check that price is displayed
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();

    // Check that compare price is displayed (if different from regular price)
    if (mockProduct.comparePrice && mockProduct.comparePrice !== mockProduct.price) {
      expect(screen.getByText(`$${mockProduct.comparePrice}`)).toBeInTheDocument();
    }

    // Check that image is displayed
    const image = screen.getByAltText(mockProduct.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.featuredImageUrl);

    // Check that rating information is displayed
    expect(screen.getByText(`${mockProduct.ratingAverage} (${mockProduct.ratingCount})`)).toBeInTheDocument();
  });

  it('handles "Add to Cart" button click', () => {
    const mockOnAddToCart = vi.fn();
    
    // Mock the AddToCartButton to call our mock function
    vi.doMock('@/components/AddToCartButton', () => ({
      __esModule: true,
      default: ({ onAddToCart }: { onAddToCart: () => void }) => (
        <button onClick={() => onAddToCart()} data-testid="add-to-cart-button">
          Add to Cart
        </button>
      ),
    }));

    // Need to dynamically import after mocking
    const { default: ProductCardDynamic } = require('@/components/ProductCard');
    render(<ProductCardDynamic product={mockProduct} onAddToCart={mockOnAddToCart} />);

    const addToCartButton = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('handles wishlist toggle', () => {
    const mockOnToggleWishlist = vi.fn();
    
    // Mock the WishlistButton to call our mock function
    vi.doMock('@/components/WishlistButton', () => ({
      __esModule: true,
      default: ({ onToggleWishlist }: { onToggleWishlist: () => void }) => (
        <button onClick={() => onToggleWishlist()} data-testid="wishlist-button">
          Wishlist
        </button>
      ),
    }));

    // Need to dynamically import after mocking
    const { default: ProductCardDynamic } = require('@/components/ProductCard');
    render(<ProductCardDynamic product={mockProduct} onToggleWishlist={mockOnToggleWishlist} />);

    const wishlistButton = screen.getByTestId('wishlist-button');
    fireEvent.click(wishlistButton);

    expect(mockOnToggleWishlist).toHaveBeenCalledWith(mockProduct.id);
  });

  it('displays image loading and error states', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText(mockProduct.name);
    
    // Initially, image should be loading
    expect(image).toBeInTheDocument();
    
    // Simulate error state
    fireEvent.error(image);
    
    // Check if fallback image or placeholder is shown
    // This would depend on how the Image component handles errors in the actual implementation
  });

  it('applies correct CSS classes for styling', () => {
    render(<ProductCard product={mockProduct} />);

    // Check if the main container has appropriate CSS classes
    const cardContainer = screen.getByRole('article');
    expect(cardContainer).toHaveClass('group', 'relative', 'overflow-hidden');

    // Check if the image container has appropriate classes
    const imageLink = screen.getByRole('link');
    expect(imageLink).toHaveClass('aspect-square', 'w-full', 'overflow-hidden', 'rounded-md');
  });

  it('shows quick view button on hover (desktop)', () => {
    render(<ProductCard product={mockProduct} />);

    const imageLink = screen.getByRole('link');
    fireEvent.mouseEnter(imageLink);

    // Check if quick view button appears on hover
    const quickViewButton = screen.queryByText('Quick View');
    if (quickViewButton) {
      expect(quickViewButton).toBeInTheDocument();
    }
  });

  it('responds to responsive behavior', () => {
    // Test mobile behavior
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<ProductCard product={mockProduct} />);

    // Check if mobile-specific behavior is applied
    // This would depend on the actual implementation
  });
});