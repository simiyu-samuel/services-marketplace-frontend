# Recovery Guide: Latest Code from Dist

## What Was Done

1. **Cloned** the repo from [services-marketplace-frontend](https://github.com/simiyu-samuel/services-marketplace-frontend.git)
2. **Replaced** the repo's `dist` with your latest built output (the one that has your updates)
3. **Merged** everything into your workspace

You now have:
- **Full source code** (from the repo) in `src/` — this is the *older* version
- **Latest built app** in `dist/` — this reflects your *latest* changes

## Important Limitation

**You cannot fully recover original React/TypeScript source from a production build.** The `dist` folder contains:
- Minified JavaScript (variable names shortened, structure flattened)
- Bundled modules (many files merged)
- No source maps (`.map` files) were present, so recovery is harder

## Your Options

### Option 1: Use the Latest Dist (Immediate)

The `dist` folder is your working app. You can:
- Deploy it as-is (e.g. to Vercel, Netlify, or any static host)
- Preview it locally: `pnpm preview` or `npx vite preview` (from project root)

### Option 2: Attempt Partial Recovery with Webcrack

[Webcrack](https://github.com/j4k0xb/webcrack) can unpack and unminify bundles to get *partially* readable output. With Node.js and npm/pnpm installed:

```bash
# Install webcrack
pnpm add -D webcrack
# or: npm install -D webcrack

# Unpack the main entry bundle
pnpm exec webcrack dist/assets/index-C60DldN2.js -o recovered/
```

This produces unpacked files in `recovered/` that you can use as a **reference** to identify logic and structure, but they won't be clean React/TSX source.

### Option 3: Manual Porting (Recommended for Ongoing Development)

1. Run the old source dev server: `pnpm dev`
2. Run the dist preview: `pnpm preview` (serves from `dist/`)
3. Compare the two in the browser and note differences
4. Manually apply updates from the dist behavior back into `src/`

### Option 4: Keep Both

- Use `dist/` for deployment (latest UI/behavior)
- Use `src/` for future development (clone and evolve)
- When you add new features, build and update `dist/` with `pnpm build`

## Component Names Found in the Bundle

Your latest dist includes these components (from chunk filenames), which you can use when comparing with the repo’s `src/`:

- `MainLayout`, `ImprovedLayout`, `AdminLayout`, `PremiumLayout`
- `ServiceCard`, `ServiceDetails`, `ServiceForm`, `ServiceListView`, `ServiceMediaManager`
- `CreateService`, `EditService`, `CreateAdminService`, `EditMyAdminService`
- `MyServices`, `MyBookings`, `Bookings`, `AdminGeneralBookings`
- `Dashboard`, `Analytics`, `Payments`, `Settings`, `Profile`, `Contacts`, `Users`
- `Blog`, `BlogCard`, `BlogDetails`, `CreateBlogPost`, `EditBlogPost`, `BlogPostForm`
- `Login`, `Register`, `RegisterCustomer`, `RegisterSeller`
- `Contact`, `AboutUs`, `TermsOfService`, `PrivacyPolicy`, `ForgotPassword`, `ResetPassword`, `VerifyEmail`
- And more — see `dist/assets/` for the full set

## Next Steps

1. Run `pnpm install` (or `npm install`) to install dependencies
2. Run `pnpm dev` to work with source, or `pnpm preview` to verify the latest dist
3. Optionally run webcrack on the main bundle for reference
4. Start porting known changes from the dist behavior into `src/` as needed
