// Copies the site files into dist/ for Netlify drag-and-drop deploys.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const files = ["index.html", "styles.css", "script.js", "program.pdf"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

for (const file of files) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    console.error(`Missing ${file}. Run "npm run build:pdf" first.`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(dist, file));
}

console.log(`Copied ${files.length} files to dist/.`);
