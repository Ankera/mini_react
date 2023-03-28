const core = require('@babel/core');
const types = require('@babel/types');

/**
 * babel插件格式是固定格式
 */
module.exports = function() {
 
  return {
    visitor: {
      CallExpression: function(path, state) {
        const { node } = path;
        if(types.isMemberExpression(node.callee)){
          if(node.callee.object.name === 'console'){
            if(['log','error','info','warn','debug'].includes(node.callee.property.name)){
              const { line, column } = path.node.loc.start;
              path.node.arguments.unshift(types.stringLiteral(`${line}:${column}`))
            }
          }
        }
      }
    }
  }
}