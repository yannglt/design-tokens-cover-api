const express = require('express');
const { json } = require('express/lib/response');
const serverless = require('serverless-http');
const sharp = require('sharp');
const tinycolor = require("tinycolor2");

const app = express();
const router = express.Router();

app.use('/', router)

router.get('/api', async (req, res) => {

  const category = req.query.category;

  if(category == "measurement"){
    const value = req.query.value;
    const pathStart = 180 - value / 2;
    const pathMarkerStart = 180 - value / 2 - 4;
    const pathMarkerEnd = 180 + value / 2;

    const measurement = `
      <svg width="360" height="200" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="360" height="200" fill="#F5F4F0"/>
        <rect opacity="0.08" x="`+ pathStart + `" y="112" width="`+ value + `" height="24" fill="black"/>
        <rect x="`+ pathMarkerStart + `" y="112" width="4" height="24" fill="black"/>
        <rect x="`+ pathMarkerEnd + `" y="112" width="4" height="24" fill="black"/>
        <text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" x="180" y="96">`+ value + `px</text>
        <rect x="`+ pathStart + `" y="122" width="` + value + `" height="4" fill="black"/>
      </svg>
    `

    const image = await sharp(Buffer.from(measurement))
    .png()
    .toBuffer();

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image);
  } else {
    res.end('fail')
  }

  // const color = req.query.color;

  // const red = req.query.red;
  // const green = req.query.green;
  // const blue = req.query.blue;

  // const rgb = tinycolor(color).toRgb();
  // const red = JSON.parse(rgb.r);
  // const green = JSON.parse(rgb.g);
  // const blue = JSON.parse(rgb.b);

  // Create a color cover
  // const image = await sharp({
  //   create: {
  //     width: 256,
  //     height: 256,
  //     channels: 4,
  //     background: { r: red, g: green, b: blue, alpha: 1 }
  //   }
  // })
});

module.exports = app
module.exports.handler = serverless(app)