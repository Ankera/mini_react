const { SyncHook } = require('tapable');

const sync = new SyncHook();

sync.call();

sync.tap('key', () => {
  console.log('111')
})

