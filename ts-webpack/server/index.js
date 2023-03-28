const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('../webpack.config');

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));

app.listen(3002, () => {
  console.log('listening on success');
})