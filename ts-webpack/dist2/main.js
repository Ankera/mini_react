/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./loaders/inline1-loader.js!./loaders/inline2-loader.js!./src/title.js":
/*!******************************************************************************!*\
  !*** ./loaders/inline1-loader.js!./loaders/inline2-loader.js!./src/title.js ***!
  \******************************************************************************/
/***/ (function(module) {

const title = 'hello Title'

module.exports = title;// pre2// pre1// normal2// normal1// inline2// inline1// post2// post1

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!***********************!*\
  !*** ./src/entry1.js ***!
  \***********************/
const title = __webpack_require__(/*! inline1-loader!inline2-loader!./title */ "./loaders/inline1-loader.js!./loaders/inline2-loader.js!./src/title.js");

// console.log('entry1 = =12 ', title)

const sum = (a,b) => a + b;// pre2// pre1// normal2// normal1// post2// post1
}();
/******/ })()
;