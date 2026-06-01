import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4500); // espera splash

// Vista limpia sin hover
await page.screenshot({ path: 'ui-full.png' });

// Hover sobre el hotspot de Tipo A (~38% x, ~65% y)
await page.mouse.move(1440 * 0.38, 900 * 0.65);
await page.waitForTimeout(400);
await page.screenshot({ path: 'ui-hover-a.png' });

// Hover sobre el hotspot de Tipo B (~62% x, ~65% y)
await page.mouse.move(1440 * 0.62, 900 * 0.65);
await page.waitForTimeout(400);
await page.screenshot({ path: 'ui-hover-b.png' });

console.log('Screenshots guardados.');
await browser.close();
