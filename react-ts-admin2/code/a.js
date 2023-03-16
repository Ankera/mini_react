const { SyncHook } = require('tapable');
const path = require('path');

const sync = new SyncHook();

sync.call();

sync.tap('key', () => {
  console.log('111')
})



console.log(path.resolve(__dirname, '../webpack'))