# E2E Testing with Playwright

This directory contains End-to-End (E2E) tests for the NovelSolar application using Playwright.

## Test Structure

- `homepage.spec.ts` - Tests for homepage loading and navigation
- `products.spec.ts` - Tests for product browsing and search functionality
- `cart.spec.ts` - Tests for shopping cart operations
- `checkout.spec.ts` - Tests for the checkout process
- `admin.spec.ts` - Tests for admin panel functionality

## Running Tests

### Prerequisites

If you want to run tests manually, start the development server first:

```bash
npm run dev
```

The Playwright configuration also supports auto-starting the dev server via `playwright.config.ts`, so manual server startup is optional when running `npm run test:e2e`.

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Tests with UI Mode

```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (visible browser)

```bash
npm run test:e2e:headed
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### Run Specific Test File

```bash
npx playwright test products.spec.ts
```

## Configuration

The Playwright configuration is in `playwright.config.ts` and includes:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5 and iPhone 12
- **Auto-start dev server**: Automatically starts `npm run dev` before tests

## Test Features

### Homepage Tests
- Page loading verification
- Navigation link validation
- Content presence checks

### Product Tests
- Product page display
- Individual product details
- Category filtering
- Search functionality

### Cart Tests
- Add to cart functionality
- Cart display and navigation
- Quantity updates
- Item removal

### Checkout Tests
- Checkout process navigation
- Form validation
- Order completion

### Admin Tests
- Login page functionality
- Authentication validation
- Dashboard access
- Product management interface
- Logout functionality

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Realistic Data**: Use realistic test data that matches production scenarios
3. **Wait Strategies**: Use Playwright's auto-waiting instead of manual timeouts
4. **Selectors**: Prefer semantic selectors over fragile CSS/XPath
5. **Assertions**: Use descriptive assertions that clearly state expectations

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline. Make sure to:

1. Install Playwright browsers in CI: `npx playwright install --with-deps`
2. Set `CI=true` environment variable for proper retry behavior
3. Use `--project=chromium` for faster CI runs

## Troubleshooting

### Common Issues

1. **Tests failing due to timing**: Increase timeout or use proper wait strategies
2. **Selectors not found**: Use Playwright's codegen to find correct selectors
3. **Dev server not starting**: Ensure port 3000 is available

### Debugging

Use the Playwright UI mode to debug failing tests:

```bash
npm run test:e2e:ui
```

Or use the trace viewer for failed tests:

```bash
npx playwright show-trace test-results/
```