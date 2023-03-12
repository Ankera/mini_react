const webpack = require('./webpack');
const options = require('./webpack.config.s2');

const compiler = webpack(options);

compiler.run((err, stats) => {
  stats.toJson({
    modules: true,
    chunks: true,
    assets: true,
  })
})