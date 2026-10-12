import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const SOURCE_DIR = 'C:\\Users\\fores\\Downloads\\Services';
const TARGET_VIDEOS = path.resolve('public', 'videos', 'services');
const TARGET_IMAGES = path.resolve('public', 'images', 'services');

const videos = [
  {
    src: '11_Month_Warranty_20261011224240.mp4',
    slug: '11-month-warranty'
  },
  {
    src: 'New_Construction_20261011224536.mp4',
    slug: 'new-construction'
  },
  {
    src: 'Pool_&_Spa_Inspection_20261011224022.mp4',
    slug: 'pool-and-spa'
  },
  {
    src: 'Radon_Testing_20261011221947.mp4',
    slug: 'radon-testing'
  },
  {
    src: 'Sewer_Scope_Inspection_20261011222735.mp4',
    slug: 'sewer-scope'
  },
  {
    src: 'Termite_Inspections_20261011222512.mp4',
    slug: 'termite-inspection'
  }
];

if (!fs.existsSync(TARGET_VIDEOS)) fs.mkdirSync(TARGET_VIDEOS, { recursive: true });
if (!fs.existsSync(TARGET_IMAGES)) fs.mkdirSync(TARGET_IMAGES, { recursive: true });

console.log('🎬 Processing service videos with faststart streaming & webp posters...\n');

for (const v of videos) {
  const inputPath = path.join(SOURCE_DIR, v.src);
  const outVideo = path.join(TARGET_VIDEOS, `${v.slug}.mp4`);
  const outPoster = path.join(TARGET_IMAGES, `${v.slug}-poster.webp`);

  if (!fs.existsSync(inputPath)) {
    console.error(`Missing input file: ${inputPath}`);
    continue;
  }

  console.log(`▶ Optimizing: ${v.src} -> ${v.slug}.mp4`);
  // Optimize video with web streaming faststart and high-fidelity CRF 22
  execSync(`ffmpeg -y -i "${inputPath}" -c:v libx264 -crf 22 -preset medium -c:a aac -b:a 128k -movflags +faststart "${outVideo}"`, { stdio: 'inherit' });

  console.log(`🖼 Generating poster: ${v.slug}-poster.webp`);
  execSync(`ffmpeg -y -ss 00:00:01.500 -i "${inputPath}" -frames:v 1 -q:v 2 "${outPoster}"`, { stdio: 'inherit' });

  const stats = fs.statSync(outVideo);
  console.log(`✔ Finished ${v.slug}: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);
}

console.log('✨ All 6 videos and poster thumbnails successfully processed!');
