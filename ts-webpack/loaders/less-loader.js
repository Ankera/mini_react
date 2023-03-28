const less = require('less');

function LessLoader(lessSource) {
  // console.log('================================')
  const callback = this.async()

  less.render(lessSource, { fileName: this.resource }, (err, result) => {
    // console.log('lessSource', result.css)
    let scripts = `module.exports = ${JSON.stringify(result.css)}`
    callback(err, scripts)
  })
  // return lessSource;
}

module.exports = LessLoader;