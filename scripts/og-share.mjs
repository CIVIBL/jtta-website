// Regenerate public/images/og-share.jpg: crop hero-cabin-path.jpg to 1.91:1 at native width, centred on the cabin. Run: node scripts/og-share.mjs
import sharp from "sharp";

const src = "public/images/hero-cabin-path.jpg";
const CENTRE_Y = 0.44; // cabin's vertical centre (roof peak to porch step), as a fraction of the source height
const { width, height } = await sharp(src).metadata();
const h = Math.floor(width / 1.91);
const top = Math.min(height - h, Math.max(0, Math.round(height * CENTRE_Y - h / 2)));
await sharp(src)
  .extract({ left: 0, top, width, height: h })
  .jpeg({ quality: 85, progressive: true, mozjpeg: true })
  .toFile("public/images/og-share.jpg");
console.log(`og-share.jpg ${width}x${h} (top ${top})`);
