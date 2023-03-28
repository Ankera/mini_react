

class DemoPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.environment.tap('done', () => {
      console.log('done === DemoPlugin')
    });

    compiler.hooks.afterEnvironment.tap('done', () => {
      console.log('done === afterEnvironment')
    });

    compiler.hooks.entryOption.tap('done', (context, entry) => {
      console.log('done === context', context, entry)
    });

    compiler.hooks.afterPlugins.tap('done', () => {
      console.log('done === afterEnvironment')
    });

    compiler.hooks.afterResolvers.tap('done', () => {
      console.log('done === afterResolvers')
    });
  }
}

module.exports = DemoPlugin;