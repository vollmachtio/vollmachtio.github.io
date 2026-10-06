import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/concepts/', '/architecture/', '/security/', '/standards/', '/quickstart/'];
for (const width of [390, 1440]) {
  test('visible pause label freezes animation at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.locator('.star-label').click();
    await expect(page.getByRole('checkbox', { name: 'Pause stars' })).toBeChecked();
    await expect(page.locator('.motion-off')).toBeVisible();
    const times = () => page.locator('.starfield').evaluate(el => el.getAnimations({ subtree: true }).map(a => a.currentTime));
    await page.waitForTimeout(100);
    const paused = await times();
    await page.waitForTimeout(200);
    expect(await times()).toEqual(paused);
    await page.locator('.star-label').click();
    await expect(page.getByRole('checkbox', { name: 'Pause stars' })).not.toBeChecked();
    await page.waitForTimeout(200);
    expect(await times()).not.toEqual(paused);
  });
}
test('phone menu stays beside logo and opens with keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  const summary = page.locator('.mobile-menu summary');
  const brand = await page.locator('.brand').boundingBox();
  const menu = await summary.boundingBox();
  expect(Math.abs(brand.y - menu.y)).toBeLessThan(12);
  await summary.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Concepts', exact: true }).click();
  await expect(page).toHaveURL(/\/concepts\/$/);
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
});
for (const width of [320, 390]) {
  test('phone reading sizes and controls at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    for (const selector of ['.steps p', '.fare', '.scope', '.example-note', '.workflow-note', '.caption', '.receipt dd', '.security-grid p']) {
      expect(await page.locator(selector).evaluateAll(elements => elements.every(el => parseFloat(getComputedStyle(el).fontSize) >= 14)), selector).toBe(true);
    }
    const steps = await page.locator('.steps li').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().top));
    expect(steps[1]).toBeGreaterThan(steps[0]);
    expect(steps[2]).toBeGreaterThan(steps[1]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.star-label')).toBeHidden();
    await expect(page.locator('.star-toggle')).toBeHidden();
    for (const route of routes) {
      await page.goto(route);
      await page.locator('.mobile-menu summary').click();
      expect(await page.locator('nav a, footer a').evaluateAll(elements => elements.filter(el => el.getClientRects().length).every(el => el.getBoundingClientRect().height >= 44))).toBe(true);
    }
  });
}
test('homepage leads with the story and keeps stars out of documentation', async ({ page }) => {
  await page.goto('/');
  const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.getAttribute('aria-labelledby')));
  expect(order).toEqual(['headline', 'flight-title', 'vision-title', 'mandate-title', 'security-title']);
  await expect(page.getByRole('link', { name: 'Explore on GitHub' })).toHaveAttribute('href', 'https://github.com/vollmachtio/vollmacht');
  await expect(page.getByRole('button', { name: /approve/i })).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Pause stars' }).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.starfield span').first()).toHaveCSS('animation-play-state', 'paused');
  await page.goto('/architecture/');
  await expect(page.locator('.starfield')).toHaveCount(0);
});
test('stars can be paused and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const stars = page.locator('.starfield span');
  await expect(stars.first()).toHaveCSS('animation-name', 'twinkle');
  await page.getByRole('checkbox', { name: 'Pause stars' }).check();
  for (const star of await stars.all()) {
    await expect(star).toHaveCSS('animation-play-state', 'paused');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const star of await stars.all()) {
    await expect(star).toHaveCSS('animation-name', 'none');
  }
  await expect(page.getByRole('checkbox', { name: 'Pause stars' })).toBeHidden();
});
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
