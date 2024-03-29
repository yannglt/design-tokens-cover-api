const express = require('express');
const { json } = require('express/lib/response');
const serverless = require('serverless-http');
const sharp = require('sharp');
const tinycolor = require("tinycolor2");
const path = require('path');

path.resolve(process.cwd(), 'fonts', 'fonts.conf');
path.resolve(process.cwd(), 'fonts', 'Inter-Bold.ttf');

const app = express();
const router = express.Router();

app.use('/', router)

router.get('/api', async (req, res) => {

  const category = req.query.category;

  switch(category) {
    case "color":
      const colorValue = req.query.value;

      const rgb = tinycolor(colorValue).toRgb();
      const red = JSON.parse(rgb.r);
      const green = JSON.parse(rgb.g);
      const blue = JSON.parse(rgb.b);

      const imageColor = await sharp({
        create: {
          width: 256,
          height: 256,
          channels: 4,
          background: { r: red, g: green, b: blue, alpha: 1 }
        }
      })
      .png()
      .toBuffer();

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(imageColor);
      break;

    case "text-style":
      // instructions go here
      break;

    case "measurement":
      const measurementValue = req.query.value;
      const pathStart = 180 - measurementValue / 2;
      const pathMarkerStart = 180 - measurementValue / 2 - 4;
      const pathMarkerEnd = 180 + measurementValue / 2;

      const measurement = `
        <svg width="360" height="200" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#F5F4F0"/>
          <rect opacity="0.08" x="`+ pathStart + `" y="112" width="` + measurementValue + `" height="24" fill="black"/>
          <rect x="`+ pathMarkerStart + `" y="112" width="4" height="24" fill="black"/>
          <rect x="`+ pathMarkerEnd + `" y="112" width="4" height="24" fill="black"/>
          <text fill="black" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="32" font-weight="bold" text-anchor="middle" x="180" y="96">`+ measurementValue + `px</text>
          <rect x="`+ pathStart + `" y="122" width="` + measurementValue + `" height="4" fill="black"/>
        </svg>
      `

      const imageMeasurement = await sharp(Buffer.from(measurement))
      .png()
      .toBuffer();

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(imageMeasurement);
      break;

    case "duration":
      // instructions go here
      break;

    case "depth":
      // instructions go here
      break;

    case "shadow":
      // instructions go here
      break;

    case "border":
      // instructions go here
      break;

    case "gradient":
      const gradientValueStart = req.query.valueStart;
      const gradientValueEnd = req.query.valueEnd;

      const gradient = `
        <svg width="360" height="200" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="url(#gradientPaint)"/>
          <defs>
            <linearGradient id="gradientPaint" x1="180" y1="0" x2="180" y2="200" gradientUnits="userSpaceOnUse">
              <stop stop-color="#`+ gradientValueStart + `"/>
              <stop offset="1" stop-color="#`+ gradientValueEnd + `"/>
            </linearGradient>
          </defs>
        </svg>
      `

      const imageGradient = await sharp(Buffer.from(gradient))
      .png()
      .toBuffer();

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(imageGradient);
      break;

    case "weight":
      // instructions go here
      break;

    case "vector":
      // instructions go here
      break;

    case "bitmap":
      // instructions go here
      break;

    default:
      res.end('fail')
  }
});

module.exports = app
module.exports.handler = serverless(app)