# Project Walkthrough: LuxeJewel E-commerce Platform

## Project Overview

LuxeJewel is a premium e-commerce platform for jewelry, targeting budget-conscious millennials and Gen Z customers. The platform combines elegant design with modern functionality to create a luxurious shopping experience at accessible prices.

### Technologies Used
- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Animations**: Framer Motion
- **UI Components**: Custom-built with Tailwind
- **Database**: Designed for Supabase PostgreSQL
- **Payment**: Stripe integration
- **Deployment**: Vercel
- **Testing**: Vitest, React Testing Library

### Architecture Summary
- **Frontend**: Next.js app directory with server and client components
- **Backend**: Next.js API routes with plans for Supabase integration
- **Database**: PostgreSQL schema designed for e-commerce
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Payments**: Stripe integration

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

### Environment Variables Needed
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation Steps
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

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser

### Database Setup
1. Create a Supabase account
2. Create a new project
3. Set up the database schema using the definitions in TECHNICAL_SPEC.md
4. Configure Row Level Security (RLS) policies
5. Add environment variables to connect to your Supabase instance

### Running Locally
- Development: `npm run dev`
- Production build: `npm run build`
- Production server: `npm run start`
- Linting: `npm run lint`
- Testing: `npm run test`

### Running Tests
- All tests: `npm run test`
- Test with UI: `npm run test:ui`
- Coverage report: `npm run test:coverage`

## Deployment Guide

### Vercel Deployment Steps
1. Sign up for a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Link your project: `vercel link`
4. Deploy: `vercel --prod`
5. Configure environment variables in Vercel dashboard

### Supabase Configuration
1. Create production Supabase project
2. Set up the same schema as in development
3. Configure production RLS policies
4. Set up production storage buckets
5. Update environment variables in Vercel

### Stripe Setup
1. Create Stripe account
2. Get API keys for production
3. Configure webhooks for payment confirmation
4. Update environment variables in Vercel
5. Test payment flow in production

### Environment Variables in Production
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- DATABASE_URL
- NEXTAUTH_SECRET (if using NextAuth)

### Custom Domain Setup
1. Purchase domain (if needed)
2. Configure DNS settings
3. Add domain in Vercel dashboard
4. Set up SSL certificate (automatic with Vercel)
5. Configure redirects if needed

## Feature Tour

### Product Catalog
**What it does**: Displays jewelry products with filtering and sorting options
**How to use**: Browse products on the homepage or category pages
**How it works**: Server components fetch products, client components handle filtering
**Related files**: `/app/page.tsx`, `/src/components/ProductCard.tsx`
**API endpoints**: `/api/products`
**Database tables**: `products`, `categories`, `product_images`

### Shopping Cart
**What it does**: Allows users to add products and manage their selections
**How to use**: Click "Add to Cart" buttons, visit cart page to manage
**How it works**: Uses React state for guest carts, database for logged-in users
**Related files**: `/src/components/AddToCartButton.tsx`, `/src/pages/cart.tsx`
**API endpoints**: `/api/cart`
**Database tables**: `shopping_cart`

### Wishlist
**What it does**: Allows users to save products for later consideration
**How to use**: Click heart icons on product cards or detail pages
**How it works**: Stores in database linked to user accounts
**Related files**: `/src/components/WishlistButton.tsx`
**API endpoints**: `/api/wishlist`
**Database tables**: `wishlists`

### Product Reviews & Ratings
**What it does**: Enables customers to leave reviews and star ratings
**How to use**: Submit reviews on product detail pages
**How it works**: Reviews stored in database with user verification
**Related files**: `/src/components/StarRating.tsx`, `/src/components/ReviewCard.tsx`
**API endpoints**: `/api/reviews`
**Database tables**: `reviews`, `review_images`

### User Accounts
**What it does**: Manages user profiles, order history, and preferences
**How to use**: Register/login via header, manage profile in account section
**How it works**: Integrated with Supabase Auth for secure authentication
**Related files**: `/src/components/Header.tsx`, `/src/pages/account.tsx`
**API endpoints**: `/api/auth/*`
**Database tables**: `users`, `profiles`

### Admin Dashboard
**What it does**: Provides administrative interface for store management
**How to use**: Access via `/admin` route (requires admin privileges)
**How it works**: Role-based access control with Supabase RLS
**Related files**: `/src/app/admin/*`, `/src/components/Admin/*`
**API endpoints**: `/api/admin/*`
**Database tables**: `admin_users`

### Search Functionality
**What it does**: Allows users to search for products by name, category, etc.
**How to use**: Type in search bar in header
**How it works**: Text-based search with autocomplete
**Related files**: `/src/components/SearchBar.tsx`
**API endpoints**: `/api/search`
**Database tables**: `products`

### AI Image Search (Planned)
**What it does**: Allows users to upload images to find similar jewelry
**How to use**: Upload image on search page
**How it works**: Vector embeddings for visual similarity matching
**Related files**: `/src/components/ImageSearch.tsx`
**API endpoints**: `/api/search/ai`
**Database tables**: `products` (with vector embeddings)

## Code Organization

### Folder Structure Explanation
```
luxejewel/
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx          # Root layout with global styles
│   ├── page.tsx            # Homepage with product listings
│   └── globals.css         # Global styles and Tailwind configuration
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ui/            # Base UI components (buttons, etc.)
│   │   ├── Header.tsx     # Site navigation
│   │   ├── Footer.tsx     # Site footer
│   │   ├── ProductCard.tsx # Product display component
│   │   └── ...            # Other components
│   ├── pages/             # API routes and legacy pages
│   │   └── api/
│   │       └── products.ts # Product API endpoint
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Helper functions (formatting, etc.)
│   └── styles/            # Additional styles (if needed)
├── __tests__/             # Test files
│   └── components/        # Component tests
├── public/                # Static assets (images, favicon, etc.)
└── ...
```

### Naming Conventions
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Utilities: camelCase (e.g., `formatCurrency`)
- Files: kebab-case for non-components (e.g., `product-details.module.css`)
- Environment variables: UPPERCASE with PREFIXES (e.g., `NEXT_PUBLIC_SUPABASE_URL`)

### Component Architecture
- **Presentational Components**: Pure UI components (ProductCard, StarRating)
- **Container Components**: Handle logic and state (ProductPage, CategoryPage)
- **Layout Components**: Structure and organization (Header, Footer)
- **Control Components**: Interactive elements (AddToCartButton, WishlistButton)

### State Management Approach
- **Local State**: useState, useReducer for component-specific state
- **Global State**: React Context for shared application state
- **Server State**: SWR for data fetching and caching
- **URL State**: Next.js router for page-level state

### API Route Organization
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/cart/*` - Shopping cart operations
- `/api/orders/*` - Order processing
- `/api/reviews/*` - Product reviews
- `/api/wishlist/*` - Wishlist operations
- `/api/admin/*` - Administrative functions

## Testing Guide

### How to Run Tests
- Run all tests: `npm run test`
- Run tests in watch mode: `npm run test:watch`
- Run tests with UI: `npm run test:ui`
- Run tests with coverage: `npm run test:coverage`

### Test Structure Explanation
- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components with React Testing Library
- **Integration Tests**: Test API routes and database interactions
- **E2E Tests**: Test complete user workflows with Playwright

### Adding New Tests
1. Create test file with `.test.tsx` extension
2. Place in corresponding `__tests__` directory
3. Use Vitest syntax for assertions
4. Use React Testing Library for component testing
5. Follow AAA pattern (Arrange, Act, Assert)

### E2E Test Execution
1. Install Playwright: `npx playwright install`
2. Run E2E tests: `npm run test:e2e`
3. Run in headed mode: `npm run test:e2e:headed`
4. Generate reports: `npm run test:e2e:report`

## Admin Guide

### How to Access Admin Dashboard
1. Ensure your user account has admin privileges in the `admin_users` table
2. Navigate to `/admin` route
3. Authenticate if not already logged in

### Managing Products
1. Go to Products section in admin dashboard
2. Use "Add Product" form to create new items
3. Edit existing products with the pencil icon
4. Delete products with the trash icon
5. Bulk operations available for multiple products

### Processing Orders
1. Navigate to Orders section
2. View all orders with status filters
3. Update order status as items are processed
4. Add tracking information when shipped
5. Communicate with customers through integrated tools

### Viewing Analytics
1. Access Analytics dashboard
2. View sales metrics and trends
3. Track popular products
4. Monitor conversion rates
5. Export reports as needed

## Troubleshooting

### Common Issues and Solutions

#### Development Server Won't Start
- **Issue**: `npm run dev` fails with module errors
- **Solution**: Delete `node_modules` and `package-lock.json`, then reinstall with `npm install`

#### Environment Variables Not Loading
- **Issue**: API calls fail due to missing configuration
- **Solution**: Ensure `.env.local` file exists with correct variable names

#### Database Connection Issues
- **Issue**: Cannot connect to Supabase
- **Solution**: Verify environment variables and Supabase project URL

#### Build Failures
- **Issue**: `npm run build` fails
- **Solution**: Check for TypeScript errors, ensure all dependencies are installed

#### Component Rendering Issues
- **Issue**: Components don't render as expected
- **Solution**: Check for prop type mismatches, verify data structures

### Debug Mode
- Enable debug logging by setting `DEBUG=true` in environment
- Use browser dev tools to inspect React components
- Check console for error messages and warnings

### Logging Approach
- Client-side: Console logging for development
- Server-side: Structured logging with Winston (planned)
- Error tracking: Sentry integration (planned)

## API Documentation

### All Endpoints Documented

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

#### Product Endpoints
- `GET /api/products` - Get all products with pagination/filtering
- `GET /api/products/[slug]` - Get single product by slug
- `GET /api/products/[id]/related` - Get related products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/search` - Search products

#### Cart Endpoints
- `GET /api/cart` - Get current user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

#### Order Endpoints
- `GET /api/orders` - Get current user's orders
- `GET /api/orders/[id]` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]/cancel` - Cancel order

#### Request/Response Examples
**Get Products Request:**
```
GET /api/products?category=earrings&minPrice=50&maxPrice=200&page=1&limit=10
```

**Get Products Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Diamond Stud Earrings",
      "price": 199.99,
      "comparePrice": 249.99,
      "imageUrls": ["https://example.com/image.jpg"],
      "featuredImageUrl": "https://example.com/image.jpg",
      "ratingAverage": 4.5,
      "ratingCount": 24,
      "category": "Earrings",
      "shortDescription": "Beautiful diamond stud earrings..."
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalProducts": 45
}
```

#### Authentication Requirements
- Public endpoints: No authentication required
- User endpoints: Valid user session required
- Admin endpoints: Admin privileges required

#### Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource does not exist
- `500`: Internal Server Error - Unexpected server error