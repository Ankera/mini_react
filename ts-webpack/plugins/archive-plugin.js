const JSZip = require('jszip')
const { RawSource } = require('webpack-sources')

/**
 * 存档插件
 */
class ArchivePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    // emit 当webpack 确定好输出内容后，会触发的钩子，这里是你修改输出文件的最后机会，这个钩子执行完，就把输入文件写入到对应文件里面
    compiler.hooks.emit.tap('AssetsPlugin', (compilation) => {
      console.log('=========1===========')
      compilation.hooks.processAssets.tapPromise('AssetsPlugin', (assets) => {
        console.log('=========2===========')
        const zip = new JSZip()
        for (const filename in assets) {
          const cacheSource = assets[filename]

          const source = cacheSource.source()

          zip.file(filename, source)
        }
        return zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
          // assets['archive_' + Date.now() + '.zip'] = {
          //   source() {
          //     return content
          //   },
          // }
          console.log('=======')
          assets['archive_' + Date.now() + '.zip'] = new RawSource(content)
        })
      })
    })
  }

  // apply(compiler) {
  //   const zip = new JSZip()
  //   // emit 当webpack 确定好输出内容后，会触发的钩子，这里是你修改输出文件的最后机会，这个钩子执行完，就把输入文件写入到对应文件里面
  //   compiler.hooks.emit.tapPromise('AssetsPlugin', (compilation) => {
  //     const assets = compilation.assets
  //     for (const filename in assets) {
  //       const cacheSource = assets[filename]

  //       const source = cacheSource.source()

  //       zip.file(filename, source)
  //     }
  //     return zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
  //       assets['archive_' + Date.now() + '.zip'] = {
  //         source() {
  //           return content
  //         },
  //       }
  //     })
  //   })
  // }
}

module.exports = ArchivePlugin
