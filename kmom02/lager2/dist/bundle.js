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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9ob21lLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9tZW51LmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL25ldy1vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvb3JkZXItZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9sYWdlcjIvLi9qcy9vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvcHJvZHVjdC1kZXRhaWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3Byb2R1Y3RzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3V0aWxzLmpzIiwid2VicGFjazovL2xhZ2VyMi8uL2pzL3ZhcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xhZ2VyMi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbGFnZXIyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGFnZXIyLy4vanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFYTs7QUFFYjs7QUFFaUM7QUFDRTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQWlCOztBQUV6Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxRQUFRLG1EQUFhO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtB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Ozs7OztBQy9FcEI7QUFDQTs7QUFFYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFaUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRmpCO0FBQ0E7O0FBRWE7OztBQUdiO0FBQ0E7O0FBRTJCOzs7Ozs7O1VDVDNCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFYTs7QUFFYjs7QUFFaUM7O0FBRWpDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLElBQUksbURBQWE7QUFDakIsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gaG9tZS5qc1xuXG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudS5qc1wiO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5sZXQgaG9tZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNob3dIb21lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuY29udGFpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3AtbmF2XCIpKSkge1xuICAgICAgICAgICAgd2luZG93LnJvb3RFbGVtZW50LnJlbW92ZUNoaWxkKHdpbmRvdy50b3BOYXZpZ2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB1dGlscy5jbGVhbldpbmRvdygpO1xuXG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJMYWdlcmFwcFwiO1xuXG4gICAgICAgIGxldCBncmVldGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBsZXQgdGltZU9mRGF5R3JlZXRpbmcgPSBcIkhlaiBiZXPDtmthcmVuXCI7XG4gICAgICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIGlmIChub3cuZ2V0SG91cnMoKSA8PSAxMCkge1xuICAgICAgICAgICAgdGltZU9mRGF5R3JlZXRpbmcgPSBcIkdvZG1vcmdvblwiO1xuICAgICAgICB9IGVsc2UgaWYgKG5vdy5nZXRIb3VycygpID49IDE3KSB7XG4gICAgICAgICAgICB0aW1lT2ZEYXlHcmVldGluZyA9IFwiR29ka3bDpGxsXCI7XG4gICAgICAgIH1cblxuICAgICAgICBncmVldGluZy50ZXh0Q29udGVudCA9IHRpbWVPZkRheUdyZWV0aW5nICtcbiAgICAgICAgICAgIFwiLCBkZXQgaMOkciDDpHIgZW4gU1BBIGbDtnIga3Vyc2VuIFdlYmFwcC5cIjtcblxuICAgICAgICBsZXQgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuXG4gICAgICAgIGltYWdlLnNyYyA9IFwiaW1nL0FJLWhlYWQyLmpwZ1wiO1xuICAgICAgICBpbWFnZS5hbHQgPSBcIkFJIGhlYWRcIjtcblxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKGdyZWV0aW5nKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuXG4gICAgICAgIHdpbmRvdy5yb290RWxlbWVudC5hcHBlbmRDaGlsZCh3aW5kb3cubWFpbkNvbnRhaW5lcik7XG5cbiAgICAgICAgbWVudS5zaG93TWVudShcImhvbWVcIik7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNob3dIb21lOiBzaG93SG9tZVxuICAgIH07XG59KSgpO1xuXG5leHBvcnQge1xuICAgIGhvbWVcbn07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gaW52ZW50b3J5LmpzXG5cbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9tZW51LmpzXCI7XG5pbXBvcnQgeyBwcm9kdWN0RGV0YWlscyB9IGZyb20gXCIuL3Byb2R1Y3QtZGV0YWlscy5qc1wiO1xuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tIFwiLi9wcm9kdWN0cy5qc1wiO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuXG5sZXQgaW52ZW50b3J5ID0ge1xuICAgIHNob3dJbnZlbnRvcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwcm9kdWN0cy5nZXRBbGxQcm9kdWN0cyhpbnZlbnRvcnkucmVuZGVyUHJvZHVjdHMpO1xuICAgIH0sXG5cbiAgICByZW5kZXJQcm9kdWN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcC1uYXZcIikpKSB7XG4gICAgICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzLmNsZWFuV2luZG93KCk7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICAgIHRpdGxlLmNsYXNzTmFtZSA9IFwidGl0bGVcIjtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIkxhZ2Vyc2FsZG9cIjtcblxuICAgICAgICBsZXQgcHJvZHVjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIHByb2R1Y3RMaXN0LmNsYXNzTmFtZSA9IFwiaW52LWNvbnRhaW5lclwiO1xuXG4gICAgICAgIGxldCBwcm9kdWN0Um93cyA9IHByb2R1Y3RzLmFsbFByb2R1Y3RzLm1hcChwcm9kdWN0ID0+IGdlbmVyYXRlUHJvZHVjdExpc3QocHJvZHVjdCkpO1xuXG4gICAgICAgIHByb2R1Y3RSb3dzLm1hcChwcm9kdWN0Um93ID0+IHByb2R1Y3RMaXN0LmFwcGVuZENoaWxkKHByb2R1Y3RSb3cpKTtcblxuICAgICAgICB3aW5kb3cubWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2R1Y3RMaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJpbnZlbnRvcnlcIik7XG4gICAgfVxufTtcblxubGV0IGdlbmVyYXRlUHJvZHVjdExpc3QgPSBmdW5jdGlvbiAocHJvZHVjdCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHByb2R1Y3QpO1xuICAgIGxldCBwcm9kdWN0Um93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIHByb2R1Y3RSb3cuY2xhc3NOYW1lID0gXCJmbGV4LXJvd1wiO1xuXG4gICAgbGV0IHByb2R1Y3ROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIHByb2R1Y3ROYW1lLmNsYXNzTmFtZSA9IFwiZmxleC1pdGVtIGxlZnRcIjtcbiAgICBwcm9kdWN0TmFtZS50ZXh0Q29udGVudCA9IHByb2R1Y3QubmFtZTtcblxuICAgIGxldCBwcm9kdWN0QW1vdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIHByb2R1Y3RBbW91bnQuY2xhc3NOYW1lID0gXCJmbGV4LWl0ZW0gcmlnaHRcIjtcbiAgICBwcm9kdWN0QW1vdW50LnRleHRDb250ZW50ID0gcHJvZHVjdC5zdG9jaztcblxuICAgIHByb2R1Y3RSb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhwcm9kdWN0KTtcbiAgICAgICAgcHJvZHVjdERldGFpbHMuc2hvd1Byb2R1Y3REZXRhaWxzKHByb2R1Y3QpO1xuICAgIH0pO1xuXG4gICAgcHJvZHVjdFJvdy5hcHBlbmRDaGlsZChwcm9kdWN0TmFtZSk7XG4gICAgcHJvZHVjdFJvdy5hcHBlbmRDaGlsZChwcm9kdWN0QW1vdW50KTtcblxuICAgIHJldHVybiBwcm9kdWN0Um93O1xufTtcblxuZXhwb3J0IHsgaW52ZW50b3J5IH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gbWVudS5qc1xuXG5pbXBvcnQgeyBob21lIH0gZnJvbSBcIi4vaG9tZS5qc1wiO1xuaW1wb3J0IHsgaW52ZW50b3J5IH0gZnJvbSBcIi4vaW52ZW50b3J5LmpzXCI7XG5pbXBvcnQgeyBuZXdPcmRlcnMgfSBmcm9tIFwiLi9uZXctb3JkZXJzLmpzXCI7XG5cbmxldCBtZW51ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hvd01lbnUgPSBmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgd2luZG93Lm5hdmlnYXRpb24uaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBsZXQgbmF2RWxlbWVudHMgPSBbe25hbWU6IFwiSG9tZVwiLCBjbGFzczogXCJob21lXCIsIG5hdjogaG9tZS5zaG93SG9tZX0sXG4gICAgICAgICAgICB7bmFtZTogXCJMYWdlcnNhbGRvXCIsIGNsYXNzOiBcImludmVudG9yeVwiLCBuYXY6IGludmVudG9yeS5zaG93SW52ZW50b3J5fSxcbiAgICAgICAgICAgIHtuYW1lOiBcIlBsb2NrbGlzdGFcIiwgY2xhc3M6IFwiY2hlY2tsaXN0XCIsIG5hdjogbmV3T3JkZXJzLnNob3dOZXdPcmRlcnN9XTtcblxuICAgICAgICBuYXZFbGVtZW50cy5tYXAoZWxlbWVudCA9PiBkcmF3Qm90dG9tTmF2RWxlbWVudCAoZWxlbWVudCwgc2VsZWN0ZWQpKTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm5hdmlnYXRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgZHJhd0JvdHRvbU5hdkVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0ZWQpIHtcbiAgICAgICAgbGV0IG5hdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWQgPT09IGVsZW1lbnQuY2xhc3MpIHtcbiAgICAgICAgICAgIG5hdkVsZW1lbnQuY2xhc3NOYW1lID0gXCJhY3RpdmVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGVsZW1lbnQubmF2KTtcblxuICAgICAgICBsZXQgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuXG4gICAgICAgIGljb24uY2xhc3NOYW1lID0gXCJtYXRlcmlhbC1pY29uc1wiO1xuICAgICAgICBpY29uLnRleHRDb250ZW50ID0gZWxlbWVudC5jbGFzcztcbiAgICAgICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChpY29uKTtcblxuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXG4gICAgICAgIHRleHQuY2xhc3NOYW1lID0gXCJpY29uLXRleHRcIjtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IGVsZW1lbnQubmFtZTtcbiAgICAgICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcblxuICAgICAgICB3aW5kb3cubmF2aWdhdGlvbi5hcHBlbmRDaGlsZChuYXZFbGVtZW50KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hvd01lbnU6IHNob3dNZW51XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7XG4gICAgbWVudVxufTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy9uZXctb3JkZXJzLmpzXG5cbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9tZW51LmpzXCI7XG5pbXBvcnQgeyBvcmRlcnMgfSBmcm9tIFwiLi9vcmRlcnMuanNcIjtcbmltcG9ydCB7IG9yZGVyRGV0YWlscyB9IGZyb20gXCIuL29yZGVyLWRldGFpbHMuanNcIjtcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcblxubGV0IG5ld09yZGVycyA9IHtcbiAgICBzaG93TmV3T3JkZXJzOiBmdW5jdGlvbihub0NhY2hlID0gZmFsc2UpIHtcbiAgICAgICAgb3JkZXJzLmdldEFsbE9yZGVycyhuZXdPcmRlcnMucmVuZGVyT3JkZXJzLCBub0NhY2hlKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyT3JkZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcC1uYXZcIikpKSB7XG4gICAgICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQucmVtb3ZlQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzLmNsZWFuV2luZG93KCk7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICAgIHRpdGxlLmNsYXNzTmFtZSA9IFwidGl0bGVcIjtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIk55YSBvcmRyYXJcIjtcblxuICAgICAgICBsZXQgb3JkZXJMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBvcmRlckxpc3QuY2xhc3NOYW1lID0gXCJpbnYtY29udGFpbmVyXCI7XG5cbiAgICAgICAgbGV0IG5ld09yZGVycyA9IG9yZGVycy5hbGxPcmRlcnMuZmlsdGVyKG9yZGVyID0+IG9yZGVyLnN0YXR1c19pZCA9PT0gMTAwKTtcbiAgICAgICAgbGV0IG9yZGVyUm93cyA9IG5ld09yZGVycy5tYXAob3JkZXIgPT4gZ2VuZXJhdGVPcmRlckxpc3Qob3JkZXIpKTtcblxuICAgICAgICBvcmRlclJvd3MubWFwKG9yZGVyUm93ID0+IG9yZGVyTGlzdC5hcHBlbmRDaGlsZChvcmRlclJvdykpO1xuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQob3JkZXJMaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJjaGVja2xpc3RcIik7XG4gICAgfVxufTtcblxubGV0IGdlbmVyYXRlT3JkZXJMaXN0ID0gZnVuY3Rpb24gKG9yZGVyKSB7XG4gICAgLy8gY29uc29sZS5sb2cob3JkZXIpO1xuICAgIGxldCBvcmRlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICBvcmRlclJvdy5jbGFzc05hbWUgPSBcImZsZXgtcm93XCI7XG5cbiAgICBsZXQgb3JkZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIG9yZGVyTmFtZS5jbGFzc05hbWUgPSBcImZsZXgtaXRlbSBsZWZ0XCI7XG4gICAgb3JkZXJOYW1lLnRleHRDb250ZW50ID0gb3JkZXIubmFtZTtcblxuICAgIGxldCBvcmRlcklkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIG9yZGVySWQuY2xhc3NOYW1lID0gXCJmbGV4LWl0ZW0gcmlnaHRcIjtcbiAgICBvcmRlcklkLnRleHRDb250ZW50ID0gb3JkZXIuaWQ7XG5cbiAgICBvcmRlclJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG9yZGVyKTtcbiAgICAgICAgb3JkZXJEZXRhaWxzLnNob3dQcm9kdWN0TGlzdEZvclBpY2sob3JkZXIpO1xuICAgIH0pO1xuXG4gICAgb3JkZXJSb3cuYXBwZW5kQ2hpbGQob3JkZXJOYW1lKTtcbiAgICBvcmRlclJvdy5hcHBlbmRDaGlsZChvcmRlcklkKTtcblxuICAgIHJldHVybiBvcmRlclJvdztcbn07XG5cbmV4cG9ydCB7XG4gICAgbmV3T3JkZXJzXG59O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIG9yZGVyLWRldGFpbHMuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmltcG9ydCB7IG5ld09yZGVycyB9IGZyb20gXCIuL25ldy1vcmRlcnMuanNcIjtcbmltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSBcIi4vcHJvZHVjdHMuanNcIjtcbmltcG9ydCB7IG9yZGVycyB9IGZyb20gXCIuL29yZGVycy5qc1wiO1xuXG5sZXQgb3JkZXJEZXRhaWxzID0ge1xuICAgIHNob3dQcm9kdWN0TGlzdEZvclBpY2s6IGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICAgIGxldCBjb21wbGV0ZUVsZW1lbnRMaXN0ID0gW107XG5cbiAgICAgICAgdXRpbHMuY2xlYW5XaW5kb3coKTtcblxuICAgICAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgICAgaHJlZjogXCIjXCIsXG4gICAgICAgICAgICB0ZXh0Q29udGVudDogXCJOeWEgb3JkcmFyXCIsXG4gICAgICAgICAgICBvbmNsaWNrOiBuZXdPcmRlcnMuc2hvd05ld09yZGVyc1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29tcGxldGVFbGVtZW50TGlzdC5wdXNoKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgdHlwZTogXCJoMVwiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRpdGxlXCIsXG4gICAgICAgICAgICB0ZXh0Q29udGVudDogb3JkZXIubmFtZVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgbGV0IGVsZW1lbnRMaXN0ID0gdXRpbHMuZ2VuZXJhdGVQcm9kdWN0TGlzdEZvclBpY2sob3JkZXIub3JkZXJfaXRlbXMpO1xuXG4gICAgICAgIGVsZW1lbnRMaXN0LmZvckVhY2goZWxlbWVudCA9PiBjb21wbGV0ZUVsZW1lbnRMaXN0LnB1c2goZWxlbWVudCkpO1xuXG4gICAgICAgIGNvbXBsZXRlRWxlbWVudExpc3QuZm9yRWFjaChlbGVtZW50ID0+IHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpKTtcblxuICAgICAgICBpZiAocHJvZHVjdHMuYXJlUHJvZHVjdHNPblN0b2NrKG9yZGVyLm9yZGVyX2l0ZW1zKSkge1xuICAgICAgICAgICAgbGV0IGl0ZW1FbGVtZW50ID0gdXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgICAgICAgaHJlZjogXCIjXCIsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ1dHRvbiBibHVlLWJ1dHRvbiBmdWxsLXdpZHRoLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRleHRDb250ZW50OiBcIlPDpHR0IHNvbSBwYWNrYXRcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ZW1FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlci5pZCk7XG4gICAgICAgICAgICAgICAgb3JkZXJzLnVwZGF0ZU9yZGVyKG9yZGVyLmlkLCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB3aW5kb3cuY29tbWFuZFN0cmlwZS5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93LmNvbW1hbmRTdHJpcGUpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJjaGVja2xpc3RcIik7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgb3JkZXJEZXRhaWxzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gb3JkZXJzLmpzXG5cbmltcG9ydCB7IGFwaUtleSwgYmFzZVVybCB9IGZyb20gXCIuL3ZhcnMuanNcIjtcbmltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSBcIi4vcHJvZHVjdHMuanNcIjtcbmltcG9ydCB7IG5ld09yZGVycyB9IGZyb20gXCIuL25ldy1vcmRlcnMuanNcIjtcblxubGV0IG9yZGVycyA9IHtcbiAgICBhbGxPcmRlcnM6IFtdLFxuXG4gICAgZ2V0QWxsT3JkZXJzOiBmdW5jdGlvbihjYWxsYmFjaywgbm9DYWNoZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChub0NhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLmFsbE9yZGVycyA9IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKG9yZGVycy5hbGxPcmRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmZXRjaChgJHtiYXNlVXJsfS9vcmRlcnM/YXBpX2tleT0ke2FwaUtleX1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb25EYXRhKTtcbiAgICAgICAgICAgICAgICBvcmRlcnMuYWxsT3JkZXJzID0ganNvbkRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldE9yZGVyOiBmdW5jdGlvbihvcmRlcklkKSB7XG4gICAgICAgIHJldHVybiBvcmRlcnMuYWxsT3JkZXJzLmZpbHRlcihmdW5jdGlvbihvcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIG9yZGVyLmlkID09IG9yZGVySWQ7XG4gICAgICAgIH0pWzBdO1xuICAgIH0sXG5cbiAgICB1cGRhdGVPcmRlcjogYXN5bmMgZnVuY3Rpb24ob3JkZXJJZCwgbnlTdGF0dXNJZCkge1xuICAgICAgICBsZXQgb3JkZXIgPSB7XG4gICAgICAgICAgICBpZDogb3JkZXJJZCxcbiAgICAgICAgICAgIHN0YXR1c19pZDogbnlTdGF0dXNJZCxcbiAgICAgICAgICAgIGFwaV9rZXk6IGFwaUtleVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwib3JkZXI6XCIsIG9yZGVyKTtcblxuICAgICAgICBsZXQgZmV0Y2hPYmplY3QgPSB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmRlciksXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCBmZXRjaChgJHtiYXNlVXJsfS9vcmRlcnNgLCBmZXRjaE9iamVjdClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmdWxsT3JkZXIgPSBvcmRlcnMuZ2V0T3JkZXIob3JkZXJJZCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJmdWxsT3JkZXJcIiwgZnVsbE9yZGVyKTtcblxuICAgICAgICBmdWxsT3JkZXIub3JkZXJfaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBsZXQgbmV3U3RvY2sgPSBpdGVtLnN0b2NrIC0gaXRlbS5hbW91bnQ7XG4gICAgICAgICAgICBsZXQgcHJvZHVjdERldGFpbHMgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGl0ZW0ucHJvZHVjdF9pZCxcbiAgICAgICAgICAgICAgICBzdG9jazogbmV3U3RvY2ssXG4gICAgICAgICAgICAgICAgYXBpX2tleTogYXBpS2V5XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb2R1Y3REZXRhaWxzOlwiLCBwcm9kdWN0RGV0YWlscyk7XG5cbiAgICAgICAgICAgIHByb2R1Y3RzLnVwZGF0ZVByb2R1Y3QocHJvZHVjdERldGFpbHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBuZXdPcmRlcnMuc2hvd05ld09yZGVycyh0cnVlKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBvcmRlcnMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBwcm9kdWN0LWRldGFpbHMuanNcblxuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnUuanNcIjtcbmltcG9ydCB7IGludmVudG9yeSB9IGZyb20gXCIuL2ludmVudG9yeS5qc1wiO1xuXG5sZXQgcHJvZHVjdERldGFpbHMgPSB7XG4gICAgc2hvd1Byb2R1Y3REZXRhaWxzOiBmdW5jdGlvbiAocHJvZHVjdCkge1xuICAgICAgICB3aW5kb3cudG9wTmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCB0b3BOYXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cbiAgICAgICAgdG9wTmF2RWxlbWVudC50ZXh0Q29udGVudCA9IFwiTGFnZXJzYWxkb1wiO1xuICAgICAgICB0b3BOYXZFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbnZlbnRvcnkuc2hvd0ludmVudG9yeSk7XG5cbiAgICAgICAgd2luZG93LnRvcE5hdmlnYXRpb24uYXBwZW5kQ2hpbGQodG9wTmF2RWxlbWVudCk7XG5cbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBsZXQgcHJvZHVjdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgICAgcHJvZHVjdE5hbWUuY2xhc3NOYW1lID0gXCJwcm9kdWN0LW5hbWVcIjtcbiAgICAgICAgcHJvZHVjdE5hbWUudGV4dENvbnRlbnQgPSBwcm9kdWN0Lm5hbWU7XG5cbiAgICAgICAgbGV0IHByb2R1Y3RJbmZvTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkbFwiKTtcblxuICAgICAgICBwcm9kdWN0SW5mb0xpc3QuY2xhc3NOYW1lID0gXCJwcm9kdWN0LWluZm9cIjtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcHJvZHVjdCkge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdEluZm9UZXJtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImR0XCIpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRkXCIpO1xuXG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9UZXJtLnRleHRDb250ZW50ID0ga2V5ICsgXCI6XCI7XG4gICAgICAgICAgICAgICAgcHJvZHVjdEluZm9EZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHByb2R1Y3Rba2V5XTtcblxuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb1Rlcm0pO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RJbmZvTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SW5mb0Rlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2R1Y3ROYW1lKTtcbiAgICAgICAgd2luZG93Lm1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQocHJvZHVjdEluZm9MaXN0KTtcblxuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93LnRvcE5hdmlnYXRpb24pO1xuICAgICAgICB3aW5kb3cucm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQod2luZG93Lm1haW5Db250YWluZXIpO1xuXG4gICAgICAgIG1lbnUuc2hvd01lbnUoXCJpbnZlbnRvcnlcIik7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgcHJvZHVjdERldGFpbHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBwcm9kdWN0cy5qc1xuXG5pbXBvcnQgeyBhcGlLZXksIGJhc2VVcmwgfSBmcm9tIFwiLi92YXJzLmpzXCI7XG5cbmxldCBwcm9kdWN0cyA9IHtcbiAgICBhbGxQcm9kdWN0czogW10sXG5cbiAgICBnZXRBbGxQcm9kdWN0czogYXN5bmMgZnVuY3Rpb24oY2FsbGJhY2ssIG9yZGVySXRlbXMgPSBbXSwgbm9DYWNoZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChub0NhY2hlKSB7XG4gICAgICAgICAgICBwcm9kdWN0cy5hbGxQcm9kdWN0cyA9IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2R1Y3RzLmFsbFByb2R1Y3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmV0dXJuIGNhbGxiYWNrOiBnZXRBbGxQcm9kdWN0c1wiKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgZmV0Y2goYCR7YmFzZVVybH0vcHJvZHVjdHM/YXBpX2tleT0ke2FwaUtleX1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbkRhdGE6IFwiLCBqc29uRGF0YSk7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHMuYWxsUHJvZHVjdHMgPSBqc29uRGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG9yZGVySXRlbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3RJZCkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHMuYWxsUHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0LmlkID09IHByb2R1Y3RJZDtcbiAgICAgICAgfSlbMF07XG4gICAgfSxcblxuICAgIGFyZVByb2R1Y3RzT25TdG9jazogZnVuY3Rpb24ob3JkZXJJdGVtcykge1xuICAgICAgICBpZiAocHJvZHVjdHMuYWxsUHJvZHVjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvZHVjdHMuZ2V0QWxsUHJvZHVjdHMocHJvZHVjdHMuYXJlUHJvZHVjdHNPblN0b2NrQ2FsbGJhY2ssIG9yZGVySXRlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmFyZVByb2R1Y3RzT25TdG9ja0NhbGxiYWNrKG9yZGVySXRlbXMpO1xuICAgIH0sXG5cbiAgICBhcmVQcm9kdWN0c09uU3RvY2tDYWxsYmFjazogZnVuY3Rpb24ob3JkZXJJdGVtcykge1xuICAgICAgICBsZXQgYWxsQXZhaWxhYmxlID0gdHJ1ZTtcblxuICAgICAgICBvcmRlckl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKG9yZGVySXRlbSkge1xuICAgICAgICAgICAgaWYgKG9yZGVySXRlbS5hbW91bnQgPiBvcmRlckl0ZW0uc3RvY2spIHtcbiAgICAgICAgICAgICAgICBhbGxBdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW0gbm90IGF2YWlsYWJsZTogXCIsIG9yZGVySXRlbS5wcm9kdWN0X2lkLCBvcmRlckl0ZW0uc3RvY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlckl0ZW0ucHJvZHVjdF9pZCwgb3JkZXJJdGVtLmFtb3VudCwgb3JkZXJJdGVtLnN0b2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFsbEF2YWlsYWJsZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlUHJvZHVjdDogYXN5bmMgZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICBsZXQgZmV0Y2hPYmplY3QgPSB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwcm9kdWN0KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZmV0Y2hPYmplY3Q6XCIsIGZldGNoT2JqZWN0KTtcblxuICAgICAgICBhd2FpdCBmZXRjaChgJHtiYXNlVXJsfS9wcm9kdWN0c2AsIGZldGNoT2JqZWN0KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGVQcm9kdWN0IHJlc3BvbnNlOiBcIiwgcmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgcHJvZHVjdHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyB1dGlscy5qc1xuXG5jb25zdCB1dGlscyA9IHtcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRpb25zLnR5cGUgfHwgXCJkaXZcIik7XG5cbiAgICAgICAgZm9yIChsZXQgcHJvcGVydHkgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50W3Byb3BlcnR5XSA9IG9wdGlvbnNbcHJvcGVydHldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSxcblxuICAgIHJlbW92ZU5vZGVzOiBmdW5jdGlvbihpZCkge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhbldpbmRvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy50b3BOYXZpZ2F0aW9uLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHdpbmRvdy5tYWluQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHdpbmRvdy5jb21tYW5kU3RyaXBlLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfSxcblxuICAgIGdlbmVyYXRlUHJvZHVjdExpc3RGb3JQaWNrOiBmdW5jdGlvbihwcm9kdWN0cykge1xuICAgICAgICBsZXQgZWxlbWVudExpc3QgPSBbXTtcblxuICAgICAgICBwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICAgICAgIGxldCBkZXRhaWxzRm9yUGljayA9IHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGxcIixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwicHJvZHVjdC1pbmZvXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImR0XCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IFwiUHJvZHVrdDpcIlxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRkXCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IHByb2R1Y3QubmFtZVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImR0XCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IFwiSHlsbGE6XCJcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgZGV0YWlsc0ZvclBpY2suYXBwZW5kQ2hpbGQodXRpbHMuY3JlYXRlRWxlbWVudCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkZFwiLFxuICAgICAgICAgICAgICAgIHRleHRDb250ZW50OiBwcm9kdWN0LmxvY2F0aW9uXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGRldGFpbHNGb3JQaWNrLmFwcGVuZENoaWxkKHV0aWxzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZHRcIixcbiAgICAgICAgICAgICAgICB0ZXh0Q29udGVudDogXCJBbnRhbDpcIlxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBkZXRhaWxzRm9yUGljay5hcHBlbmRDaGlsZCh1dGlscy5jcmVhdGVFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRkXCIsXG4gICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IHByb2R1Y3QuYW1vdW50XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnRMaXN0LnB1c2goZGV0YWlsc0ZvclBpY2spO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZWxlbWVudExpc3Q7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgdXRpbHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbmNvbnN0IGFwaUtleSA9IFwiMGJmMTkyMmNlOGEzMThhZGRiMzQwZDY1MDM2YjRhNWVcIjtcbmNvbnN0IGJhc2VVcmwgPSBcImh0dHBzOi8vbGFnZXIuZW1pbGZvbGluby5zZS92MlwiO1xuXG5leHBvcnQgeyBiYXNlVXJsLCBhcGlLZXkgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIG1haW4uanNcblxuaW1wb3J0IHsgaG9tZSB9IGZyb20gXCIuL2hvbWUuanNcIjtcblxuKGZ1bmN0aW9uIE1BSU5fSUlGRSgpIHtcbiAgICB3aW5kb3cucm9vdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIik7XG5cbiAgICB3aW5kb3cudG9wTmF2aWdhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIik7XG4gICAgd2luZG93LnRvcE5hdmlnYXRpb24uY2xhc3NOYW1lID0gXCJ0b3AtbmF2XCI7XG4gICAgd2luZG93LnRvcE5hdmlnYXRpb24uaWQgPSBcInRvcC1uYXZcIjtcblxuICAgIHdpbmRvdy5tYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm1haW5cIik7XG4gICAgd2luZG93Lm1haW5Db250YWluZXIuY2xhc3NOYW1lID0gXCJjb250YWluZXJcIjtcblxuICAgIHdpbmRvdy5jb21tYW5kU3RyaXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB3aW5kb3cuY29tbWFuZFN0cmlwZS5pZCA9IFwiY29tbWFuZC1zdHJpcGVcIjtcblxuICAgIHdpbmRvdy5uYXZpZ2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm5hdlwiKTtcbiAgICB3aW5kb3cubmF2aWdhdGlvbi5jbGFzc05hbWUgPSBcImJvdHRvbS1uYXZcIjtcblxuICAgIGhvbWUuc2hvd0hvbWUoKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9