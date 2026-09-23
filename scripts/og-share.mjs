// Regenerate public/images/og-share.jpg: centre-crop hero-cabin.jpg to 1.91:1 at native width. Run: node scripts/og-share.mjs
import sharp from "sharp";

const src = "public/images/hero-cabin.jpg";
const { width, height } = await sharp(src).metadata();
const h = Math.floor(width / 1.91);
await sharp(src)
  .extract({ left: 0, top: Math.floor((height - h) / 2), width, height: h })
  .jpeg({ quality: 85, progressive: true, mozjpeg: true })
  .toFile("public/images/og-share.jpg");
