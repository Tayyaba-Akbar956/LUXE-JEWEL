import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ProductsPage from '../../app/products/page';
import { products } from '@/data/products';

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

// Mock the ProductCard component
vi.mock('@/components/ProductCard', () => {
  return {
    __esModule: true,
    default: ({ product }: { product: any }) => (
      <div data-testid="product-card" data-product-id={product.id}>
        <span>{product.name}</span>
      </div>
    ),
  };
});

// Mock the Header and Footer components
vi.mock('@/components/Header', () => {
  return {
    __esModule: true,
    default: () => <header data-testid="header">Header</header>,
  };
});

vi.mock('@/components/Footer', () => {
  return {
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>,
  };
});

describe('ProductsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all products', async () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductsPage />
        </WishlistProvider>
      </CartProvider>
    );

    // Wait for the page to render
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(products.length);
    });

    // Check that the header and footer are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Check that the page title is rendered
    expect(screen.getByText('All Jewelry')).toBeInTheDocument();

    // Check that the product count is accurate
    expect(screen.getByText(`${products.length} Exquisite Pieces`)).toBeInTheDocument();
  });

  it('allows filtering by category', async () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductsPage />
        </WishlistProvider>
      </CartProvider>
    );

    // Wait for the page to render
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(products.length);
    });

    // Count products in each category
    const ringsCount = products.filter(p => p.category === 'rings').length;
    const earringsCount = products.filter(p => p.category === 'earrings').length;

    // Check that category filter buttons exist
    expect(screen.getByText('Rings')).toBeInTheDocument();
    expect(screen.getByText('Earrings')).toBeInTheDocument();
    expect(screen.getByText('Necklaces')).toBeInTheDocument();
    expect(screen.getByText('Bracelets')).toBeInTheDocument();
  });

  it('allows sorting products', async () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductsPage />
        </WishlistProvider>
      </CartProvider>
    );

    // Wait for the page to render
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(products.length);
    });

    // Check that sort options exist
    const sortSelect = screen.getByRole('combobox');
    expect(sortSelect).toBeInTheDocument();
  });

  it('renders hero section', async () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ProductsPage />
        </WishlistProvider>
      </CartProvider>
    );

    // Wait for the page to render
    await waitFor(() => {
      expect(screen.getByText('All Jewelry')).toBeInTheDocument();
    });

    // Check that hero section elements exist
    expect(screen.getByText('All Jewelry')).toBeInTheDocument();
    expect(screen.getByText(`${products.length} Exquisite Pieces`)).toBeInTheDocument();
  });
});