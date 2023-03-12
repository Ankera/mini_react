var cache = {};

function require(moduleId){
  if(cache[moduleId]){
    return cache[moduleId].exports;
  }

  var module = cache[moduleId] = {
    exports: {}
  }

  modules[moduleId](module, module.exports, require);

  return module.exports;
}