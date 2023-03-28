
function loader(source, options) {
  console.log('pre2')
  // console.log(this.getOptions())
  return source + '// pre2'
}

loader.pitch = function(){
  console.log('pre2 pitch')
}

module.exports = loader;