"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/(luma)/layout",{

/***/ "(app-pages-browser)/./app/(luma)/layout.tsx":
/*!*******************************!*\
  !*** ./app/(luma)/layout.tsx ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ RootLayout; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _components_shared_footer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/shared/footer */ \"(app-pages-browser)/./components/shared/footer.tsx\");\n/* harmony import */ var _providers_global_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/providers/global-provider */ \"(app-pages-browser)/./providers/global-provider.tsx\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction RootLayout(param) {\n    let { children } = param;\n    _s();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const { credentials, isFetchingUser } = (0,_providers_global_provider__WEBPACK_IMPORTED_MODULE_2__.useGlobalContext)();\n    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(()=>{\n        if (!credentials) {\n            router.push(\"/sign-in\");\n        }\n    }, [\n        credentials,\n        router\n    ]);\n    // if (isFetchingUser) {\n    //   return <LoadingScreen text=\"Please wait...\" />;\n    // }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"flex-1 pt-8 pb-16 px-4 md:px-0\",\n                children: children\n            }, void 0, false, {\n                fileName: \"/Users/websculptor/Desktop/bluma/app/(luma)/layout.tsx\",\n                lineNumber: 26,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_shared_footer__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {}, void 0, false, {\n                fileName: \"/Users/websculptor/Desktop/bluma/app/(luma)/layout.tsx\",\n                lineNumber: 27,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n_s(RootLayout, \"YmRgo/GA7eZdTNkwRRi1SHjwjFI=\", false, function() {\n    return [\n        next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter,\n        _providers_global_provider__WEBPACK_IMPORTED_MODULE_2__.useGlobalContext\n    ];\n});\n_c = RootLayout;\nvar _c;\n$RefreshReg$(_c, \"RootLayout\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC8obHVtYSkvbGF5b3V0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFZ0Q7QUFFZTtBQUNuQjtBQUNWO0FBR25CLFNBQVNJLFdBQVcsS0FBcUI7UUFBckIsRUFBRUMsUUFBUSxFQUFXLEdBQXJCOztJQUNqQyxNQUFNQyxTQUFTSiwwREFBU0E7SUFDeEIsTUFBTSxFQUFFSyxXQUFXLEVBQUVDLGNBQWMsRUFBRSxHQUFHUCw0RUFBZ0JBO0lBRXhERSxnREFBU0EsQ0FBQztRQUNSLElBQUksQ0FBQ0ksYUFBYTtZQUNoQkQsT0FBT0csSUFBSSxDQUFDO1FBQ2Q7SUFDRixHQUFHO1FBQUNGO1FBQWFEO0tBQU87SUFFeEIsd0JBQXdCO0lBQ3hCLG9EQUFvRDtJQUNwRCxJQUFJO0lBRUoscUJBQ0U7OzBCQUNFLDhEQUFDSTtnQkFBS0MsV0FBVTswQkFBa0NOOzs7Ozs7MEJBQ2xELDhEQUFDTCxpRUFBTUE7Ozs7Ozs7QUFHYjtHQXBCd0JJOztRQUNQRixzREFBU0E7UUFDZ0JELHdFQUFnQkE7OztLQUZsQ0ciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwLyhsdW1hKS9sYXlvdXQudHN4P2Q5YzciXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCBGb290ZXIgZnJvbSBcIkAvY29tcG9uZW50cy9zaGFyZWQvZm9vdGVyXCI7XG5pbXBvcnQgTG9hZGluZ1NjcmVlbiBmcm9tIFwiQC9jb21wb25lbnRzL3NoYXJlZC9sb2FkaW5nLXNjcmVlblwiO1xuaW1wb3J0IHsgdXNlR2xvYmFsQ29udGV4dCB9IGZyb20gXCJAL3Byb3ZpZGVycy9nbG9iYWwtcHJvdmlkZXJcIjtcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjtcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgdG9hc3QgfSBmcm9tIFwic29ubmVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJvb3RMYXlvdXQoeyBjaGlsZHJlbiB9OiBJTGF5b3V0KSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuICBjb25zdCB7IGNyZWRlbnRpYWxzLCBpc0ZldGNoaW5nVXNlciB9ID0gdXNlR2xvYmFsQ29udGV4dCgpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFjcmVkZW50aWFscykge1xuICAgICAgcm91dGVyLnB1c2goXCIvc2lnbi1pblwiKTtcbiAgICB9XG4gIH0sIFtjcmVkZW50aWFscywgcm91dGVyXSk7XG5cbiAgLy8gaWYgKGlzRmV0Y2hpbmdVc2VyKSB7XG4gIC8vICAgcmV0dXJuIDxMb2FkaW5nU2NyZWVuIHRleHQ9XCJQbGVhc2Ugd2FpdC4uLlwiIC8+O1xuICAvLyB9XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZmxleC0xIHB0LTggcGItMTYgcHgtNCBtZDpweC0wXCI+e2NoaWxkcmVufTwvbWFpbj5cbiAgICAgIDxGb290ZXIgLz5cbiAgICA8Lz5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJGb290ZXIiLCJ1c2VHbG9iYWxDb250ZXh0IiwidXNlUm91dGVyIiwidXNlRWZmZWN0IiwiUm9vdExheW91dCIsImNoaWxkcmVuIiwicm91dGVyIiwiY3JlZGVudGlhbHMiLCJpc0ZldGNoaW5nVXNlciIsInB1c2giLCJtYWluIiwiY2xhc3NOYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/(luma)/layout.tsx\n"));

/***/ })

});