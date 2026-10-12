import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const badges = [
  {
    src: 'C:/Users/fores/.gemini/antigravity/brain/57c20a95-6534-416b-af4b-8789bb6046c2/.user_uploaded/media_1791827141081_90365049.png',
    name: 'internachi_new_construction_inspector'
  },
  {
    src: 'C:/Users/fores/.gemini/antigravity/brain/57c20a95-6534-416b-af4b-8789bb6046c2/.user_uploaded/media_1791827550450_62d5dd83.png',
    name: 'internachi_moisture_intrusion_inspector'
  }
];

const imagesDir = 'public/images';

async function processAll() {
  for (const b of badges) {
    const pngOut = path.join(imagesDir, `${b.name}.png`);
    const webpOut = path.join(imagesDir, `${b.name}.webp`);

    console.log(`Processing ${b.name} from ${b.src}...`);
    
    // Save PNG
    await sharp(b.src)
      .png({ compressionLevel: 9 })
      .toFile(pngOut);
    console.log(`Saved PNG: ${pngOut} (${fs.statSync(pngOut).size} bytes)`);

    // Save WebP
    await sharp(b.src)
      .webp({ quality: 95 })
      .toFile(webpOut);
    console.log(`Saved WebP: ${webpOut} (${fs.statSync(webpOut).size} bytes)`);
  }
  console.log('All badge conversions completed successfully!');
}

processAll().catch(err => {
  console.error('Error processing badges:', err);
  process.exit(1);
});
