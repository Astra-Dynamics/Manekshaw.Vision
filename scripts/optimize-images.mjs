import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimize() {
  const publicDir = path.resolve('public');

  console.log('Optimizing images in public directory...');

  // 1. logo.jpg -> logo.webp
  if (fs.existsSync(path.join(publicDir, 'logo.jpg'))) {
    await sharp(path.join(publicDir, 'logo.jpg'))
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'logo.webp'));
    console.log('Generated logo.webp');
  }

  // 2. screenshot-3.png -> screenshot-3.webp & 1200x630 OG image og-image.webp / og-image.png
  if (fs.existsSync(path.join(publicDir, 'screenshot-3.png'))) {
    await sharp(path.join(publicDir, 'screenshot-3.png'))
      .resize(1200, 630, { fit: 'cover' })
      .webp({ quality: 82 })
      .toFile(path.join(publicDir, 'og-image.webp'));

    await sharp(path.join(publicDir, 'screenshot-3.png'))
      .resize(1200, 630, { fit: 'cover' })
      .png({ quality: 80, compressionLevel: 8 })
      .toFile(path.join(publicDir, 'og-image.png'));

    await sharp(path.join(publicDir, 'screenshot-3.png'))
      .webp({ quality: 80 })
      .toFile(path.join(publicDir, 'screenshot-3.webp'));

    console.log('Generated screenshot-3.webp, og-image.webp, og-image.png');
  }

  // 3. adyn-logo.png -> adyn-logo.webp
  if (fs.existsSync(path.join(publicDir, 'adyn-logo.png'))) {
    await sharp(path.join(publicDir, 'adyn-logo.png'))
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, 'adyn-logo.webp'));
    console.log('Generated adyn-logo.webp');
  }

  // 4. Favicon icons (180x180 apple touch, 192x192, 512x512)
  const baseIcon = fs.existsSync(path.join(publicDir, 'favicon.png'))
    ? path.join(publicDir, 'favicon.png')
    : path.join(publicDir, 'favicon-32x32.png');

  if (fs.existsSync(baseIcon)) {
    await sharp(baseIcon)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    await sharp(baseIcon)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'favicon-192.png'));

    await sharp(baseIcon)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'favicon-512.png'));

    // Create 32x32 favicon.ico fallback
    await sharp(baseIcon)
      .resize(32, 32)
      .toFormat('png')
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('Generated icons: apple-touch-icon.png (180x180), favicon-192.png, favicon-512.png, favicon.ico');
  }

  console.log('Image optimization complete!');
}

optimize().catch((err) => {
  console.error(err);
  process.exit(1);
});
