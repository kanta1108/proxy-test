const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/corona-tracker-world-date', limiter, (req, res, next) => {
  createProxyMiddleware({
    target: process.env.BASE_API_URL_CORONA_WORLD,
    changeOrigin: true,
    pathRewrite: {
      [`^/corona-tracker-world-date`]: '',
    },
  })(req, res, next);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
