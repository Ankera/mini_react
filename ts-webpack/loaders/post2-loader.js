function loader(source) {
  console.log('post2')
  return source + '// post2'
}

loader.pitch = function(a, b, c, d){
  console.log('post2 pitch')
}

module.exports = loader;