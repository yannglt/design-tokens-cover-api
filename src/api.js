const express = require("express");
const serverless = require("serverless-http");
const { createCanvas } = require('canvas');

const app = express();
const router = express.Router();

router.get('/:category/:value', function (req, res) {
  const data = {
    "category": req.params.category,
    "value": req.params.value
  };

  // Define the canvas
  const width = 30
  const height = 20
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  context.fillStyle = "#" + data.value
  context.fillRect(0, 0, width, height)

  // Convert the Canvas to a buffer
  const buffer = canvas.toBuffer('image/png')

  // Set and send the response as a PNG
  res.set({ 'Content-Type': 'image/png' });
  res.send(buffer)
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

// router.get("/", (req, res) => {
//   res.json({
//     hello: "hi!"
//   });
// });