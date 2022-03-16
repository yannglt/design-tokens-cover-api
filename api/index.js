const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const sharp = require('sharp');

const app = express();
const router = express.Router();

const source = `
  <svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="transparent" />
  </svg>
`;

app.use(bodyParser.json())
app.use('/', router)

router.get('/api', async (req, res) => {

  // Create a color cover
  // const image = await sharp({
  //   create: {
  //     width: 2,
  //     height: 2,
  //     channels: 4,
  //     background: { r: 255, g: 0, b: 0, alpha: 1 }
  //   }
  // })

  // Create any other design token
  const image = await sharp(Buffer.from(source))
  .png()
  .toBuffer();

  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image);
});

module.exports = app
module.exports.handler = serverless(app)