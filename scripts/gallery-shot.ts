// Screenshots the Maths picture gallery (web build made with EXPO_PUBLIC_VIZ_GALLERY=1).
import puppeteer from 'puppeteer-core';
const [, , URL = 'http://localhost:5110', OUT = 'gallery.png'] = process.argv;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: 1240, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: OUT.replace('.png', '-top.png') });
  await page.evaluate(() => { document.querySelectorAll('div').forEach((d) => { const e = d as HTMLElement; if (e.scrollHeight > e.clientHeight + 50) e.scrollTop = e.scrollHeight * 0.38; }); });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: OUT.replace('.png', '-mid.png') });
  await page.evaluate(() => { const el = document.scrollingElement; document.querySelectorAll('div').forEach((d) => { if ((d as HTMLElement).scrollHeight > (d as HTMLElement).clientHeight + 50) (d as HTMLElement).scrollTop = (d as HTMLElement).scrollHeight; }); });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: OUT.replace('.png', '-bottom.png') });
  await b.close();
})();
