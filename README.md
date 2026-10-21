# Nancy & Daniel: Order of the Day

A mobile-first wedding program (plain HTML, CSS and JavaScript) with a matching A4 PDF.

## Edit the content

Everything you are likely to change is at the top of `script.js`:

- `CONFIG`: the date and venue shown on the cover, `WEDDING_DATE` (format `YYYY-MM-DD`, used for the "Happening now" badge), the contact person, and the PDF file name.
- `CEREMONY` and `RECEPTION`: the timeline. Each item has a `time` (like `"1:00 PM"`), an `event`, and an optional `icon` (`heart`, `glasses`, `bouquet`, `sparkle`, `ring`).
- `PHOTOGRAPHY`: the Order of Photography, one group name per line. Each is shown as "Couple with ..." (the prefix is set in `PHOTO_PREFIX`).
- `BRIDAL_PARTY`: names and roles. A value in square brackets (like `"[TO CONFIRM]"`) or `"To be announced"` is shown as a soft, italic placeholder.

The footer thank-you wording and the small "Together with their families" line on the cover are in `index.html`.

## Preview locally

Option A, VS Code: install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.

Option B, terminal:

```
npx serve .
```

Then open the address it prints. To test on your phone, open the "Network" address on a phone connected to the same Wi-Fi.

To preview the print layout, open the page in Chrome and press Ctrl+P (Cmd+P on Mac).

## Regenerate the PDF

You need Node.js installed. The first time only:

```
npm install
```

Then, after every content change:

```
npm run build:pdf
```

This opens `index.html` in a headless browser with the print stylesheet and saves `program.pdf` (5 A4 pages: cover, ceremony, reception, photography, bridal party). An internet connection is needed so the Google Fonts load; the script warns you if they don't.

## Deploy to Vercel (from GitHub)

Vercel does not generate the PDF; it serves the `program.pdf` committed in the repo. `vercel.json` tells it to skip `npm install` (Puppeteer cannot run on Vercel's build machines), copy the four site files into `dist`, and serve only that folder.

1. Edit your content.
2. Run `npm run build:pdf` locally to refresh `program.pdf`.
3. Commit the content change **and** `program.pdf` together, then push to `main`. Vercel deploys automatically.

In the Vercel project settings (**Settings > Build and Deployment**), leave the Build Command, Install Command and Output Directory overrides switched off so `vercel.json` is used. Note that "Redeploy" on an older deployment rebuilds that older commit; pushing a new commit always deploys the latest code.

## Deploy to Netlify (drag and drop)

1. Run `npm run build`. This regenerates the PDF and copies the four site files (`index.html`, `styles.css`, `script.js`, `program.pdf`) into a `dist` folder.
2. Go to https://app.netlify.com/drop and drag the `dist` folder onto the page.
3. Netlify gives you a live link. You can rename the site under **Site configuration > Change site name**.
4. To update later, run `npm run build` again, open your site in Netlify, go to **Deploys**, and drag the new `dist` folder onto the deploy area.

Use the `dist` folder, not the whole project folder: the project folder contains `node_modules`, which is large and not needed online.

## QR code

```
npm run build:qr
```

This creates a styled QR code for https://dancyprogram.vercel.app with "Dancy26" lettering: `qr-art.svg` (best for print), `qr-art.png` (2400x2400) and `qr-art-inverted.png` (wine background). The script tries QR versions 7, 8 and 9, makes the lettering as large as it can, and only keeps a result that decodes correctly at full size, 600px, 300px and when blurred. It prints the chosen version, how much of the code the lettering covers, and every test result.

The lettering sits just off-centre because the exact centre holds an alignment pattern that scanners need. Before printing, scan the final card with a few different phones.
