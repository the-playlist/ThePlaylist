"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/(dashboard)/players/page",{

/***/ "(app-pages-browser)/./src/app/(dashboard)/players/page.tsx":
/*!**********************************************!*\
  !*** ./src/app/(dashboard)/players/page.tsx ***!
  \**********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_components */ \"(app-pages-browser)/./src/app/_components/index.tsx\");\n/* harmony import */ var _app_components_add_edit_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/app/_components/add-edit-player */ \"(app-pages-browser)/./src/app/_components/add-edit-player/index.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\nconst Players = ()=>{\n    _s();\n    const [addEditEmplyee, setAddEditEmplyee] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const users = [\n        {\n            id: 0,\n            firstName: \"John Lennon\",\n            lastName: \"Lennon\",\n            email: \"johnLennon@gmail.com\",\n            phone: \"+1 1234 456 789\"\n        },\n        {\n            id: 1,\n            firstName: \"Aretha\",\n            lastName: \"Franklin\",\n            email: \"johnLennon@gmail.com\",\n            phone: \"+1 1122 333 456\"\n        },\n        {\n            id: 2,\n            firstName: \"Michael\",\n            lastName: \"Jackson\",\n            email: \"johnLennon@gmail.com\",\n            phone: \"+1 3344 567 899\"\n        },\n        {\n            id: 3,\n            firstName: \"Van\",\n            lastName: \"Morrison\",\n            email: \"johnLennon@gmail.com\",\n            phone: \"+1 4445 678 990\"\n        }\n    ];\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"overflow-x-auto\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex border-3 justify-end\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: ()=>document.getElementById(\"my_modal_3\").showModal(),\n                            className: \" self-end btn btn-primary bg-primary border-none text-white \",\n                            children: \"Add New Player+\"\n                        }, void 0, false, {\n                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                            lineNumber: 42,\n                            columnNumber: 11\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                        lineNumber: 41,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"table\", {\n                        className: \"table border-separate border-spacing-y-5 p-1 rounded-2xl \",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"thead\", {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"tr\", {\n                                    className: \"text-black text-lg font-thin\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {}, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 52,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {\n                                            children: \"First Name\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 53,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {\n                                            children: \"Last Name\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 54,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {\n                                            children: \"Email\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 55,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {\n                                            children: \"Phone\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 56,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {\n                                            children: \"Songs\"\n                                        }, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 57,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {}, void 0, false, {\n                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                            lineNumber: 58,\n                                            columnNumber: 15\n                                        }, undefined)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                    lineNumber: 51,\n                                    columnNumber: 13\n                                }, undefined)\n                            }, void 0, false, {\n                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                lineNumber: 50,\n                                columnNumber: 11\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"tbody\", {\n                                children: users === null || users === void 0 ? void 0 : users.map((item, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"tr\", {\n                                        className: \"h-20 text-black text-lg shadow-xl  rounded-2xl \",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"th\", {\n                                                children: index + 1\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 64,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"td\", {\n                                                children: item === null || item === void 0 ? void 0 : item.firstName\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 65,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"td\", {\n                                                children: item === null || item === void 0 ? void 0 : item.lastName\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 66,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"td\", {\n                                                children: item === null || item === void 0 ? void 0 : item.email\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 67,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"td\", {\n                                                children: item === null || item === void 0 ? void 0 : item.phone\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 68,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"td\", {\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                    className: \"w-15 h-15\",\n                                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                        className: \"bg-yellow-600 w-10 h-10  rounded-full flex  items-center justify-center \",\n                                                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                                                            width: \"11\",\n                                                            height: \"18\",\n                                                            viewBox: \"0 0 11 18\",\n                                                            fill: \"none\",\n                                                            xmlns: \"http://www.w3.org/2000/svg\",\n                                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                                                d: \"M10.2498 10.4108C10.2498 10.4108 10.2032 10.5269 9.59041 12.0108C9.56808 12.0646 9.53448 12.1138 9.49154 12.1556C9.44859 12.1974 9.39715 12.231 9.34013 12.2545C9.28312 12.2779 9.22166 12.2908 9.15926 12.2923C9.09686 12.2939 9.03474 12.2841 8.97645 12.2634C8.91816 12.2428 8.86484 12.2118 8.81954 12.1722C8.77423 12.1325 8.73783 12.0851 8.71241 12.0324C8.68698 11.9798 8.67304 11.9231 8.67137 11.8655C8.6697 11.8079 8.68034 11.7506 8.70267 11.6968C9.31081 10.228 9.3644 10.0946 9.3644 10.0946C9.94691 8.69893 11.3076 5.43441 7.34892 2.99785C7.09366 2.84484 6.85901 2.66436 6.64991 2.46022V14.9333C6.62585 15.7393 6.26838 16.5061 5.6509 17.0764C5.03343 17.6468 4.20281 17.9772 3.32962 18C2.44655 18 1.59965 17.6762 0.975222 17.0999C0.350798 16.5236 0 15.7419 0 14.9269C0 14.1118 0.350798 13.3302 0.975222 12.7539C1.59965 12.1775 2.44655 11.8538 3.32962 11.8538H5.70625V0H6.66389V0.430108C6.69788 0.801588 6.82557 1.16057 7.03677 1.47836C7.24796 1.79614 7.5368 2.06389 7.88017 2.26022C12.468 5.09462 10.7974 9.09678 10.2498 10.4108Z\",\n                                                                fill: \"white\"\n                                                            }, void 0, false, {\n                                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                                lineNumber: 79,\n                                                                columnNumber: 25\n                                                            }, undefined)\n                                                        }, void 0, false, {\n                                                            fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                            lineNumber: 72,\n                                                            columnNumber: 23\n                                                        }, undefined)\n                                                    }, void 0, false, {\n                                                        fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                        lineNumber: 71,\n                                                        columnNumber: 21\n                                                    }, undefined)\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                    lineNumber: 70,\n                                                    columnNumber: 19\n                                                }, undefined)\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 69,\n                                                columnNumber: 17\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"td\", {\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components__WEBPACK_IMPORTED_MODULE_2__.OptionButton, {\n                                                    item: item,\n                                                    index: index\n                                                }, void 0, false, {\n                                                    fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                    lineNumber: 87,\n                                                    columnNumber: 22\n                                                }, undefined)\n                                            }, void 0, false, {\n                                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                                lineNumber: 87,\n                                                columnNumber: 17\n                                            }, undefined)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                        lineNumber: 63,\n                                        columnNumber: 15\n                                    }, undefined))\n                            }, void 0, false, {\n                                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                                lineNumber: 61,\n                                columnNumber: 11\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                        lineNumber: 49,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                lineNumber: 40,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_components_add_edit_player__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                show: addEditEmplyee\n            }, void 0, false, {\n                fileName: \"/Users/sly/Documents/Next Js/theplaylist/src/app/(dashboard)/players/page.tsx\",\n                lineNumber: 93,\n                columnNumber: 8\n            }, undefined)\n        ]\n    }, void 0, true);\n};\n_s(Players, \"70bgrFOnDEqse5j4ey0/EW6GvX8=\");\n_c = Players;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Players);\nvar _c;\n$RefreshReg$(_c, \"Players\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvKGRhc2hib2FyZCkvcGxheWVycy9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUN3QztBQUNTO0FBQ2E7QUFFOUQsTUFBTUksVUFBVTs7SUFDZCxNQUFNLENBQUNDLGdCQUFnQkMsa0JBQWtCLEdBQUdMLCtDQUFRQSxDQUFDO0lBQ3JELE1BQU1NLFFBQVE7UUFDWjtZQUNFQyxJQUFJO1lBQ0pDLFdBQVc7WUFDWEMsVUFBVTtZQUNWQyxPQUFPO1lBQ1BDLE9BQU87UUFDVDtRQUNBO1lBQ0VKLElBQUk7WUFDSkMsV0FBVztZQUNYQyxVQUFVO1lBQ1ZDLE9BQU87WUFDUEMsT0FBTztRQUNUO1FBQ0E7WUFDRUosSUFBSTtZQUNKQyxXQUFXO1lBQ1hDLFVBQVU7WUFDVkMsT0FBTztZQUNQQyxPQUFPO1FBQ1Q7UUFDQTtZQUNFSixJQUFJO1lBQ0pDLFdBQVc7WUFDWEMsVUFBVTtZQUNWQyxPQUFPO1lBQ1BDLE9BQU87UUFDVDtLQUNEO0lBQ0QscUJBQ0U7OzBCQUNFLDhEQUFDQztnQkFBSUMsV0FBVTs7a0NBQ2IsOERBQUNEO3dCQUFJQyxXQUFVO2tDQUNiLDRFQUFDQzs0QkFDQ0MsU0FBUyxJQUFNQyxTQUFTQyxjQUFjLENBQUMsY0FBY0MsU0FBUzs0QkFDOURMLFdBQVU7c0NBQ1g7Ozs7Ozs7Ozs7O2tDQUlILDhEQUFDTTt3QkFBTU4sV0FBVTs7MENBQ2YsOERBQUNPOzBDQUNDLDRFQUFDQztvQ0FBR1IsV0FBVTs7c0RBQ1osOERBQUNTOzs7OztzREFDRCw4REFBQ0E7c0RBQUc7Ozs7OztzREFDSiw4REFBQ0E7c0RBQUc7Ozs7OztzREFDSiw4REFBQ0E7c0RBQUc7Ozs7OztzREFDSiw4REFBQ0E7c0RBQUc7Ozs7OztzREFDSiw4REFBQ0E7c0RBQUc7Ozs7OztzREFDSiw4REFBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7MENBR0wsOERBQUNDOzBDQUNFakIsa0JBQUFBLDRCQUFBQSxNQUFPa0IsR0FBRyxDQUFDLENBQUNDLE1BQVdDLHNCQUN0Qiw4REFBQ0w7d0NBQUdSLFdBQVU7OzBEQUNaLDhEQUFDUzswREFBSUksUUFBUTs7Ozs7OzBEQUNiLDhEQUFDQzswREFBSUYsaUJBQUFBLDJCQUFBQSxLQUFNakIsU0FBUzs7Ozs7OzBEQUNwQiw4REFBQ21COzBEQUFJRixpQkFBQUEsMkJBQUFBLEtBQU1oQixRQUFROzs7Ozs7MERBQ25CLDhEQUFDa0I7MERBQUlGLGlCQUFBQSwyQkFBQUEsS0FBTWYsS0FBSzs7Ozs7OzBEQUNoQiw4REFBQ2lCOzBEQUFJRixpQkFBQUEsMkJBQUFBLEtBQU1kLEtBQUs7Ozs7OzswREFDaEIsOERBQUNnQjswREFDQyw0RUFBQ2Y7b0RBQUlDLFdBQVU7OERBQ2IsNEVBQUNEO3dEQUFJQyxXQUFVO2tFQUNiLDRFQUFDZTs0REFDQ0MsT0FBTTs0REFDTkMsUUFBTzs0REFDUEMsU0FBUTs0REFDUkMsTUFBSzs0REFDTEMsT0FBTTtzRUFFTiw0RUFBQ0M7Z0VBQ0NDLEdBQUU7Z0VBQ0ZILE1BQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBEQU1mLDhEQUFDTDswREFBSSw0RUFBQzFCLHFEQUFZQTtvREFBQ3dCLE1BQU1BO29EQUFNQyxPQUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFNL0MsOERBQUN4Qix1RUFBYUE7Z0JBQUNrQyxNQUFNaEM7Ozs7Ozs7O0FBRzVCO0dBMUZNRDtLQUFBQTtBQTRGTiwrREFBZUEsT0FBT0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvYXBwLyhkYXNoYm9hcmQpL3BsYXllcnMvcGFnZS50c3g/MGNiNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgT3B0aW9uQnV0dG9uIH0gZnJvbSBcIi4uLy4uL19jb21wb25lbnRzXCI7XG5pbXBvcnQgQWRkRWRpdFBsYXllciBmcm9tIFwiQC9hcHAvX2NvbXBvbmVudHMvYWRkLWVkaXQtcGxheWVyXCI7XG5cbmNvbnN0IFBsYXllcnMgPSAoKSA9PiB7XG4gIGNvbnN0IFthZGRFZGl0RW1wbHllZSwgc2V0QWRkRWRpdEVtcGx5ZWVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB1c2VycyA9IFtcbiAgICB7XG4gICAgICBpZDogMCxcbiAgICAgIGZpcnN0TmFtZTogXCJKb2huIExlbm5vblwiLFxuICAgICAgbGFzdE5hbWU6IFwiTGVubm9uXCIsXG4gICAgICBlbWFpbDogXCJqb2huTGVubm9uQGdtYWlsLmNvbVwiLFxuICAgICAgcGhvbmU6IFwiKzEgMTIzNCA0NTYgNzg5XCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogMSxcbiAgICAgIGZpcnN0TmFtZTogXCJBcmV0aGFcIixcbiAgICAgIGxhc3ROYW1lOiBcIkZyYW5rbGluXCIsXG4gICAgICBlbWFpbDogXCJqb2huTGVubm9uQGdtYWlsLmNvbVwiLFxuICAgICAgcGhvbmU6IFwiKzEgMTEyMiAzMzMgNDU2XCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogMixcbiAgICAgIGZpcnN0TmFtZTogXCJNaWNoYWVsXCIsXG4gICAgICBsYXN0TmFtZTogXCJKYWNrc29uXCIsXG4gICAgICBlbWFpbDogXCJqb2huTGVubm9uQGdtYWlsLmNvbVwiLFxuICAgICAgcGhvbmU6IFwiKzEgMzM0NCA1NjcgODk5XCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogMyxcbiAgICAgIGZpcnN0TmFtZTogXCJWYW5cIixcbiAgICAgIGxhc3ROYW1lOiBcIk1vcnJpc29uXCIsXG4gICAgICBlbWFpbDogXCJqb2huTGVubm9uQGdtYWlsLmNvbVwiLFxuICAgICAgcGhvbmU6IFwiKzEgNDQ0NSA2NzggOTkwXCIsXG4gICAgfSxcbiAgXTtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJvdmVyZmxvdy14LWF1dG9cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGJvcmRlci0zIGp1c3RpZnktZW5kXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteV9tb2RhbF8zXCIpLnNob3dNb2RhbCgpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiIHNlbGYtZW5kIGJ0biBidG4tcHJpbWFyeSBiZy1wcmltYXJ5IGJvcmRlci1ub25lIHRleHQtd2hpdGUgXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBBZGQgTmV3IFBsYXllcitcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZSBib3JkZXItc2VwYXJhdGUgYm9yZGVyLXNwYWNpbmcteS01IHAtMVx0cm91bmRlZC0yeGwgXCI+XG4gICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cInRleHQtYmxhY2sgdGV4dC1sZyBmb250LXRoaW5cIj5cbiAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgIDx0aD5GaXJzdCBOYW1lPC90aD5cbiAgICAgICAgICAgICAgPHRoPkxhc3QgTmFtZTwvdGg+XG4gICAgICAgICAgICAgIDx0aD5FbWFpbDwvdGg+XG4gICAgICAgICAgICAgIDx0aD5QaG9uZTwvdGg+XG4gICAgICAgICAgICAgIDx0aD5Tb25nczwvdGg+XG4gICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIHt1c2Vycz8ubWFwKChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImgtMjAgdGV4dC1ibGFjayB0ZXh0LWxnIHNoYWRvdy14bCAgcm91bmRlZC0yeGwgXCI+XG4gICAgICAgICAgICAgICAgPHRoPntpbmRleCArIDF9PC90aD5cbiAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0/LmZpcnN0TmFtZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57aXRlbT8ubGFzdE5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0/LmVtYWlsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPntpdGVtPy5waG9uZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xNSBoLTE1XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmcteWVsbG93LTYwMCB3LTEwIGgtMTAgIHJvdW5kZWQtZnVsbCBmbGV4ICBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDExIDE4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJNMTAuMjQ5OCAxMC40MTA4QzEwLjI0OTggMTAuNDEwOCAxMC4yMDMyIDEwLjUyNjkgOS41OTA0MSAxMi4wMTA4QzkuNTY4MDggMTIuMDY0NiA5LjUzNDQ4IDEyLjExMzggOS40OTE1NCAxMi4xNTU2QzkuNDQ4NTkgMTIuMTk3NCA5LjM5NzE1IDEyLjIzMSA5LjM0MDEzIDEyLjI1NDVDOS4yODMxMiAxMi4yNzc5IDkuMjIxNjYgMTIuMjkwOCA5LjE1OTI2IDEyLjI5MjNDOS4wOTY4NiAxMi4yOTM5IDkuMDM0NzQgMTIuMjg0MSA4Ljk3NjQ1IDEyLjI2MzRDOC45MTgxNiAxMi4yNDI4IDguODY0ODQgMTIuMjExOCA4LjgxOTU0IDEyLjE3MjJDOC43NzQyMyAxMi4xMzI1IDguNzM3ODMgMTIuMDg1MSA4LjcxMjQxIDEyLjAzMjRDOC42ODY5OCAxMS45Nzk4IDguNjczMDQgMTEuOTIzMSA4LjY3MTM3IDExLjg2NTVDOC42Njk3IDExLjgwNzkgOC42ODAzNCAxMS43NTA2IDguNzAyNjcgMTEuNjk2OEM5LjMxMDgxIDEwLjIyOCA5LjM2NDQgMTAuMDk0NiA5LjM2NDQgMTAuMDk0NkM5Ljk0NjkxIDguNjk4OTMgMTEuMzA3NiA1LjQzNDQxIDcuMzQ4OTIgMi45OTc4NUM3LjA5MzY2IDIuODQ0ODQgNi44NTkwMSAyLjY2NDM2IDYuNjQ5OTEgMi40NjAyMlYxNC45MzMzQzYuNjI1ODUgMTUuNzM5MyA2LjI2ODM4IDE2LjUwNjEgNS42NTA5IDE3LjA3NjRDNS4wMzM0MyAxNy42NDY4IDQuMjAyODEgMTcuOTc3MiAzLjMyOTYyIDE4QzIuNDQ2NTUgMTggMS41OTk2NSAxNy42NzYyIDAuOTc1MjIyIDE3LjA5OTlDMC4zNTA3OTggMTYuNTIzNiAwIDE1Ljc0MTkgMCAxNC45MjY5QzAgMTQuMTExOCAwLjM1MDc5OCAxMy4zMzAyIDAuOTc1MjIyIDEyLjc1MzlDMS41OTk2NSAxMi4xNzc1IDIuNDQ2NTUgMTEuODUzOCAzLjMyOTYyIDExLjg1MzhINS43MDYyNVYwSDYuNjYzODlWMC40MzAxMDhDNi42OTc4OCAwLjgwMTU4OCA2LjgyNTU3IDEuMTYwNTcgNy4wMzY3NyAxLjQ3ODM2QzcuMjQ3OTYgMS43OTYxNCA3LjUzNjggMi4wNjM4OSA3Ljg4MDE3IDIuMjYwMjJDMTIuNDY4IDUuMDk0NjIgMTAuNzk3NCA5LjA5Njc4IDEwLjI0OTggMTAuNDEwOFpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwid2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57PE9wdGlvbkJ1dHRvbiBpdGVtPXtpdGVtfSBpbmRleD17aW5kZXh9IC8+fTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgICB7PEFkZEVkaXRQbGF5ZXIgc2hvdz17YWRkRWRpdEVtcGx5ZWV9IC8+fVxuICAgIDwvPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVycztcbiJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwiT3B0aW9uQnV0dG9uIiwiQWRkRWRpdFBsYXllciIsIlBsYXllcnMiLCJhZGRFZGl0RW1wbHllZSIsInNldEFkZEVkaXRFbXBseWVlIiwidXNlcnMiLCJpZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZW1haWwiLCJwaG9uZSIsImRpdiIsImNsYXNzTmFtZSIsImJ1dHRvbiIsIm9uQ2xpY2siLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic2hvd01vZGFsIiwidGFibGUiLCJ0aGVhZCIsInRyIiwidGgiLCJ0Ym9keSIsIm1hcCIsIml0ZW0iLCJpbmRleCIsInRkIiwic3ZnIiwid2lkdGgiLCJoZWlnaHQiLCJ2aWV3Qm94IiwiZmlsbCIsInhtbG5zIiwicGF0aCIsImQiLCJzaG93Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/(dashboard)/players/page.tsx\n"));

/***/ })

});