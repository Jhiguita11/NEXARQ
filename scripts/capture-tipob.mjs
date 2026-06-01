import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

// Espera splash + building selector
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
await page.screenshot({ path: 'tipob-01-selector.png' });

// Hover sobre Tipo B (62% x, 65% y)
await page.mouse.move(1440 * 0.62, 900 * 0.65);
await page.waitForTimeout(500);
await page.screenshot({ path: 'tipob-02-hover.png' });

// Click en el botón Iniciar Recorrido dentro de la card
const btn = page.locator('button:has-text("Iniciar Recorrido")').last();
await btn.click();
await page.waitForTimeout(1200);
await page.screenshot({ path: 'tipob-03-welcome.png' });

// Click en Iniciar Recorrido 360°
const startBtn = page.locator('button:has-text("Iniciar Recorrido 360°")');
await startBtn.click();
await page.waitForTimeout(4000);
await page.screenshot({ path: 'tipob-04-tour.png' });

console.log('Capturas guardadas.');
await browser.close();
