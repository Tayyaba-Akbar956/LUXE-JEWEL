-- Seed Categories with Real Images
INSERT INTO categories (name, slug, description, image_url) VALUES
('Rings', 'rings', 'Elegant rings for every occasion', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'),
('Necklaces', 'necklaces', 'Stunning necklaces to elevate your style', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'),
('Earrings', 'earrings', 'Beautiful earrings that sparkle', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'),
('Bracelets', 'bracelets', 'Chic bracelets for a modern look', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80')
ON CONFLICT (slug) DO UPDATE SET 
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- Seed Products with High-Quality Professional Photography
INSERT INTO products (name, slug, description, short_description, price, compare_price, category_id, inventory_quantity, images, featured_image, is_featured, rating_average, rating_count) VALUES
(
  'Gold Chain Necklace', 
  'gold-chain-necklace', 
  'A versatile 18k gold chain necklace that adds a touch of sophistication to any outfit. The interlinked design ensures durability and a smooth feel against the skin.',
  'Classic gold chain necklace for versatile styling.',
  149.99, 
  null, 
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  30, 
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'],
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
  true,
  4.5,
  18
),
(
  'Pearl Drop Earrings', 
  'pearl-drop-earrings', 
  'Elegant freshman pearls suspended from sterling silver hooks. These drop earrings capture the essence of sophistication and are perfect for weddings or evening events.',
  'Elegant pearl drop earrings for special occasions.',
  89.99, 
  120.00, 
  (SELECT id FROM categories WHERE slug = 'earrings'),
  20, 
  ARRAY['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80'],
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
  false,
  4.2,
  32
),
(
  'Silver Bangles Set', 
  'silver-bangles-set', 
  'A set of three polished silver bangles. Wear them stacked for a bold statement or individually for a subtle shine. Handcrafted with attention to detail.',
  'Set of three stylish silver bangles.',
  79.99, 
  null, 
  (SELECT id FROM categories WHERE slug = 'bracelets'),
  45, 
  ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  false,
  4.6,
  15
),
(
  'Sapphire Halo Ring', 
  'sapphire-halo-ring', 
  'A stunning deep blue sapphire surrounded by a halo of sparkling diamonds. Set in platinum, this ring is a true showstopper and a perfect engagement or anniversary gift.',
  'Exquisite sapphire ring with diamond halo.',
  599.99, 
  750.00, 
  (SELECT id FROM categories WHERE slug = 'rings'),
  10, 
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  true,
  4.9,
  8
)
ON CONFLICT (slug) DO UPDATE SET
  images = EXCLUDED.images,
  featured_image = EXCLUDED.featured_image,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
