// Regenerate favicons from the ink-splat silhouette of jtta-logo.png (lettering dropped). Run: node scripts/favicons.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SIZE = 512;
const MARGIN = 0.08;

// Alpha above 50% becomes solid black; everything else transparent.
const { data, info } = await sharp("public/images/jtta-logo.png")
  .ensureAlpha()
  .extractChannel("alpha")
  .threshold(128)
  .raw()
  .toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < data.length; i++) rgba[i * 4 + 3] = data[i];

const inner = Math.round(SIZE * (1 - 2 * MARGIN));
const trimmed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim()
  .png()
  .toBuffer();
const master = await sharp(trimmed)
  .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({
    top: (SIZE - inner) / 2, bottom: (SIZE - inner) / 2, left: (SIZE - inner) / 2, right: (SIZE - inner) / 2,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const png = (s) => sharp(master).resize(s, s).png().toBuffer();

await writeFile("public/favicon-32.png", await png(32));
await sharp(master).resize(180, 180).flatten({ background: "#ffffff" }).png().toFile("public/apple-touch-icon.png");

// ICO container holding PNG-encoded 16, 32 and 48 px images.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
await writeFile("public/favicon.ico", Buffer.concat([header, ...images]));
