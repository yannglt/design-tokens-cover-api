'use strict'
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

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
        </svg>
      </main>
    </body>
  </html>
`;

app.use(bodyParser.json())
app.use('/.netlify/functions/server', router) // path must route to lambda
app.use('/', router)

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<h1>Hello, stranger</h1>')
  res.end()
})

router.get('/ogimage', async (req, res) => {
  const compiledHTML = handlebars.compile(templateHTML)({
    measurement: req.query.measurement,
  });

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
  await page.setContent(compiledHTML, { waitUntil: "domcontentloaded" });

  const element = await page.$('#body');
  const image = await element.screenshot({ omitBackground: true });
  await browser.close();

  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image);
});

module.exports = app
module.exports.handler = serverless(app)