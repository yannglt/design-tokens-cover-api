const express = require("express");
const { createCanvas } = require('@napi-rs/canvas');

const app = express();
const port = process.env.port || 3000;

app.get('/:category/:value', function (req, res) {
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

module.exports = app;

app.listen(port, () => console.log(`Server is running in port ${port}`));