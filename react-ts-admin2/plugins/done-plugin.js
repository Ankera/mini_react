class DonePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    console.log('DonePlugin')

    compiler.hooks.done.tap('done', () => {
      console.log('done === DonePlugin')
    })
  }
}

module.exports = DonePlugin;