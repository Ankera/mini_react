const JSZip = require('jszip');

/**
 * 存档插件
 */
class ArchivePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    const zip = new JSZip();
    compiler.hooks.emit.tap('AssetsPlugin', (compilation) => {
      compilation.hooks.processAssets.tapPromise('AssetsPlugin', (assets) => {
        for (const filename in assets) {
          const cacheSource = assets[filename];
  
          const source = cacheSource.source();
  
          zip.file(filename, source);
        }
        return zip.generateAsync({type: 'nodebuffer'}).then((content) => {
          assets['archive_' + Date.now() + '.zip'] = {
            source(){
              return content;
            }
          };
        })
      })
    })
  }
}

module.exports = ArchivePlugin;