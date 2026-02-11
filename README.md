# LuxeJewel - Luxury Jewelry E-commerce Platform

LuxeJewel is a premium e-commerce platform designed for selling luxury jewelry with a focus on user experience, performance, and modern web technologies.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with a luxury design system
- **Supabase** for authentication and database
- **AI-Powered Visual Search** - Find similar jewelry by uploading images
- **Responsive Design** - Works on all device sizes
- **Admin Dashboard** - Manage products, orders, and customers
- **Secure Payment Processing** - With mock payment option
- **Advanced Filtering & Sorting** - For product discovery
- **Wishlist & Reviews** - Enhanced user engagement
- **Performance Optimized** - Fast loading times

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Mock payment system (ready for Stripe integration)
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd luxejewel
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For production deployment
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_API_KEY=your_google_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
luxejewel/
├── app/                    # Next.js 14 App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── ai-search/         # AI visual search
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── products/          # Product pages
│   ├── wishlist/          # Wishlist
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── context/           # React contexts
│   ├── data/              # Static data
│   └── lib/               # Utility functions
├── __tests__/             # Unit and integration tests
├── tests-e2e/             # End-to-end tests
└── ...
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT` | Set to `true` to use mock payment system |
| `NEXT_PUBLIC_APP_URL` | The URL of your deployed application |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side operations (not public) |
| `GOOGLE_API_KEY` | Google API key for AI features |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint the code
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests in UI mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Import your project into [Vercel](https://vercel.com)
3. Add the required environment variables in the Vercel dashboard
4. Your application will be deployed automatically

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Routes

- `GET /api/products` - Get all products
- `GET /api/products/[slug]` - Get a specific product
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove item from cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/reviews` - Get product reviews
- `POST /api/reviews` - Submit review
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist` - Remove from wishlist
- `GET /api/search` - Search products

## Testing

### Unit Tests

Run unit tests with Vitest:
```bash
npm run test
```

### End-to-End Tests

Run E2E tests with Playwright:
```bash
npx playwright test
```

## Admin Dashboard

The admin dashboard is accessible at `/admin` and includes:

- Product management (CRUD operations)
- Order management
- Customer management
- Analytics and reporting
- Review moderation

## Payment System

The application includes a mock payment system that simulates payment processing without real transactions. To enable real payment processing:

1. Set `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=false`
2. Add your Stripe keys to environment variables
3. Update the payment processing logic in the checkout flow

## AI Features

The application includes AI-powered visual search that allows users to upload an image and find similar jewelry products. This feature uses Google's Generative AI for image analysis.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.