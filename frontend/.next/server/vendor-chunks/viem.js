"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/viem";
exports.ids = ["vendor-chunks/viem"];
exports.modules = {

/***/ "(ssr)/./node_modules/viem/_esm/chains/definitions/meterTestnet.js":
/*!*******************************************************************!*\
  !*** ./node_modules/viem/_esm/chains/definitions/meterTestnet.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   meterTestnet: () => (/* binding */ meterTestnet)\n/* harmony export */ });\n/* harmony import */ var _utils_chain_defineChain_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/chain/defineChain.js */ \"(ssr)/./node_modules/viem/_esm/utils/chain/defineChain.js\");\n\nconst meterTestnet = /*#__PURE__*/ (0,_utils_chain_defineChain_js__WEBPACK_IMPORTED_MODULE_0__.defineChain)({\n    id: 83,\n    name: 'Meter Testnet',\n    nativeCurrency: {\n        decimals: 18,\n        name: 'MTR',\n        symbol: 'MTR',\n    },\n    rpcUrls: {\n        default: { http: ['https://rpctest.meter.io'] },\n    },\n    blockExplorers: {\n        default: {\n            name: 'MeterTestnetScan',\n            url: 'https://scan-warringstakes.meter.io',\n        },\n    },\n});\n//# sourceMappingURL=meterTestnet.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmllbS9fZXNtL2NoYWlucy9kZWZpbml0aW9ucy9tZXRlclRlc3RuZXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBK0Q7QUFDeEQsbUNBQW1DLHdFQUFXO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLG1CQUFtQixvQ0FBb0M7QUFDdkQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibHVtYS8uL25vZGVfbW9kdWxlcy92aWVtL19lc20vY2hhaW5zL2RlZmluaXRpb25zL21ldGVyVGVzdG5ldC5qcz85YmNkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZUNoYWluIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhaW4vZGVmaW5lQ2hhaW4uanMnO1xuZXhwb3J0IGNvbnN0IG1ldGVyVGVzdG5ldCA9IC8qI19fUFVSRV9fKi8gZGVmaW5lQ2hhaW4oe1xuICAgIGlkOiA4MyxcbiAgICBuYW1lOiAnTWV0ZXIgVGVzdG5ldCcsXG4gICAgbmF0aXZlQ3VycmVuY3k6IHtcbiAgICAgICAgZGVjaW1hbHM6IDE4LFxuICAgICAgICBuYW1lOiAnTVRSJyxcbiAgICAgICAgc3ltYm9sOiAnTVRSJyxcbiAgICB9LFxuICAgIHJwY1VybHM6IHtcbiAgICAgICAgZGVmYXVsdDogeyBodHRwOiBbJ2h0dHBzOi8vcnBjdGVzdC5tZXRlci5pbyddIH0sXG4gICAgfSxcbiAgICBibG9ja0V4cGxvcmVyczoge1xuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBuYW1lOiAnTWV0ZXJUZXN0bmV0U2NhbicsXG4gICAgICAgICAgICB1cmw6ICdodHRwczovL3NjYW4td2FycmluZ3N0YWtlcy5tZXRlci5pbycsXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWV0ZXJUZXN0bmV0LmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/viem/_esm/chains/definitions/meterTestnet.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/viem/_esm/utils/chain/defineChain.js":
/*!***********************************************************!*\
  !*** ./node_modules/viem/_esm/utils/chain/defineChain.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   defineChain: () => (/* binding */ defineChain)\n/* harmony export */ });\nfunction defineChain(chain) {\n    return {\n        formatters: undefined,\n        fees: undefined,\n        serializers: undefined,\n        ...chain,\n    };\n}\n//# sourceMappingURL=defineChain.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdmllbS9fZXNtL3V0aWxzL2NoYWluL2RlZmluZUNoYWluLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibHVtYS8uL25vZGVfbW9kdWxlcy92aWVtL19lc20vdXRpbHMvY2hhaW4vZGVmaW5lQ2hhaW4uanM/Njg0NCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZGVmaW5lQ2hhaW4oY2hhaW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXR0ZXJzOiB1bmRlZmluZWQsXG4gICAgICAgIGZlZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgc2VyaWFsaXplcnM6IHVuZGVmaW5lZCxcbiAgICAgICAgLi4uY2hhaW4sXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmluZUNoYWluLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/viem/_esm/utils/chain/defineChain.js\n");

/***/ })

};
;