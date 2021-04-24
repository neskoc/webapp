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
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./js/utils.js");
/* jshint esversion: 8 */
/* jshint node: true */



// home.js




let home = (function () {
    let showHome = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        _utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.cleanWindow();

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
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./js/utils.js");
/* jshint esversion: 8 */
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
        _utils_js__WEBPACK_IMPORTED_MODULE_3__.utils.cleanWindow();

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

    let productAmount = document.createElement("div");

    productAmount.className = "flex-item right";
    productAmount.textContent = product.stock;

    productRow.addEventListener("click", function handleClick() {
        console.log(product);
        _product_details_js__WEBPACK_IMPORTED_MODULE_1__.productDetails.showProductDetails(product);
    });

    productRow.appendChild(productName);
    productRow.appendChild(productAmount);

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
/* jshint esversion: 8 */
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
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./js/utils.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/new-orders.js






let newOrders = {
    showNewOrders: function(noCache = false) {
        _orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getAllOrders(newOrders.renderOrders, noCache);
    },

    renderOrders: function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        _utils_js__WEBPACK_IMPORTED_MODULE_3__.utils.cleanWindow();

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Nya ordrar";

        let orderList = document.createElement("div");

        orderList.className = "inv-container";

        let newOrders = _orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id === 100);
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
/* harmony import */ var _products_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./products.js */ "./js/products.js");
/* harmony import */ var _orders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./orders.js */ "./js/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// order-details.js







let orderDetails = {
    showProductListForPick: function(order) {
        let completeElementList = [];

        _utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.cleanWindow();

        window.topNavigation.appendChild(_utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.createElement({
            type: "a",
            href: "#",
            textContent: "Nya ordrar",
            onclick: _new_orders_js__WEBPACK_IMPORTED_MODULE_2__.newOrders.showNewOrders
        }));

        completeElementList.push(_utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.createElement({
            type: "h1",
            className: "title",
            textContent: order.name
        }));

        let elementList = _utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.generateProductListForPick(order.order_items);

        elementList.forEach(element => completeElementList.push(element));

        completeElementList.forEach(element => window.mainContainer.appendChild(element));

        if (_products_js__WEBPACK_IMPORTED_MODULE_3__.products.areProductsOnStock(order.order_items)) {
            let itemElement = _utils_js__WEBPACK_IMPORTED_MODULE_1__.utils.createElement({
                type: "a",
                href: "#",
                className: "button blue-button full-width-button",
                textContent: "Sätt som packat"
            });

            itemElement.addEventListener("click", function handleClick() {
                console.log(order.id);
                _orders_js__WEBPACK_IMPORTED_MODULE_4__.orders.updateOrder(order.id, 200);
            });
            window.commandStripe.appendChild(itemElement);
        }

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);
        window.rootElement.appendChild(window.commandStripe);

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
/* harmony import */ var _products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./products.js */ "./js/products.js");
/* harmony import */ var _new_orders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./new-orders.js */ "./js/new-orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// orders.js





let orders = {
    allOrders: [],

    getAllOrders: function(callback, noCache = false) {
        if (noCache) {
            console.log("noCache", noCache);
            _products_js__WEBPACK_IMPORTED_MODULE_1__.products.allProducts = [];
            orders.allOrders = [];
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
    },

    updateOrder: async function(orderId, nyStatusId) {
        let order = {
            id: orderId,
            status_id: nyStatusId,
            api_key: _vars_js__WEBPACK_IMPORTED_MODULE_0__.apiKey
        };

        console.log("order:", order);

        let fetchObject = {
            body: JSON.stringify(order),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        };

        await fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_0__.baseUrl}/orders`, fetchObject)
            .then(function (response) {
                console.log(response);
            });

        let fullOrder = orders.getOrder(orderId);

        console.log("fullOrder", fullOrder);

        fullOrder.order_items.forEach(function(item) {
            let newStock = item.stock - item.amount;
            let productDetails = {
                id: item.product_id,
                stock: newStock,
                api_key: _vars_js__WEBPACK_IMPORTED_MODULE_0__.apiKey
            };

            console.log("productDetails:", productDetails);

            _products_js__WEBPACK_IMPORTED_MODULE_1__.products.updateProduct(productDetails);
        });

        _new_orders_js__WEBPACK_IMPORTED_MODULE_2__.newOrders.showNewOrders(true);
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
/* jshint esversion: 8 */
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
/* jshint esversion: 8 */
/* jshint node: true */



// products.js



let products = {
    allProducts: [],

    getAllProducts: async function(callback, orderItems = [], noCache = false) {
        if (noCache) {
            products.allProducts = [];
        } else if (products.allProducts.length > 0) {
            console.log("return callback: getAllProducts");
            return callback();
        }

        await fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_0__.baseUrl}/products?api_key=${_vars_js__WEBPACK_IMPORTED_MODULE_0__.apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log("jsonData: ", jsonData);
                products.allProducts = jsonData.data;

                return callback(orderItems);
            });
    },

    getProduct: function(productId) {
        return products.allProducts.filter(function(product) {
            return product.id == productId;
        })[0];
    },

    areProductsOnStock: function(orderItems) {
        if (products.allProducts.length === 0) {
            return products.getAllProducts(products.areProductsOnStockCallback, orderItems);
        }

        return products.areProductsOnStockCallback(orderItems);
    },

    areProductsOnStockCallback: function(orderItems) {
        let allAvailable = true;

        orderItems.forEach(function (orderItem) {
            if (orderItem.amount > orderItem.stock) {
                allAvailable = false;
                console.log("Item not available: ", orderItem.product_id, orderItem.stock);
            } else {
                console.log(orderItem.product_id, orderItem.amount, orderItem.stock);
            }
        });

        return allAvailable;
    },

    updateProduct: async function(product) {
        let fetchObject = {
            body: JSON.stringify(product),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        };

        console.log("fetchObject:", fetchObject);

        await fetch(`${_vars_js__WEBPACK_IMPORTED_MODULE_0__.baseUrl}/products`, fetchObject)
            .then(function (response) {
                console.log("updateProduct response: ", response);

                return response;
            });
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
/* jshint esversion: 8 */
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

    cleanWindow: function() {
        window.topNavigation.innerHTML = "";
        window.mainContainer.innerHTML = "";
        window.commandStripe.innerHTML = "";
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
/* jshint esversion: 8 */
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
/* jshint esversion: 8 */
/* jshint node: true */



// main.js



(function MAIN_IIFE() {
    window.rootElement = document.getElementById("root");

    window.topNavigation = document.createElement("nav");
    window.topNavigation.className = "top-nav";
    window.topNavigation.id = "top-nav";

    window.mainContainer = document.createElement("main");
    window.mainContainer.className = "container";

    window.commandStripe = document.createElement("div");
    window.commandStripe.id = "command-stripe";

    window.navigation = document.createElement("nav");
    window.navigation.className = "bottom-nav";

    _home_js__WEBPACK_IMPORTED_MODULE_0__.home.showHome();
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9ob21lLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9tZW51LmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL25ldy1vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvb3JkZXItZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvcHJvZHVjdC1kZXRhaWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3Byb2R1Y3RzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3V0aWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3ZhcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xhZ2VyMi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFYTs7QUFFYjs7QUFFaUM7QUFDRTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQWlCOztBQUV6Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxRQUFRLG1EQUFhO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtB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IGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBob21lLmpzXG5cbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9tZW51LmpzXCI7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gXCIuL3V0aWxzLmpzXCI7XG5cbmxldCBob21lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hvd0hvbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcC1uYXZcIikpKSB7XG4gICAgICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzLmNsZWFuV2luZG93KCk7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICAgIHRpdGxlLmNsYXNzTmFtZSA9IFwidGl0bGVcIjtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIkxhZ2VyYXBwXCI7XG5cbiAgICAgICAgbGV0IGdyZWV0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGxldCB0aW1lT2ZEYXlHcmVldGluZyA9IFwiSGVqIGJlc8O2a2FyZW5cIjtcbiAgICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgaWYgKG5vdy5nZXRIb3VycygpIDw9IDEwKSB7XG4gICAgICAgICAgICB0aW1lT2ZEYXlHcmVldGluZyA9IFwiR29kbW9yZ29uXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobm93LmdldEhvdXJzKCkgPj0gMTcpIHtcbiAgICAgICAgICAgIHRpbWVPZkRheUdyZWV0aW5nID0gXCJHb2RrdsOkbGxcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyZWV0aW5nLnRleHRDb250ZW50ID0gdGltZU9mRGF5R3JlZXRpbmcgK1xuICAgICAgICAgICAgXCIsIGRldCBow6RyIMOkciBlbiBTUEEgZsO2ciBrdXJzZW4gV2ViYXBwLlwiO1xuXG4gICAgICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgICAgaW1hZ2Uuc3JjID0gXCJpbWcvQUktaGVhZDIuanBnXCI7XG4gICAgICAgIGltYWdlLmFsdCA9IFwiQUkgaGVhZFwiO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQoZ3JlZXRpbmcpO1xuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChpbWFnZSk7XG5cbiAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LmFwcGVuZENoaWxkKHdpbmRvdy5tYWluQ29udGFpbmVyKTtcblxuICAgICAgICBtZW51LnNob3dNZW51KFwiaG9tZVwiKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hvd0hvbWU6IHNob3dIb21lXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7XG4gICAgaG9tZVxufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBpbnZlbnRvcnkuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IHByb2R1Y3REZXRhaWxzIH0gZnJvbSBcIi4vcHJvZHVjdC1kZXRhaWxzLmpzXCI7XG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuL3Byb2R1Y3RzLmpzXCI7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gXCIuL3V0aWxzLmpzXCI7XG5cbmxldCBpbnZlbnRvcnkgPSB7XG4gICAgc2hvd0ludmVudG9yeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHByb2R1Y3RzLmdldEFsbFByb2R1Y3RzKGludmVudG9yeS5yZW5kZXJQcm9kdWN0cyk7XG4gICAgfSxcblxuICAgIHJlbmRlclByb2R1Y3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmNvbnRhaW5zKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9wLW5hdlwiKSkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh3aW5kb3cudG9wTmF2aWdhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHMuY2xlYW5XaW5kb3coKTtcblxuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJ0aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiTGFnZXJzYWxkb1wiO1xuXG4gICAgICAgIGxldCBwcm9kdWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgcHJvZHVjdExpc3QuY2xhc3NOYW1lID0gXCJpbnYtY29udGFpbmVyXCI7XG5cbiAgICAgICAgbGV0IHByb2R1Y3RSb3dzID0gcHJvZHVjdHMuYWxsUHJvZHVjdHMubWFwKHByb2R1Y3QgPT4gZ2VuZXJhdGVQcm9kdWN0TGlzdChwcm9kdWN0KSk7XG5cbiAgICAgICAgcHJvZHVjdFJvd3MubWFwKHByb2R1Y3RSb3cgPT4gcHJvZHVjdExpc3QuYXBwZW5kQ2hpbGQocHJvZHVjdFJvdykpO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQocHJvZHVjdExpc3QpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImludmVudG9yeVwiKTtcbiAgICB9XG59O1xuXG5sZXQgZ2VuZXJhdGVQcm9kdWN0TGlzdCA9IGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgLy8gY29uc29sZS5sb2cocHJvZHVjdCk7XG4gICAgbGV0IHByb2R1Y3RSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgcHJvZHVjdFJvdy5jbGFzc05hbWUgPSBcImZsZXgtcm93XCI7XG5cbiAgICBsZXQgcHJvZHVjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgcHJvZHVjdE5hbWUuY2xhc3NOYW1lID0gXCJmbGV4LWl0ZW0gbGVmdFwiO1xuICAgIHByb2R1Y3ROYW1lLnRleHRDb250ZW50ID0gcHJvZHVjdC5uYW1lO1xuXG4gICAgbGV0IHByb2R1Y3RBbW91bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgcHJvZHVjdEFtb3VudC5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSByaWdodFwiO1xuICAgIHByb2R1Y3RBbW91bnQudGV4dENvbnRlbnQgPSBwcm9kdWN0LnN0b2NrO1xuXG4gICAgcHJvZHVjdFJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByb2R1Y3QpO1xuICAgICAgICBwcm9kdWN0RGV0YWlscy5zaG93UHJvZHVjdERldGFpbHMocHJvZHVjdCk7XG4gICAgfSk7XG5cbiAgICBwcm9kdWN0Um93LmFwcGVuZENoaWxkKHByb2R1Y3ROYW1lKTtcbiAgICBwcm9kdWN0Um93LmFwcGVuZENoaWxkKHByb2R1Y3RBbW91bnQpO1xuXG4gICAgcmV0dXJuIHByb2R1Y3RSb3c7XG59O1xuXG5leHBvcnQgeyBpbnZlbnRvcnkgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBtZW51LmpzXG5cbmltcG9ydCB7IGhvbWUgfSBmcm9tIFwiLi9ob21lLmpzXCI7XG5pbXBvcnQgeyBpbnZlbnRvcnkgfSBmcm9tIFwiLi9pbnZlbnRvcnkuanNcIjtcbmltcG9ydCB7IG5ld09yZGVycyB9IGZyb20gXCIuL25ldy1vcmRlcnMuanNcIjtcblxubGV0IG1lbnUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBzaG93TWVudSA9IGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgICB3aW5kb3cubmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCBuYXZFbGVtZW50cyA9IFt7bmFtZTogXCJIb21lXCIsIGNsYXNzOiBcImhvbWVcIiwgbmF2OiBob21lLnNob3dIb21lfSxcbiAgICAgICAgICAgIHtuYW1lOiBcIkxhZ2Vyc2FsZG9cIiwgY2xhc3M6IFwiaW52ZW50b3J5XCIsIG5hdjogaW52ZW50b3J5LnNob3dJbnZlbnRvcnl9LFxuICAgICAgICAgICAge25hbWU6IFwiUGxvY2tsaXN0YVwiLCBjbGFzczogXCJjaGVja2xpc3RcIiwgbmF2OiBuZXdPcmRlcnMuc2hvd05ld09yZGVyc31dO1xuXG4gICAgICAgIG5hdkVsZW1lbnRzLm1hcChlbGVtZW50ID0+IGRyYXdCb3R0b21OYXZFbGVtZW50IChlbGVtZW50LCBzZWxlY3RlZCkpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubmF2aWdhdGlvbik7XG4gICAgfTtcblxuICAgIGxldCBkcmF3Qm90dG9tTmF2RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBzZWxlY3RlZCkge1xuICAgICAgICBsZXQgbmF2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZCA9PT0gZWxlbWVudC5jbGFzcykge1xuICAgICAgICAgICAgbmF2RWxlbWVudC5jbGFzc05hbWUgPSBcImFjdGl2ZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbmF2RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWxlbWVudC5uYXYpO1xuXG4gICAgICAgIGxldCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG5cbiAgICAgICAgaWNvbi5jbGFzc05hbWUgPSBcIm1hdGVyaWFsLWljb25zXCI7XG4gICAgICAgIGljb24udGV4dENvbnRlbnQgPSBlbGVtZW50LmNsYXNzO1xuICAgICAgICBuYXZFbGVtZW50LmFwcGVuZENoaWxkKGljb24pO1xuXG4gICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cbiAgICAgICAgdGV4dC5jbGFzc05hbWUgPSBcImljb24tdGV4dFwiO1xuICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gZWxlbWVudC5uYW1lO1xuICAgICAgICBuYXZFbGVtZW50LmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICAgIHdpbmRvdy5uYXZpZ2F0aW9uLmFwcGVuZENoaWxkKG5hdkVsZW1lbnQpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93TWVudTogc2hvd01lbnVcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHtcbiAgICBtZW51XG59O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGpzL25ldy1vcmRlcnMuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IG9yZGVycyB9IGZyb20gXCIuL29yZGVycy5qc1wiO1xuaW1wb3J0IHsgb3JkZXJEZXRhaWxzIH0gZnJvbSBcIi4vb3JkZXItZGV0YWlscy5qc1wiO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5sZXQgbmV3T3JkZXJzID0ge1xuICAgIHNob3dOZXdPcmRlcnM6IGZ1bmN0aW9uKG5vQ2FjaGUgPSBmYWxzZSkge1xuICAgICAgICBvcmRlcnMuZ2V0QWxsT3JkZXJzKG5ld09yZGVycy5yZW5kZXJPcmRlcnMsIG5vQ2FjaGUpO1xuICAgIH0sXG5cbiAgICByZW5kZXJPcmRlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmNvbnRhaW5zKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9wLW5hdlwiKSkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5yZW1vdmVDaGlsZCh3aW5kb3cudG9wTmF2aWdhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHMuY2xlYW5XaW5kb3coKTtcblxuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJ0aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiTnlhIG9yZHJhclwiO1xuXG4gICAgICAgIGxldCBvcmRlckxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIG9yZGVyTGlzdC5jbGFzc05hbWUgPSBcImludi1jb250YWluZXJcIjtcblxuICAgICAgICBsZXQgbmV3T3JkZXJzID0gb3JkZXJzLmFsbE9yZGVycy5maWx0ZXIob3JkZXIgPT4gb3JkZXIuc3RhdHVzX2lkID09PSAxMDApO1xuICAgICAgICBsZXQgb3JkZXJSb3dzID0gbmV3T3JkZXJzLm1hcChvcmRlciA9PiBnZW5lcmF0ZU9yZGVyTGlzdChvcmRlcikpO1xuXG4gICAgICAgIG9yZGVyUm93cy5tYXAob3JkZXJSb3cgPT4gb3JkZXJMaXN0LmFwcGVuZENoaWxkKG9yZGVyUm93KSk7XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChvcmRlckxpc3QpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImNoZWNrbGlzdFwiKTtcbiAgICB9XG59O1xuXG5sZXQgZ2VuZXJhdGVPcmRlckxpc3QgPSBmdW5jdGlvbiAob3JkZXIpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhvcmRlcik7XG4gICAgbGV0IG9yZGVyUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIG9yZGVyUm93LmNsYXNzTmFtZSA9IFwiZmxleC1yb3dcIjtcblxuICAgIGxldCBvcmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgb3JkZXJOYW1lLmNsYXNzTmFtZSA9IFwiZmxleC1pdGVtIGxlZnRcIjtcbiAgICBvcmRlck5hbWUudGV4dENvbnRlbnQgPSBvcmRlci5uYW1lO1xuXG4gICAgbGV0IG9yZGVySWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgb3JkZXJJZC5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSByaWdodFwiO1xuICAgIG9yZGVySWQudGV4dENvbnRlbnQgPSBvcmRlci5pZDtcblxuICAgIG9yZGVyUm93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAgICAgY29uc29sZS5sb2cob3JkZXIpO1xuICAgICAgICBvcmRlckRldGFpbHMuc2hvd1Byb2R1Y3RMaXN0Rm9yUGljayhvcmRlcik7XG4gICAgfSk7XG5cbiAgICBvcmRlclJvdy5hcHBlbmRDaGlsZChvcmRlck5hbWUpO1xuICAgIG9yZGVyUm93LmFwcGVuZENoaWxkKG9yZGVySWQpO1xuXG4gICAgcmV0dXJuIG9yZGVyUm93O1xufTtcblxuZXhwb3J0IHtcbiAgICBuZXdPcmRlcnNcbn07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gb3JkZXItZGV0YWlscy5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuaW1wb3J0IHsgbmV3T3JkZXJzIH0gZnJvbSBcIi4vbmV3LW9yZGVycy5qc1wiO1xuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tIFwiLi9wcm9kdWN0cy5qc1wiO1xuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4vb3JkZXJzLmpzXCI7XG5cbmxldCBvcmRlckRldGFpbHMgPSB7XG4gICAgc2hvd1Byb2R1Y3RMaXN0Rm9yUGljazogZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgICAgbGV0IGNvbXBsZXRlRWxlbWVudExpc3QgPSBbXTtcblxuICAgICAgICB1dGlscy5jbGVhbldpbmRvdygpO1xuXG4gICAgICAgIHdpbmRvdy50b3BOYXZpZ2F0aW9uLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgICBocmVmOiBcIiNcIixcbiAgICAgICAgICAgIHRleHRDb250ZW50OiBcIk55YSBvcmRyYXJcIixcbiAgICAgICAgICAgIG9uY2xpY2s6IG5ld09yZGVycy5zaG93TmV3T3JkZXJzXG4gICAgICAgIH0pKTtcblxuICAgICAgICBjb21wbGV0ZUVsZW1lbnRMaXN0LnB1c2godXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICB0eXBlOiBcImgxXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGl0bGVcIixcbiAgICAgICAgICAgIHRleHRDb250ZW50OiBvcmRlci5uYW1lXG4gICAgICAgIH0pKTtcblxuICAgICAgICBsZXQgZWxlbWVudExpc3QgPSB1dGlscy5nZW5lcmF0ZVByb2R1Y3RMaXN0Rm9yUGljayhvcmRlci5vcmRlcl9pdGVtcyk7XG5cbiAgICAgICAgZWxlbWVudExpc3QuZm9yRWFjaChlbGVtZW50ID0+IGNvbXBsZXRlRWxlbWVudExpc3QucHVzaChlbGVtZW50KSk7XG5cbiAgICAgICAgY29tcGxldGVFbGVtZW50TGlzdC5mb3JFYWNoKGVsZW1lbnQgPT4gd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCkpO1xuXG4gICAgICAgIGlmIChwcm9kdWN0cy5hcmVQcm9kdWN0c09uU3RvY2sob3JkZXIub3JkZXJfaXRlbXMpKSB7XG4gICAgICAgICAgICBsZXQgaXRlbUVsZW1lbnQgPSB1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICAgICAgICBocmVmOiBcIiNcIixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnV0dG9uIGJsdWUtYnV0dG9uIGZ1bGwtd2lkdGgtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IFwiU8OkdHQgc29tIHBhY2thdFwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXRlbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yZGVyLmlkKTtcbiAgICAgICAgICAgICAgICBvcmRlcnMudXBkYXRlT3JkZXIob3JkZXIuaWQsIDIwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHdpbmRvdy5jb21tYW5kU3RyaXBlLmFwcGVuZENoaWxkKGl0ZW1FbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cudG9wTmF2aWdhdGlvbik7XG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cuY29tbWFuZFN0cmlwZSk7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImNoZWNrbGlzdFwiKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBvcmRlckRldGFpbHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBvcmRlcnMuanNcblxuaW1wb3J0IHsgYXBpS2V5LCBiYXNlVXJsIH0gZnJvbSBcIi4vdmFycy5qc1wiO1xuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tIFwiLi9wcm9kdWN0cy5qc1wiO1xuaW1wb3J0IHsgbmV3T3JkZXJzIH0gZnJvbSBcIi4vbmV3LW9yZGVycy5qc1wiO1xuXG5sZXQgb3JkZXJzID0ge1xuICAgIGFsbE9yZGVyczogW10sXG5cbiAgICBnZXRBbGxPcmRlcnM6IGZ1bmN0aW9uKGNhbGxiYWNrLCBub0NhY2hlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG5vQ2FjaGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm9DYWNoZVwiLCBub0NhY2hlKTtcbiAgICAgICAgICAgIHByb2R1Y3RzLmFsbFByb2R1Y3RzID0gW107XG4gICAgICAgICAgICBvcmRlcnMuYWxsT3JkZXJzID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAob3JkZXJzLmFsbE9yZGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZldGNoKGAke2Jhc2VVcmx9L29yZGVycz9hcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coanNvbkRhdGEpO1xuICAgICAgICAgICAgICAgIG9yZGVycy5hbGxPcmRlcnMgPSBqc29uRGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0T3JkZXI6IGZ1bmN0aW9uKG9yZGVySWQpIHtcbiAgICAgICAgcmV0dXJuIG9yZGVycy5hbGxPcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gb3JkZXIuaWQgPT0gb3JkZXJJZDtcbiAgICAgICAgfSlbMF07XG4gICAgfSxcblxuICAgIHVwZGF0ZU9yZGVyOiBhc3luYyBmdW5jdGlvbihvcmRlcklkLCBueVN0YXR1c0lkKSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgIGlkOiBvcmRlcklkLFxuICAgICAgICAgICAgc3RhdHVzX2lkOiBueVN0YXR1c0lkLFxuICAgICAgICAgICAgYXBpX2tleTogYXBpS2V5XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJvcmRlcjpcIiwgb3JkZXIpO1xuXG4gICAgICAgIGxldCBmZXRjaE9iamVjdCA9IHtcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZGVyKSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L29yZGVyc2AsIGZldGNoT2JqZWN0KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZ1bGxPcmRlciA9IG9yZGVycy5nZXRPcmRlcihvcmRlcklkKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcImZ1bGxPcmRlclwiLCBmdWxsT3JkZXIpO1xuXG4gICAgICAgIGZ1bGxPcmRlci5vcmRlcl9pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGxldCBuZXdTdG9jayA9IGl0ZW0uc3RvY2sgLSBpdGVtLmFtb3VudDtcbiAgICAgICAgICAgIGxldCBwcm9kdWN0RGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICBpZDogaXRlbS5wcm9kdWN0X2lkLFxuICAgICAgICAgICAgICAgIHN0b2NrOiBuZXdTdG9jayxcbiAgICAgICAgICAgICAgICBhcGlfa2V5OiBhcGlLZXlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJvZHVjdERldGFpbHM6XCIsIHByb2R1Y3REZXRhaWxzKTtcblxuICAgICAgICAgICAgcHJvZHVjdHMudXBkYXRlUHJvZHVjdChwcm9kdWN0RGV0YWlscyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ld09yZGVycy5zaG93TmV3T3JkZXJzKHRydWUpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IG9yZGVycyB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHByb2R1Y3QtZGV0YWlscy5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgaW52ZW50b3J5IH0gZnJvbSBcIi4vaW52ZW50b3J5LmpzXCI7XG5cbmxldCBwcm9kdWN0RGV0YWlscyA9IHtcbiAgICBzaG93UHJvZHVjdERldGFpbHM6IGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgIHdpbmRvdy50b3BOYXZpZ2F0aW9uLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IHRvcE5hdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICB0b3BOYXZFbGVtZW50LnRleHRDb250ZW50ID0gXCJMYWdlcnNhbGRvXCI7XG4gICAgICAgIHRvcE5hdkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGludmVudG9yeS5zaG93SW52ZW50b3J5KTtcblxuICAgICAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5hcHBlbmRDaGlsZCh0b3BOYXZFbGVtZW50KTtcblxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCBwcm9kdWN0TmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgICBwcm9kdWN0TmFtZS5jbGFzc05hbWUgPSBcInByb2R1Y3QtbmFtZVwiO1xuICAgICAgICBwcm9kdWN0TmFtZS50ZXh0Q29udGVudCA9IHByb2R1Y3QubmFtZTtcblxuICAgICAgICBsZXQgcHJvZHVjdEluZm9MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRsXCIpO1xuXG4gICAgICAgIHByb2R1Y3RJbmZvTGlzdC5jbGFzc05hbWUgPSBcInByb2R1Y3QtaW5mb1wiO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBwcm9kdWN0KSB7XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0SW5mb1Rlcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZHRcIik7XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3RJbmZvRGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGRcIik7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0SW5mb1Rlcm0udGV4dENvbnRlbnQgPSBrZXkgKyBcIjpcIjtcbiAgICAgICAgICAgICAgICBwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gcHJvZHVjdFtrZXldO1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9MaXN0LmFwcGVuZENoaWxkKHByb2R1Y3RJbmZvVGVybSk7XG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9MaXN0LmFwcGVuZENoaWxkKHByb2R1Y3RJbmZvRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQocHJvZHVjdE5hbWUpO1xuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb0xpc3QpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cudG9wTmF2aWdhdGlvbik7XG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImludmVudG9yeVwiKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBwcm9kdWN0RGV0YWlscyB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHByb2R1Y3RzLmpzXG5cbmltcG9ydCB7IGFwaUtleSwgYmFzZVVybCB9IGZyb20gXCIuL3ZhcnMuanNcIjtcblxubGV0IHByb2R1Y3RzID0ge1xuICAgIGFsbFByb2R1Y3RzOiBbXSxcblxuICAgIGdldEFsbFByb2R1Y3RzOiBhc3luYyBmdW5jdGlvbihjYWxsYmFjaywgb3JkZXJJdGVtcyA9IFtdLCBub0NhY2hlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG5vQ2FjaGUpIHtcbiAgICAgICAgICAgIHByb2R1Y3RzLmFsbFByb2R1Y3RzID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAocHJvZHVjdHMuYWxsUHJvZHVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXR1cm4gY2FsbGJhY2s6IGdldEFsbFByb2R1Y3RzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBmZXRjaChgJHtiYXNlVXJsfS9wcm9kdWN0cz9hcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqc29uRGF0YTogXCIsIGpzb25EYXRhKTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5hbGxQcm9kdWN0cyA9IGpzb25EYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sob3JkZXJJdGVtcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0UHJvZHVjdDogZnVuY3Rpb24ocHJvZHVjdElkKSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cy5hbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3QuaWQgPT0gcHJvZHVjdElkO1xuICAgICAgICB9KVswXTtcbiAgICB9LFxuXG4gICAgYXJlUHJvZHVjdHNPblN0b2NrOiBmdW5jdGlvbihvcmRlckl0ZW1zKSB7XG4gICAgICAgIGlmIChwcm9kdWN0cy5hbGxQcm9kdWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0cy5nZXRBbGxQcm9kdWN0cyhwcm9kdWN0cy5hcmVQcm9kdWN0c09uU3RvY2tDYWxsYmFjaywgb3JkZXJJdGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvZHVjdHMuYXJlUHJvZHVjdHNPblN0b2NrQ2FsbGJhY2sob3JkZXJJdGVtcyk7XG4gICAgfSxcblxuICAgIGFyZVByb2R1Y3RzT25TdG9ja0NhbGxiYWNrOiBmdW5jdGlvbihvcmRlckl0ZW1zKSB7XG4gICAgICAgIGxldCBhbGxBdmFpbGFibGUgPSB0cnVlO1xuXG4gICAgICAgIG9yZGVySXRlbXMuZm9yRWFjaChmdW5jdGlvbiAob3JkZXJJdGVtKSB7XG4gICAgICAgICAgICBpZiAob3JkZXJJdGVtLmFtb3VudCA+IG9yZGVySXRlbS5zdG9jaykge1xuICAgICAgICAgICAgICAgIGFsbEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXRlbSBub3QgYXZhaWxhYmxlOiBcIiwgb3JkZXJJdGVtLnByb2R1Y3RfaWQsIG9yZGVySXRlbS5zdG9jayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yZGVySXRlbS5wcm9kdWN0X2lkLCBvcmRlckl0ZW0uYW1vdW50LCBvcmRlckl0ZW0uc3RvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWxsQXZhaWxhYmxlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVQcm9kdWN0OiBhc3luYyBmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgIGxldCBmZXRjaE9iamVjdCA9IHtcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaE9iamVjdDpcIiwgZmV0Y2hPYmplY3QpO1xuXG4gICAgICAgIGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L3Byb2R1Y3RzYCwgZmV0Y2hPYmplY3QpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZVByb2R1Y3QgcmVzcG9uc2U6IFwiLCByZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBwcm9kdWN0cyB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHV0aWxzLmpzXG5cbmNvbnN0IHV0aWxzID0ge1xuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdGlvbnMudHlwZSB8fCBcImRpdlwiKTtcblxuICAgICAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsIHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcGVydHldID0gb3B0aW9uc1twcm9wZXJ0eV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlTm9kZXM6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFuV2luZG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LnRvcE5hdmlnYXRpb24uaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgd2luZG93LmNvbW1hbmRTdHJpcGUuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGVQcm9kdWN0TGlzdEZvclBpY2s6IGZ1bmN0aW9uKHByb2R1Y3RzKSB7XG4gICAgICAgIGxldCBlbGVtZW50TGlzdCA9IFtdO1xuXG4gICAgICAgIHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgbGV0IGRldGFpbHNGb3JQaWNrID0gdXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkbFwiLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJwcm9kdWN0LWluZm9cIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRldGFpbHNGb3JQaWNrLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZHRcIixcbiAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogXCJQcm9kdWt0OlwiXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGRldGFpbHNGb3JQaWNrLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGRcIixcbiAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogcHJvZHVjdC5uYW1lXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGRldGFpbHNGb3JQaWNrLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZHRcIixcbiAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogXCJIeWxsYTpcIlxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRkXCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IHByb2R1Y3QubG9jYXRpb25cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgZGV0YWlsc0ZvclBpY2suYXBwZW5kQ2hpbGQodXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkdFwiLFxuICAgICAgICAgICAgICAgIHRleHRDb250ZW50OiBcIkFudGFsOlwiXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGRldGFpbHNGb3JQaWNrLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGRcIixcbiAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogcHJvZHVjdC5hbW91bnRcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgZWxlbWVudExpc3QucHVzaChkZXRhaWxzRm9yUGljayk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBlbGVtZW50TGlzdDtcbiAgICB9XG59O1xuXG5leHBvcnQgeyB1dGlscyB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuY29uc3QgYXBpS2V5ID0gXCIwYmYxOTIyY2U4YTMxOGFkZGIzNDBkNjUwMzZiNGE1ZVwiO1xuY29uc3QgYmFzZVVybCA9IFwiaHR0cHM6Ly9sYWdlci5lbWlsZm9saW5vLnNlL3YyXCI7XG5cbmV4cG9ydCB7IGJhc2VVcmwsIGFwaUtleSB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gbWFpbi5qc1xuXG5pbXBvcnQgeyBob21lIH0gZnJvbSBcIi4vaG9tZS5qc1wiO1xuXG4oZnVuY3Rpb24gTUFJTl9JSUZFKCkge1xuICAgIHdpbmRvdy5yb290RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcblxuICAgIHdpbmRvdy50b3BOYXZpZ2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5hdlwiKTtcbiAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5jbGFzc05hbWUgPSBcInRvcC1uYXZcIjtcbiAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5pZCA9IFwidG9wLW5hdlwiO1xuXG4gICAgd2luZG93Lm1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcbiAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbnRhaW5lclwiO1xuXG4gICAgd2luZG93LmNvbW1hbmRTdHJpcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHdpbmRvdy5jb21tYW5kU3RyaXBlLmlkID0gXCJjb21tYW5kLXN0cmlwZVwiO1xuXG4gICAgd2luZG93Lm5hdmlnYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpO1xuICAgIHdpbmRvdy5uYXZpZ2F0aW9uLmNsYXNzTmFtZSA9IFwiYm90dG9tLW5hdlwiO1xuXG4gICAgaG9tZS5zaG93SG9tZSgpO1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=