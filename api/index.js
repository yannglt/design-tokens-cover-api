const express = require('express');
const { json } = require('express/lib/response');
const serverless = require('serverless-http');
const sharp = require('sharp');
var tinycolor = require("tinycolor2");

const app = express();
const router = express.Router();

const source = `
  <svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="transparent" />
  </svg>
`;

app.use('/', router)

router.get('/api', async (req, res) => {

  const color = req.query.color;

  // const red = req.query.red;
  // const green = req.query.green;
  // const blue = req.query.blue;

  const rgb = tinycolor(color).toRgb();
  const red = JSON.parse(rgb.r);
  const green = JSON.parse(rgb.g);
  const blue = JSON.parse(rgb.b);

  // Create a color cover
  const image = await sharp({
    create: {
      width: 256,
      height: 256,
      channels: 4,
      background: { r: red, g: green, b: blue, alpha: 1 }
    }
  })

  // Create any other design token
  // const image = await sharp(Buffer.from(source))
  .png()
  .toBuffer();

  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image);
});

module.exports = app
module.exports.handler = serverless(app)