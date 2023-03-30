const title = require('inline1-loader!inline2-loader!./title')
const title2 = require('./title2')

console.log('title2', title2)

const _ = require('lodash')

// // console.log('entry1 = =12 ', title)

// const sum = (a,b) => a + b;

// console.log('entry2 =', sum(2,3));
// // import './base.css';

// import _ from 'lodash';

console.log('entry', _.add(1, 2))

module.exports = {
  add(a, b) {
    return a + b
  },
  minus(a, b) {
    return a - b
  },
}
