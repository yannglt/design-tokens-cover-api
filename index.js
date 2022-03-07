const express = require('express');
const puppeteer = require('puppeteer');
const Handlebars = require("handlebars");

const app = express();
const port = process.env.PORT || 3000;

const templateHTML = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <style>{{styles}}</style>
    </head>
    <body id="body">
      <main>
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#F6F8FB"/>
            <g filter="url(#filter0_dd_226_16959)">
              <rect x="40" y="34" width="220" height="132" rx="24" fill="white"/>
              <rect x="64" y="58" width="172" height="84" rx="4" fill="#FFDFB8"/>
              <text fill="#FF715C" xml:space="preserve" style="white-space: pre" font-family="Fira Code" font-size="24" font-weight="600"><tspan text-anchor="middle" x="150" y="108">{{measurement}}</tspan></text>
              <rect x="64" y="58" width="172" height="84" rx="4" stroke="#FF715C" stroke-width="2" stroke-dasharray="8 4"/>
            </g>
          <defs>
            <filter id="filter0_dd_226_16959" x="32" y="28" width="236" height="148" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="2"/>
              <feGaussianBlur stdDeviation="4"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_226_16959"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="1"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
              <feBlend mode="normal" in2="effect1_dropShadow_226_16959" result="effect2_dropShadow_226_16959"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_226_16959" result="shape"/>
            </filter>
          </defs>
        </svg>

      </main>
    </body>
  </html>
`;

const templateStyles = `
  * {
    box-sizing: border-box;
  }
`;

app.get('/ogimage', async (req, res) => {
  const compiledStyles = Handlebars.compile(templateStyles);

  // compiled HTML
  const compiledHTML = Handlebars.compile(templateHTML)({
    measurement: req.query.measurement,
    styles: compiledStyles,
  });

  // Launch Headless browser and capture creenshot
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 300,
      height: 200,
    },
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 300, height: 200, deviceScaleFactor: 2 });
  // Set the content to our rendered HTML
  await page.setContent(compiledHTML, { waitUntil: "domcontentloaded" });

  const element = await page.$('#body');
  const image = await element.screenshot({ omitBackground: true });
  await browser.close();

  res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': `immutable, no-transform, s-max-age=2592000, max-age=2592000` });
  res.end(image);
});

app.listen(port, () => console.log(`Server is running in port ${port}`));