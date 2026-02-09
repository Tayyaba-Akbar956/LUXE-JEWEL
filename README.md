# LuxeJewel - Elegant Jewelry E-commerce Platform

LuxeJewel is a premium e-commerce platform for jewelry, targeting budget-conscious millennials and Gen Z customers. The platform combines elegant design with modern functionality to create a luxurious shopping experience at accessible prices.

## Features

- **Elegant UI/UX**: Sophisticated design with luxury aesthetic
- **Product Catalog**: Browse and filter jewelry by category, price, and other attributes
- **Shopping Cart**: Add/remove items, adjust quantities
- **Wishlist**: Save favorite items for later
- **Product Reviews**: Star ratings and written reviews
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Fast loading with image optimization
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Custom SVG icons
- **Database**: Mock data for demonstration (designed for Supabase integration)
- **Payment**: Stripe integration (configured but not activated in demo)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/luxejewel.git
```

2. Navigate to the project directory:
```bash
cd luxejewel
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Project Structure

```
luxejewel/
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # Shadcn/ui components
│   │   ├── Header.tsx     # Header component
│   │   ├── Footer.tsx     # Footer component
│   │   ├── ProductCard.tsx # Product card component
│   │   ├── StarRating.tsx # Star rating component
│   │   ├── AddToCartButton.tsx # Add to cart button
│   │   └── WishlistButton.tsx # Wishlist button
│   ├── pages/             # API routes
│   │   └── api/
│   │       └── products.ts # Products API route
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Helper functions
│   └── styles/            # Additional styles (if needed)
├── __tests__/             # Test files
│   └── components/        # Component tests
│       └── ProductCard.test.tsx
├── public/                # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## API Routes

- `GET /api/products` - Get products with optional filtering and pagination
- `POST /api/products` - Create new product (admin only, not enabled in demo)

## Testing

The project uses Vitest for unit and integration testing. Component tests are written with React Testing Library.

Run tests with:
```bash
npm run test
```

## Deployment

The application is designed for deployment on Vercel. Connect your repository to Vercel and it will automatically build and deploy.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by luxury jewelry brands and modern e-commerce best practices
- Built with Next.js, TypeScript, and Tailwind CSS
- Icons from custom SVG implementations