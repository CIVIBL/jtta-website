// Trace the ink-splat silhouette of jtta-logo.png (alpha only, so no lettering) to an SVG path for Splat.astro.
// Prints the viewBox and path. Run: node scripts/splat-path.mjs
import sharp from "sharp";

const { data, info } = await sharp("public/images/jtta-logo.png")
  .ensureAlpha()
  .extractChannel("alpha")
  .threshold(128)
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && data[y * W + x] > 0;

// Pixel-edge boundary, oriented clockwise (y down) around filled pixels.
const out = new Map();
const add = (ax, ay, bx, by) => { const k = ax + "," + ay; (out.get(k) ?? out.set(k, []).get(k)).push([bx, by]); };
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!inside(x, y)) continue;
  if (!inside(x, y - 1)) add(x, y, x + 1, y);
  if (!inside(x + 1, y)) add(x + 1, y, x + 1, y + 1);
  if (!inside(x, y + 1)) add(x + 1, y + 1, x, y + 1);
  if (!inside(x - 1, y)) add(x, y + 1, x, y);
}
const loops = [];
for (const [start, ends] of out) {
  while (ends.length) {
    const [sx, sy] = start.split(",").map(Number);
    const loop = [[sx, sy]];
    let [cx, cy] = ends.pop();
    while (!(cx === sx && cy === sy)) {
      loop.push([cx, cy]);
      const next = out.get(cx + "," + cy);
      [cx, cy] = next.pop();
    }
    loops.push(loop);
  }
}
const area = (p) => p.reduce((s, [x, y], i) => { const [nx, ny] = p[(i + 1) % p.length]; return s + x * ny - nx * y; }, 0) / 2;
// Outer boundaries only (positive area); drop specks.
const outers = loops.filter((p) => area(p) > 40);

// Smooth the pixel staircase (Chaikin, 2 passes), then simplify (Ramer-Douglas-Peucker).
const chaikin = (p) => p.flatMap(([x, y], i) => { const [nx, ny] = p[(i + 1) % p.length]; return [[0.75 * x + 0.25 * nx, 0.75 * y + 0.25 * ny], [0.25 * x + 0.75 * nx, 0.25 * y + 0.75 * ny]]; });
const rdp = (pts, eps) => {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len; if (d > max) { max = d; idx = i; } }
  return max > eps ? [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)] : [a, b];
};
// Closed loop: split at the point farthest from the start so RDP has a real chord on each half.
const rdpLoop = (s, eps) => { let k = 0, m = 0; s.forEach(([x, y], i) => { const d = Math.hypot(x - s[0][0], y - s[0][1]); if (d > m) { m = d; k = i; } }); return [...rdp(s.slice(0, k + 1), eps).slice(0, -1), ...rdp([...s.slice(k), s[0]], eps).slice(0, -1)]; };
const shapes = outers.map((p) => rdpLoop(chaikin(chaikin(p)), 0.9));

const xs = shapes.flat().map((p) => p[0]), ys = shapes.flat().map((p) => p[1]);
const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
const scale = 100 / Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0);
const f = (v) => +v.toFixed(1);
const d = shapes.map((s) => "M" + s.map(([x, y]) => f((x - x0) * scale) + " " + f((y - y0) * scale)).join("L") + "Z").join("");
console.log(`viewBox="0 0 ${f((Math.max(...xs) - x0) * scale)} ${f((Math.max(...ys) - y0) * scale)}"`);
console.log(`shapes=${shapes.length} points=${shapes.reduce((n, s) => n + s.length, 0)} chars=${d.length}`);
console.log(d);
