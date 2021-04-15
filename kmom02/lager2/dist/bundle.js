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
/* harmony import */ var _product_details_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./product-details.js */ "./js/product-details.js");
/* harmony import */ var _products_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./products.js */ "./js/products.js");
/* jshint esversion: 6 */
/* jshint node: true */



// inventory.js





let inventory = {
    showInventory: function() {
        _products_js__WEBPACK_IMPORTED_MODULE_2__.products.getAllProducts(inventory.renderProducts);
    },

    renderProducts: function() {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Lagersaldo";

        let productList = document.createElement("div");

        productList.className = "inv-container";

        let productRows = _products_js__WEBPACK_IMPORTED_MODULE_2__.products.allProducts.map(product => generateProductList(product));

        productRows.map(productRow => productList.appendChild(productRow));

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(productList);

        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("inventory");
    }
};

let generateProductList = function (product) {
    // console.log(product);
    let productRow = document.createElement("div");

    productRow.className = "flex-row";

    let productName = document.createElement("div");

    productName.className = "flex-item left";
    productName.textContent = product.name;

    let productId = document.createElement("div");

    productId.className = "flex-item right";
    productId.textContent = product.id;

    productRow.addEventListener("click", function handleClick() {
        console.log(product);
        _product_details_js__WEBPACK_IMPORTED_MODULE_1__.productDetails.showProductDetails(product);
    });

    productRow.appendChild(productName);
    productRow.appendChild(productId);

    return productRow;
};




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
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.js */ "./js/menu.js");
/* harmony import */ var _orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./orders.js */ "./js/orders.js");
/* harmony import */ var _order_details_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./order-details.js */ "./js/order-details.js");
/* jshint esversion: 6 */
/* jshint node: true */



// js/new-orders.js





let newOrders = {
    showNewOrders: function() {
        _orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getAllOrders(newOrders.renderOrders);
    },

    renderOrders: function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Nya ordrar";

        let orderList = document.createElement("div");

        orderList.className = "inv-container";

        let newOrders = _orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status === 'Ny');
        let orderRows = newOrders.map(order => generateOrderList(order));

        orderRows.map(orderRow => orderList.appendChild(orderRow));

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(orderList);

        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("checklist");
    }
};

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
        _order_details_js__WEBPACK_IMPORTED_MODULE_2__.orderDetails.showProductListForPick(order);
    });

    orderRow.appendChild(orderName);
    orderRow.appendChild(orderId);

    return orderRow;
};




/***/ }),

/***/ "./js/order-details.js":
/*!*****************************!*\
  !*** ./js/order-details.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orderDetails": () => (/* binding */ orderDetails)
/* harmony export */ });
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.js */ "./js/menu.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./js/utils.js");
/* harmony import */ var _new_orders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./new-orders.js */ "./js/new-orders.js");
/* jshint esversion: 6 */
/* jshint node: true */



// order-details.js





let orderDetails = {
    showProductListForPick: function(order) {
        let completeElementList = [];

        window.topNavigation.innerHTML = "";

        window.topNavigation.appendChild(_utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.createElement({
            type: "a",
            href: "#",
            textContent: "Nya ordrar",
            onclick: _new_orders_js__WEBPACK_IMPORTED_MODULE_2__.newOrders.showNewOrders
        }));

        window.mainContainer.innerHTML = "";

        completeElementList.push(_utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.createElement({
            type: "h1",
            className: "title",
            textContent: order.name
        }));

        let elementList = _utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.generateProductListForPick(order.order_items);

        elementList.forEach(element => completeElementList.push(element));

        completeElementList.forEach(element =>  window.mainContainer.appendChild(element));

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        _menu_js__WEBPACK_IMPORTED_MODULE_0__.menu.showMenu("checklist");
    }
};




/***/ }),

/***/ "./js/orders.js":
/*!**********************!*\
  !*** ./js/orders.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orders": () => (/* binding */ orders)
/* harmony export */ });
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vars.js */ "./js/vars.js");
/* jshint esversion: 6 */
/* jshint node: true */



// orders.js



let orders = {
    allOrders: [],

    getAllOrders: function(callback, noCach = false) {
        if (noCach) {
            this.allOrders = [];
        } else if (orders.allOrders.length > 0) {
            return callback();
        }

        fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_0__.baseUrl}/orders?api_key=${_vars_js__WEBPACK_IMPORTED_MODULE_0__.apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);
                orders.allOrders = jsonData.data;

                return callback();
            });
    },

    getOrder: function(orderId) {
        return orders.allOrders.filter(function(order) {
            return order.id == orderId;
        })[0];
    }
};




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




let productDetails = {
    showProductDetails: function (product) {
        window.topNavigation.innerHTML = "";

        let topNavElement = document.createElement("a");

        topNavElement.textContent = "Lagersaldo";
        topNavElement.addEventListener("click", _inventory_js__WEBPACK_IMPORTED_MODULE_1__.inventory.showInventory);

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
    }
};




/***/ }),

/***/ "./js/products.js":
/*!************************!*\
  !*** ./js/products.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "products": () => (/* binding */ products)
/* harmony export */ });
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vars.js */ "./js/vars.js");
/* jshint esversion: 6 */
/* jshint node: true */



// products.js



let products = {
    allProducts: [],

    getAllProducts: function(callback, noCach = false) {
        if (noCach) {
            this.allProducts = [];
        } else if (this.allProducts.length > 0) {
            return callback();
        }

        fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_0__.baseUrl}/products?api_key=${_vars_js__WEBPACK_IMPORTED_MODULE_0__.apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);
                this.allProducts = jsonData.data;

                return callback();
            });
    },

    getProduct: function(productId) {
        return this.allProducts.filter(function(product) {
            return product.id == productId;
        })[0];
    }
};




/***/ }),

/***/ "./js/utils.js":
/*!*********************!*\
  !*** ./js/utils.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "utils": () => (/* binding */ utils)
/* harmony export */ });
/* jshint esversion: 6 */
/* jshint node: true */



// utils.js

const utils = {
    createElement: function(options) {
        let element = document.createElement(options.type || "div");

        for (let property in options) {
            if (Object.prototype.hasOwnProperty.call(options, property)) {
                element[property] = options[property];
            }
        }

        return element;
    },

    removeNodes: function(id) {
        let element = document.getElementById(id);

        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    generateProductListForPick: function(products) {
        let elementList = [];

        products.forEach(function(product) {
            let detailsForPick = utils.createElement({
                type: "dl",
                className: "product-info"
            });

            detailsForPick.appendChild(utils.createElement({
                type: "dt",
                textContent: "Produkt:"
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dd",
                textContent: product.name
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dt",
                textContent: "Hylla:"
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dd",
                textContent: product.location
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dt",
                textContent: "Antal:"
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dd",
                textContent: product.amount
            }));

            elementList.push(detailsForPick);
        });

        return elementList;
    }
};




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9ob21lLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9tZW51LmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL25ldy1vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvb3JkZXItZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvcHJvZHVjdC1kZXRhaWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3Byb2R1Y3RzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3V0aWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3ZhcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xhZ2VyMi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVhOztBQUViOztBQUVpQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFFBQVEsbURBQWE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFJQzs7Ozs7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O0FBRWlDOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxtREFBYTtBQUNqQixDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBob21lLmpzXG5cbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9tZW51LmpzXCI7XG5cbmxldCBob21lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hvd0hvbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcC1uYXZcIikpKSB7XG4gICAgICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICAgIHRpdGxlLmNsYXNzTmFtZSA9IFwidGl0bGVcIjtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIkxhZ2VyYXBwXCI7XG5cbiAgICAgICAgbGV0IGdyZWV0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGxldCB0aW1lT2ZEYXlHcmVldGluZyA9IFwiSGVqIGJlc8O2a2FyZW5cIjtcbiAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgaWYgKG5vdy5nZXRIb3VycygpIDw9IDEwKSB7XG4gICAgICAgICAgICB0aW1lT2ZEYXlHcmVldGluZyA9IFwiR29kbW9yZ29uXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobm93LmdldEhvdXJzKCkgPj0gMTcpIHtcbiAgICAgICAgICAgIHRpbWVPZkRheUdyZWV0aW5nID0gXCJHb2RrdsOkbGxcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyZWV0aW5nLnRleHRDb250ZW50ID0gdGltZU9mRGF5R3JlZXRpbmcgK1xuICAgICAgICAgICAgXCIsIGRldCBow6RyIMOkciBlbiBTUEEgZsO2ciBrdXJzZW4gV2ViYXBwLlwiO1xuXG4gICAgICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgICAgaW1hZ2Uuc3JjID0gXCJpbWcvQUktaGVhZDIuanBnXCI7XG4gICAgICAgIGltYWdlLmFsdCA9IFwiQUkgaGVhZFwiO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQoZ3JlZXRpbmcpO1xuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChpbWFnZSk7XG5cbiAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy5tYWluQ29udGFpbmVyKTtcblxuICAgICAgICBtZW51LnNob3dNZW51KFwiaG9tZVwiKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hvd0hvbWU6IHNob3dIb21lXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7XG4gICAgaG9tZVxufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBpbnZlbnRvcnkuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IHByb2R1Y3REZXRhaWxzIH0gZnJvbSBcIi4vcHJvZHVjdC1kZXRhaWxzLmpzXCI7XG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuL3Byb2R1Y3RzLmpzXCI7XG5cbmxldCBpbnZlbnRvcnkgPSB7XG4gICAgc2hvd0ludmVudG9yeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHByb2R1Y3RzLmdldEFsbFByb2R1Y3RzKGludmVudG9yeS5yZW5kZXJQcm9kdWN0cyk7XG4gICAgfSxcblxuICAgIHJlbmRlclByb2R1Y3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmNvbnRhaW5zKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9wLW5hdlwiKSkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh3aW5kb3cudG9wTmF2aWdhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJ0aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiTGFnZXJzYWxkb1wiO1xuXG4gICAgICAgIGxldCBwcm9kdWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgcHJvZHVjdExpc3QuY2xhc3NOYW1lID0gXCJpbnYtY29udGFpbmVyXCI7XG5cbiAgICAgICAgbGV0IHByb2R1Y3RSb3dzID0gcHJvZHVjdHMuYWxsUHJvZHVjdHMubWFwKHByb2R1Y3QgPT4gZ2VuZXJhdGVQcm9kdWN0TGlzdChwcm9kdWN0KSk7XG5cbiAgICAgICAgcHJvZHVjdFJvd3MubWFwKHByb2R1Y3RSb3cgPT4gcHJvZHVjdExpc3QuYXBwZW5kQ2hpbGQocHJvZHVjdFJvdykpO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQocHJvZHVjdExpc3QpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImludmVudG9yeVwiKTtcbiAgICB9XG59O1xuXG5sZXQgZ2VuZXJhdGVQcm9kdWN0TGlzdCA9IGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgLy8gY29uc29sZS5sb2cocHJvZHVjdCk7XG4gICAgbGV0IHByb2R1Y3RSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgcHJvZHVjdFJvdy5jbGFzc05hbWUgPSBcImZsZXgtcm93XCI7XG5cbiAgICBsZXQgcHJvZHVjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgcHJvZHVjdE5hbWUuY2xhc3NOYW1lID0gXCJmbGV4LWl0ZW0gbGVmdFwiO1xuICAgIHByb2R1Y3ROYW1lLnRleHRDb250ZW50ID0gcHJvZHVjdC5uYW1lO1xuXG4gICAgbGV0IHByb2R1Y3RJZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICBwcm9kdWN0SWQuY2xhc3NOYW1lID0gXCJmbGV4LWl0ZW0gcmlnaHRcIjtcbiAgICBwcm9kdWN0SWQudGV4dENvbnRlbnQgPSBwcm9kdWN0LmlkO1xuXG4gICAgcHJvZHVjdFJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByb2R1Y3QpO1xuICAgICAgICBwcm9kdWN0RGV0YWlscy5zaG93UHJvZHVjdERldGFpbHMocHJvZHVjdCk7XG4gICAgfSk7XG5cbiAgICBwcm9kdWN0Um93LmFwcGVuZENoaWxkKHByb2R1Y3ROYW1lKTtcbiAgICBwcm9kdWN0Um93LmFwcGVuZENoaWxkKHByb2R1Y3RJZCk7XG5cbiAgICByZXR1cm4gcHJvZHVjdFJvdztcbn07XG5cbmV4cG9ydCB7IGludmVudG9yeSB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIG1lbnUuanNcblxuaW1wb3J0IHsgaG9tZSB9IGZyb20gXCIuL2hvbWUuanNcIjtcbmltcG9ydCB7IGludmVudG9yeSB9IGZyb20gXCIuL2ludmVudG9yeS5qc1wiO1xuaW1wb3J0IHsgbmV3T3JkZXJzIH0gZnJvbSBcIi4vbmV3LW9yZGVycy5qc1wiO1xuXG5sZXQgbWVudSA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNob3dNZW51ID0gZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICAgIHdpbmRvdy5uYXZpZ2F0aW9uLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IG5hdkVsZW1lbnRzID0gW3tuYW1lOiBcIkhvbWVcIiwgY2xhc3M6IFwiaG9tZVwiLCBuYXY6IGhvbWUuc2hvd0hvbWV9LFxuICAgICAgICAgICAge25hbWU6IFwiTGFnZXJzYWxkb1wiLCBjbGFzczogXCJpbnZlbnRvcnlcIiwgbmF2OiBpbnZlbnRvcnkuc2hvd0ludmVudG9yeX0sXG4gICAgICAgICAgICB7bmFtZTogXCJQbG9ja2xpc3RhXCIsIGNsYXNzOiBcImNoZWNrbGlzdFwiLCBuYXY6IG5ld09yZGVycy5zaG93TmV3T3JkZXJzfV07XG5cbiAgICAgICAgbmF2RWxlbWVudHMubWFwKGVsZW1lbnQgPT4gZHJhd0JvdHRvbU5hdkVsZW1lbnQgKGVsZW1lbnQsIHNlbGVjdGVkKSk7XG5cbiAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy5uYXZpZ2F0aW9uKTtcbiAgICB9O1xuXG4gICAgbGV0IGRyYXdCb3R0b21OYXZFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdGVkKSB7XG4gICAgICAgIGxldCBuYXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkID09PSBlbGVtZW50LmNsYXNzKSB7XG4gICAgICAgICAgICBuYXZFbGVtZW50LmNsYXNzTmFtZSA9IFwiYWN0aXZlXCI7XG4gICAgICAgIH1cblxuICAgICAgICBuYXZFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlbGVtZW50Lm5hdik7XG5cbiAgICAgICAgbGV0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcblxuICAgICAgICBpY29uLmNsYXNzTmFtZSA9IFwibWF0ZXJpYWwtaWNvbnNcIjtcbiAgICAgICAgaWNvbi50ZXh0Q29udGVudCA9IGVsZW1lbnQuY2xhc3M7XG4gICAgICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQoaWNvbik7XG5cbiAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblxuICAgICAgICB0ZXh0LmNsYXNzTmFtZSA9IFwiaWNvbi10ZXh0XCI7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBlbGVtZW50Lm5hbWU7XG4gICAgICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dCk7XG5cbiAgICAgICAgd2luZG93Lm5hdmlnYXRpb24uYXBwZW5kQ2hpbGQobmF2RWxlbWVudCk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNob3dNZW51OiBzaG93TWVudVxuICAgIH07XG59KSgpO1xuXG5leHBvcnQge1xuICAgIG1lbnVcbn07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvbmV3LW9yZGVycy5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4vb3JkZXJzLmpzXCI7XG5pbXBvcnQgeyBvcmRlckRldGFpbHMgfSBmcm9tIFwiLi9vcmRlci1kZXRhaWxzLmpzXCI7XG5cbmxldCBuZXdPcmRlcnMgPSB7XG4gICAgc2hvd05ld09yZGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgIG9yZGVycy5nZXRBbGxPcmRlcnMobmV3T3JkZXJzLnJlbmRlck9yZGVycyk7XG4gICAgfSxcblxuICAgIHJlbmRlck9yZGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuY29udGFpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3AtbmF2XCIpKSkge1xuICAgICAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LnJlbW92ZUNoaWxkKHdpbmRvdy50b3BOYXZpZ2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJOeWEgb3JkcmFyXCI7XG5cbiAgICAgICAgbGV0IG9yZGVyTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgb3JkZXJMaXN0LmNsYXNzTmFtZSA9IFwiaW52LWNvbnRhaW5lclwiO1xuXG4gICAgICAgIGxldCBuZXdPcmRlcnMgPSBvcmRlcnMuYWxsT3JkZXJzLmZpbHRlcihvcmRlciA9PiBvcmRlci5zdGF0dXMgPT09ICdOeScpO1xuICAgICAgICBsZXQgb3JkZXJSb3dzID0gbmV3T3JkZXJzLm1hcChvcmRlciA9PiBnZW5lcmF0ZU9yZGVyTGlzdChvcmRlcikpO1xuXG4gICAgICAgIG9yZGVyUm93cy5tYXAob3JkZXJSb3cgPT4gb3JkZXJMaXN0LmFwcGVuZENoaWxkKG9yZGVyUm93KSk7XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChvcmRlckxpc3QpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImNoZWNrbGlzdFwiKTtcbiAgICB9XG59O1xuXG5sZXQgZ2VuZXJhdGVPcmRlckxpc3QgPSBmdW5jdGlvbiAob3JkZXIpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhvcmRlcik7XG4gICAgbGV0IG9yZGVyUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIG9yZGVyUm93LmNsYXNzTmFtZSA9IFwiZmxleC1yb3dcIjtcblxuICAgIGxldCBvcmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgb3JkZXJOYW1lLmNsYXNzTmFtZSA9IFwiZmxleC1pdGVtIGxlZnRcIjtcbiAgICBvcmRlck5hbWUudGV4dENvbnRlbnQgPSBvcmRlci5uYW1lO1xuXG4gICAgbGV0IG9yZGVySWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgb3JkZXJJZC5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSByaWdodFwiO1xuICAgIG9yZGVySWQudGV4dENvbnRlbnQgPSBvcmRlci5pZDtcblxuICAgIG9yZGVyUm93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAgICAgY29uc29sZS5sb2cob3JkZXIpO1xuICAgICAgICBvcmRlckRldGFpbHMuc2hvd1Byb2R1Y3RMaXN0Rm9yUGljayhvcmRlcik7XG4gICAgfSk7XG5cbiAgICBvcmRlclJvdy5hcHBlbmRDaGlsZChvcmRlck5hbWUpO1xuICAgIG9yZGVyUm93LmFwcGVuZENoaWxkKG9yZGVySWQpO1xuXG4gICAgcmV0dXJuIG9yZGVyUm93O1xufTtcblxuZXhwb3J0IHtcbiAgICBuZXdPcmRlcnNcbn07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gb3JkZXItZGV0YWlscy5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuaW1wb3J0IHsgbmV3T3JkZXJzIH0gZnJvbSBcIi4vbmV3LW9yZGVycy5qc1wiO1xuXG5sZXQgb3JkZXJEZXRhaWxzID0ge1xuICAgIHNob3dQcm9kdWN0TGlzdEZvclBpY2s6IGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICAgIGxldCBjb21wbGV0ZUVsZW1lbnRMaXN0ID0gW107XG5cbiAgICAgICAgd2luZG93LnRvcE5hdmlnYXRpb24uaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgICAgaHJlZjogXCIjXCIsXG4gICAgICAgICAgICB0ZXh0Q29udGVudDogXCJOeWEgb3JkcmFyXCIsXG4gICAgICAgICAgICBvbmNsaWNrOiBuZXdPcmRlcnMuc2hvd05ld09yZGVyc1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBjb21wbGV0ZUVsZW1lbnRMaXN0LnB1c2godXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImgxXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGl0bGVcIixcbiAgICAgICAgICAgIHRleHRDb250ZW50OiBvcmRlci5uYW1lXG4gICAgICAgIH0pKTtcblxuICAgICAgICBsZXQgZWxlbWVudExpc3QgPSB1dGlscy5nZW5lcmF0ZVByb2R1Y3RMaXN0Rm9yUGljayhvcmRlci5vcmRlcl9pdGVtcyk7XG5cbiAgICAgICAgZWxlbWVudExpc3QuZm9yRWFjaChlbGVtZW50ID0+IGNvbXBsZXRlRWxlbWVudExpc3QucHVzaChlbGVtZW50KSk7XG5cbiAgICAgICAgY29tcGxldGVFbGVtZW50TGlzdC5mb3JFYWNoKGVsZW1lbnQgPT4gIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpKTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJjaGVja2xpc3RcIik7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgb3JkZXJEZXRhaWxzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gb3JkZXJzLmpzXG5cbmltcG9ydCB7IGFwaUtleSwgYmFzZVVybCB9IGZyb20gXCIuL3ZhcnMuanNcIjtcblxubGV0IG9yZGVycyA9IHtcbiAgICBhbGxPcmRlcnM6IFtdLFxuXG4gICAgZ2V0QWxsT3JkZXJzOiBmdW5jdGlvbihjYWxsYmFjaywgbm9DYWNoID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG5vQ2FjaCkge1xuICAgICAgICAgICAgdGhpcy5hbGxPcmRlcnMgPSBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChvcmRlcnMuYWxsT3JkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmV0Y2goYCR7YmFzZVVybH0vb3JkZXJzP2FwaV9rZXk9JHthcGlLZXl9YClcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGpzb25EYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhqc29uRGF0YSk7XG4gICAgICAgICAgICAgICAgb3JkZXJzLmFsbE9yZGVycyA9IGpzb25EYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRPcmRlcjogZnVuY3Rpb24ob3JkZXJJZCkge1xuICAgICAgICByZXR1cm4gb3JkZXJzLmFsbE9yZGVycy5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmRlci5pZCA9PSBvcmRlcklkO1xuICAgICAgICB9KVswXTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBvcmRlcnMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBwcm9kdWN0LWRldGFpbHMuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IGludmVudG9yeSB9IGZyb20gXCIuL2ludmVudG9yeS5qc1wiO1xuXG5sZXQgcHJvZHVjdERldGFpbHMgPSB7XG4gICAgc2hvd1Byb2R1Y3REZXRhaWxzOiBmdW5jdGlvbiAocHJvZHVjdCkge1xuICAgICAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCB0b3BOYXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cbiAgICAgICAgdG9wTmF2RWxlbWVudC50ZXh0Q29udGVudCA9IFwiTGFnZXJzYWxkb1wiO1xuICAgICAgICB0b3BOYXZFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbnZlbnRvcnkuc2hvd0ludmVudG9yeSk7XG5cbiAgICAgICAgd2luZG93LnRvcE5hdmlnYXRpb24uYXBwZW5kQ2hpbGQodG9wTmF2RWxlbWVudCk7XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBsZXQgcHJvZHVjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgICAgcHJvZHVjdE5hbWUuY2xhc3NOYW1lID0gXCJwcm9kdWN0LW5hbWVcIjtcbiAgICAgICAgcHJvZHVjdE5hbWUudGV4dENvbnRlbnQgPSBwcm9kdWN0Lm5hbWU7XG5cbiAgICAgICAgbGV0IHByb2R1Y3RJbmZvTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkbFwiKTtcblxuICAgICAgICBwcm9kdWN0SW5mb0xpc3QuY2xhc3NOYW1lID0gXCJwcm9kdWN0LWluZm9cIjtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcHJvZHVjdCkge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdEluZm9UZXJtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImR0XCIpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRkXCIpO1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9UZXJtLnRleHRDb250ZW50ID0ga2V5ICsgXCI6XCI7XG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9EZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHByb2R1Y3Rba2V5XTtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb1Rlcm0pO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2R1Y3ROYW1lKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQocHJvZHVjdEluZm9MaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJpbnZlbnRvcnlcIik7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgcHJvZHVjdERldGFpbHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBwcm9kdWN0cy5qc1xuXG5pbXBvcnQgeyBhcGlLZXksIGJhc2VVcmwgfSBmcm9tIFwiLi92YXJzLmpzXCI7XG5cbmxldCBwcm9kdWN0cyA9IHtcbiAgICBhbGxQcm9kdWN0czogW10sXG5cbiAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24oY2FsbGJhY2ssIG5vQ2FjaCA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChub0NhY2gpIHtcbiAgICAgICAgICAgIHRoaXMuYWxsUHJvZHVjdHMgPSBbXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFsbFByb2R1Y3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmV0Y2goYCR7YmFzZVVybH0vcHJvZHVjdHM/YXBpX2tleT0ke2FwaUtleX1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25EYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFsbFByb2R1Y3RzID0ganNvbkRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3RJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3QuaWQgPT0gcHJvZHVjdElkO1xuICAgICAgICB9KVswXTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBwcm9kdWN0cyB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHV0aWxzLmpzXG5cbmNvbnN0IHV0aWxzID0ge1xuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdGlvbnMudHlwZSB8fCBcImRpdlwiKTtcblxuICAgICAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsIHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcGVydHldID0gb3B0aW9uc1twcm9wZXJ0eV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlTm9kZXM6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdlbmVyYXRlUHJvZHVjdExpc3RGb3JQaWNrOiBmdW5jdGlvbihwcm9kdWN0cykge1xuICAgICAgICBsZXQgZWxlbWVudExpc3QgPSBbXTtcblxuICAgICAgICBwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICAgICAgIGxldCBkZXRhaWxzRm9yUGljayA9IHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGxcIixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwicHJvZHVjdC1pbmZvXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImR0XCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IFwiUHJvZHVrdDpcIlxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRkXCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IHByb2R1Y3QubmFtZVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImR0XCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IFwiSHlsbGE6XCJcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgZGV0YWlsc0ZvclBpY2suYXBwZW5kQ2hpbGQodXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkZFwiLFxuICAgICAgICAgICAgICAgIHRleHRDb250ZW50OiBwcm9kdWN0LmxvY2F0aW9uXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGRldGFpbHNGb3JQaWNrLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZHRcIixcbiAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogXCJBbnRhbDpcIlxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRkXCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IHByb2R1Y3QuYW1vdW50XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnRMaXN0LnB1c2goZGV0YWlsc0ZvclBpY2spO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZWxlbWVudExpc3Q7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgdXRpbHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbmNvbnN0IGFwaUtleSA9IFwiMGJmMTkyMmNlOGEzMThhZGRiMzQwZDY1MDM2YjRhNWVcIjtcbmNvbnN0IGJhc2VVcmwgPSBcImh0dHBzOi8vbGFnZXIuZW1pbGZvbGluby5zZS92MlwiO1xuXG5leHBvcnQgeyBiYXNlVXJsLCBhcGlLZXkgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoganNoaW50IGVzdmVyc2lvbjogNiAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIG1haW4uanNcblxuaW1wb3J0IHsgaG9tZSB9IGZyb20gXCIuL2hvbWUuanNcIjtcblxuKGZ1bmN0aW9uIE1BSU5fSUlGRSgpIHtcbiAgICB3aW5kb3cucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5cbiAgICB3aW5kb3cudG9wTmF2aWdhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIik7XG4gICAgd2luZG93LnRvcE5hdmlnYXRpb24uY2xhc3NOYW1lID0gXCJ0b3AtbmF2XCI7XG4gICAgd2luZG93LnRvcE5hdmlnYXRpb24uaWQgPSBcInRvcC1uYXZcIjtcblxuICAgIHdpbmRvdy5tYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XG4gICAgd2luZG93Lm1haW5Db250YWluZXIuY2xhc3NOYW1lID0gXCJjb250YWluZXJcIjtcblxuICAgIHdpbmRvdy5uYXZpZ2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5hdlwiKTtcbiAgICB3aW5kb3cubmF2aWdhdGlvbi5jbGFzc05hbWUgPSBcImJvdHRvbS1uYXZcIjtcblxuICAgIGhvbWUuc2hvd0hvbWUoKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9