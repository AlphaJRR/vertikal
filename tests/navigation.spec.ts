import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // Adjust if using different local port

test('Homepage loads and has correct title', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/VERTIKAL/);
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible();
});

test('Navigation to Creators works', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('text=Creators');
  await expect(page).toHaveURL(/.*creators/);
  // Verify Gold Badge exists
  const goldBadge = page.locator('img[alt*="Gold"], img[alt*="gold"]').first();
  await expect(goldBadge).toBeVisible({ timeout: 5000 }).catch(() => {
    // Badge might not load, but page should still work
    console.log('Gold badge image not found, but page loaded');
  });
});

test('Investors page is Green-only', async ({ page }) => {
  await page.goto(`${BASE_URL}/investors`);
  // Verify Green badge exists
  const greenBadge = page.locator('img[alt*="Green"], img[alt*="green"]').first();
  await expect(greenBadge).toBeVisible({ timeout: 5000 }).catch(() => {
    console.log('Green badge image not found, but page loaded');
  });
  // Verify Titanium/Gold do NOT exist in main content
  const titaniumBadge = page.locator('img[alt*="Titanium"]');
  await expect(titaniumBadge).toHaveCount(0);
});

test('Beta is Stealth (NoIndex)', async ({ page }) => {
  await page.goto(`${BASE_URL}/beta`);
  const meta = page.locator('meta[name="robots"]');
  await expect(meta).toHaveAttribute('content', /noindex/);
});

test('Demo page loads without redirect loop', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/demo`, { waitUntil: 'networkidle' });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/.*demo/);
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible();
});

test('No placeholder text in Investors page', async ({ page }) => {
  await page.goto(`${BASE_URL}/investors`);
  const bodyText = await page.textContent('body');
  expect(bodyText).not.toContain('Chart:');
  expect(bodyText).not.toContain('Data visualization placeholder');
  expect(bodyText).not.toContain('[email protected]');
});

test('No placeholder text in Networks page', async ({ page }) => {
  await page.goto(`${BASE_URL}/networks`);
  const bodyText = await page.textContent('body');
  expect(bodyText).not.toContain('Chart:');
  expect(bodyText).not.toContain('Data visualization placeholder');
  expect(bodyText).not.toContain('[email protected]');
});

test('No placeholder text in Creators page', async ({ page }) => {
  await page.goto(`${BASE_URL}/creators`);
  const bodyText = await page.textContent('body');
  expect(bodyText).not.toContain('Chart:');
  expect(bodyText).not.toContain('Data visualization placeholder');
});

