-- Seed Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Rings', 'rings', 'Elegant rings for every occasion', 'https://placehold.co/600x400?text=Rings'),
('Necklaces', 'necklaces', 'Stunning necklaces to elevate your style', 'https://placehold.co/600x400?text=Necklaces'),
('Earrings', 'earrings', 'Beautiful earrings that sparkle', 'https://placehold.co/600x400?text=Earrings'),
('Bracelets', 'bracelets', 'Chic bracelets for a modern look', 'https://placehold.co/600x400?text=Bracelets');

-- Seed Products
INSERT INTO products (name, slug, description, short_description, price, compare_price, category_id, inventory_quantity, images, featured_image, is_featured, rating_average, rating_count) VALUES
(
  'Diamond Stud Earrings', 
  'diamond-stud-earrings', 
  'Classic diamond stud earrings set in 14k white gold. Perfect for daily wear or special occasions. These timeless pieces feature round-cut diamonds with excellent clarity and brilliance.',
  'Beautiful diamond stud earrings for everyday elegance.',
  199.99, 
  249.99, 
  (SELECT id FROM categories WHERE slug = 'earrings'),
  50, 
  ARRAY['https://placehold.co/600x600?text=Diamond+Studs+1', 'https://placehold.co/600x600?text=Diamond+Studs+2'],
  'https://placehold.co/600x600?text=Diamond+Studs+1',
  true,
  4.8,
  24
),
(
  'Gold Chain Necklace', 
  'gold-chain-necklace', 
  'A versatile 18k gold chain necklace that adds a touch of sophistication to any outfit. The interlinked design ensures durability and a smooth feel against the skin.',
  'Classic gold chain necklace for versatile styling.',
  149.99, 
  null, 
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  30, 
  ARRAY['https://placehold.co/600x600?text=Gold+Necklace+1', 'https://placehold.co/600x600?text=Gold+Necklace+2'],
  'https://placehold.co/600x600?text=Gold+Necklace+1',
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
  ARRAY['https://placehold.co/600x600?text=Pearl+Drop+1'],
  'https://placehold.co/600x600?text=Pearl+Drop+1',
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
  ARRAY['https://placehold.co/600x600?text=Silver+Bangles+1'],
  'https://placehold.co/600x600?text=Silver+Bangles+1',
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
  ARRAY['https://placehold.co/600x600?text=Sapphire+Ring+1', 'https://placehold.co/600x600?text=Sapphire+Ring+2'],
  'https://placehold.co/600x600?text=Sapphire+Ring+1',
  true,
  4.9,
  8
);
