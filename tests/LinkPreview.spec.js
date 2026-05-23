const { test, expect } = require('@playwright/test');

test.describe('LinkPreview E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept requests to the preview server
    await page.route('**/parse/link', async route => {
      // Simulate delay for skeleton loading state
      await new Promise(r => setTimeout(r, 500));
      const json = {
        domain: 'reactjs.org',
        title: 'React – A JavaScript library for building user interfaces',
        description: 'A JavaScript library for building user interfaces',
        img: 'https://reactjs.org/logo-og.png'
      };
      await route.fulfill({ json, status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' } });
    });
  });

  test('should load the test page and display preview data', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');

    // Check initial loading state
    const loadingText = await page.locator('text=facebook.com');
    await expect(loadingText).toBeVisible({ timeout: 10000 });

    // Wait for the component to render the domain text
    const domainText = await page.locator('text=reactjs.org');
    await expect(domainText).toBeVisible({ timeout: 10000 });

    const titleText = await page.locator('text=React – A JavaScript library for building user interfaces').first();
    await expect(titleText).toBeVisible();

    const descText = await page.locator('text=A JavaScript library for building user interfaces').nth(1);
    await expect(descText).toBeVisible();
  });
});
