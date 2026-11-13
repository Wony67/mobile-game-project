import { expect, test, type Page } from '@playwright/test';

type State = { x: number; y: number; bullets: { x: number; y: number }[] };
async function state(page: Page): Promise<State> {
  return page.evaluate(() => {
    const game = (window as any).__flightGame;
    const scene = game.scene.getScene('flight');
    const player = scene.children.getByName('player');
    return { x: player.x, y: player.y, bullets: scene.children.list
      .filter((child: any) => child.name === 'bullet')
      .map((bullet: any) => ({ x: bullet.x, y: bullet.y })) };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => !!(window as any).__flightGame?.scene.getScene('flight')?.children.getByName('player'))).toBe(true);
});

test('landscape canvas renders without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => state(page).then((s) => s.x)).toBe(150);
  const canvas = await page.locator('canvas').boundingBox();
  expect(canvas!.width / canvas!.height).toBeCloseTo(16 / 9, 1);
  await page.screenshot({ path: 'test-results/first-flight.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('arrow keys move, release stops, diagonal speed stays normalized', async ({ page }) => {
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowRight');
  const right = await state(page);
  expect(right.x).toBeGreaterThan(200);
  expect(right.y).toBe(270);
  await page.waitForTimeout(100);
  expect((await state(page)).x).toBe(right.x);
  await page.keyboard.down('ArrowRight');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(300);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.up('ArrowUp');
  const diagonal = await state(page);
  expect(diagonal.y).toBeLessThan(right.y);
  expect(diagonal.x - right.x).toBeCloseTo(right.y - diagonal.y, 0);
  expect(diagonal.x - right.x).toBeLessThan(85);
});

test('player remains fully inside all four edges', async ({ page }) => {
  for (const [key, axis, edge, duration] of [
    ['ArrowLeft', 'x', 27, 700], ['ArrowUp', 'y', 24, 1200],
    ['ArrowRight', 'x', 933, 3500], ['ArrowDown', 'y', 516, 2000],
  ] as const) {
    await page.keyboard.down(key);
    await page.waitForTimeout(duration);
    await page.keyboard.up(key);
    expect((await state(page))[axis]).toBe(edge);
  }
});

test('Space and Z fire rightward with bounded repeat rate and cleanup', async ({ page }) => {
  expect((await state(page)).bullets).toHaveLength(0);
  await page.keyboard.down('Space');
  await expect.poll(() => state(page).then((s) => s.bullets.length)).toBeGreaterThan(0);
  const first = (await state(page)).bullets[0];
  await page.waitForTimeout(100);
  expect((await state(page)).bullets[0].x).toBeGreaterThan(first.x);
  await page.waitForTimeout(500);
  await page.keyboard.up('Space');
  const fired = await state(page);
  expect(fired.bullets.length).toBeGreaterThan(2);
  expect(fired.bullets.length).toBeLessThanOrEqual(6);
  expect(fired.bullets.every((b) => b.y === fired.y && b.x > fired.x)).toBe(true);
  await expect.poll(() => state(page).then((s) => s.bullets.length), { timeout: 4000 }).toBe(0);
  await page.keyboard.down('z');
  await expect.poll(() => state(page).then((s) => s.bullets.length)).toBeGreaterThan(0);
  await page.keyboard.up('z');
});

test('touch layout fits mobile; movement and attack buttons work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.locator('canvas')).toBeVisible();
  await page.locator('[data-move="right"]').hover();
  await page.mouse.down();
  await page.waitForTimeout(250);
  await page.mouse.up();
  expect((await state(page)).x).toBeGreaterThan(180);
  await page.locator('#fire').hover();
  await page.mouse.down();
  await expect.poll(() => state(page).then((s) => s.bullets.length)).toBeGreaterThan(0);
  await page.mouse.up();
  await page.screenshot({ path: 'test-results/mobile-flight.png', fullPage: true });
});
