import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/concepts/', '/architecture/', '/security/', '/standards/', '/quickstart/'];
test('explicit Home navigation returns from every documentation page', async ({ page }) => {
  for (const route of routes.slice(1)) {
    await page.goto(route);
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4174/');
    await expect(page.locator('h1')).toContainText('Approve the commitment.');
    await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
  }
});
for (const width of [320, 390, 768, 1440]) {
  for (const route of routes) {
    test(route + ' at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const external = [];
      await page.route('**/*', async request => {
        const url = new URL(request.request().url());
        if (url.origin !== 'http://127.0.0.1:4174') {
          external.push(url.href);
          await request.abort();
        } else {
          await request.continue();
        }
      });
      const response = await page.goto(route);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
      expect(await page.locator('script, iframe, form').count()).toBe(0);
      expect(external).toEqual([]);
      const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(accessibility.violations).toEqual([]);
    });
  }
}
test('keyboard skip link moves focus into main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('main')).toBeFocused();
});
test('all local links and fragments resolve', async ({ page, request }) => {
  for (const route of routes) {
    await page.goto(route);
    const links = await page.locator('a[href]').evaluateAll(elements => elements.map(element => element.href));
    for (const href of links) {
      const url = new URL(href);
      if (url.origin !== 'http://127.0.0.1:4174') continue;
      expect((await request.get(url.pathname)).status(), href).toBe(200);
      if (url.hash) {
        await page.goto(url.pathname);
        expect(await page.locator('[id]').evaluateAll((elements, id) => elements.some(element => element.id === id), decodeURIComponent(url.hash.slice(1))), href).toBe(true);
      }
    }
  }
});
