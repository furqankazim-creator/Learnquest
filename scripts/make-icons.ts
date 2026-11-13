import sharp from 'sharp';
import { backgroundSvg, iconSvg, markSvg } from '../src/logo';

async function png(svg: string, out: string, size = 1024) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log('wrote', out);
}

(async () => {
  await png(iconSvg({ scale: 0.9 }), 'assets/icon.png');
  await png(backgroundSvg(), 'assets/android-icon-background.png');
  await png(markSvg(0.66), 'assets/android-icon-foreground.png');
  await png(markSvg(0.78), 'assets/splash-icon.png');
  await png(iconSvg({ scale: 0.95, rounded: true }), 'assets/favicon.png', 96);
  // monochrome (themed icons): white silhouette of the owl on transparent
  const mono = await sharp(Buffer.from(markSvg(0.66))).ensureAlpha().extractChannel('alpha').toBuffer();
  await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#ffffff' } })
    .joinChannel(await sharp(mono).resize(1024, 1024).toBuffer())
    .png().toFile('assets/android-icon-monochrome.png');
  console.log('wrote monochrome');
})();
