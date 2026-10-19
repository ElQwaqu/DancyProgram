// Renders index.html with the print stylesheet and saves program.pdf (A4).
const path = require("path");
const { pathToFileURL } = require("url");
const puppeteer = require("puppeteer");

const root = path.resolve(__dirname, "..");
const input = pathToFileURL(path.join(root, "index.html")).href;
const output = path.join(root, "program.pdf");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.on("pageerror", (err) => console.error("Page error:", err.message));

    await page.emulateMediaType("print");
    await page.goto(input, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);

    const fontsOk = await page.evaluate(
      () => document.fonts.check('500 16px "Cormorant Garamond"') && document.fonts.check('16px "Jost"')
    );
    if (!fontsOk) {
      console.warn("Warning: Google Fonts did not load (offline?). The PDF will use fallback fonts.");
    }

    await page.pdf({
      path: output,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log(`Saved ${path.relative(process.cwd(), output) || output}`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
