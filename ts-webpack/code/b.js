const process = require('process')
process.nextTick(() => {
  console.log('A')
  process.nextTick(() => {
    console.log('E')
  })
  setImmediate(() => {
    console.log('F')
  })
})
process.nextTick(() => {
  console.log('B')
  process.nextTick(() => {
    console.log('G')
  })
  setImmediate(() => {
    console.log('H')
  })
})

setImmediate(() => {
  console.log('c')
})

process.nextTick(() => {
  console.log('D')
})

console.log('主线程')
