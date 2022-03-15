const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const sharp = require('sharp');

const app = express();
const router = express.Router();

const source = `
<svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
`;

app.use(bodyParser.json())
app.use('/.netlify/functions/server', router)
app.use('/', router)

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<h1>Hello, stranger</h1>')
  res.end()
})

router.get('/ogimage', async (req, res) => {

  const image = await sharp({
    create: {
      width: 48,
      height: 48,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 }
    }
  })
  .png()
  .toBuffer();

  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image);
});

module.exports = app
module.exports.handler = serverless(app)