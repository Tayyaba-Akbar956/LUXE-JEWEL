import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import { cn } from '@/lib/utils';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'LuxeJewel | Exquisite Luxury Jewelry Collection',
  description: 'Discover timeless elegance with our curated collection of fine jewelry. Premium diamonds, gold, and precious gemstones crafted for the modern connoisseur.',
  keywords: 'luxury jewelry, diamond rings, gold necklaces, fine jewelry, premium earrings, designer bracelets',
  openGraph: {
    title: 'LuxeJewel | Exquisite Luxury Jewelry Collection',
    description: 'Discover timeless elegance with our curated collection of fine jewelry.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.variable,
        playfair.variable,
        cormorant.variable,
        'font-sans min-h-screen bg-background antialiased'
      )}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}