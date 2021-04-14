/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/home.js":
/*!********************!*\
  !*** ./js/home.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "home": () => (/* binding */ home)
/* harmony export */ });
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.js */ "./js/menu.js");
/* jshint esversion: 6 */
/* jshint node: true */



// home.js



let home = (function () {
    let showHome = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Lagerapp";

        let greeting = document.createElement("p");
        let timeOfDayGreeting = "Hej besökaren";
        let now = new Date();

        if (now.getHours() <= 10) {
            timeOfDayGreeting = "Godmorgon";
        } else if (now.getHours() >= 17) {
            timeOfDayGreeting = "Godkväll";
        }

        greeting.textContent = timeOfDayGreeting +
            ", det här är en SPA för kursen Webapp.";

        let image = document.createElement("img");

        image.src = "img/AI-head2.jpg";
        image.alt = "AI head";

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(greeting);
        window.mainContainer.appendChild(image);

        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("home");
    };

    return {
        showHome: showHome
    };
})();




/***/ }),

/***/ "./js/inventory.js":
/*!*************************!*\
  !*** ./js/inventory.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inventory": () => (/* binding */ inventory)
/* harmony export */ });
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.js */ "./js/menu.js");
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vars.js */ "./js/vars.js");
/* harmony import */ var _product_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product-details.js */ "./js/product-details.js");
/* jshint esversion: 6 */
/* jshint node: true */



// inventory.js





let inventory = (function () {
    let showInventory = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Lagersaldo";

        let productList = document.createElement("div");

        productList.className = "inv-container";

        fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl}/products?api_key=${_vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);

                jsonData.data.forEach(function (product) {
                    // console.log(product);
                    let productRow = document.createElement("div");

                    productRow.className = "flex-row";

                    let productName = document.createElement("div");

                    productName.className = "flex-item left";
                    productName.textContent = product.name;

                    let productCount = document.createElement("div");

                    productCount.className = "flex-item right";
                    productCount.textContent = product.stock;

                    productRow.addEventListener("click", function handleClick() {
                        console.log(product);
                        _product_details_js__WEBPACK_IMPORTED_MODULE_2__.productDetails.showProduct(product);
                    });

                    productRow.appendChild(productName);
                    productRow.appendChild(productCount);
                    productList.appendChild(productRow);
                });
            });

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(productList);

        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("inventory");
    };

    return {
        showInventory: showInventory
    };
})();




/***/ }),

/***/ "./js/menu.js":
/*!********************!*\
  !*** ./js/menu.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "menu": () => (/* binding */ menu)
/* harmony export */ });
/* harmony import */ var _home_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.js */ "./js/home.js");
/* harmony import */ var _inventory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inventory.js */ "./js/inventory.js");
/* harmony import */ var _new_orders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./new-orders.js */ "./js/new-orders.js");
/* jshint esversion: 6 */
/* jshint node: true */



// menu.js





let menu = (function () {
    let showMenu = function (selected) {
        window.navigation.innerHTML = "";

        let navElements = [{name: "Home", class: "home", nav: _home_js__WEBPACK_IMPORTED_MODULE_0__.home.showHome},
            {name: "Lagersaldo", class: "inventory", nav: _inventory_js__WEBPACK_IMPORTED_MODULE_1__.inventory.showInventory},
            {name: "Plocklista", class: "checklist", nav: _new_orders_js__WEBPACK_IMPORTED_MODULE_2__.newOrders.showNewOrders}];

        navElements.map(element => drawBottomNavElement (element, selected));

        window.rootElement.appendChild(window.navigation);
    };

    let drawBottomNavElement = function (element, selected) {
        let navElement = document.createElement("a");

        if (selected === element.class) {
            navElement.className = "active";
        }

        navElement.addEventListener("click", element.nav);

        let icon = document.createElement("i");

        icon.className = "material-icons";
        icon.textContent = element.class;
        navElement.appendChild(icon);

        let text = document.createElement("span");

        text.className = "icon-text";
        text.textContent = element.name;
        navElement.appendChild(text);

        window.navigation.appendChild(navElement);
    };

    return {
        showMenu: showMenu
    };
})();




/***/ }),

/***/ "./js/new-orders.js":
/*!**************************!*\
  !*** ./js/new-orders.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newOrders": () => (/* binding */ newOrders)
/* harmony export */ });
/* harmony import */ var _old_menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./old.menu.js */ "./js/old.menu.js");
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vars.js */ "./js/vars.js");
/* harmony import */ var _order_items_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./order-items.js */ "./js/order-items.js");
/* jshint esversion: 6 */
/* jshint node: true */



// js/new-orders.js





let newOrders = (function () {
    let showNewOrders = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "New orders";

        let orderList = document.createElement("div");

        orderList.className = "inv-container";

        fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl}/orders?api_key=${_vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);
                let orderRows = jsonData.data.map(order => generateOrderList(order));

                orderRows.map(orderRow => orderList.appendChild(orderRow));
            });

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(orderList);

        window.rootElement.appendChild(window.mainContainer);

        _old_menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("new-orders");
    };

    let publicAPI = {
        showNewOrders: showNewOrders
    };

    return publicAPI;
})();

let generateOrderList = function (order) {
    // console.log(order);
    let orderRow = document.createElement("div");

    orderRow.className = "flex-row";

    let orderName = document.createElement("div");

    orderName.className = "flex-item left";
    orderName.textContent = order.name;

    let orderId = document.createElement("div");

    orderId.className = "flex-item right";
    orderId.textContent = order.id;

    orderRow.addEventListener("click", function handleClick() {
        console.log(order);
        _order_items_js__WEBPACK_IMPORTED_MODULE_2__.orderItems.showOrderItems(order);
    });

    orderRow.appendChild(orderName);
    orderRow.appendChild(orderId);

    return orderRow;
};




/***/ }),

/***/ "./js/old.menu.js":
/*!************************!*\
  !*** ./js/old.menu.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "menu": () => (/* binding */ menu)
/* harmony export */ });
/* harmony import */ var _home_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.js */ "./js/home.js");
/* harmony import */ var _inventory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inventory.js */ "./js/inventory.js");
/* harmony import */ var _new_orders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./new-orders.js */ "./js/new-orders.js");
/* jshint esversion: 6 */
/* jshint node: true */



// menu.js





let menu = (function () {
    let showMenu = function (selected) {
        window.navigation.innerHTML = "";

        let navElements = [{name: "Home", class: "home", nav: _home_js__WEBPACK_IMPORTED_MODULE_0__.home.showHome},
            {name: "Lagersaldo", class: "inventory", nav: _inventory_js__WEBPACK_IMPORTED_MODULE_1__.inventory.showInventory},
            {name: "Plocklista", class: "checklist", nav: _new_orders_js__WEBPACK_IMPORTED_MODULE_2__.newOrders.showNewOrders}];

        navElements.forEach(function (element) {
            let navElement = document.createElement("a");

            if (selected === element.class) {
                navElement.className = "active";
            }

            navElement.addEventListener("click", element.nav);

            let icon = document.createElement("i");

            icon.className = "material-icons";
            icon.textContent = element.class;
            navElement.appendChild(icon);

            let text = document.createElement("span");

            text.className = "icon-text";
            text.textContent = element.name;
            navElement.appendChild(text);

            window.navigation.appendChild(navElement);
        });

        window.rootElement.appendChild(window.navigation);
    };

    return {
        showMenu: showMenu
    };
})();




/***/ }),

/***/ "./js/order-items.js":
/*!***************************!*\
  !*** ./js/order-items.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orderItems": () => (/* binding */ orderItems)
/* harmony export */ });
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.js */ "./js/menu.js");
/* harmony import */ var _inventory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inventory.js */ "./js/inventory.js");
/* jshint esversion: 6 */
/* jshint node: true */



// product-details.js




let orderItems = (function () {
    let showOrderItems = function (product) {
        window.topNavigation.innerHTML = "";

        /* let topNav = document.createElement("ul");
        topNav.className = "top-ul";

        let listItem = document.createElement("li");
        listItem.className = "top-li"; */

        let topNavElement = document.createElement("a");

        topNavElement.textContent = "Lagersaldo";
        topNavElement.addEventListener("click", _inventory_js__WEBPACK_IMPORTED_MODULE_1__.inventory.showInventory);

        /* listItem.appendChild(listItemAnchor);
        topNav.appendChild(listItem); */
        window.topNavigation.appendChild(topNavElement);

        window.mainContainer.innerHTML = "";

        let productName = document.createElement("h1");

        productName.className = "product-name";
        productName.textContent = product.name;

        let productInfoList = document.createElement("dl");

        productInfoList.className = "product-info";

        for (let key in product) {
            if (key !== "name") {
                let productInfoTerm = document.createElement("dt");
                let productInfoDescription = document.createElement("dd");

                productInfoTerm.textContent = key + ":";
                productInfoDescription.textContent = product[key];

                productInfoList.appendChild(productInfoTerm);
                productInfoList.appendChild(productInfoDescription);
            }
        }

        window.mainContainer.appendChild(productName);
        window.mainContainer.appendChild(productInfoList);

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("new-orders");
    };

    return {
        showOrderItems: showOrderItems
    };
})();




/***/ }),

/***/ "./js/product-details.js":
/*!*******************************!*\
  !*** ./js/product-details.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "productDetails": () => (/* binding */ productDetails)
/* harmony export */ });
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.js */ "./js/menu.js");
/* harmony import */ var _inventory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inventory.js */ "./js/inventory.js");
/* jshint esversion: 6 */
/* jshint node: true */



// product-details.js




let productDetails = (function () {
    let showProduct = function (product) {
        window.topNavigation.innerHTML = "";

        /* let topNav = document.createElement("ul");
        topNav.className = "top-ul";

        let listItem = document.createElement("li");
        listItem.className = "top-li"; */

        let topNavElement = document.createElement("a");

        topNavElement.textContent = "Lagersaldo";
        topNavElement.addEventListener("click", _inventory_js__WEBPACK_IMPORTED_MODULE_1__.inventory.showInventory);

        /* listItem.appendChild(listItemAnchor);
        topNav.appendChild(listItem); */
        window.topNavigation.appendChild(topNavElement);

        window.mainContainer.innerHTML = "";

        let productName = document.createElement("h1");

        productName.className = "product-name";
        productName.textContent = product.name;

        let productInfoList = document.createElement("dl");

        productInfoList.className = "product-info";

        for (let key in product) {
            if (key !== "name") {
                let productInfoTerm = document.createElement("dt");
                let productInfoDescription = document.createElement("dd");

                productInfoTerm.textContent = key + ":";
                productInfoDescription.textContent = product[key];

                productInfoList.appendChild(productInfoTerm);
                productInfoList.appendChild(productInfoDescription);
            }
        }

        window.mainContainer.appendChild(productName);
        window.mainContainer.appendChild(productInfoList);

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("inventory");
    };

    return {
        showProduct: showProduct
    };
})();




/***/ }),

/***/ "./js/vars.js":
/*!********************!*\
  !*** ./js/vars.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "baseUrl": () => (/* binding */ baseUrl),
/* harmony export */   "apiKey": () => (/* binding */ apiKey)
/* harmony export */ });
/* jshint esversion: 6 */
/* jshint node: true */




const apiKey = "0bf1922ce8a318addb340d65036b4a5e";
const baseUrl = "https://lager.emilfolino.se/v2";




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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.js */ "./js/home.js");
/* jshint esversion: 6 */
/* jshint node: true */



// main.js



(function MAIN_IIFE() {
    window.rootElement = document.getElementById("root");

    window.topNavigation = document.createElement("nav");
    window.topNavigation.className = "top-nav";
    window.topNavigation.id = "top-nav";

    window.mainContainer = document.createElement("main");
    window.mainContainer.className = "container";

    window.navigation = document.createElement("nav");
    window.navigation.className = "bottom-nav";

    _home_js__WEBPACK_IMPORTED_MODULE_0__.home.showHome();
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9ob21lLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9tZW51LmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL25ldy1vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvb2xkLm1lbnUuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvb3JkZXItaXRlbXMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvcHJvZHVjdC1kZXRhaWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3ZhcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xhZ2VyMi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVhOztBQUViOztBQUVpQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFFBQVEsbURBQWE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFJQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkRGO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRWlDO0FBQ1c7QUFDVTs7QUFFdEQ7QUFDQTtBQUNB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QTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFFBQVEsbURBQWE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFJQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JFRjtBQUNBOztBQUVhOzs7QUFHYjtBQUNBOztBQUUyQjs7Ozs7OztVQ1QzQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRWlDOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxtREFBYTtBQUNqQixDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBob21lLmpzXG5cbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9tZW51LmpzXCI7XG5cbmxldCBob21lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hvd0hvbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcC1uYXZcIikpKSB7XG4gICAgICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICAgIHRpdGxlLmNsYXNzTmFtZSA9IFwidGl0bGVcIjtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIkxhZ2VyYXBwXCI7XG5cbiAgICAgICAgbGV0IGdyZWV0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGxldCB0aW1lT2ZEYXlHcmVldGluZyA9IFwiSGVqIGJlc8O2a2FyZW5cIjtcbiAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgaWYgKG5vdy5nZXRIb3VycygpIDw9IDEwKSB7XG4gICAgICAgICAgICB0aW1lT2ZEYXlHcmVldGluZyA9IFwiR29kbW9yZ29uXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobm93LmdldEhvdXJzKCkgPj0gMTcpIHtcbiAgICAgICAgICAgIHRpbWVPZkRheUdyZWV0aW5nID0gXCJHb2RrdsOkbGxcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyZWV0aW5nLnRleHRDb250ZW50ID0gdGltZU9mRGF5R3JlZXRpbmcgK1xuICAgICAgICAgICAgXCIsIGRldCBow6RyIMOkciBlbiBTUEEgZsO2ciBrdXJzZW4gV2ViYXBwLlwiO1xuXG4gICAgICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgICAgaW1hZ2Uuc3JjID0gXCJpbWcvQUktaGVhZDIuanBnXCI7XG4gICAgICAgIGltYWdlLmFsdCA9IFwiQUkgaGVhZFwiO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQoZ3JlZXRpbmcpO1xuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChpbWFnZSk7XG5cbiAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy5tYWluQ29udGFpbmVyKTtcblxuICAgICAgICBtZW51LnNob3dNZW51KFwiaG9tZVwiKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hvd0hvbWU6IHNob3dIb21lXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7XG4gICAgaG9tZVxufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBpbnZlbnRvcnkuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IGFwaUtleSwgYmFzZVVybCB9IGZyb20gXCIuL3ZhcnMuanNcIjtcbmltcG9ydCB7IHByb2R1Y3REZXRhaWxzIH0gZnJvbSBcIi4vcHJvZHVjdC1kZXRhaWxzLmpzXCI7XG5cbmxldCBpbnZlbnRvcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBzaG93SW52ZW50b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuY29udGFpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3AtbmF2XCIpKSkge1xuICAgICAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LnJlbW92ZUNoaWxkKHdpbmRvdy50b3BOYXZpZ2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJMYWdlcnNhbGRvXCI7XG5cbiAgICAgICAgbGV0IHByb2R1Y3RMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBwcm9kdWN0TGlzdC5jbGFzc05hbWUgPSBcImludi1jb250YWluZXJcIjtcblxuICAgICAgICBmZXRjaChgJHtiYXNlVXJsfS9wcm9kdWN0cz9hcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coanNvbkRhdGEpO1xuXG4gICAgICAgICAgICAgICAganNvbkRhdGEuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdFJvdy5jbGFzc05hbWUgPSBcImZsZXgtcm93XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb2R1Y3ROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZS5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSBsZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3ROYW1lLnRleHRDb250ZW50ID0gcHJvZHVjdC5uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0Q291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RDb3VudC5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSByaWdodFwiO1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0Q291bnQudGV4dENvbnRlbnQgPSBwcm9kdWN0LnN0b2NrO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RSb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvZHVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0RGV0YWlscy5zaG93UHJvZHVjdChwcm9kdWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdFJvdy5hcHBlbmRDaGlsZChwcm9kdWN0TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RSb3cuYXBwZW5kQ2hpbGQocHJvZHVjdENvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdExpc3QuYXBwZW5kQ2hpbGQocHJvZHVjdFJvdyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2R1Y3RMaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJpbnZlbnRvcnlcIik7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNob3dJbnZlbnRvcnk6IHNob3dJbnZlbnRvcnlcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHtcbiAgICBpbnZlbnRvcnlcbn07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gbWVudS5qc1xuXG5pbXBvcnQgeyBob21lIH0gZnJvbSBcIi4vaG9tZS5qc1wiO1xuaW1wb3J0IHsgaW52ZW50b3J5IH0gZnJvbSBcIi4vaW52ZW50b3J5LmpzXCI7XG5pbXBvcnQgeyBuZXdPcmRlcnMgfSBmcm9tIFwiLi9uZXctb3JkZXJzLmpzXCI7XG5cbmxldCBtZW51ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hvd01lbnUgPSBmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgd2luZG93Lm5hdmlnYXRpb24uaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBsZXQgbmF2RWxlbWVudHMgPSBbe25hbWU6IFwiSG9tZVwiLCBjbGFzczogXCJob21lXCIsIG5hdjogaG9tZS5zaG93SG9tZX0sXG4gICAgICAgICAgICB7bmFtZTogXCJMYWdlcnNhbGRvXCIsIGNsYXNzOiBcImludmVudG9yeVwiLCBuYXY6IGludmVudG9yeS5zaG93SW52ZW50b3J5fSxcbiAgICAgICAgICAgIHtuYW1lOiBcIlBsb2NrbGlzdGFcIiwgY2xhc3M6IFwiY2hlY2tsaXN0XCIsIG5hdjogbmV3T3JkZXJzLnNob3dOZXdPcmRlcnN9XTtcblxuICAgICAgICBuYXZFbGVtZW50cy5tYXAoZWxlbWVudCA9PiBkcmF3Qm90dG9tTmF2RWxlbWVudCAoZWxlbWVudCwgc2VsZWN0ZWQpKTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm5hdmlnYXRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgZHJhd0JvdHRvbU5hdkVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0ZWQpIHtcbiAgICAgICAgbGV0IG5hdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWQgPT09IGVsZW1lbnQuY2xhc3MpIHtcbiAgICAgICAgICAgIG5hdkVsZW1lbnQuY2xhc3NOYW1lID0gXCJhY3RpdmVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGVsZW1lbnQubmF2KTtcblxuICAgICAgICBsZXQgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIGljb24uY2xhc3NOYW1lID0gXCJtYXRlcmlhbC1pY29uc1wiO1xuICAgICAgICBpY29uLnRleHRDb250ZW50ID0gZWxlbWVudC5jbGFzcztcbiAgICAgICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChpY29uKTtcblxuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXG4gICAgICAgIHRleHQuY2xhc3NOYW1lID0gXCJpY29uLXRleHRcIjtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IGVsZW1lbnQubmFtZTtcbiAgICAgICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcblxuICAgICAgICB3aW5kb3cubmF2aWdhdGlvbi5hcHBlbmRDaGlsZChuYXZFbGVtZW50KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hvd01lbnU6IHNob3dNZW51XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7XG4gICAgbWVudVxufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy9uZXctb3JkZXJzLmpzXG5cbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9vbGQubWVudS5qc1wiO1xuaW1wb3J0IHsgYXBpS2V5LCBiYXNlVXJsIH0gZnJvbSBcIi4vdmFycy5qc1wiO1xuaW1wb3J0IHsgb3JkZXJJdGVtcyB9IGZyb20gXCIuL29yZGVyLWl0ZW1zLmpzXCI7XG5cbmxldCBuZXdPcmRlcnMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBzaG93TmV3T3JkZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuY29udGFpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3AtbmF2XCIpKSkge1xuICAgICAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LnJlbW92ZUNoaWxkKHdpbmRvdy50b3BOYXZpZ2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJOZXcgb3JkZXJzXCI7XG5cbiAgICAgICAgbGV0IG9yZGVyTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgb3JkZXJMaXN0LmNsYXNzTmFtZSA9IFwiaW52LWNvbnRhaW5lclwiO1xuXG4gICAgICAgIGZldGNoKGAke2Jhc2VVcmx9L29yZGVycz9hcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coanNvbkRhdGEpO1xuICAgICAgICAgICAgICAgIGxldCBvcmRlclJvd3MgPSBqc29uRGF0YS5kYXRhLm1hcChvcmRlciA9PiBnZW5lcmF0ZU9yZGVyTGlzdChvcmRlcikpO1xuXG4gICAgICAgICAgICAgICAgb3JkZXJSb3dzLm1hcChvcmRlclJvdyA9PiBvcmRlckxpc3QuYXBwZW5kQ2hpbGQob3JkZXJSb3cpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQob3JkZXJMaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJuZXctb3JkZXJzXCIpO1xuICAgIH07XG5cbiAgICBsZXQgcHVibGljQVBJID0ge1xuICAgICAgICBzaG93TmV3T3JkZXJzOiBzaG93TmV3T3JkZXJzXG4gICAgfTtcblxuICAgIHJldHVybiBwdWJsaWNBUEk7XG59KSgpO1xuXG5sZXQgZ2VuZXJhdGVPcmRlckxpc3QgPSBmdW5jdGlvbiAob3JkZXIpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhvcmRlcik7XG4gICAgbGV0IG9yZGVyUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIG9yZGVyUm93LmNsYXNzTmFtZSA9IFwiZmxleC1yb3dcIjtcblxuICAgIGxldCBvcmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgb3JkZXJOYW1lLmNsYXNzTmFtZSA9IFwiZmxleC1pdGVtIGxlZnRcIjtcbiAgICBvcmRlck5hbWUudGV4dENvbnRlbnQgPSBvcmRlci5uYW1lO1xuXG4gICAgbGV0IG9yZGVySWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgb3JkZXJJZC5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSByaWdodFwiO1xuICAgIG9yZGVySWQudGV4dENvbnRlbnQgPSBvcmRlci5pZDtcblxuICAgIG9yZGVyUm93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAgICAgY29uc29sZS5sb2cob3JkZXIpO1xuICAgICAgICBvcmRlckl0ZW1zLnNob3dPcmRlckl0ZW1zKG9yZGVyKTtcbiAgICB9KTtcblxuICAgIG9yZGVyUm93LmFwcGVuZENoaWxkKG9yZGVyTmFtZSk7XG4gICAgb3JkZXJSb3cuYXBwZW5kQ2hpbGQob3JkZXJJZCk7XG5cbiAgICByZXR1cm4gb3JkZXJSb3c7XG59O1xuXG5leHBvcnQge1xuICAgIG5ld09yZGVyc1xufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBtZW51LmpzXG5cbmltcG9ydCB7IGhvbWUgfSBmcm9tIFwiLi9ob21lLmpzXCI7XG5pbXBvcnQgeyBpbnZlbnRvcnkgfSBmcm9tIFwiLi9pbnZlbnRvcnkuanNcIjtcbmltcG9ydCB7IG5ld09yZGVycyB9IGZyb20gXCIuL25ldy1vcmRlcnMuanNcIjtcblxubGV0IG1lbnUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBzaG93TWVudSA9IGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgICB3aW5kb3cubmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCBuYXZFbGVtZW50cyA9IFt7bmFtZTogXCJIb21lXCIsIGNsYXNzOiBcImhvbWVcIiwgbmF2OiBob21lLnNob3dIb21lfSxcbiAgICAgICAgICAgIHtuYW1lOiBcIkxhZ2Vyc2FsZG9cIiwgY2xhc3M6IFwiaW52ZW50b3J5XCIsIG5hdjogaW52ZW50b3J5LnNob3dJbnZlbnRvcnl9LFxuICAgICAgICAgICAge25hbWU6IFwiUGxvY2tsaXN0YVwiLCBjbGFzczogXCJjaGVja2xpc3RcIiwgbmF2OiBuZXdPcmRlcnMuc2hvd05ld09yZGVyc31dO1xuXG4gICAgICAgIG5hdkVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBuYXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cbiAgICAgICAgICAgIGlmIChzZWxlY3RlZCA9PT0gZWxlbWVudC5jbGFzcykge1xuICAgICAgICAgICAgICAgIG5hdkVsZW1lbnQuY2xhc3NOYW1lID0gXCJhY3RpdmVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWxlbWVudC5uYXYpO1xuXG4gICAgICAgICAgICBsZXQgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgICAgICBpY29uLmNsYXNzTmFtZSA9IFwibWF0ZXJpYWwtaWNvbnNcIjtcbiAgICAgICAgICAgIGljb24udGV4dENvbnRlbnQgPSBlbGVtZW50LmNsYXNzO1xuICAgICAgICAgICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChpY29uKTtcblxuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblxuICAgICAgICAgICAgdGV4dC5jbGFzc05hbWUgPSBcImljb24tdGV4dFwiO1xuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IGVsZW1lbnQubmFtZTtcbiAgICAgICAgICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dCk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0aW9uLmFwcGVuZENoaWxkKG5hdkVsZW1lbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm5hdmlnYXRpb24pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93TWVudTogc2hvd01lbnVcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHtcbiAgICBtZW51XG59O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHByb2R1Y3QtZGV0YWlscy5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgaW52ZW50b3J5IH0gZnJvbSBcIi4vaW52ZW50b3J5LmpzXCI7XG5cbmxldCBvcmRlckl0ZW1zID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hvd09yZGVySXRlbXMgPSBmdW5jdGlvbiAocHJvZHVjdCkge1xuICAgICAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIC8qIGxldCB0b3BOYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgICAgIHRvcE5hdi5jbGFzc05hbWUgPSBcInRvcC11bFwiO1xuXG4gICAgICAgIGxldCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgbGlzdEl0ZW0uY2xhc3NOYW1lID0gXCJ0b3AtbGlcIjsgKi9cblxuICAgICAgICBsZXQgdG9wTmF2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG4gICAgICAgIHRvcE5hdkVsZW1lbnQudGV4dENvbnRlbnQgPSBcIkxhZ2Vyc2FsZG9cIjtcbiAgICAgICAgdG9wTmF2RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaW52ZW50b3J5LnNob3dJbnZlbnRvcnkpO1xuXG4gICAgICAgIC8qIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxpc3RJdGVtQW5jaG9yKTtcbiAgICAgICAgdG9wTmF2LmFwcGVuZENoaWxkKGxpc3RJdGVtKTsgKi9cbiAgICAgICAgd2luZG93LnRvcE5hdmlnYXRpb24uYXBwZW5kQ2hpbGQodG9wTmF2RWxlbWVudCk7XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBsZXQgcHJvZHVjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgICAgcHJvZHVjdE5hbWUuY2xhc3NOYW1lID0gXCJwcm9kdWN0LW5hbWVcIjtcbiAgICAgICAgcHJvZHVjdE5hbWUudGV4dENvbnRlbnQgPSBwcm9kdWN0Lm5hbWU7XG5cbiAgICAgICAgbGV0IHByb2R1Y3RJbmZvTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkbFwiKTtcblxuICAgICAgICBwcm9kdWN0SW5mb0xpc3QuY2xhc3NOYW1lID0gXCJwcm9kdWN0LWluZm9cIjtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcHJvZHVjdCkge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdEluZm9UZXJtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImR0XCIpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRkXCIpO1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9UZXJtLnRleHRDb250ZW50ID0ga2V5ICsgXCI6XCI7XG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9EZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHByb2R1Y3Rba2V5XTtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb1Rlcm0pO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2R1Y3ROYW1lKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQocHJvZHVjdEluZm9MaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJuZXctb3JkZXJzXCIpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93T3JkZXJJdGVtczogc2hvd09yZGVySXRlbXNcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHtcbiAgICBvcmRlckl0ZW1zXG59O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHByb2R1Y3QtZGV0YWlscy5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgaW52ZW50b3J5IH0gZnJvbSBcIi4vaW52ZW50b3J5LmpzXCI7XG5cbmxldCBwcm9kdWN0RGV0YWlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNob3dQcm9kdWN0ID0gZnVuY3Rpb24gKHByb2R1Y3QpIHtcbiAgICAgICAgd2luZG93LnRvcE5hdmlnYXRpb24uaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICAvKiBsZXQgdG9wTmF2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICB0b3BOYXYuY2xhc3NOYW1lID0gXCJ0b3AtdWxcIjtcblxuICAgICAgICBsZXQgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGxpc3RJdGVtLmNsYXNzTmFtZSA9IFwidG9wLWxpXCI7ICovXG5cbiAgICAgICAgbGV0IHRvcE5hdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICB0b3BOYXZFbGVtZW50LnRleHRDb250ZW50ID0gXCJMYWdlcnNhbGRvXCI7XG4gICAgICAgIHRvcE5hdkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGludmVudG9yeS5zaG93SW52ZW50b3J5KTtcblxuICAgICAgICAvKiBsaXN0SXRlbS5hcHBlbmRDaGlsZChsaXN0SXRlbUFuY2hvcik7XG4gICAgICAgIHRvcE5hdi5hcHBlbmRDaGlsZChsaXN0SXRlbSk7ICovXG4gICAgICAgIHdpbmRvdy50b3BOYXZpZ2F0aW9uLmFwcGVuZENoaWxkKHRvcE5hdkVsZW1lbnQpO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IHByb2R1Y3ROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICAgIHByb2R1Y3ROYW1lLmNsYXNzTmFtZSA9IFwicHJvZHVjdC1uYW1lXCI7XG4gICAgICAgIHByb2R1Y3ROYW1lLnRleHRDb250ZW50ID0gcHJvZHVjdC5uYW1lO1xuXG4gICAgICAgIGxldCBwcm9kdWN0SW5mb0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGxcIik7XG5cbiAgICAgICAgcHJvZHVjdEluZm9MaXN0LmNsYXNzTmFtZSA9IFwicHJvZHVjdC1pbmZvXCI7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHByb2R1Y3QpIHtcbiAgICAgICAgICAgIGlmIChrZXkgIT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3RJbmZvVGVybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkdFwiKTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdEluZm9EZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkZFwiKTtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvVGVybS50ZXh0Q29udGVudCA9IGtleSArIFwiOlwiO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvRGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBwcm9kdWN0W2tleV07XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0SW5mb0xpc3QuYXBwZW5kQ2hpbGQocHJvZHVjdEluZm9UZXJtKTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0SW5mb0xpc3QuYXBwZW5kQ2hpbGQocHJvZHVjdEluZm9EZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9kdWN0TmFtZSk7XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2R1Y3RJbmZvTGlzdCk7XG5cbiAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy50b3BOYXZpZ2F0aW9uKTtcbiAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy5tYWluQ29udGFpbmVyKTtcblxuICAgICAgICBtZW51LnNob3dNZW51KFwiaW52ZW50b3J5XCIpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93UHJvZHVjdDogc2hvd1Byb2R1Y3RcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHtcbiAgICBwcm9kdWN0RGV0YWlsc1xufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbmNvbnN0IGFwaUtleSA9IFwiMGJmMTkyMmNlOGEzMThhZGRiMzQwZDY1MDM2YjRhNWVcIjtcbmNvbnN0IGJhc2VVcmwgPSBcImh0dHBzOi8vbGFnZXIuZW1pbGZvbGluby5zZS92MlwiO1xuXG5leHBvcnQgeyBiYXNlVXJsLCBhcGlLZXkgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIG1haW4uanNcblxuaW1wb3J0IHsgaG9tZSB9IGZyb20gXCIuL2hvbWUuanNcIjtcblxuKGZ1bmN0aW9uIE1BSU5fSUlGRSgpIHtcbiAgICB3aW5kb3cucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5cbiAgICB3aW5kb3cudG9wTmF2aWdhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIik7XG4gICAgd2luZG93LnRvcE5hdmlnYXRpb24uY2xhc3NOYW1lID0gXCJ0b3AtbmF2XCI7XG4gICAgd2luZG93LnRvcE5hdmlnYXRpb24uaWQgPSBcInRvcC1uYXZcIjtcblxuICAgIHdpbmRvdy5tYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XG4gICAgd2luZG93Lm1haW5Db250YWluZXIuY2xhc3NOYW1lID0gXCJjb250YWluZXJcIjtcblxuICAgIHdpbmRvdy5uYXZpZ2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5hdlwiKTtcbiAgICB3aW5kb3cubmF2aWdhdGlvbi5jbGFzc05hbWUgPSBcImJvdHRvbS1uYXZcIjtcblxuICAgIGhvbWUuc2hvd0hvbWUoKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9