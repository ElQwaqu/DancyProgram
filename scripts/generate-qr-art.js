// Builds a styled QR code with "Dancy26" lettering, verifies it decodes, and saves
// qr-art.svg, qr-art.png (2400x2400) and qr-art-inverted.png.
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const opentype = require("opentype.js");
const sharp = require("sharp");
const jsQR = require("jsqr");

const URL_TEXT = "https://dancyprogram.vercel.app";
const LABEL = "Dancy26";
const VERSIONS = [7, 8, 9];
const QUIET = 4; // modules
const DOT_R = 0.3; // dot radius in modules (60% diameter)
const OUTLINE = 0.5; // cream stroke width in modules (half shows outside the letters)
const CLEARANCE = 0.15; // extra gap between outline and the nearest dot
const MAX_COVERAGE = 0.25;
const MASK_PX = 8; // mask resolution, pixels per module
const OUT_PX = 2400;

const COLORS = {
  normal: { bg: "#FAF6F0", dot: "#6B1D3A", fixed: "#6B1D3A", frame: "#4B5A2A", gap: "#FAF6F0", eye: "#6B1D3A", text: "#6B1D3A", outline: "#FAF6F0" },
  inverted: { bg: "#6B1D3A", dot: "#F6D6D8", fixed: "#F3E8D8", frame: "#F3E8D8", gap: "#6B1D3A", eye: "#F6D6D8", text: "#F3E8D8", outline: "#6B1D3A" },
};

const root = path.resolve(__dirname, "..");
const fontFile = require.resolve("@fontsource/jost/files/jost-latin-700-normal.woff");
const fontData = fs.readFileSync(fontFile);
const font = opentype.parse(fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength));

/* ---------- QR matrix ---------- */

function buildMatrix(version) {
  const qr = QRCode.create(URL_TEXT, { errorCorrectionLevel: "H", version });
  const { size, data, reservedBit } = qr.modules;
  const dark = (r, c) => data[r * size + c] === 1;
  const reserved = (r, c) => reservedBit[r * size + c] === 1;
  let dataCount = 0;
  for (let i = 0; i < size * size; i++) if (!reservedBit[i]) dataCount++;
  return { version, size, dark, reserved, dataCount, canvas: size + QUIET * 2 };
}

/* ---------- Lettering ---------- */

// Glyph path at font size 1 module, measured once.
const basePath = font.getPath(LABEL, 0, 0, 1);
const baseBox = basePath.getBoundingBox();
const baseW = baseBox.x2 - baseBox.x1;
const baseH = baseBox.y2 - baseBox.y1;

// Path data for the label scaled so its glyph height is `height` modules, centred at (cx, cy) in canvas units.
function labelPath(height, cx, cy) {
  const k = height / baseH;
  const p = font.getPath(LABEL, 0, 0, k);
  const dx = cx - (baseBox.x1 + baseW / 2) * k;
  const dy = cy - (baseBox.y1 + baseH / 2) * k;
  p.commands.forEach((cmd) => {
    for (const key of ["x", "x1", "x2"]) if (key in cmd) cmd[key] += dx;
    for (const key of ["y", "y1", "y2"]) if (key in cmd) cmd[key] += dy;
  });
  return p.toPathData(3);
}

// Which modules the lettering (plus outline and clearance) touches.
async function coverage(m, height, cy) {
  const px = m.canvas * MASK_PX;
  const cx = m.canvas / 2;
  const width = height * (baseW / baseH);
  const pad = OUTLINE / 2 + CLEARANCE;
  // Quick reject: lettering must stay inside the symbol area.
  if (cx - width / 2 - pad < QUIET || cx + width / 2 + pad > QUIET + m.size) return null;
  if (cy - height / 2 - pad < QUIET || cy + height / 2 + pad > QUIET + m.size) return null;

  const d = labelPath(height, cx, cy);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${m.canvas} ${m.canvas}">` +
    `<path d="${d}" fill="#000" stroke="#000" stroke-width="${OUTLINE + CLEARANCE * 2}" stroke-linejoin="round"/></svg>`;
  const { data } = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });

  const covered = new Set();
  const rPx = DOT_R * MASK_PX;
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      const ccx = (c + QUIET + 0.5) * MASK_PX;
      const ccy = (r + QUIET + 0.5) * MASK_PX;
      let hit = false;
      for (let y = Math.floor(ccy - rPx); y <= Math.ceil(ccy + rPx) && !hit; y++) {
        for (let x = Math.floor(ccx - rPx); x <= Math.ceil(ccx + rPx); x++) {
          if ((x + 0.5 - ccx) ** 2 + (y + 0.5 - ccy) ** 2 > rPx * rPx) continue;
          if (data[y * px + x] > 0) { hit = true; break; }
        }
      }
      if (!hit) continue;
      if (m.reserved(r, c)) return null; // never touch finder, timing, alignment or format modules
      covered.add(r * m.size + c);
    }
  }
  const ratio = covered.size / m.dataCount;
  return ratio < MAX_COVERAGE ? { covered, ratio, d } : null;
}

// Largest lettering height that fits at vertical centre cy (binary search).
async function largestAt(m, cy) {
  let lo = 0;
  let hi = m.size;
  let best = null;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    const res = await coverage(m, mid, cy);
    if (res) { lo = mid; best = { height: mid, cy, ...res }; } else hi = mid;
  }
  return best;
}

async function bestPlacement(m) {
  const centre = m.canvas / 2;
  const options = [];
  for (let cy = QUIET + 2; cy <= QUIET + m.size - 2; cy += 0.5) {
    const res = await largestAt(m, cy);
    if (res) options.push(res);
  }
  const maxH = Math.max(...options.map((o) => o.height));
  // Among near-maximum sizes, prefer the placement nearest the centre.
  return options
    .filter((o) => o.height >= maxH * 0.98)
    .sort((a, b) => Math.abs(a.cy - centre) - Math.abs(b.cy - centre))[0];
}

/* ---------- Drawing ---------- */

function renderSvg(m, label, palette) {
  const col = COLORS[palette];
  const n = m.canvas;
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" width="${OUT_PX}" height="${OUT_PX}">`);
  parts.push(`<rect width="${n}" height="${n}" fill="${col.bg}"/>`);

  const finders = [[0, 0], [0, m.size - 7], [m.size - 7, 0]];
  const inFinder = (r, c) => finders.some(([fr, fc]) => r >= fr && r < fr + 7 && c >= fc && c < fc + 7);

  const dots = [];
  const fixed = [];
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (!m.dark(r, c) || inFinder(r, c)) continue;
      const x = c + QUIET;
      const y = r + QUIET;
      if (m.reserved(r, c)) {
        fixed.push(`<rect x="${x + 0.04}" y="${y + 0.04}" width="0.92" height="0.92" rx="0.18"/>`);
      } else if (!label.covered.has(r * m.size + c)) {
        dots.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="${DOT_R}"/>`);
      }
    }
  }
  parts.push(`<g fill="${col.fixed}">${fixed.join("")}</g>`);
  parts.push(`<g fill="${col.dot}">${dots.join("")}</g>`);

  finders.forEach(([fr, fc]) => {
    const x = fc + QUIET;
    const y = fr + QUIET;
    parts.push(
      `<rect x="${x}" y="${y}" width="7" height="7" rx="1.7" fill="${col.frame}"/>` +
        `<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="1.1" fill="${col.gap}"/>` +
        `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="0.8" fill="${col.eye}"/>`
    );
  });

  parts.push(
    `<path d="${label.d}" fill="${col.text}" stroke="${col.outline}" stroke-width="${OUTLINE}" ` +
      `stroke-linejoin="round" paint-order="stroke"/>`
  );
  parts.push("</svg>");
  return parts.join("");
}

/* ---------- Decode tests ---------- */

async function decode(pipeline, inversionAttempts) {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const result = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height, {
    inversionAttempts,
  });
  return result ? result.data : null;
}

async function runTests(png, inversionAttempts) {
  const tests = {
    "2400px": () => sharp(png),
    "600px": () => sharp(png).resize(600, 600),
    "300px": () => sharp(png).resize(300, 300),
    "600px + blur": () => sharp(png).resize(600, 600).blur(1.2),
  };
  const results = {};
  for (const [name, make] of Object.entries(tests)) {
    results[name] = (await decode(make(), inversionAttempts)) === URL_TEXT;
  }
  return results;
}

const allPass = (results) => Object.values(results).every(Boolean);
const fmt = (results) => Object.entries(results).map(([k, v]) => `${k} ${v ? "PASS" : "FAIL"}`).join(", ");
const toPng = (svg) => sharp(Buffer.from(svg)).resize(OUT_PX, OUT_PX).png().toBuffer();

/* ---------- Main ---------- */

(async () => {
  const candidates = [];

  for (const version of VERSIONS) {
    const m = buildMatrix(version);
    const placement = await bestPlacement(m);
    if (!placement) {
      console.log(`v${version}: no valid placement`);
      continue;
    }
    let { height } = placement;
    let label = placement;
    let attempt = 0;
    while (height > 0.5 && attempt < 12) {
      const svg = renderSvg(m, label, "normal");
      const png = await toPng(svg);
      const results = await runTests(png, "dontInvert");
      const textPx = (height / m.canvas) * OUT_PX;
      console.log(
        `v${version} try ${++attempt}: text ${height.toFixed(2)} modules (${textPx.toFixed(0)}px), ` +
          `coverage ${(label.ratio * 100).toFixed(1)}% | ${fmt(results)}`
      );
      if (allPass(results)) {
        candidates.push({ m, label, height, textPx, svg, png, results });
        break;
      }
      // Shrink 5%; letters shift as they shrink, so skip sizes that touch a fixed pattern.
      let smaller = null;
      while (!smaller && height > 0.5) {
        height *= 0.95;
        smaller = await coverage(m, height, placement.cy);
      }
      if (!smaller) break;
      label = { height, cy: placement.cy, ...smaller };
    }
  }

  if (!candidates.length) {
    console.error("No version passed all decode tests.");
    process.exit(1);
  }

  const best = candidates.sort((a, b) => b.textPx - a.textPx)[0];
  fs.writeFileSync(path.join(root, "qr-art.svg"), best.svg);
  fs.writeFileSync(path.join(root, "qr-art.png"), best.png);

  const invSvg = renderSvg(best.m, best.label, "inverted");
  const invPng = await toPng(invSvg);
  fs.writeFileSync(path.join(root, "qr-art-inverted.png"), invPng);
  const invResults = await runTests(invPng, "attemptBoth");

  console.log("\n=== Result ===");
  console.log(`Chosen version: ${best.m.version} (${best.m.size}x${best.m.size} modules)`);
  console.log(`Text height: ${best.height.toFixed(2)} modules, ${best.textPx.toFixed(0)}px on the ${OUT_PX}px image`);
  console.log(`Text coverage: ${(best.label.ratio * 100).toFixed(1)}% of data modules`);
  console.log(`Tests: ${fmt(best.results)}`);
  console.log(`Inverted: ${fmt(invResults)} -> ${allPass(invResults) ? "decodes" : "does NOT decode reliably"}`);
  console.log("Saved qr-art.svg, qr-art.png, qr-art-inverted.png");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
