'use strict'
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

app.use(bodyParser.json())
app.use('/.netlify/functions/server', router)
app.use('/', router)

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<h1>Hello, stranger</h1>')
  res.end()
})

// router.get('/ogimage', async (req, res) => {
  

  // res.writeHead(200, { 'Content-Type': 'image/png' });
  // res.end(image);
// });

module.exports = app
module.exports.handler = serverless(app)