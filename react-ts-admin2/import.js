const core = require('@babel/core');
const types = require('@babel/types');

/**
 * babel插件格式是固定格式
 */
module.exports = function() {
 
  return {
    visitor: {
      ImportDeclaration: function(path, state) {
        const { node } = path;
        const { specifiers } = node;
        const { libraryName, libraryDirectory = 'lib' } = state.opts;
        // 不是默认导出
        if(node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0])) {
          const declarations = specifiers.map(specifier => {
            return types.importDeclaration(
              // 导入声明模块 import add
              [types.importDefaultSpecifier(specifier.local)],
              // 导入模块source  lodash/add
              types.stringLiteral(
                libraryDirectory ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}` : `${libraryName}/${specifier.imported.name}`
              )
            )
          });
          path.replaceWithMultiple(declarations);
        }
      }
    }
  }
}