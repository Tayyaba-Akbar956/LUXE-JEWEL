import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const supabase = createClient();

  // Fetch featured products
  const { data: featuredData } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8);

  const featuredProducts = featuredData || [];

  // Fetch new products
  const { data: newData } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  const newProducts = newData || [];

  // Category showcase images
  const categories = [
    {
      name: 'Rings',
      slug: 'rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
      description: 'Exquisite rings for every occasion'
    },
    {
      name: 'Necklaces',
      slug: 'necklaces',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
      description: 'Elegant necklaces that captivate'
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
      description: 'Statement earrings for every style'
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
      description: 'Beautiful bracelets to adorn your wrist'
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-luxury-black">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
              alt="Luxury jewelry"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/50" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4">
            <div className="max-w-2xl">
              <span className="inline-block font-heading text-sm uppercase tracking-[0.3em] text-gold-500 mb-4 animate-fade-in">
                Timeless Elegance
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-champagne-200 leading-tight mb-6 animate-fade-in">
                Discover the Art of
                <span className="block text-gold-gradient">Luxury Jewelry</span>
              </h1>
              <p className="text-lg text-silver-400 mb-8 leading-relaxed animate-fade-in">
                Exquisite pieces crafted with precision and passion. Each creation tells a story of elegance, sophistication, and timeless beauty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <Link href="/products" className="btn-luxury text-center">
                  Explore Collection
                </Link>
                <Link href="#categories" className="btn-luxury-outline text-center">
                  Shop by Category
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 rounded-full border-2 border-gold-500/50 flex justify-center pt-2">
              <div className="w-1 h-2 bg-gold-500 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: '💎', title: 'Exquisite Quality', desc: 'Premium Grade Crystals' },
                { icon: '🚚', title: 'Fast Shipping', desc: 'Reliable doorstep delivery' },
                { icon: '↩️', title: 'Easy Returns', desc: 'Stress-free 7-day policy' },
                { icon: '🔒', title: 'Secure Payment', desc: '100% encrypted checkout' },
              ].map((badge, i) => (
                <div key={i} className="text-center">
                  <span className="text-3xl mb-2 block">{badge.icon}</span>
                  <h3 className="font-heading text-sm uppercase tracking-wider text-gold-500">{badge.title}</h3>
                  <p className="text-xs text-silver-500 mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500">Curated Selection</span>
              <h2 className="font-display text-4xl md:text-5xl text-champagne-200 mt-2">Featured Pieces</h2>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length === 0 ? (
                <div className="col-span-full text-center text-silver-500">No featured items available.</div>
              ) : featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/products" className="btn-luxury-outline">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-20 bg-luxury-black-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500">Collections</span>
              <h2 className="font-display text-4xl md:text-5xl text-champagne-200 mt-2">Shop by Category</h2>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-gold-500/20 hover:border-gold-500/50 transition-all duration-500"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                    <h3 className="font-display text-2xl text-champagne-200 group-hover:text-gold-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-silver-500 mt-1">{category.description}</p>
                    <span className="inline-block mt-4 font-heading text-xs uppercase tracking-widest text-gold-500 border-b border-gold-500/50">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500">Fresh Additions</span>
              <h2 className="font-display text-4xl md:text-5xl text-champagne-200 mt-2">New Arrivals</h2>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.length === 0 ? (
                <div className="col-span-full text-center text-silver-500">No new arrivals.</div>
              ) : newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-luxury-black-100 border-y border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500">Client Stories</span>
              <h2 className="font-display text-4xl md:text-5xl text-champagne-200 mt-2">What Our Clients Say</h2>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  text: "The crystal ring exceeded all my expectations. The sparkle is extraordinary, and it looks so much like the real thing. My sister absolutely loves it!",
                  author: "James M.",
                  title: "Gilded Solitaire Crystal Ring",
                  rating: 5
                },
                {
                  text: "I've purchased artificial jewelry from many places, but LuxeJewel's quality is unmatched. The emerald-city drop necklace is breathtaking.",
                  author: "Sarah L.",
                  title: "Emerald City Drop Necklace",
                  rating: 5
                },
                {
                  text: "Fast shipping, beautiful packaging, and the faux pearl earrings are even more stunning in person. I'll definitely be a returning customer.",
                  author: "Emily R.",
                  title: "Faux Pearl Drop Earrings",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div key={i} className="card-luxury p-8 text-center">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <svg key={j} className="h-5 w-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-silver-400 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="mt-6 pt-6 border-t border-gold-500/20">
                    <p className="font-heading text-sm uppercase tracking-wider text-champagne-200">{testimonial.author}</p>
                    <p className="text-xs text-gold-500 mt-1">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-gold-500">Stay Connected</span>
              <h2 className="font-display text-4xl md:text-5xl text-champagne-200 mt-2">Join the Elite</h2>
              <p className="text-silver-400 mt-4 mb-8">
                Subscribe to receive exclusive offers, early access to new collections, and personalized styling tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-luxury flex-1"
                />
                <button type="submit" className="btn-luxury whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}