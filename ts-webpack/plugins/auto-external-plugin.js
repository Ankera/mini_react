class AutoExternalPlugin {
  constructor(options) {
    this.options = options;

    this.externalsModules = Object.keys(this.options);

    this.importModules = new Set();
  }

  /**
   * 
   */
  apply(compiler){

  }
}

module.exports = AutoExternalPlugin;