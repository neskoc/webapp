/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/models/auth.js":
/*!***************************!*\
  !*** ./js/models/auth.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "auth": () => (/* binding */ auth),
/* harmony export */   "baseUrl": () => (/* reexport safe */ _vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl),
/* harmony export */   "apiKey": () => (/* reexport safe */ _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vars.js */ "./js/vars.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/models/auth.js





// import { apiKey, baseUrl, token } from "../vars.js";


let auth = {
    baseUrl: _vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl,
    apiKey: _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey,
    urlLogin: `${_vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl}/auth/login`,
    urlRegister: `${_vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl}/auth/register`,
    email: "",
    password: "",
    // TODO: change token to ""
    token: "", //token,
    currentForm: {},
    callback: "",
    error: "",
    login: async function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: auth.urlLogin,
            body: {
                email: auth.email,
                password: auth.password,
                api_key: _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey
            }
        }).then(function(result) {
            console.log(result.data.token);
            auth.token = result.data.token;
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/${auth.callback}`);
        });
    },
    register: async function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: auth.urlRegister,
            body: {
                email: auth.email,
                password: auth.password,
                api_key: _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey
            }
        }).then(function(result) {
            console.log("Register.result.data:", result);
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/${auth.callback}`);
        }).catch(function(err) {
            let errJson = JSON.parse(err);

            console.error("Error:", errJson);
            console.log("Error name:", errJson.name);
            // return m.route.set(`/register`);
        });
    }
};




/***/ }),

/***/ "./js/models/invoices.js":
/*!*******************************!*\
  !*** ./js/models/invoices.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoicesModel": () => (/* binding */ invoicesModel)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./js/models/orders.js");
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/models/invoices.js








let invoicesModel = {
    url: `${_models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.baseUrl}/invoices?api_key=${_models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.apiKey}`,
    invoices: [],

    getAllInvoices: async function() {
        console.log(`auth.token: ${_models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.token}`);
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: invoicesModel.url,
            headers: {
                'x-access-token': _models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.token,
            }
        }).then(function(result) {
            console.log("Invoices.getAllInvoices:", result.data);
            invoicesModel.invoices = result.data;
        });
    },

    saveInvoice: async function(order) {
        const formatYmd = date => date.toISOString().slice(0, 10);
        let currentDate = formatYmd(new Date());

        let sum = 0;

        order.order_items.forEach(function(product) {
            sum += +product.price * +product.amount;
        });

        let body = {
            order_id: order.id,
            api_key: _models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.apiKey,
            total_price: sum,
            creation_date: currentDate
        };

        console.log("saveInvoice: body", body);

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: `${_models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.baseUrl}/invoices`,
            body: body,
            headers: {
                'x-access-token': _models_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.token,
            }
        }).then(function(result) {
            console.log("saveInvoice: result: ", result);
            _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.updateOrder(order.id, 600);
        });
    }
};




/***/ }),

/***/ "./js/models/lager.js":
/*!****************************!*\
  !*** ./js/models/lager.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lager": () => (/* binding */ lager)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/models/lager.js






let lager = {
    current: {
        deliveries: [],
        products: []
    },
    currentForm: {},
    loadAllDeliveries: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/deliveries?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
        }).then(function(result) {
            lager.current.deliveries = result.data;
        }).finally (function() {
            mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
                method: "GET",
                url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
            }).then(function(result) {
                lager.current.products = result.data;
                // console.log("lager.current.products: ", lager.current.products);
            });
        });
    },
    addIndelivery: function() {
        lager.currentForm.api_key = _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey;
        console.log("lager.currentForm: ", lager.currentForm);

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/deliveries`,
            body: lager.currentForm
        }).then(function() {
            console.log("lager.currentForm: ", lager.currentForm);
            let requestBody = {
                api_key: _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey,
                id: lager.currentForm.product_id,
                name: lager.current.products.filter(
                    product => product.id == lager.currentForm.product_id
                )[0].name,
                stock: (+lager.currentForm.amount + // prefix +string converts it to number
                    +lager.current.products.filter(
                        product => product.id == lager.currentForm.product_id
                    )[0].stock)
            };

            console.log("requestBody: ", requestBody);
            mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
                method: "PUT",
                url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products`,
                body: requestBody
            }).then(function(response) {
                console.log("update product response: ",  response);
            });
        }).finally(function() {
            lager.resetCurrentForm();

            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/indelivery");
        });
    },
    resetCurrentForm: function() {
        lager.currentForm = {};
    }
};




/***/ }),

/***/ "./js/models/orders.js":
/*!*****************************!*\
  !*** ./js/models/orders.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orders": () => (/* binding */ orders)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.js */ "./js/models/auth.js");
/* harmony import */ var _products_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./products.js */ "./js/models/products.js");
/* jshint esversion: 8 */
/* jshint node: true */



// orders.js





// import { pickLists } from "../views/pick-lists.js";

let orders = {
    allOrders: [],
    currentOrder: '',
    current: { order: ''},

    getAllOrders: async function(noCache = false) {
        if (noCache) {
            console.log("noCache", noCache);
            _products_js__WEBPACK_IMPORTED_MODULE_2__.products.allProducts = [];
            orders.allOrders = [];
        } else if (orders.allOrders.length > 0) {
            return orders.allOrders;
        }

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/orders?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
        }).then(function(result) {
            orders.allOrders = result.data;
            console.log("orders.allOrders: ", orders.allOrders);
        });
    },

    getOrder: async function(orderId) {
        if (orders.allOrders === []) {
            await orders.getAllOrders(true);
        }
        orders.currentOrder = orders.allOrders.filter(function(order) {
            return order.id == orderId;
        })[0];
        console.log("getOrder: orders.currentOrder", orders.currentOrder);
        return orders.currentOrder;
    },

    updateOrder: async function(orderId, nyStatusId) {
        let order = {
            id: orderId,
            status_id: nyStatusId,
            api_key: _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey
        };

        // console.log("order:", order);
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            // body: JSON.stringify(order),
            body: order,
            method: 'PUT',
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/orders`
        }).then(function(result) {
            console.log(result);
            let fullOrder = orders.getOrder(orderId);

            console.log("fullOrder", fullOrder);

            fullOrder.order_items.forEach(function(item) {
                let newStock = item.stock - item.amount;
                let productDetails = {
                    id: item.product_id,
                    stock: newStock,
                    api_key: _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey
                };

                console.log("productDetails:", productDetails);

                _products_js__WEBPACK_IMPORTED_MODULE_2__.products.updateProduct(productDetails);
            });
        }).finally(function() {
            orders.getAllOrders(true);
        });
    }
};




/***/ }),

/***/ "./js/models/products.js":
/*!*******************************!*\
  !*** ./js/models/products.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "products": () => (/* binding */ products)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// products.js





let products = {
    allProducts: [],

    getAllProducts: function(noCache = false) {
        if (noCache) {
            products.allProducts = [];
        } else if (products.allProducts.length > 0) {
            // console.log("return: getAllProducts");
            return products.allProducts;
        }

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
        }).then(function(result) {
            products.allProducts = result.data;
            // console.log("products.allProducts: ", products.allProducts);
        });
    },

    getProduct: function(productId) {
        console.log("productId:", productId);
        return products.allProducts.filter(function(product) {
            return product.id == productId;
        })[0];
    },

    areProductsOnStock: function(orderItems) {
        if (products.allProducts.length === 0) {
            return products.getAllProducts();
        }

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

    updateProduct: function(productDetails) {
        console.log("updateProduct.productDetails:", productDetails);

        mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "PUT",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products`,
            body: productDetails
        }).then(function(response) {
            console.log("update product response: ",  response);
        });
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
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMGJmMTkyMmNlOGEzMThhZGRiMzQwZDY1MDM2YjRhNWUiLCJlbWFpbCI6ImNuZXNrb0BlLmVtYWlsIiwiaWF0IjoxNjE5NTUwNTE1LCJleHAiOjE2MTk2MzY5MTV9.qqGTySkGToXk7UWbxWhKWMKMgjCiGiC3e_Jhavmks10";

// export { baseUrl, apiKey, token };


/***/ }),

/***/ "./js/views/home.js":
/*!**************************!*\
  !*** ./js/views/home.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "home": () => (/* binding */ home)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./js/models/orders.js");
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/products.js */ "./js/models/products.js");
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/home.js







let main = {
    oninit: function() {
        _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getAllOrders();
        _models_products_js__WEBPACK_IMPORTED_MODULE_2__.products.getAllProducts();
        _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id < 600)[0];
    },
    view: function() {
        let greeting = "Det h??r ??r en SPA f??r kursen Webapp";
        let image = {
            src: "img/AI-head2.jpg",
            alt: "AI head"
        };

        if (_models_auth_js__WEBPACK_IMPORTED_MODULE_3__.auth.token) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Lagerapp"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", greeting),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("img", image, greeting)
            ];
        } else {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Lagerapp"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", greeting),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "a.button.blue-button.full-width-button",
                    { href: "#!/login" },
                    "Logga in"
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "a.button.green-button.full-width-button",
                    { href: "#!/register" },
                    "Registrera"
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("img", image, greeting)
            ];
        }
    }
};

let home = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/indelivery.js":
/*!********************************!*\
  !*** ./js/views/indelivery.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "indelivery": () => (/* binding */ indelivery)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_lager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/lager.js */ "./js/models/lager.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/indelivery.js




const indeliveryComponent = {
    view: function(vnode) {
        let current = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.card", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.card-title", current.product_name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("dl.product-info",
                [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Produkt"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.product_id),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Antal"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.amount),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Leveransdatum"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.delivery_date),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Kommentar"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.comment)
                ]
            ),
        ]);
    }
};

let main = {
    oninit: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.loadAllDeliveries,
    view: function() {
        if (_models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.current.deliveries.length < 1) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Inleveranser"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", "Inga inleveranser finns registrerade!")
            ];
        }
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Inleveranser"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                "a.button.blue-button.full-width-button",
                { href: "#!/new-indelivery" },
                "Ny inleverans"
            ),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.delivery-container", _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.current.deliveries.map(function(delivery) {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(indeliveryComponent, delivery);
            }))
        ];
    }
};

let indelivery = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/inventory.js":
/*!*******************************!*\
  !*** ./js/views/inventory.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inventory": () => (/* binding */ inventory)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/products.js */ "./js/models/products.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/inventory.js





const inventoryComponent = {
    view: function(vnode) {
        let product = vnode.attrs;
        // console.log("vnode.attrs:", vnode.attrs);

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-row", {
            onclick: function() {
                console.log("view:product-details/:id", product.id);
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/product-details/${product.id}`);
            }
        }, [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.left", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.right", product.stock),
        ]);
    }
};

let main = {
    oninit: _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.getAllProducts,
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Lagersaldo"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.inv-container", _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.allProducts.map(product => {
                // console.log("inventory.view:product", product);
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(inventoryComponent, product);
            }))
        ];
    }
};

let inventory = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/invoice.js":
/*!*****************************!*\
  !*** ./js/views/invoice.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoice": () => (/* binding */ invoice)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./js/models/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/invoice.js




const orderRow = {
    view: function(vnode) {
        let product = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.amount),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.price),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", +product.amount * +product.price)
        ]);
    }
};

let main = {
    view: function(vnode) {
        let order = vnode.attrs;

        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h2", "Fakturainfo"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.address),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.zip ? order.zip : '' + ' ' + order.city ? order.city : 0),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.country),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.adress),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("table.table.table-scroll.table-striped", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Product"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Antal"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Pris"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Total")
                ]),
                order.order_items.map(function(item) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderRow, item);
                })
            ])
        ];
    }
};

let invoice = {
    oninit: function(vnode) {
        _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getOrder(vnode.attrs.id);
    },
    view: function(vnode) {
        console.log("invoice.view: vnode.attrs", vnode.attrs);
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main, _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder));
    }
};




/***/ }),

/***/ "./js/views/invoices.js":
/*!******************************!*\
  !*** ./js/views/invoices.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoices": () => (/* binding */ invoices)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_invoices_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/invoices.js */ "./js/models/invoices.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/invoices.js





const invoicesRow = {
    view: function(vnode) {
        let invoice = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr.tr-link", {
            onclick: function() {
                console.log(invoice);
                mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/invoice/${invoice.order_id}`);
            }
        }, [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td", invoice.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", invoice.total_price)
        ]);
    }
};

let main = {
    oninit: _models_invoices_js__WEBPACK_IMPORTED_MODULE_1__.invoicesModel.getAllInvoices,
    view: function() {
        if (_models_invoices_js__WEBPACK_IMPORTED_MODULE_1__.invoicesModel.invoices.length === 0) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Fakturor"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", "Inga fakturor finns registrerade!")
            ];
        }
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Fakturor"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("table.table.table-scroll.table-striped", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Kund"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Summa")
                ]),
                _models_invoices_js__WEBPACK_IMPORTED_MODULE_1__.invoicesModel.invoices.map(function(invoice) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()(invoicesRow, invoice);
                })
            ]),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                "a.button.green-button.full-width-button.space",
                { href: "#!/new-invoice" },
                "Skapa en faktura"
            )
        ];
    }
};

let invoices = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/layout.js":
/*!****************************!*\
  !*** ./js/views/layout.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "layout": () => (/* binding */ layout)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/views/layout.js






let layout = {
    view: function(vnode) {
        let navElements = [
            {name: "Home", class: "home", link: "home", nav: "#!/"}
        ];

        if (_models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.token) {
            navElements.push({name: "Inleverans", class: "local_shipping",
                link: "indelivery", nav: "#!/indelivery"});
            navElements.push({name: "Lagersaldo", class: "inventory",
                link: "inventory", nav: "#!/inventory"});
            navElements.push({name: "Plocklista", class: "checklist",
                link: "pick-lists", nav: "#!/pick-lists"});
            navElements.push({name: "Faktura", class: "receipt",
                link: "invoices", nav: "#!/invoices"});
        }
        // console.log("route: ", m.route.get().split("/"));
        let selected = mithril__WEBPACK_IMPORTED_MODULE_0___default().route.get().split("/")[1] || "home";

        console.log("selected:", selected);

        navElements = navElements.map(element => generateBottomNavElement(element, selected));

        return [
            // m("main.container", vnode.children),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div#root", vnode.children),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("nav.bottom-nav", navElements)
        ];
    }
};

let generateBottomNavElement = function (element, selected) {
    let bottomNavElements = [];
    let active = "";

    if (selected === element.link) {
        active = ".active";
    }

    let navElementAndClass = "a" + active;

    bottomNavElements.push(
        mithril__WEBPACK_IMPORTED_MODULE_0___default()(
            navElementAndClass,
            { href: element.nav },
            [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "i.material-icons",
                    element.class
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "span.icon-text",
                    element.name
                )
            ]
        )
    );

    return bottomNavElements;
};




/***/ }),

/***/ "./js/views/login.js":
/*!***************************!*\
  !*** ./js/views/login.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "login": () => (/* binding */ login)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/login.js




let main = {
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Logga in"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.login();
                }}, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "E-postadress"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=email][placeholder=E-postadress][required=required]", {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "L??senord"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=password][placeholder=L??senord][required=required]", {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "input.button.green-button.full-width-button[type=submit][value=Login]",
                    "Logga in"
                )]
            )];
    }
};

let login = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/new-indelivery.js":
/*!************************************!*\
  !*** ./js/views/new-indelivery.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newIndelivery": () => (/* binding */ newIndelivery)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_lager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/lager.js */ "./js/models/lager.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/new-indelivery.js




let main = {
    oninit: function() {
        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.resetCurrentForm();
    },
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.form-container", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h2", "Ny inleverans"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.addIndelivery();
                } }, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Produkt"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("select.input[required=required]", {
                    onchange: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.product_id = e.target.value;
                    }
                }, _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.current.products.map(function(product) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()("option", { value: product.id }, product.name);
                })),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Antal"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=number][placeholder=Antal][required=required][min=1]", {
                    oninput: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.amount = e.target.value;
                    },
                    value: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.amount
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Leveransdatum"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=date][placeholder=Leveransdatum][required=required]", {
                    oninput: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.delivery_date = e.target.value;
                    },
                    value: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.date
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Kommentar"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("textarea.input[cols=2][placeholder=Kommentar]", {
                    oninput: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.comment = e.target.value;
                    },
                    value: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.comment
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "input.button.green-button.full-width-button[type=submit][value=Save]",
                    "G??r inleverans"
                )
            ])
        ]);
    }
};

let newIndelivery = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/new-invoice.js":
/*!*********************************!*\
  !*** ./js/views/new-invoice.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newInvoice": () => (/* binding */ newInvoice)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./js/models/orders.js");
/* harmony import */ var _models_invoices_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/invoices.js */ "./js/models/invoices.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/new-invoice.js





const orderRow = {
    view: function(vnode) {
        let product = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.amount),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.price),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", +product.amount * +product.price)
        ]);
    }
};

let showOrder = {
    view: function(vnode) {
        let order = vnode.attrs;
        // console.log("showOrder: orders.ccurrentOrder", order);

        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.address),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.zip ? order.zip : '' + ' ' + order.city ? order.city : 0),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.country),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.adress),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("table.table.table-scroll.table-striped", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Product"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Antal"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Pris"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Total")
                ]),
                order.order_items.map(function(item) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderRow, item);
                })
            ]),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                "input.button.green-button.full-width-button[type=submit][value='Skapa fakturan']"
            )
        ];
    }
};

let main = {
    view: function() {
        let order = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.form-container", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h2", "Ny faktura"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_invoices_js__WEBPACK_IMPORTED_MODULE_2__.invoicesModel.saveInvoice(order);
                    mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/invoices");
                } }, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Order"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("select.input[required=required]", {
                    onchange: function (e) {
                        order = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getOrder(e.target.value);
                        console.log("main", _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder);
                    }
                }, _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id < 600)
                    .map(function(order) {
                        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("option", { value: order.id }, order.name);
                    })
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("div#invoice-container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(showOrder, order))
            ])
        ]);
    }
};

let newInvoice = {
    oninit: function() {
        if (_models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder !== '') {
            _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id < 600)[0];
        }
    },
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/order-details.js":
/*!***********************************!*\
  !*** ./js/views/order-details.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orderDetails": () => (/* binding */ orderDetails)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/products.js */ "./js/models/products.js");
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/orders.js */ "./js/models/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// order-details.js



// import { pickLists } from "./pick-lists.js";



let orderItems = {
    view: function(vnode) {
        let order = vnode.attrs;

        console.log("orderItems->order.order_items:", order.order_items);
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("dl.product-info", order.order_items.map(function(product) {
                return [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Product"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.product_id),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Hylla"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.location),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Beskrivning"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.description)
                ];
            }))
        ];
    }
};

let main = {
    view: function() {
        let order = _models_orders_js__WEBPACK_IMPORTED_MODULE_2__.orders.currentOrder;

        let indeliveryPossible = _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.areProductsOnStock(order.order_items);

        if (indeliveryPossible) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderItems, order),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "a.button.green-button.full-width-button",
                    {
                        onclick: function() {
                            console.log(order.id);
                            _models_orders_js__WEBPACK_IMPORTED_MODULE_2__.orders.updateOrder(order.id, 200);
                            mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set('/pick-lists');
                        }
                    },
                    "S??tt som packat"
                )];
        } else {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderItems, order);
        }
    }
};

let orderDetails = {
    oninit: function(vnode) {
        _models_orders_js__WEBPACK_IMPORTED_MODULE_2__.orders.getOrder(vnode.attrs.id);
    },
    view: function(vnode) {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main, vnode.attrs));
    }
};




/***/ }),

/***/ "./js/views/pick-lists.js":
/*!********************************!*\
  !*** ./js/views/pick-lists.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pickLists": () => (/* binding */ pickLists)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./js/models/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/pick-lists.js






const generateOrderList = {
    view: function(vnode) {
        let order = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-row", {
            onclick: function() {
                console.log(order);
                mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/order-details/${order.id}`);
            }
        }, [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.left", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.right", order.id),
        ]);
    }
};

let main = {
    oninit: _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getAllOrders,
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Nya ordrar"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.inv-container", (
                _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.length === 0 ?
                    _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id === 100)
                        .map(order => {
                            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(generateOrderList, order);
                        }) : mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", "Finns inga nya ordrar")
            ))
        ];
    }
};

let pickLists = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./js/views/product-details.js":
/*!*************************************!*\
  !*** ./js/views/product-details.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "productDetails": () => (/* binding */ productDetails)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/products.js */ "./js/models/products.js");
/* jshint esversion: 8 */
/* jshint node: true */



// product-details.js





let main = {
    view: function(vnode) {
        console.log("vnode:", vnode);
        let product = _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.getProduct(vnode.attrs.id);

        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.product-name", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("dl.product-info", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "id"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.id),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Artikelnummer"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.article_number),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Beskrivning"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.description),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Specifikation"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.specifiers),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "I lager"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.stock),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Hylla"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.location),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Pris"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.price),
            ])
        ];
    }
};

let productDetails = {
    view: function(vnode) {
        console.log("product-details");
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main, vnode.attrs));
    }
};




/***/ }),

/***/ "./js/views/register.js":
/*!******************************!*\
  !*** ./js/views/register.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "register": () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/register.js




let main = {
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Registrering"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.register();
                } }, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "E-postadress"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=email][placeholder=E-postadress][required=required]", {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "L??senord"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()('input.input[type="password"][placeholder="L??senord"][required=required]', {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "input.button.green-button.full-width-button[type=submit][value=Registrera]"
                )]
            )];
    }
};

let register = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./node_modules/mithril/api/mount-redraw.js":
/*!**************************************************!*\
  !*** ./node_modules/mithril/api/mount-redraw.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

module.exports = function(render, schedule, console) {
	var subscriptions = []
	var rendering = false
	var pending = false

	function sync() {
		if (rendering) throw new Error("Nested m.redraw.sync() call")
		rendering = true
		for (var i = 0; i < subscriptions.length; i += 2) {
			try { render(subscriptions[i], Vnode(subscriptions[i + 1]), redraw) }
			catch (e) { console.error(e) }
		}
		rendering = false
	}

	function redraw() {
		if (!pending) {
			pending = true
			schedule(function() {
				pending = false
				sync()
			})
		}
	}

	redraw.sync = sync

	function mount(root, component) {
		if (component != null && component.view == null && typeof component !== "function") {
			throw new TypeError("m.mount(element, component) expects a component, not a vnode")
		}

		var index = subscriptions.indexOf(root)
		if (index >= 0) {
			subscriptions.splice(index, 2)
			render(root, [], redraw)
		}

		if (component != null) {
			subscriptions.push(root, component)
			render(root, Vnode(component), redraw)
		}
	}

	return {mount: mount, redraw: redraw}
}


/***/ }),

/***/ "./node_modules/mithril/api/router.js":
/*!********************************************!*\
  !*** ./node_modules/mithril/api/router.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")
var m = __webpack_require__(/*! ../render/hyperscript */ "./node_modules/mithril/render/hyperscript.js")
var Promise = __webpack_require__(/*! ../promise/promise */ "./node_modules/mithril/promise/promise.js")

var buildPathname = __webpack_require__(/*! ../pathname/build */ "./node_modules/mithril/pathname/build.js")
var parsePathname = __webpack_require__(/*! ../pathname/parse */ "./node_modules/mithril/pathname/parse.js")
var compileTemplate = __webpack_require__(/*! ../pathname/compileTemplate */ "./node_modules/mithril/pathname/compileTemplate.js")
var assign = __webpack_require__(/*! ../pathname/assign */ "./node_modules/mithril/pathname/assign.js")

var sentinel = {}

module.exports = function($window, mountRedraw) {
	var fireAsync

	function setPath(path, data, options) {
		path = buildPathname(path, data)
		if (fireAsync != null) {
			fireAsync()
			var state = options ? options.state : null
			var title = options ? options.title : null
			if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path)
			else $window.history.pushState(state, title, route.prefix + path)
		}
		else {
			$window.location.href = route.prefix + path
		}
	}

	var currentResolver = sentinel, component, attrs, currentPath, lastUpdate

	var SKIP = route.SKIP = {}

	function route(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		// 0 = start
		// 1 = init
		// 2 = ready
		var state = 0

		var compiled = Object.keys(routes).map(function(route) {
			if (route[0] !== "/") throw new SyntaxError("Routes must start with a `/`")
			if ((/:([^\/\.-]+)(\.{3})?:/).test(route)) {
				throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`")
			}
			return {
				route: route,
				component: routes[route],
				check: compileTemplate(route),
			}
		})
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
		var p = Promise.resolve()
		var scheduled = false
		var onremove

		fireAsync = null

		if (defaultRoute != null) {
			var defaultData = parsePathname(defaultRoute)

			if (!compiled.some(function (i) { return i.check(defaultData) })) {
				throw new ReferenceError("Default route doesn't match any known routes")
			}
		}

		function resolveRoute() {
			scheduled = false
			// Consider the pathname holistically. The prefix might even be invalid,
			// but that's not our problem.
			var prefix = $window.location.hash
			if (route.prefix[0] !== "#") {
				prefix = $window.location.search + prefix
				if (route.prefix[0] !== "?") {
					prefix = $window.location.pathname + prefix
					if (prefix[0] !== "/") prefix = "/" + prefix
				}
			}
			// This seemingly useless `.concat()` speeds up the tests quite a bit,
			// since the representation is consistently a relatively poorly
			// optimized cons string.
			var path = prefix.concat()
				.replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
				.slice(route.prefix.length)
			var data = parsePathname(path)

			assign(data.params, $window.history.state)

			function fail() {
				if (path === defaultRoute) throw new Error("Could not resolve default route " + defaultRoute)
				setPath(defaultRoute, null, {replace: true})
			}

			loop(0)
			function loop(i) {
				// 0 = init
				// 1 = scheduled
				// 2 = done
				for (; i < compiled.length; i++) {
					if (compiled[i].check(data)) {
						var payload = compiled[i].component
						var matchedRoute = compiled[i].route
						var localComp = payload
						var update = lastUpdate = function(comp) {
							if (update !== lastUpdate) return
							if (comp === SKIP) return loop(i + 1)
							component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
							attrs = data.params, currentPath = path, lastUpdate = null
							currentResolver = payload.render ? payload : null
							if (state === 2) mountRedraw.redraw()
							else {
								state = 2
								mountRedraw.redraw.sync()
							}
						}
						// There's no understating how much I *wish* I could
						// use `async`/`await` here...
						if (payload.view || typeof payload === "function") {
							payload = {}
							update(localComp)
						}
						else if (payload.onmatch) {
							p.then(function () {
								return payload.onmatch(data.params, path, matchedRoute)
							}).then(update, fail)
						}
						else update("div")
						return
					}
				}
				fail()
			}
		}

		// Set it unconditionally so `m.route.set` and `m.route.Link` both work,
		// even if neither `pushState` nor `hashchange` are supported. It's
		// cleared if `hashchange` is used, since that makes it automatically
		// async.
		fireAsync = function() {
			if (!scheduled) {
				scheduled = true
				callAsync(resolveRoute)
			}
		}

		if (typeof $window.history.pushState === "function") {
			onremove = function() {
				$window.removeEventListener("popstate", fireAsync, false)
			}
			$window.addEventListener("popstate", fireAsync, false)
		} else if (route.prefix[0] === "#") {
			fireAsync = null
			onremove = function() {
				$window.removeEventListener("hashchange", resolveRoute, false)
			}
			$window.addEventListener("hashchange", resolveRoute, false)
		}

		return mountRedraw.mount(root, {
			onbeforeupdate: function() {
				state = state ? 2 : 1
				return !(!state || sentinel === currentResolver)
			},
			oncreate: resolveRoute,
			onremove: onremove,
			view: function() {
				if (!state || sentinel === currentResolver) return
				// Wrap in a fragment to preserve existing key semantics
				var vnode = [Vnode(component, attrs.key, attrs)]
				if (currentResolver) vnode = currentResolver.render(vnode[0])
				return vnode
			},
		})
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = "#!"
	route.Link = {
		view: function(vnode) {
			var options = vnode.attrs.options
			// Remove these so they don't get overwritten
			var attrs = {}, onclick, href
			assign(attrs, vnode.attrs)
			// The first two are internal, but the rest are magic attributes
			// that need censored to not screw up rendering.
			attrs.selector = attrs.options = attrs.key = attrs.oninit =
			attrs.oncreate = attrs.onbeforeupdate = attrs.onupdate =
			attrs.onbeforeremove = attrs.onremove = null

			// Do this now so we can get the most current `href` and `disabled`.
			// Those attributes may also be specified in the selector, and we
			// should honor that.
			var child = m(vnode.attrs.selector || "a", attrs, vnode.children)

			// Let's provide a *right* way to disable a route link, rather than
			// letting people screw up accessibility on accident.
			//
			// The attribute is coerced so users don't get surprised over
			// `disabled: 0` resulting in a button that's somehow routable
			// despite being visibly disabled.
			if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
				child.attrs.href = null
				child.attrs["aria-disabled"] = "true"
				// If you *really* do want to do this on a disabled link, use
				// an `oncreate` hook to add it.
				child.attrs.onclick = null
			} else {
				onclick = child.attrs.onclick
				href = child.attrs.href
				child.attrs.href = route.prefix + href
				child.attrs.onclick = function(e) {
					var result
					if (typeof onclick === "function") {
						result = onclick.call(e.currentTarget, e)
					} else if (onclick == null || typeof onclick !== "object") {
						// do nothing
					} else if (typeof onclick.handleEvent === "function") {
						onclick.handleEvent(e)
					}

					// Adapted from React Router's implementation:
					// https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
					//
					// Try to be flexible and intuitive in how we handle links.
					// Fun fact: links aren't as obvious to get right as you
					// would expect. There's a lot more valid ways to click a
					// link than this, and one might want to not simply click a
					// link, but right click or command-click it to copy the
					// link target, etc. Nope, this isn't just for blind people.
					if (
						// Skip if `onclick` prevented default
						result !== false && !e.defaultPrevented &&
						// Ignore everything but left clicks
						(e.button === 0 || e.which === 0 || e.which === 1) &&
						// Let the browser handle `target=_blank`, etc.
						(!e.currentTarget.target || e.currentTarget.target === "_self") &&
						// No modifier keys
						!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
					) {
						e.preventDefault()
						e.redraw = false
						route.set(href, null, options)
					}
				}
			}
			return child
		},
	}
	route.param = function(key) {
		return attrs && key != null ? attrs[key] : attrs
	}

	return route
}


/***/ }),

/***/ "./node_modules/mithril/hyperscript.js":
/*!*********************************************!*\
  !*** ./node_modules/mithril/hyperscript.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hyperscript = __webpack_require__(/*! ./render/hyperscript */ "./node_modules/mithril/render/hyperscript.js")

hyperscript.trust = __webpack_require__(/*! ./render/trust */ "./node_modules/mithril/render/trust.js")
hyperscript.fragment = __webpack_require__(/*! ./render/fragment */ "./node_modules/mithril/render/fragment.js")

module.exports = hyperscript


/***/ }),

/***/ "./node_modules/mithril/index.js":
/*!***************************************!*\
  !*** ./node_modules/mithril/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hyperscript = __webpack_require__(/*! ./hyperscript */ "./node_modules/mithril/hyperscript.js")
var request = __webpack_require__(/*! ./request */ "./node_modules/mithril/request.js")
var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js")

var m = function m() { return hyperscript.apply(this, arguments) }
m.m = hyperscript
m.trust = hyperscript.trust
m.fragment = hyperscript.fragment
m.mount = mountRedraw.mount
m.route = __webpack_require__(/*! ./route */ "./node_modules/mithril/route.js")
m.render = __webpack_require__(/*! ./render */ "./node_modules/mithril/render.js")
m.redraw = mountRedraw.redraw
m.request = request.request
m.jsonp = request.jsonp
m.parseQueryString = __webpack_require__(/*! ./querystring/parse */ "./node_modules/mithril/querystring/parse.js")
m.buildQueryString = __webpack_require__(/*! ./querystring/build */ "./node_modules/mithril/querystring/build.js")
m.parsePathname = __webpack_require__(/*! ./pathname/parse */ "./node_modules/mithril/pathname/parse.js")
m.buildPathname = __webpack_require__(/*! ./pathname/build */ "./node_modules/mithril/pathname/build.js")
m.vnode = __webpack_require__(/*! ./render/vnode */ "./node_modules/mithril/render/vnode.js")
m.PromisePolyfill = __webpack_require__(/*! ./promise/polyfill */ "./node_modules/mithril/promise/polyfill.js")

module.exports = m


/***/ }),

/***/ "./node_modules/mithril/mount-redraw.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/mount-redraw.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var render = __webpack_require__(/*! ./render */ "./node_modules/mithril/render.js")

module.exports = __webpack_require__(/*! ./api/mount-redraw */ "./node_modules/mithril/api/mount-redraw.js")(render, requestAnimationFrame, console)


/***/ }),

/***/ "./node_modules/mithril/pathname/assign.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/pathname/assign.js ***!
  \*************************************************/
/***/ ((module) => {



module.exports = Object.assign || function(target, source) {
	if(source) Object.keys(source).forEach(function(key) { target[key] = source[key] })
}


/***/ }),

/***/ "./node_modules/mithril/pathname/build.js":
/*!************************************************!*\
  !*** ./node_modules/mithril/pathname/build.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var buildQueryString = __webpack_require__(/*! ../querystring/build */ "./node_modules/mithril/querystring/build.js")
var assign = __webpack_require__(/*! ./assign */ "./node_modules/mithril/pathname/assign.js")

// Returns `path` from `template` + `params`
module.exports = function(template, params) {
	if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
		throw new SyntaxError("Template parameter names *must* be separated")
	}
	if (params == null) return template
	var queryIndex = template.indexOf("?")
	var hashIndex = template.indexOf("#")
	var queryEnd = hashIndex < 0 ? template.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = template.slice(0, pathEnd)
	var query = {}

	assign(query, params)

	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
		delete query[key]
		// If no such parameter exists, don't interpolate it.
		if (params[key] == null) return m
		// Escape normal parameters, but not variadic ones.
		return variadic ? params[key] : encodeURIComponent(String(params[key]))
	})

	// In case the template substitution adds new query/hash parameters.
	var newQueryIndex = resolved.indexOf("?")
	var newHashIndex = resolved.indexOf("#")
	var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex
	var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex
	var result = resolved.slice(0, newPathEnd)

	if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd)
	if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd)
	var querystring = buildQueryString(query)
	if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring
	if (hashIndex >= 0) result += template.slice(hashIndex)
	if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex)
	return result
}


/***/ }),

/***/ "./node_modules/mithril/pathname/compileTemplate.js":
/*!**********************************************************!*\
  !*** ./node_modules/mithril/pathname/compileTemplate.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var parsePathname = __webpack_require__(/*! ./parse */ "./node_modules/mithril/pathname/parse.js")

// Compiles a template into a function that takes a resolved path (without query
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled template to be the
// output of `parsePathname`. Note that it does *not* remove query parameters
// specified in the template.
module.exports = function(template) {
	var templateData = parsePathname(template)
	var templateKeys = Object.keys(templateData.params)
	var keys = []
	var regexp = new RegExp("^" + templateData.path.replace(
		// I escape literal text so people can use things like `:file.:ext` or
		// `:lang-:locale` in routes. This is all merged into one pass so I
		// don't also accidentally escape `-` and make it harder to detect it to
		// ban it from template parameters.
		/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
		function(m, key, extra) {
			if (key == null) return "\\" + m
			keys.push({k: key, r: extra === "..."})
			if (extra === "...") return "(.*)"
			if (extra === ".") return "([^/]+)\\."
			return "([^/]+)" + (extra || "")
		}
	) + "$")
	return function(data) {
		// First, check the params. Usually, there isn't any, and it's just
		// checking a static set.
		for (var i = 0; i < templateKeys.length; i++) {
			if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false
		}
		// If no interpolations exist, let's skip all the ceremony
		if (!keys.length) return regexp.test(data.path)
		var values = regexp.exec(data.path)
		if (values == null) return false
		for (var i = 0; i < keys.length; i++) {
			data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1])
		}
		return true
	}
}


/***/ }),

/***/ "./node_modules/mithril/pathname/parse.js":
/*!************************************************!*\
  !*** ./node_modules/mithril/pathname/parse.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var parseQueryString = __webpack_require__(/*! ../querystring/parse */ "./node_modules/mithril/querystring/parse.js")

// Returns `{path, params}` from `url`
module.exports = function(url) {
	var queryIndex = url.indexOf("?")
	var hashIndex = url.indexOf("#")
	var queryEnd = hashIndex < 0 ? url.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/")

	if (!path) path = "/"
	else {
		if (path[0] !== "/") path = "/" + path
		if (path.length > 1 && path[path.length - 1] === "/") path = path.slice(0, -1)
	}
	return {
		path: path,
		params: queryIndex < 0
			? {}
			: parseQueryString(url.slice(queryIndex + 1, queryEnd)),
	}
}


/***/ }),

/***/ "./node_modules/mithril/promise/polyfill.js":
/*!**************************************************!*\
  !*** ./node_modules/mithril/promise/polyfill.js ***!
  \**************************************************/
/***/ ((module) => {


/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")

	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}

	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.prototype.finally = function(callback) {
	return this.then(
		function(value) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return value
			})
		},
		function(reason) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return PromisePolyfill.reject(reason);
			})
		}
	)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}

module.exports = PromisePolyfill


/***/ }),

/***/ "./node_modules/mithril/promise/promise.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/promise/promise.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var PromisePolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/mithril/promise/polyfill.js")

if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") {
		window.Promise = PromisePolyfill
	} else if (!window.Promise.prototype.finally) {
		window.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = window.Promise
} else if (typeof __webpack_require__.g !== "undefined") {
	if (typeof __webpack_require__.g.Promise === "undefined") {
		__webpack_require__.g.Promise = PromisePolyfill
	} else if (!__webpack_require__.g.Promise.prototype.finally) {
		__webpack_require__.g.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = __webpack_require__.g.Promise
} else {
	module.exports = PromisePolyfill
}


/***/ }),

/***/ "./node_modules/mithril/querystring/build.js":
/*!***************************************************!*\
  !*** ./node_modules/mithril/querystring/build.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""

	var args = []
	for (var key in object) {
		destructure(key, object[key])
	}

	return args.join("&")

	function destructure(key, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}


/***/ }),

/***/ "./node_modules/mithril/querystring/parse.js":
/*!***************************************************!*\
  !*** ./node_modules/mithril/querystring/parse.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)

	var entries = string.split("&"), counters = {}, data = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""

		if (value === "true") value = true
		else if (value === "false") value = false

		var levels = key.split(/\]\[?|\[/)
		var cursor = data
		if (key.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			if (level === "") {
				var key = levels.slice(0, j).join()
				if (counters[key] == null) {
					counters[key] = Array.isArray(cursor) ? cursor.length : 0
				}
				level = counters[key]++
			}
			// Disallow direct prototype pollution
			else if (level === "__proto__") break
			if (j === levels.length - 1) cursor[level] = value
			else {
				// Read own properties exclusively to disallow indirect
				// prototype pollution
				var desc = Object.getOwnPropertyDescriptor(cursor, level)
				if (desc != null) desc = desc.value
				if (desc == null) cursor[level] = desc = isNumber ? [] : {}
				cursor = desc
			}
		}
	}
	return data
}


/***/ }),

/***/ "./node_modules/mithril/render.js":
/*!****************************************!*\
  !*** ./node_modules/mithril/render.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(/*! ./render/render */ "./node_modules/mithril/render/render.js")(window)


/***/ }),

/***/ "./node_modules/mithril/render/fragment.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/render/fragment.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")
var hyperscriptVnode = __webpack_require__(/*! ./hyperscriptVnode */ "./node_modules/mithril/render/hyperscriptVnode.js")

module.exports = function() {
	var vnode = hyperscriptVnode.apply(0, arguments)

	vnode.tag = "["
	vnode.children = Vnode.normalizeChildren(vnode.children)
	return vnode
}


/***/ }),

/***/ "./node_modules/mithril/render/hyperscript.js":
/*!****************************************************!*\
  !*** ./node_modules/mithril/render/hyperscript.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")
var hyperscriptVnode = __webpack_require__(/*! ./hyperscriptVnode */ "./node_modules/mithril/render/hyperscriptVnode.js")

var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty

function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}

function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}

function execSelector(state, vnode) {
	var attrs = vnode.attrs
	var children = Vnode.normalizeChildren(vnode.children)
	var hasClass = hasOwn.call(attrs, "class")
	var className = hasClass ? attrs.class : attrs.className

	vnode.tag = state.tag
	vnode.attrs = null
	vnode.children = undefined

	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}

		for (var key in attrs) {
			if (hasOwn.call(attrs, key)) newAttrs[key] = attrs[key]
		}

		attrs = newAttrs
	}

	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)){
			attrs[key] = state.attrs[key]
		}
	}
	if (className != null || state.attrs.className != null) attrs.className =
		className != null
			? state.attrs.className != null
				? String(state.attrs.className) + " " + String(className)
				: className
			: state.attrs.className != null
				? state.attrs.className
				: null

	if (hasClass) attrs.class = null

	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			vnode.attrs = attrs
			break
		}
	}

	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		vnode.text = children[0].children
	} else {
		vnode.children = children
	}

	return vnode
}

function hyperscript(selector) {
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}

	var vnode = hyperscriptVnode.apply(1, arguments)

	if (typeof selector === "string") {
		vnode.children = Vnode.normalizeChildren(vnode.children)
		if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode)
	}

	vnode.tag = selector
	return vnode
}

module.exports = hyperscript


/***/ }),

/***/ "./node_modules/mithril/render/hyperscriptVnode.js":
/*!*********************************************************!*\
  !*** ./node_modules/mithril/render/hyperscriptVnode.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

// Call via `hyperscriptVnode.apply(startOffset, arguments)`
//
// The reason I do it this way, forwarding the arguments and passing the start
// offset in `this`, is so I don't have to create a temporary array in a
// performance-critical path.
//
// In native ES6, I'd instead add a final `...args` parameter to the
// `hyperscript` and `fragment` factories and define this as
// `hyperscriptVnode(...args)`, since modern engines do optimize that away. But
// ES5 (what Mithril requires thanks to IE support) doesn't give me that luxury,
// and engines aren't nearly intelligent enough to do either of these:
//
// 1. Elide the allocation for `[].slice.call(arguments, 1)` when it's passed to
//    another function only to be indexed.
// 2. Elide an `arguments` allocation when it's passed to any function other
//    than `Function.prototype.apply` or `Reflect.apply`.
//
// In ES6, it'd probably look closer to this (I'd need to profile it, though):
// module.exports = function(attrs, ...children) {
//     if (attrs == null || typeof attrs === "object" && attrs.tag == null && !Array.isArray(attrs)) {
//         if (children.length === 1 && Array.isArray(children[0])) children = children[0]
//     } else {
//         children = children.length === 0 && Array.isArray(attrs) ? attrs : [attrs, ...children]
//         attrs = undefined
//     }
//
//     if (attrs == null) attrs = {}
//     return Vnode("", attrs.key, attrs, children)
// }
module.exports = function() {
	var attrs = arguments[this], start = this + 1, children

	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = this
	}

	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}

	return Vnode("", attrs.key, attrs, children)
}


/***/ }),

/***/ "./node_modules/mithril/render/render.js":
/*!***********************************************!*\
  !*** ./node_modules/mithril/render/render.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

module.exports = function($window) {
	var $doc = $window && $window.document
	var currentRedraw

	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}

	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}

	//sanity check to discourage people from doing `vnode.state = ...`
	function checkState(vnode, original) {
		if (vnode.state !== original) throw new Error("`vnode.state` must not be modified")
	}

	//Note: the hook is passed as the `this` argument to allow proxying the
	//arguments without requiring a full array allocation to do so. It also
	//takes advantage of the fact the current `vnode` is the first argument in
	//all lifecycle methods.
	function callHook(vnode) {
		var original = vnode.state
		try {
			return this.apply(original, arguments)
		} finally {
			checkState(vnode, original)
		}
	}

	// IE11 (at least) throws an UnspecifiedError when accessing document.activeElement when
	// inside an iframe. Catch and swallow this error, and heavy-handidly return null.
	function activeElement() {
		try {
			return $doc.activeElement
		} catch (e) {
			return null
		}
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": createText(parent, vnode, nextSibling); break
				case "<": createHTML(parent, vnode, ns, nextSibling); break
				case "[": createFragment(parent, vnode, hooks, ns, nextSibling); break
				default: createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
	}
	var possibleParents = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}
	function createHTML(parent, vnode, ns, nextSibling) {
		var match = vnode.children.match(/^\s*?<(\w+)/im) || []
		// not using the proper parent makes the child element(s) vanish.
		//     var div = document.createElement("div")
		//     div.innerHTML = "<td>i</td><td>j</td>"
		//     console.log(div.innerHTML)
		// --> "ij", no <td> in sight.
		var temp = $doc.createElement(possibleParents[match[1]] || "div")
		if (ns === "http://www.w3.org/2000/svg") {
			temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode.children + "</svg>"
			temp = temp.firstChild
		} else {
			temp.innerHTML = vnode.children
		}
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		// Capture nodes to remove, so we don't confuse them.
		vnode.instance = []
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			vnode.instance.push(child)
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs = vnode.attrs
		var is = attrs && attrs.is

		ns = getNameSpace(vnode) || ns

		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element

		if (attrs != null) {
			setAttrs(vnode, attrs, ns)
		}

		insertNode(parent, element, nextSibling)

		if (!maybeSetContentEditable(vnode)) {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs)
			}
		}
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		initLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
		}
		else {
			vnode.domSize = 0
		}
	}

	//update
	/**
	 * @param {Element|Fragment} parent - the parent element
	 * @param {Vnode[] | null} old - the list of vnodes of the last `render()` call for
	 *                               this part of the tree
	 * @param {Vnode[] | null} vnodes - as above, but for the current `render()` call.
	 * @param {Function[]} hooks - an accumulator of post-render hooks (oncreate/onupdate)
	 * @param {Element | null} nextSibling - the next DOM node if we're dealing with a
	 *                                       fragment that is not the last item in its
	 *                                       parent
	 * @param {'svg' | 'math' | String | null} ns) - the current XML namespace, if any
	 * @returns void
	 */
	// This function diffs and patches lists of vnodes, both keyed and unkeyed.
	//
	// We will:
	//
	// 1. describe its general structure
	// 2. focus on the diff algorithm optimizations
	// 3. discuss DOM node operations.

	// ## Overview:
	//
	// The updateNodes() function:
	// - deals with trivial cases
	// - determines whether the lists are keyed or unkeyed based on the first non-null node
	//   of each list.
	// - diffs them and patches the DOM if needed (that's the brunt of the code)
	// - manages the leftovers: after diffing, are there:
	//   - old nodes left to remove?
	// 	 - new nodes to insert?
	// 	 deal with them!
	//
	// The lists are only iterated over once, with an exception for the nodes in `old` that
	// are visited in the fourth part of the diff and in the `removeNodes` loop.

	// ## Diffing
	//
	// Reading https://github.com/localvoid/ivi/blob/ddc09d06abaef45248e6133f7040d00d3c6be853/packages/ivi/src/vdom/implementation.ts#L617-L837
	// may be good for context on longest increasing subsequence-based logic for moving nodes.
	//
	// In order to diff keyed lists, one has to
	//
	// 1) match nodes in both lists, per key, and update them accordingly
	// 2) create the nodes present in the new list, but absent in the old one
	// 3) remove the nodes present in the old list, but absent in the new one
	// 4) figure out what nodes in 1) to move in order to minimize the DOM operations.
	//
	// To achieve 1) one can create a dictionary of keys => index (for the old list), then iterate
	// over the new list and for each new vnode, find the corresponding vnode in the old list using
	// the map.
	// 2) is achieved in the same step: if a new node has no corresponding entry in the map, it is new
	// and must be created.
	// For the removals, we actually remove the nodes that have been updated from the old list.
	// The nodes that remain in that list after 1) and 2) have been performed can be safely removed.
	// The fourth step is a bit more complex and relies on the longest increasing subsequence (LIS)
	// algorithm.
	//
	// the longest increasing subsequence is the list of nodes that can remain in place. Imagine going
	// from `1,2,3,4,5` to `4,5,1,2,3` where the numbers are not necessarily the keys, but the indices
	// corresponding to the keyed nodes in the old list (keyed nodes `e,d,c,b,a` => `b,a,e,d,c` would
	//  match the above lists, for example).
	//
	// In there are two increasing subsequences: `4,5` and `1,2,3`, the latter being the longest. We
	// can update those nodes without moving them, and only call `insertNode` on `4` and `5`.
	//
	// @localvoid adapted the algo to also support node deletions and insertions (the `lis` is actually
	// the longest increasing subsequence *of old nodes still present in the new list*).
	//
	// It is a general algorithm that is fireproof in all circumstances, but it requires the allocation
	// and the construction of a `key => oldIndex` map, and three arrays (one with `newIndex => oldIndex`,
	// the `LIS` and a temporary one to create the LIS).
	//
	// So we cheat where we can: if the tails of the lists are identical, they are guaranteed to be part of
	// the LIS and can be updated without moving them.
	//
	// If two nodes are swapped, they are guaranteed not to be part of the LIS, and must be moved (with
	// the exception of the last node if the list is fully reversed).
	//
	// ## Finding the next sibling.
	//
	// `updateNode()` and `createNode()` expect a nextSibling parameter to perform DOM operations.
	// When the list is being traversed top-down, at any index, the DOM nodes up to the previous
	// vnode reflect the content of the new list, whereas the rest of the DOM nodes reflect the old
	// list. The next sibling must be looked for in the old list using `getNextSibling(... oldStart + 1 ...)`.
	//
	// In the other scenarios (swaps, upwards traversal, map-based diff),
	// the new vnodes list is traversed upwards. The DOM nodes at the bottom of the list reflect the
	// bottom part of the new vnodes list, and we can use the `v.dom`  value of the previous node
	// as the next sibling (cached in the `nextSibling` variable).


	// ## DOM node moves
	//
	// In most scenarios `updateNode()` and `createNode()` perform the DOM operations. However,
	// this is not the case if the node moved (second and fourth part of the diff algo). We move
	// the old DOM nodes before updateNode runs because it enables us to use the cached `nextSibling`
	// variable rather than fetching it using `getNextSibling()`.
	//
	// The fourth part of the diff currently inserts nodes unconditionally, leading to issues
	// like #1791 and #1999. We need to be smarter about those situations where adjascent old
	// nodes remain together in the new list in a way that isn't covered by parts one and
	// three of the diff algo.

	function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length)
		else {
			var isOldKeyed = old[0] != null && old[0].key != null
			var isKeyed = vnodes[0] != null && vnodes[0].key != null
			var start = 0, oldStart = 0
			if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++
			if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++
			if (isKeyed === null && isOldKeyed == null) return // both lists are full of nulls
			if (isOldKeyed !== isKeyed) {
				removeNodes(parent, old, oldStart, old.length)
				createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else if (!isKeyed) {
				// Don't index past the end of either list (causes deopts).
				var commonLength = old.length < vnodes.length ? old.length : vnodes.length
				// Rewind if necessary to the first non-null index on either side.
				// We could alternatively either explicitly create or remove nodes when `start !== oldStart`
				// but that would be optimizing for sparse lists which are more rare than dense ones.
				start = start < oldStart ? start : oldStart
				for (; start < commonLength; start++) {
					o = old[start]
					v = vnodes[start]
					if (o === v || o == null && v == null) continue
					else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling))
					else if (v == null) removeNode(parent, o)
					else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns)
				}
				if (old.length > commonLength) removeNodes(parent, old, start, old.length)
				if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else {
				// keyed diff
				var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling

				// bottom-up
				while (oldEnd >= oldStart && end >= start) {
					oe = old[oldEnd]
					ve = vnodes[end]
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
				}
				// top-down
				while (oldEnd >= oldStart && end >= start) {
					o = old[oldStart]
					v = vnodes[start]
					if (o.key !== v.key) break
					oldStart++, start++
					if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns)
				}
				// swaps and list reversals
				while (oldEnd >= oldStart && end >= start) {
					if (start === end) break
					if (o.key !== ve.key || oe.key !== v.key) break
					topSibling = getNextSibling(old, oldStart, nextSibling)
					moveNodes(parent, oe, topSibling)
					if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns)
					if (++start <= --end) moveNodes(parent, o, nextSibling)
					if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldStart++; oldEnd--
					oe = old[oldEnd]
					ve = vnodes[end]
					o = old[oldStart]
					v = vnodes[start]
				}
				// bottom up once again
				while (oldEnd >= oldStart && end >= start) {
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
					oe = old[oldEnd]
					ve = vnodes[end]
				}
				if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1)
				else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
				else {
					// inspired by ivi https://github.com/ivijs/ivi/ by Boris Kaul
					var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li=0, i=0, pos = 2147483647, matched = 0, map, lisIndices
					for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1
					for (i = end; i >= start; i--) {
						if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1)
						ve = vnodes[i]
						var oldIndex = map[ve.key]
						if (oldIndex != null) {
							pos = (oldIndex < pos) ? oldIndex : -1 // becomes -1 if nodes were re-ordered
							oldIndices[i-start] = oldIndex
							oe = old[oldIndex]
							old[oldIndex] = null
							if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
							if (ve.dom != null) nextSibling = ve.dom
							matched++
						}
					}
					nextSibling = originalNextSibling
					if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1)
					if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
					else {
						if (pos === -1) {
							// the indices of the indices of the items that are part of the
							// longest increasing subsequence in the oldIndices list
							lisIndices = makeLisIndices(oldIndices)
							li = lisIndices.length - 1
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								else {
									if (lisIndices[li] === i - start) li--
									else moveNodes(parent, v, nextSibling)
								}
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						} else {
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						}
					}
				}
			}
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode.events = old.events
			if (shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, ns, nextSibling); break
					case "[": updateFragment(parent, old, vnode, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, ns)
		}
		else {
			removeNode(parent, old)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, ns, nextSibling) {
		if (old.children !== vnode.children) {
			removeHTML(parent, old)
			createHTML(parent, vnode, ns, nextSibling)
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
		}
	}
	function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns

		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (!maybeSetContentEditable(vnode)) {
			if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
				updateNodes(element, old.children, vnode.children, hooks, null, ns)
			}
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		updateLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(parent, old.instance)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function getKeyMap(vnodes, start, end) {
		var map = Object.create(null)
		for (; start < end; start++) {
			var vnode = vnodes[start]
			if (vnode != null) {
				var key = vnode.key
				if (key != null) map[key] = start
			}
		}
		return map
	}
	// Lifted from ivi https://github.com/ivijs/ivi/
	// takes a list of unique numbers (-1 is special and can
	// occur multiple times) and returns an array with the indices
	// of the items that are part of the longest increasing
	// subsequece
	var lisTemp = []
	function makeLisIndices(a) {
		var result = [0]
		var u = 0, v = 0, i = 0
		var il = lisTemp.length = a.length
		for (var i = 0; i < il; i++) lisTemp[i] = a[i]
		for (var i = 0; i < il; ++i) {
			if (a[i] === -1) continue
			var j = result[result.length - 1]
			if (a[j] < a[i]) {
				lisTemp[i] = j
				result.push(i)
				continue
			}
			u = 0
			v = result.length - 1
			while (u < v) {
				// Fast integer average without overflow.
				// eslint-disable-next-line no-bitwise
				var c = (u >>> 1) + (v >>> 1) + (u & v & 1)
				if (a[result[c]] < a[i]) {
					u = c + 1
				}
				else {
					v = c
				}
			}
			if (a[i] < a[result[u]]) {
				if (u > 0) lisTemp[i] = result[u - 1]
				result[u] = i
			}
		}
		u = result.length
		v = result[u - 1]
		while (u-- > 0) {
			result[u] = v
			v = lisTemp[v]
		}
		lisTemp.length = 0
		return result
	}

	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}

	// This covers a really specific edge case:
	// - Parent node is keyed and contains child
	// - Child is removed, returns unresolved promise in `onbeforeremove`
	// - Parent node is moved in keyed diff
	// - Remaining children still need moved appropriately
	//
	// Ideally, I'd track removed nodes as well, but that introduces a lot more
	// complexity and I'm not exactly interested in doing that.
	function moveNodes(parent, vnode, nextSibling) {
		var frag = $doc.createDocumentFragment()
		moveChildToFrag(parent, frag, vnode)
		insertNode(parent, frag, nextSibling)
	}
	function moveChildToFrag(parent, frag, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				for (var i = 0; i < vnode.instance.length; i++) {
					frag.appendChild(vnode.instance[i])
				}
			} else if (vnode.tag !== "[") {
				// Don't recurse for text nodes *or* elements, just fragments
				frag.appendChild(vnode.dom)
			} else if (vnode.children.length === 1) {
				vnode = vnode.children[0]
				if (vnode != null) continue
			} else {
				for (var i = 0; i < vnode.children.length; i++) {
					var child = vnode.children[i]
					if (child != null) moveChildToFrag(parent, frag, child)
				}
			}
			break
		}
	}

	function insertNode(parent, dom, nextSibling) {
		if (nextSibling != null) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}

	function maybeSetContentEditable(vnode) {
		if (vnode.attrs == null || (
			vnode.attrs.contenteditable == null && // attribute
			vnode.attrs.contentEditable == null // property
		)) return false
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		return true
	}

	//remove
	function removeNodes(parent, vnodes, start, end) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) removeNode(parent, vnode)
		}
	}
	function removeNode(parent, vnode) {
		var mask = 0
		var original = vnode.state
		var stateResult, attrsResult
		if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
			var result = callHook.call(vnode.state.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				mask = 1
				stateResult = result
			}
		}
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = callHook.call(vnode.attrs.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				// eslint-disable-next-line no-bitwise
				mask |= 2
				attrsResult = result
			}
		}
		checkState(vnode, original)

		// If we can, try to fast-path it and avoid all the overhead of awaiting
		if (!mask) {
			onremove(vnode)
			removeChild(parent, vnode)
		} else {
			if (stateResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 1) { mask &= 2; if (!mask) reallyRemove() }
				}
				stateResult.then(next, next)
			}
			if (attrsResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 2) { mask &= 1; if (!mask) reallyRemove() }
				}
				attrsResult.then(next, next)
			}
		}

		function reallyRemove() {
			checkState(vnode, original)
			onremove(vnode)
			removeChild(parent, vnode)
		}
	}
	function removeHTML(parent, vnode) {
		for (var i = 0; i < vnode.instance.length; i++) {
			parent.removeChild(vnode.instance[i])
		}
	}
	function removeChild(parent, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				removeHTML(parent, vnode)
			} else {
				if (vnode.tag !== "[") {
					parent.removeChild(vnode.dom)
					if (!Array.isArray(vnode.children)) break
				}
				if (vnode.children.length === 1) {
					vnode = vnode.children[0]
					if (vnode != null) continue
				} else {
					for (var i = 0; i < vnode.children.length; i++) {
						var child = vnode.children[i]
						if (child != null) removeChild(parent, child)
					}
				}
			}
			break
		}
	}
	function onremove(vnode) {
		if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode)
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode)
		if (typeof vnode.tag !== "string") {
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}

	//attrs
	function setAttrs(vnode, attrs, ns) {
		for (var key in attrs) {
			setAttr(vnode, key, null, attrs[key], ns)
		}
	}
	function setAttr(vnode, key, old, value, ns) {
		if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || (old === value && !isFormAttribute(vnode, key)) && typeof value !== "object") return
		if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value)
		if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value)
		else if (key === "style") updateStyle(vnode.dom, old, value)
		else if (hasPropertyKey(vnode, key, ns)) {
			if (key === "value") {
				// Only do the coercion if we're actually going to check the value.
				/* eslint-disable no-implicit-coercion */
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && vnode.dom === activeElement()) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return
				/* eslint-enable no-implicit-coercion */
			}
			// If you assign an input type that is not supported by IE 11 with an assignment expression, an error will occur.
			if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value)
			else vnode.dom[key] = value
		} else {
			if (typeof value === "boolean") {
				if (value) vnode.dom.setAttribute(key, "")
				else vnode.dom.removeAttribute(key)
			}
			else vnode.dom.setAttribute(key === "className" ? "class" : key, value)
		}
	}
	function removeAttr(vnode, key, old, ns) {
		if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return
		if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) updateEvent(vnode, key, undefined)
		else if (key === "style") updateStyle(vnode.dom, old, null)
		else if (
			hasPropertyKey(vnode, key, ns)
			&& key !== "className"
			&& !(key === "value" && (
				vnode.tag === "option"
				|| vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement()
			))
			&& !(vnode.tag === "input" && key === "type")
		) {
			vnode.dom[key] = null
		} else {
			var nsLastIndex = key.indexOf(":")
			if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1)
			if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key)
		}
	}
	function setLateSelectAttrs(vnode, attrs) {
		if ("value" in attrs) {
			if(attrs.value === null) {
				if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null
			} else {
				var normalized = "" + attrs.value // eslint-disable-line no-implicit-coercion
				if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
					vnode.dom.value = normalized
				}
			}
		}
		if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, undefined)
	}
	function updateAttrs(vnode, old, attrs, ns) {
		if (attrs != null) {
			for (var key in attrs) {
				setAttr(vnode, key, old && old[key], attrs[key], ns)
			}
		}
		var val
		if (old != null) {
			for (var key in old) {
				if (((val = old[key]) != null) && (attrs == null || attrs[key] == null)) {
					removeAttr(vnode, key, val, ns)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement() || vnode.tag === "option" && vnode.dom.parentNode === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function hasPropertyKey(vnode, key, ns) {
		// Filter out namespaced keys
		return ns === undefined && (
			// If it's a custom element, just keep it.
			vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is ||
			// If it's a normal element, let's try to avoid a few browser bugs.
			key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height"// && key !== "type"
			// Defer the property check until *after* we check everything.
		) && key in vnode.dom
	}

	//style
	var uppercaseRegex = /[A-Z]/g
	function toLowerCase(capital) { return "-" + capital.toLowerCase() }
	function normalizeKey(key) {
		return key[0] === "-" && key[1] === "-" ? key :
			key === "cssFloat" ? "float" :
				key.replace(uppercaseRegex, toLowerCase)
	}
	function updateStyle(element, old, style) {
		if (old === style) {
			// Styles are equivalent, do nothing.
		} else if (style == null) {
			// New style is missing, just clear it.
			element.style.cssText = ""
		} else if (typeof style !== "object") {
			// New style is a string, let engine deal with patching.
			element.style.cssText = style
		} else if (old == null || typeof old !== "object") {
			// `old` is missing or a string, `style` is an object.
			element.style.cssText = ""
			// Add new style properties
			for (var key in style) {
				var value = style[key]
				if (value != null) element.style.setProperty(normalizeKey(key), String(value))
			}
		} else {
			// Both old & new are (different) objects.
			// Update style properties that have changed
			for (var key in style) {
				var value = style[key]
				if (value != null && (value = String(value)) !== String(old[key])) {
					element.style.setProperty(normalizeKey(key), value)
				}
			}
			// Remove style properties that no longer exist
			for (var key in old) {
				if (old[key] != null && style[key] == null) {
					element.style.removeProperty(normalizeKey(key))
				}
			}
		}
	}

	// Here's an explanation of how this works:
	// 1. The event names are always (by design) prefixed by `on`.
	// 2. The EventListener interface accepts either a function or an object
	//    with a `handleEvent` method.
	// 3. The object does not inherit from `Object.prototype`, to avoid
	//    any potential interference with that (e.g. setters).
	// 4. The event name is remapped to the handler before calling it.
	// 5. In function-based event handlers, `ev.target === this`. We replicate
	//    that below.
	// 6. In function-based event handlers, `return false` prevents the default
	//    action and stops event propagation. We replicate that below.
	function EventDict() {
		// Save this, so the current redraw is correctly tracked.
		this._ = currentRedraw
	}
	EventDict.prototype = Object.create(null)
	EventDict.prototype.handleEvent = function (ev) {
		var handler = this["on" + ev.type]
		var result
		if (typeof handler === "function") result = handler.call(ev.currentTarget, ev)
		else if (typeof handler.handleEvent === "function") handler.handleEvent(ev)
		if (this._ && ev.redraw !== false) (0, this._)()
		if (result === false) {
			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	//event
	function updateEvent(vnode, key, value) {
		if (vnode.events != null) {
			if (vnode.events[key] === value) return
			if (value != null && (typeof value === "function" || typeof value === "object")) {
				if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = value
			} else {
				if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = undefined
			}
		} else if (value != null && (typeof value === "function" || typeof value === "object")) {
			vnode.events = new EventDict()
			vnode.dom.addEventListener(key.slice(2), vnode.events, false)
			vnode.events[key] = value
		}
	}

	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") callHook.call(source.oninit, vnode)
		if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		do {
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
				var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
				var force = callHook.call(vnode.state.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			return false
		} while (false); // eslint-disable-line no-constant-condition
		vnode.dom = old.dom
		vnode.domSize = old.domSize
		vnode.instance = old.instance
		// One would think having the actual latest attributes would be ideal,
		// but it doesn't let us properly diff based on our current internal
		// representation. We have to save not only the old DOM info, but also
		// the attributes used to create it, as we diff *that*, not against the
		// DOM directly (with a few exceptions in `setAttr`). And, of course, we
		// need to save the children and text as they are conceptually not
		// unlike special "attributes" internally.
		vnode.attrs = old.attrs
		vnode.children = old.children
		vnode.text = old.text
		return true
	}

	return function(dom, vnodes, redraw) {
		if (!dom) throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = activeElement()
		var namespace = dom.namespaceURI

		// First time rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""

		vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes])
		var prevRedraw = currentRedraw
		try {
			currentRedraw = typeof redraw === "function" ? redraw : undefined
			updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		} finally {
			currentRedraw = prevRedraw
		}
		dom.vnodes = vnodes
		// `document.activeElement` can return null: https://html.spec.whatwg.org/multipage/interaction.html#dom-document-activeelement
		if (active != null && activeElement() !== active && typeof active.focus === "function") active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
}


/***/ }),

/***/ "./node_modules/mithril/render/trust.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/render/trust.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

module.exports = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}


/***/ }),

/***/ "./node_modules/mithril/render/vnode.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/render/vnode.js ***!
  \**********************************************/
/***/ ((module) => {



function Vnode(tag, key, attrs, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs, children: children, text: text, dom: dom, domSize: undefined, state: undefined, events: undefined, instance: undefined}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node == null || typeof node === "boolean") return null
	if (typeof node === "object") return node
	return Vnode("#", undefined, undefined, String(node), undefined, undefined)
}
Vnode.normalizeChildren = function(input) {
	var children = []
	if (input.length) {
		var isKeyed = input[0] != null && input[0].key != null
		// Note: this is a *very* perf-sensitive check.
		// Fun fact: merging the loop like this is somehow faster than splitting
		// it, noticeably so.
		for (var i = 1; i < input.length; i++) {
			if ((input[i] != null && input[i].key != null) !== isKeyed) {
				throw new TypeError("Vnodes must either always have keys or never have keys!")
			}
		}
		for (var i = 0; i < input.length; i++) {
			children[i] = Vnode.normalize(input[i])
		}
	}
	return children
}

module.exports = Vnode


/***/ }),

/***/ "./node_modules/mithril/request.js":
/*!*****************************************!*\
  !*** ./node_modules/mithril/request.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var PromisePolyfill = __webpack_require__(/*! ./promise/promise */ "./node_modules/mithril/promise/promise.js")
var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js")

module.exports = __webpack_require__(/*! ./request/request */ "./node_modules/mithril/request/request.js")(window, PromisePolyfill, mountRedraw.redraw)


/***/ }),

/***/ "./node_modules/mithril/request/request.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/request/request.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var buildPathname = __webpack_require__(/*! ../pathname/build */ "./node_modules/mithril/pathname/build.js")

module.exports = function($window, Promise, oncompletion) {
	var callbackCount = 0

	function PromiseProxy(executor) {
		return new Promise(executor)
	}

	// In case the global Promise is some userland library's where they rely on
	// `foo instanceof this.constructor`, `this.constructor.resolve(value)`, or
	// similar. Let's *not* break them.
	PromiseProxy.prototype = Promise.prototype
	PromiseProxy.__proto__ = Promise // eslint-disable-line no-proto

	function makeRequest(factory) {
		return function(url, args) {
			if (typeof url !== "string") { args = url; url = url.url }
			else if (args == null) args = {}
			var promise = new Promise(function(resolve, reject) {
				factory(buildPathname(url, args.params), args, function (data) {
					if (typeof args.type === "function") {
						if (Array.isArray(data)) {
							for (var i = 0; i < data.length; i++) {
								data[i] = new args.type(data[i])
							}
						}
						else data = new args.type(data)
					}
					resolve(data)
				}, reject)
			})
			if (args.background === true) return promise
			var count = 0
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion()
			}

			return wrap(promise)

			function wrap(promise) {
				var then = promise.then
				// Set the constructor, so engines know to not await or resolve
				// this as a native promise. At the time of writing, this is
				// only necessary for V8, but their behavior is the correct
				// behavior per spec. See this spec issue for more details:
				// https://github.com/tc39/ecma262/issues/1577. Also, see the
				// corresponding comment in `request/tests/test-request.js` for
				// a bit more background on the issue at hand.
				promise.constructor = PromiseProxy
				promise.then = function() {
					count++
					var next = then.apply(promise, arguments)
					next.then(complete, function(e) {
						complete()
						if (count === 0) throw e
					})
					return wrap(next)
				}
				return promise
			}
		}
	}

	function hasHeader(args, name) {
		for (var key in args.headers) {
			if ({}.hasOwnProperty.call(args.headers, key) && name.test(key)) return true
		}
		return false
	}

	return {
		request: makeRequest(function(url, args, resolve, reject) {
			var method = args.method != null ? args.method.toUpperCase() : "GET"
			var body = args.body
			var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData)
			var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json")

			var xhr = new $window.XMLHttpRequest(), aborted = false
			var original = xhr, replacedAbort
			var abort = xhr.abort

			xhr.abort = function() {
				aborted = true
				abort.call(this)
			}

			xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)

			if (assumeJSON && body != null && !hasHeader(args, /^content-type$/i)) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			if (args.timeout) xhr.timeout = args.timeout
			xhr.responseType = responseType

			for (var key in args.headers) {
				if ({}.hasOwnProperty.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key])
				}
			}

			xhr.onreadystatechange = function(ev) {
				// Don't throw errors on xhr.abort().
				if (aborted) return

				if (ev.target.readyState === 4) {
					try {
						var success = (ev.target.status >= 200 && ev.target.status < 300) || ev.target.status === 304 || (/^file:\/\//i).test(url)
						// When the response type isn't "" or "text",
						// `xhr.responseText` is the wrong thing to use.
						// Browsers do the right thing and throw here, and we
						// should honor that and do the right thing by
						// preferring `xhr.response` where possible/practical.
						var response = ev.target.response, message

						if (responseType === "json") {
							// For IE and Edge, which don't implement
							// `responseType: "json"`.
							if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText)
						} else if (!responseType || responseType === "text") {
							// Only use this default if it's text. If a parsed
							// document is needed on old IE and friends (all
							// unsupported), the user should use a custom
							// `config` instead. They're already using this at
							// their own risk.
							if (response == null) response = ev.target.responseText
						}

						if (typeof args.extract === "function") {
							response = args.extract(ev.target, args)
							success = true
						} else if (typeof args.deserialize === "function") {
							response = args.deserialize(response)
						}
						if (success) resolve(response)
						else {
							try { message = ev.target.responseText }
							catch (e) { message = response }
							var error = new Error(message)
							error.code = ev.target.status
							error.response = response
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}

			if (typeof args.config === "function") {
				xhr = args.config(xhr, args, url) || xhr

				// Propagate the `abort` to any replacement XHR as well.
				if (xhr !== original) {
					replacedAbort = xhr.abort
					xhr.abort = function() {
						aborted = true
						replacedAbort.call(this)
					}
				}
			}

			if (body == null) xhr.send()
			else if (typeof args.serialize === "function") xhr.send(args.serialize(body))
			else if (body instanceof $window.FormData) xhr.send(body)
			else xhr.send(JSON.stringify(body))
		}),
		jsonp: makeRequest(function(url, args, resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				resolve(data)
			}
			script.onerror = function() {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
			}
			script.src = url + (url.indexOf("?") < 0 ? "?" : "&") +
				encodeURIComponent(args.callbackKey || "callback") + "=" +
				encodeURIComponent(callbackName)
			$window.document.documentElement.appendChild(script)
		}),
	}
}


/***/ }),

/***/ "./node_modules/mithril/route.js":
/*!***************************************!*\
  !*** ./node_modules/mithril/route.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js")

module.exports = __webpack_require__(/*! ./api/router */ "./node_modules/mithril/api/router.js")(window, mountRedraw)


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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _views_layout_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/layout.js */ "./js/views/layout.js");
/* harmony import */ var _views_home_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/home.js */ "./js/views/home.js");
/* harmony import */ var _views_inventory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/inventory.js */ "./js/views/inventory.js");
/* harmony import */ var _views_product_details_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/product-details.js */ "./js/views/product-details.js");
/* harmony import */ var _views_pick_lists_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/pick-lists.js */ "./js/views/pick-lists.js");
/* harmony import */ var _views_order_details_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/order-details.js */ "./js/views/order-details.js");
/* harmony import */ var _views_indelivery_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/indelivery.js */ "./js/views/indelivery.js");
/* harmony import */ var _views_new_indelivery_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./views/new-indelivery.js */ "./js/views/new-indelivery.js");
/* harmony import */ var _views_invoices_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./views/invoices.js */ "./js/views/invoices.js");
/* harmony import */ var _views_invoice_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./views/invoice.js */ "./js/views/invoice.js");
/* harmony import */ var _views_new_invoice_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./views/new-invoice.js */ "./js/views/new-invoice.js");
/* harmony import */ var _views_login_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./views/login.js */ "./js/views/login.js");
/* harmony import */ var _views_register_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./views/register.js */ "./js/views/register.js");
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./models/auth.js */ "./js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// index.js



















mithril__WEBPACK_IMPORTED_MODULE_0___default().route(document.body, "/", {
    "/": {
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_home_js__WEBPACK_IMPORTED_MODULE_2__.home));
        }
    },
    "/inventory": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_inventory_js__WEBPACK_IMPORTED_MODULE_3__.inventory;
            }
            _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "inventory";
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_inventory_js__WEBPACK_IMPORTED_MODULE_3__.inventory));
        }
    },
    "/product-details/:id": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_product_details_js__WEBPACK_IMPORTED_MODULE_4__.productDetails;
            }
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function(vnode) {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_product_details_js__WEBPACK_IMPORTED_MODULE_4__.productDetails, vnode.attrs));
        }
    },
    "/pick-lists": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_pick_lists_js__WEBPACK_IMPORTED_MODULE_5__.pickLists;
            }
            _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "pick-lists";
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_pick_lists_js__WEBPACK_IMPORTED_MODULE_5__.pickLists));
        }
    },
    "/order-details/:id": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_order_details_js__WEBPACK_IMPORTED_MODULE_6__.orderDetails;
            }
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function(vnode) {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_order_details_js__WEBPACK_IMPORTED_MODULE_6__.orderDetails, vnode.attrs));
        }
    },
    "/indelivery": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_indelivery_js__WEBPACK_IMPORTED_MODULE_7__.indelivery;
            }
            _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "indelivery";
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_indelivery_js__WEBPACK_IMPORTED_MODULE_7__.indelivery));
        }
    },
    "/new-indelivery": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_new_indelivery_js__WEBPACK_IMPORTED_MODULE_8__.newIndelivery;
            }
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_new_indelivery_js__WEBPACK_IMPORTED_MODULE_8__.newIndelivery));
        }
    },
    "/invoices": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_invoices_js__WEBPACK_IMPORTED_MODULE_9__.invoices;
            }
            _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "invoices";
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_invoices_js__WEBPACK_IMPORTED_MODULE_9__.invoices));
        }
    },
    "/invoice/:id": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_invoice_js__WEBPACK_IMPORTED_MODULE_10__.invoice;
            }
            _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "invoice";
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function(vnode) {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_invoice_js__WEBPACK_IMPORTED_MODULE_10__.invoice, vnode.attrs));
        }
    },
    "/new-invoice": {
        onmatch: function() {
            if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                return _views_invoices_js__WEBPACK_IMPORTED_MODULE_9__.invoices;
            }
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
        },
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_new_invoice_js__WEBPACK_IMPORTED_MODULE_11__.newInvoice));
        }
    },
    "/login": {
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_login_js__WEBPACK_IMPORTED_MODULE_12__.login));
        }
    },
    "/register": {
        render: function() {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_register_js__WEBPACK_IMPORTED_MODULE_13__.register));
        }
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy9tb2RlbHMvYXV0aC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy9tb2RlbHMvaW52b2ljZXMuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vanMvbW9kZWxzL2xhZ2VyLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL21vZGVscy9vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vanMvbW9kZWxzL3Byb2R1Y3RzLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL3ZhcnMuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vanMvdmlld3MvaG9tZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy92aWV3cy9pbmRlbGl2ZXJ5LmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL3ZpZXdzL2ludmVudG9yeS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy92aWV3cy9pbnZvaWNlLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL3ZpZXdzL2ludm9pY2VzLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL3ZpZXdzL2xheW91dC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy92aWV3cy9sb2dpbi5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy92aWV3cy9uZXctaW5kZWxpdmVyeS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy92aWV3cy9uZXctaW52b2ljZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9qcy92aWV3cy9vcmRlci1kZXRhaWxzLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL3ZpZXdzL3BpY2stbGlzdHMuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vanMvdmlld3MvcHJvZHVjdC1kZXRhaWxzLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL2pzL3ZpZXdzL3JlZ2lzdGVyLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL25vZGVfbW9kdWxlcy9taXRocmlsL2FwaS9tb3VudC1yZWRyYXcuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vbm9kZV9tb2R1bGVzL21pdGhyaWwvYXBpL3JvdXRlci5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9oeXBlcnNjcmlwdC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9tb3VudC1yZWRyYXcuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcGF0aG5hbWUvYXNzaWduLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL25vZGVfbW9kdWxlcy9taXRocmlsL3BhdGhuYW1lL2J1aWxkLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL25vZGVfbW9kdWxlcy9taXRocmlsL3BhdGhuYW1lL2NvbXBpbGVUZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9wYXRobmFtZS9wYXJzZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9wcm9taXNlL3BvbHlmaWxsLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL25vZGVfbW9kdWxlcy9taXRocmlsL3Byb21pc2UvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9xdWVyeXN0cmluZy9idWlsZC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9xdWVyeXN0cmluZy9wYXJzZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyL2ZyYWdtZW50LmpzIiwid2VicGFjazovL2xhZ2VyNC8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci9oeXBlcnNjcmlwdC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIvaHlwZXJzY3JpcHRWbm9kZS5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIvcmVuZGVyLmpzIiwid2VicGFjazovL2xhZ2VyNC8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci90cnVzdC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIvdm5vZGUuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9sYWdlcjQvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZXF1ZXN0L3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0Ly4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcm91dGUuanMiLCJ3ZWJwYWNrOi8vbGFnZXI0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xhZ2VyNC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9sYWdlcjQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2xhZ2VyNC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2xhZ2VyNC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2xhZ2VyNC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2xhZ2VyNC8uL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUVhOztBQUVXO0FBQ3FCO0FBQzdDLFdBQVcseUJBQXlCOzs7QUFHcEM7QUFDQSxhQUFhLDZDQUFPO0FBQ3BCLFlBQVksNENBQU07QUFDbEIsaUJBQWlCLDZDQUFPLENB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLGVBQWU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsa0JBQWtCO0FBQ25DO0FBQ0E7Ozs7Ozs7Ozs7O0FDNThCWTs7QUFFWixZQUFZLG1CQUFPLENBQUMsK0RBQWlCOztBQUVyQztBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNQWTs7QUFFWjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM5Qlk7O0FBRVosc0JBQXNCLG1CQUFPLENBQUMsb0VBQW1CO0FBQ2pELGtCQUFrQixtQkFBTyxDQUFDLDhEQUFnQjs7QUFFMUMsaUJBQWlCLG1CQUFPLENBQUMsb0VBQW1COzs7Ozs7Ozs7OztBQ0xoQzs7QUFFWixvQkFBb0IsbUJBQU8sQ0FBQyxtRUFBbUI7O0FBRS9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQyxZQUFZO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7Ozs7Ozs7OztBQ2pNWTs7QUFFWixrQkFBa0IsbUJBQU8sQ0FBQyw4REFBZ0I7O0FBRTFDLGlCQUFpQixtQkFBTyxDQUFDLDBEQUFjOzs7Ozs7O1VDSnZDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRXdCOztBQUVtQjtBQUNKO0FBQ1U7QUFDVztBQUNWO0FBQ007QUFDTDtBQUNPO0FBQ1g7QUFDRjtBQUNPO0FBQ1g7QUFDTTs7QUFFUDs7QUFFeEMsb0RBQU87QUFDUDtBQUNBO0FBQ0EsbUJBQW1CLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLGdEQUFJO0FBQ25DO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0Isd0RBQVU7QUFDMUIsdUJBQXVCLDBEQUFTO0FBQ2hDO0FBQ0EsWUFBWSwyREFBYTtBQUN6QixtQkFBbUIsd0RBQVc7QUFDOUIsU0FBUztBQUNUO0FBQ0EsbUJBQW1CLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLDBEQUFTO0FBQ3hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0Isd0RBQVU7QUFDMUIsdUJBQXVCLHFFQUFjO0FBQ3JDO0FBQ0EsbUJBQW1CLHdEQUFXO0FBQzlCLFNBQVM7QUFDVDtBQUNBLG1CQUFtQiw4Q0FBQyxDQUFDLG9EQUFNLEVBQUUsOENBQUMsQ0FBQyxxRUFBYztBQUM3QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsZ0JBQWdCLHdEQUFVO0FBQzFCLHVCQUF1QiwyREFBUztBQUNoQztBQUNBLFlBQVksMkRBQWE7QUFDekIsbUJBQW1CLHdEQUFXO0FBQzlCLFNBQVM7QUFDVDtBQUNBLG1CQUFtQiw4Q0FBQyxDQUFDLG9EQUFNLEVBQUUsOENBQUMsQ0FBQywyREFBUztBQUN4QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsZ0JBQWdCLHdEQUFVO0FBQzFCLHVCQUF1QixpRUFBWTtBQUNuQztBQUNBLG1CQUFtQix3REFBVztBQUM5QixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsOENBQUMsQ0FBQyxvREFBTSxFQUFFLDhDQUFDLENBQUMsaUVBQVk7QUFDM0M7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGdCQUFnQix3REFBVTtBQUMxQix1QkFBdUIsNERBQVU7QUFDakM7QUFDQSxZQUFZLDJEQUFhO0FBQ3pCLG1CQUFtQix3REFBVztBQUM5QixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsOENBQUMsQ0FBQyxvREFBTSxFQUFFLDhDQUFDLENBQUMsNERBQVU7QUFDekM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGdCQUFnQix3REFBVTtBQUMxQix1QkFBdUIsbUVBQWE7QUFDcEM7QUFDQSxtQkFBbUIsd0RBQVc7QUFDOUIsU0FBUztBQUNUO0FBQ0EsbUJBQW1CLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLG1FQUFhO0FBQzVDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0Isd0RBQVU7QUFDMUIsdUJBQXVCLHdEQUFRO0FBQy9CO0FBQ0EsWUFBWSwyREFBYTtBQUN6QixtQkFBbUIsd0RBQVc7QUFDOUIsU0FBUztBQUNUO0FBQ0EsbUJBQW1CLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLHdEQUFRO0FBQ3ZDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0Isd0RBQVU7QUFDMUIsdUJBQXVCLHVEQUFPO0FBQzlCO0FBQ0EsWUFBWSwyREFBYTtBQUN6QixtQkFBbUIsd0RBQVc7QUFDOUIsU0FBUztBQUNUO0FBQ0EsbUJBQW1CLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLHVEQUFPO0FBQ3RDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxnQkFBZ0Isd0RBQVU7QUFDMUIsdUJBQXVCLHdEQUFRO0FBQy9CO0FBQ0EsbUJBQW1CLHdEQUFXO0FBQzlCLFNBQVM7QUFDVDtBQUNBLG1CQUFtQiw4Q0FBQyxDQUFDLG9EQUFNLEVBQUUsOENBQUMsQ0FBQyw4REFBVTtBQUN6QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUJBQW1CLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLG1EQUFLO0FBQ3BDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxtQkFBbUIsOENBQUMsQ0FBQyxvREFBTSxFQUFFLDhDQUFDLENBQUMseURBQVE7QUFDdkM7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuLy8ganMvbW9kZWxzL2F1dGguanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgYXBpS2V5LCBiYXNlVXJsIH0gZnJvbSBcIi4uL3ZhcnMuanNcIjtcbi8vIGltcG9ydCB7IGFwaUtleSwgYmFzZVVybCwgdG9rZW4gfSBmcm9tIFwiLi4vdmFycy5qc1wiO1xuXG5cbmxldCBhdXRoID0ge1xuICAgIGJhc2VVcmw6IGJhc2VVcmwsXG4gICAgYXBpS2V5OiBhcGlLZXksXG4gICAgdXJsTG9naW46IGAke2Jhc2VVcmx9L2F1dGgvbG9naW5gLFxuICAgIHVybFJlZ2lzdGVyOiBgJHtiYXNlVXJsfS9hdXRoL3JlZ2lzdGVyYCxcbiAgICBlbWFpbDogXCJcIixcbiAgICBwYXNzd29yZDogXCJcIixcbiAgICAvLyBUT0RPOiBjaGFuZ2UgdG9rZW4gdG8gXCJcIlxuICAgIHRva2VuOiBcIlwiLCAvL3Rva2VuLFxuICAgIGN1cnJlbnRGb3JtOiB7fSxcbiAgICBjYWxsYmFjazogXCJcIixcbiAgICBlcnJvcjogXCJcIixcbiAgICBsb2dpbjogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogYXV0aC51cmxMb2dpbixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICBlbWFpbDogYXV0aC5lbWFpbCxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogYXV0aC5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICBhcGlfa2V5OiBhcGlLZXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhLnRva2VuKTtcbiAgICAgICAgICAgIGF1dGgudG9rZW4gPSByZXN1bHQuZGF0YS50b2tlbjtcbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChgLyR7YXV0aC5jYWxsYmFja31gKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZWdpc3RlcjogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogYXV0aC51cmxSZWdpc3RlcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICBlbWFpbDogYXV0aC5lbWFpbCxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogYXV0aC5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICBhcGlfa2V5OiBhcGlLZXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0ZXIucmVzdWx0LmRhdGE6XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoYC8ke2F1dGguY2FsbGJhY2t9YCk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgbGV0IGVyckpzb24gPSBKU09OLnBhcnNlKGVycik7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJySnNvbik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG5hbWU6XCIsIGVyckpzb24ubmFtZSk7XG4gICAgICAgICAgICAvLyByZXR1cm4gbS5yb3V0ZS5zZXQoYC9yZWdpc3RlcmApO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBhdXRoLCBiYXNlVXJsLCBhcGlLZXkgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbi8vIGpzL21vZGVscy9pbnZvaWNlcy5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IG9yZGVycyB9IGZyb20gXCIuLi9tb2RlbHMvb3JkZXJzLmpzXCI7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4uL21vZGVscy9hdXRoLmpzXCI7XG5cbmxldCBpbnZvaWNlc01vZGVsID0ge1xuICAgIHVybDogYCR7YXV0aC5iYXNlVXJsfS9pbnZvaWNlcz9hcGlfa2V5PSR7YXV0aC5hcGlLZXl9YCxcbiAgICBpbnZvaWNlczogW10sXG5cbiAgICBnZXRBbGxJbnZvaWNlczogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBhdXRoLnRva2VuOiAke2F1dGgudG9rZW59YCk7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBpbnZvaWNlc01vZGVsLnVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhdXRoLnRva2VuLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZvaWNlcy5nZXRBbGxJbnZvaWNlczpcIiwgcmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgaW52b2ljZXNNb2RlbC5pbnZvaWNlcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2F2ZUludm9pY2U6IGFzeW5jIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICAgIGNvbnN0IGZvcm1hdFltZCA9IGRhdGUgPT4gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICAgICAgbGV0IGN1cnJlbnREYXRlID0gZm9ybWF0WW1kKG5ldyBEYXRlKCkpO1xuXG4gICAgICAgIGxldCBzdW0gPSAwO1xuXG4gICAgICAgIG9yZGVyLm9yZGVyX2l0ZW1zLmZvckVhY2goZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgc3VtICs9ICtwcm9kdWN0LnByaWNlICogK3Byb2R1Y3QuYW1vdW50O1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYm9keSA9IHtcbiAgICAgICAgICAgIG9yZGVyX2lkOiBvcmRlci5pZCxcbiAgICAgICAgICAgIGFwaV9rZXk6IGF1dGguYXBpS2V5LFxuICAgICAgICAgICAgdG90YWxfcHJpY2U6IHN1bSxcbiAgICAgICAgICAgIGNyZWF0aW9uX2RhdGU6IGN1cnJlbnREYXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJzYXZlSW52b2ljZTogYm9keVwiLCBib2R5KTtcblxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vaW52b2ljZXNgLFxuICAgICAgICAgICAgYm9keTogYm9keSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhdXRoLnRva2VuLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlSW52b2ljZTogcmVzdWx0OiBcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIG9yZGVycy51cGRhdGVPcmRlcihvcmRlci5pZCwgNjAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgaW52b2ljZXNNb2RlbCB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuLy8ganMvbW9kZWxzL2xhZ2VyLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5cbmxldCBsYWdlciA9IHtcbiAgICBjdXJyZW50OiB7XG4gICAgICAgIGRlbGl2ZXJpZXM6IFtdLFxuICAgICAgICBwcm9kdWN0czogW11cbiAgICB9LFxuICAgIGN1cnJlbnRGb3JtOiB7fSxcbiAgICBsb2FkQWxsRGVsaXZlcmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L2RlbGl2ZXJpZXM/YXBpX2tleT0ke2F1dGguYXBpS2V5fWBcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGxhZ2VyLmN1cnJlbnQuZGVsaXZlcmllcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9KS5maW5hbGx5IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHVybDogYCR7YXV0aC5iYXNlVXJsfS9wcm9kdWN0cz9hcGlfa2V5PSR7YXV0aC5hcGlLZXl9YFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBsYWdlci5jdXJyZW50LnByb2R1Y3RzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsYWdlci5jdXJyZW50LnByb2R1Y3RzOiBcIiwgbGFnZXIuY3VycmVudC5wcm9kdWN0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhZGRJbmRlbGl2ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGFnZXIuY3VycmVudEZvcm0uYXBpX2tleSA9IGF1dGguYXBpS2V5O1xuICAgICAgICBjb25zb2xlLmxvZyhcImxhZ2VyLmN1cnJlbnRGb3JtOiBcIiwgbGFnZXIuY3VycmVudEZvcm0pO1xuXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogYCR7YXV0aC5iYXNlVXJsfS9kZWxpdmVyaWVzYCxcbiAgICAgICAgICAgIGJvZHk6IGxhZ2VyLmN1cnJlbnRGb3JtXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhZ2VyLmN1cnJlbnRGb3JtOiBcIiwgbGFnZXIuY3VycmVudEZvcm0pO1xuICAgICAgICAgICAgbGV0IHJlcXVlc3RCb2R5ID0ge1xuICAgICAgICAgICAgICAgIGFwaV9rZXk6IGF1dGguYXBpS2V5LFxuICAgICAgICAgICAgICAgIGlkOiBsYWdlci5jdXJyZW50Rm9ybS5wcm9kdWN0X2lkLFxuICAgICAgICAgICAgICAgIG5hbWU6IGxhZ2VyLmN1cnJlbnQucHJvZHVjdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0ID0+IHByb2R1Y3QuaWQgPT0gbGFnZXIuY3VycmVudEZvcm0ucHJvZHVjdF9pZFxuICAgICAgICAgICAgICAgIClbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICBzdG9jazogKCtsYWdlci5jdXJyZW50Rm9ybS5hbW91bnQgKyAvLyBwcmVmaXggK3N0cmluZyBjb252ZXJ0cyBpdCB0byBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgK2xhZ2VyLmN1cnJlbnQucHJvZHVjdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdCA9PiBwcm9kdWN0LmlkID09IGxhZ2VyLmN1cnJlbnRGb3JtLnByb2R1Y3RfaWRcbiAgICAgICAgICAgICAgICAgICAgKVswXS5zdG9jaylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdEJvZHk6IFwiLCByZXF1ZXN0Qm9keSk7XG4gICAgICAgICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vcHJvZHVjdHNgLFxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3RCb2R5XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgcHJvZHVjdCByZXNwb25zZTogXCIsICByZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxhZ2VyLnJlc2V0Q3VycmVudEZvcm0oKTtcblxuICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KFwiL2luZGVsaXZlcnlcIik7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzZXRDdXJyZW50Rm9ybTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxhZ2VyLmN1cnJlbnRGb3JtID0ge307XG4gICAgfVxufTtcblxuZXhwb3J0IHsgbGFnZXIgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBvcmRlcnMuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuL3Byb2R1Y3RzLmpzXCI7XG4vLyBpbXBvcnQgeyBwaWNrTGlzdHMgfSBmcm9tIFwiLi4vdmlld3MvcGljay1saXN0cy5qc1wiO1xuXG5sZXQgb3JkZXJzID0ge1xuICAgIGFsbE9yZGVyczogW10sXG4gICAgY3VycmVudE9yZGVyOiAnJyxcbiAgICBjdXJyZW50OiB7IG9yZGVyOiAnJ30sXG5cbiAgICBnZXRBbGxPcmRlcnM6IGFzeW5jIGZ1bmN0aW9uKG5vQ2FjaGUgPSBmYWxzZSkge1xuICAgICAgICBpZiAobm9DYWNoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub0NhY2hlXCIsIG5vQ2FjaGUpO1xuICAgICAgICAgICAgcHJvZHVjdHMuYWxsUHJvZHVjdHMgPSBbXTtcbiAgICAgICAgICAgIG9yZGVycy5hbGxPcmRlcnMgPSBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChvcmRlcnMuYWxsT3JkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcmRlcnMuYWxsT3JkZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vb3JkZXJzP2FwaV9rZXk9JHthdXRoLmFwaUtleX1gXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBvcmRlcnMuYWxsT3JkZXJzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGVycy5hbGxPcmRlcnM6IFwiLCBvcmRlcnMuYWxsT3JkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldE9yZGVyOiBhc3luYyBmdW5jdGlvbihvcmRlcklkKSB7XG4gICAgICAgIGlmIChvcmRlcnMuYWxsT3JkZXJzID09PSBbXSkge1xuICAgICAgICAgICAgYXdhaXQgb3JkZXJzLmdldEFsbE9yZGVycyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBvcmRlcnMuY3VycmVudE9yZGVyID0gb3JkZXJzLmFsbE9yZGVycy5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmRlci5pZCA9PSBvcmRlcklkO1xuICAgICAgICB9KVswXTtcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRPcmRlcjogb3JkZXJzLmN1cnJlbnRPcmRlclwiLCBvcmRlcnMuY3VycmVudE9yZGVyKTtcbiAgICAgICAgcmV0dXJuIG9yZGVycy5jdXJyZW50T3JkZXI7XG4gICAgfSxcblxuICAgIHVwZGF0ZU9yZGVyOiBhc3luYyBmdW5jdGlvbihvcmRlcklkLCBueVN0YXR1c0lkKSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgIGlkOiBvcmRlcklkLFxuICAgICAgICAgICAgc3RhdHVzX2lkOiBueVN0YXR1c0lkLFxuICAgICAgICAgICAgYXBpX2tleTogYXV0aC5hcGlLZXlcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm9yZGVyOlwiLCBvcmRlcik7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgLy8gYm9keTogSlNPTi5zdHJpbmdpZnkob3JkZXIpLFxuICAgICAgICAgICAgYm9keTogb3JkZXIsXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L29yZGVyc2BcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICBsZXQgZnVsbE9yZGVyID0gb3JkZXJzLmdldE9yZGVyKG9yZGVySWQpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZ1bGxPcmRlclwiLCBmdWxsT3JkZXIpO1xuXG4gICAgICAgICAgICBmdWxsT3JkZXIub3JkZXJfaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1N0b2NrID0gaXRlbS5zdG9jayAtIGl0ZW0uYW1vdW50O1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0RGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0ucHJvZHVjdF9pZCxcbiAgICAgICAgICAgICAgICAgICAgc3RvY2s6IG5ld1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICBhcGlfa2V5OiBhdXRoLmFwaUtleVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb2R1Y3REZXRhaWxzOlwiLCBwcm9kdWN0RGV0YWlscyk7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0cy51cGRhdGVQcm9kdWN0KHByb2R1Y3REZXRhaWxzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb3JkZXJzLmdldEFsbE9yZGVycyh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgb3JkZXJzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gcHJvZHVjdHMuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5cbmxldCBwcm9kdWN0cyA9IHtcbiAgICBhbGxQcm9kdWN0czogW10sXG5cbiAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24obm9DYWNoZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChub0NhY2hlKSB7XG4gICAgICAgICAgICBwcm9kdWN0cy5hbGxQcm9kdWN0cyA9IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2R1Y3RzLmFsbFByb2R1Y3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmV0dXJuOiBnZXRBbGxQcm9kdWN0c1wiKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0cy5hbGxQcm9kdWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L3Byb2R1Y3RzP2FwaV9rZXk9JHthdXRoLmFwaUtleX1gXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBwcm9kdWN0cy5hbGxQcm9kdWN0cyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9kdWN0cy5hbGxQcm9kdWN0czogXCIsIHByb2R1Y3RzLmFsbFByb2R1Y3RzKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3RJZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInByb2R1Y3RJZDpcIiwgcHJvZHVjdElkKTtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmFsbFByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvZHVjdC5pZCA9PSBwcm9kdWN0SWQ7XG4gICAgICAgIH0pWzBdO1xuICAgIH0sXG5cbiAgICBhcmVQcm9kdWN0c09uU3RvY2s6IGZ1bmN0aW9uKG9yZGVySXRlbXMpIHtcbiAgICAgICAgaWYgKHByb2R1Y3RzLmFsbFByb2R1Y3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmdldEFsbFByb2R1Y3RzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWxsQXZhaWxhYmxlID0gdHJ1ZTtcblxuICAgICAgICBvcmRlckl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKG9yZGVySXRlbSkge1xuICAgICAgICAgICAgaWYgKG9yZGVySXRlbS5hbW91bnQgPiBvcmRlckl0ZW0uc3RvY2spIHtcbiAgICAgICAgICAgICAgICBhbGxBdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW0gbm90IGF2YWlsYWJsZTogXCIsIG9yZGVySXRlbS5wcm9kdWN0X2lkLCBvcmRlckl0ZW0uc3RvY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlckl0ZW0ucHJvZHVjdF9pZCwgb3JkZXJJdGVtLmFtb3VudCwgb3JkZXJJdGVtLnN0b2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFsbEF2YWlsYWJsZTtcbiAgICB9LFxuXG4gICAgYXJlUHJvZHVjdHNPblN0b2NrQ2FsbGJhY2s6IGZ1bmN0aW9uKG9yZGVySXRlbXMpIHtcbiAgICAgICAgbGV0IGFsbEF2YWlsYWJsZSA9IHRydWU7XG5cbiAgICAgICAgb3JkZXJJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChvcmRlckl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChvcmRlckl0ZW0uYW1vdW50ID4gb3JkZXJJdGVtLnN0b2NrKSB7XG4gICAgICAgICAgICAgICAgYWxsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJdGVtIG5vdCBhdmFpbGFibGU6IFwiLCBvcmRlckl0ZW0ucHJvZHVjdF9pZCwgb3JkZXJJdGVtLnN0b2NrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cob3JkZXJJdGVtLnByb2R1Y3RfaWQsIG9yZGVySXRlbS5hbW91bnQsIG9yZGVySXRlbS5zdG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhbGxBdmFpbGFibGU7XG4gICAgfSxcblxuICAgIHVwZGF0ZVByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3REZXRhaWxzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlUHJvZHVjdC5wcm9kdWN0RGV0YWlsczpcIiwgcHJvZHVjdERldGFpbHMpO1xuXG4gICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vcHJvZHVjdHNgLFxuICAgICAgICAgICAgYm9keTogcHJvZHVjdERldGFpbHNcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgcHJvZHVjdCByZXNwb25zZTogXCIsICByZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IHByb2R1Y3RzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5jb25zdCBhcGlLZXkgPSBcIjBiZjE5MjJjZThhMzE4YWRkYjM0MGQ2NTAzNmI0YTVlXCI7XG5jb25zdCBiYXNlVXJsID0gXCJodHRwczovL2xhZ2VyLmVtaWxmb2xpbm8uc2UvdjJcIjtcbi8vIGNvbnN0IHRva2VuID0gXCJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGNHbGZhMlY1SWpvaU1HSm1NVGt5TW1ObE9HRXpNVGhoWkdSaU16UXdaRFkxTURNMllqUmhOV1VpTENKbGJXRnBiQ0k2SW1OdVpYTnJiMEJsTG1WdFlXbHNJaXdpYVdGMElqb3hOakU1TlRVd05URTFMQ0psZUhBaU9qRTJNVGsyTXpZNU1UVjkucXFHVHlTa0dUb1hrN1VXYnhXaEtXTUtNZ2pDaUdpQzNlX0poYXZta3MxMFwiO1xuXG4vLyBleHBvcnQgeyBiYXNlVXJsLCBhcGlLZXksIHRva2VuIH07XG5leHBvcnQgeyBiYXNlVXJsLCBhcGlLZXkgfTsiLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvaG9tZS5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4uL21vZGVscy9vcmRlcnMuanNcIjtcbmltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSBcIi4uL21vZGVscy9wcm9kdWN0cy5qc1wiO1xuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuLi9tb2RlbHMvYXV0aC5qc1wiO1xuXG5sZXQgbWFpbiA9IHtcbiAgICBvbmluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBvcmRlcnMuZ2V0QWxsT3JkZXJzKCk7XG4gICAgICAgIHByb2R1Y3RzLmdldEFsbFByb2R1Y3RzKCk7XG4gICAgICAgIG9yZGVycy5jdXJyZW50T3JkZXIgPSBvcmRlcnMuYWxsT3JkZXJzLmZpbHRlcihvcmRlciA9PiBvcmRlci5zdGF0dXNfaWQgPCA2MDApWzBdO1xuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBncmVldGluZyA9IFwiRGV0IGjDpHIgw6RyIGVuIFNQQSBmw7ZyIGt1cnNlbiBXZWJhcHBcIjtcbiAgICAgICAgbGV0IGltYWdlID0ge1xuICAgICAgICAgICAgc3JjOiBcImltZy9BSS1oZWFkMi5qcGdcIixcbiAgICAgICAgICAgIGFsdDogXCJBSSBoZWFkXCJcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoYXV0aC50b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgXCJMYWdlcmFwcFwiKSxcbiAgICAgICAgICAgICAgICBtKFwicFwiLCBncmVldGluZyksXG4gICAgICAgICAgICAgICAgbShcImltZ1wiLCBpbWFnZSwgZ3JlZXRpbmcpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgXCJMYWdlcmFwcFwiKSxcbiAgICAgICAgICAgICAgICBtKFwicFwiLCBncmVldGluZyksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJhLmJ1dHRvbi5ibHVlLWJ1dHRvbi5mdWxsLXdpZHRoLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICB7IGhyZWY6IFwiIyEvbG9naW5cIiB9LFxuICAgICAgICAgICAgICAgICAgICBcIkxvZ2dhIGluXCJcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIG0oXG4gICAgICAgICAgICAgICAgICAgIFwiYS5idXR0b24uZ3JlZW4tYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogXCIjIS9yZWdpc3RlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiUmVnaXN0cmVyYVwiXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBtKFwiaW1nXCIsIGltYWdlLCBncmVldGluZylcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5sZXQgaG9tZSA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4pKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBob21lIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvaW5kZWxpdmVyeS5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCB7IGxhZ2VyIH0gZnJvbSBcIi4uL21vZGVscy9sYWdlci5qc1wiO1xuXG5jb25zdCBpbmRlbGl2ZXJ5Q29tcG9uZW50ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGxldCBjdXJyZW50ID0gdm5vZGUuYXR0cnM7XG5cbiAgICAgICAgcmV0dXJuIG0oXCJkaXYuY2FyZFwiLCBbXG4gICAgICAgICAgICBtKFwicC5jYXJkLXRpdGxlXCIsIGN1cnJlbnQucHJvZHVjdF9uYW1lKSxcbiAgICAgICAgICAgIG0oXCJkbC5wcm9kdWN0LWluZm9cIixcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIlByb2R1a3RcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkZFwiLCBjdXJyZW50LnByb2R1Y3RfaWQpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJBbnRhbFwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIGN1cnJlbnQuYW1vdW50KSxcbiAgICAgICAgICAgICAgICAgICAgbShcImR0XCIsIFwiTGV2ZXJhbnNkYXR1bVwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIGN1cnJlbnQuZGVsaXZlcnlfZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIktvbW1lbnRhclwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIGN1cnJlbnQuY29tbWVudClcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApLFxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG5sZXQgbWFpbiA9IHtcbiAgICBvbmluaXQ6IGxhZ2VyLmxvYWRBbGxEZWxpdmVyaWVzLFxuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobGFnZXIuY3VycmVudC5kZWxpdmVyaWVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiSW5sZXZlcmFuc2VyXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJwXCIsIFwiSW5nYSBpbmxldmVyYW5zZXIgZmlubnMgcmVnaXN0cmVyYWRlIVwiKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiSW5sZXZlcmFuc2VyXCIpLFxuICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICBcImEuYnV0dG9uLmJsdWUtYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgeyBocmVmOiBcIiMhL25ldy1pbmRlbGl2ZXJ5XCIgfSxcbiAgICAgICAgICAgICAgICBcIk55IGlubGV2ZXJhbnNcIlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG0oXCJkaXYuZGVsaXZlcnktY29udGFpbmVyXCIsIGxhZ2VyLmN1cnJlbnQuZGVsaXZlcmllcy5tYXAoZnVuY3Rpb24oZGVsaXZlcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShpbmRlbGl2ZXJ5Q29tcG9uZW50LCBkZWxpdmVyeSk7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgaW5kZWxpdmVyeSA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4pKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBpbmRlbGl2ZXJ5IH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvaW52ZW50b3J5LmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuLi9tb2RlbHMvcHJvZHVjdHMuanNcIjtcblxuY29uc3QgaW52ZW50b3J5Q29tcG9uZW50ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGxldCBwcm9kdWN0ID0gdm5vZGUuYXR0cnM7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidm5vZGUuYXR0cnM6XCIsIHZub2RlLmF0dHJzKTtcblxuICAgICAgICByZXR1cm4gbShcImRpdi5mbGV4LXJvd1wiLCB7XG4gICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZXc6cHJvZHVjdC1kZXRhaWxzLzppZFwiLCBwcm9kdWN0LmlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoYC9wcm9kdWN0LWRldGFpbHMvJHtwcm9kdWN0LmlkfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBbXG4gICAgICAgICAgICBtKFwiZGl2LmZsZXgtaXRlbS5sZWZ0XCIsIHByb2R1Y3QubmFtZSksXG4gICAgICAgICAgICBtKFwiZGl2LmZsZXgtaXRlbS5yaWdodFwiLCBwcm9kdWN0LnN0b2NrKSxcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxubGV0IG1haW4gPSB7XG4gICAgb25pbml0OiBwcm9kdWN0cy5nZXRBbGxQcm9kdWN0cyxcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIkxhZ2Vyc2FsZG9cIiksXG4gICAgICAgICAgICBtKFwiZGl2Lmludi1jb250YWluZXJcIiwgcHJvZHVjdHMuYWxsUHJvZHVjdHMubWFwKHByb2R1Y3QgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW52ZW50b3J5LnZpZXc6cHJvZHVjdFwiLCBwcm9kdWN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShpbnZlbnRvcnlDb21wb25lbnQsIHByb2R1Y3QpO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIF07XG4gICAgfVxufTtcblxubGV0IGludmVudG9yeSA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4pKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBpbnZlbnRvcnkgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9pbnZvaWNlLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4uL21vZGVscy9vcmRlcnMuanNcIjtcblxuY29uc3Qgb3JkZXJSb3cgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IHByb2R1Y3QgPSB2bm9kZS5hdHRycztcblxuICAgICAgICByZXR1cm4gbShcInRyXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0ZFwiLCBwcm9kdWN0Lm5hbWUpLFxuICAgICAgICAgICAgbShcInRkLnJpZ2h0XCIsIHByb2R1Y3QuYW1vdW50KSxcbiAgICAgICAgICAgIG0oXCJ0ZC5yaWdodFwiLCBwcm9kdWN0LnByaWNlKSxcbiAgICAgICAgICAgIG0oXCJ0ZC5yaWdodFwiLCArcHJvZHVjdC5hbW91bnQgKiArcHJvZHVjdC5wcmljZSlcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxubGV0IG1haW4gPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IG9yZGVyID0gdm5vZGUuYXR0cnM7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJoMlwiLCBcIkZha3R1cmFpbmZvXCIpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIubmFtZSksXG4gICAgICAgICAgICBtKFwicC5pbmZvLXJvd1wiLCBvcmRlci5hZGRyZXNzKSxcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLnppcCA/IG9yZGVyLnppcCA6ICcnICsgJyAnICsgb3JkZXIuY2l0eSA/IG9yZGVyLmNpdHkgOiAnJyksXG4gICAgICAgICAgICBtKFwicC5pbmZvLXJvd1wiLCBvcmRlci5jb3VudHJ5KSxcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLmFkcmVzcyksXG4gICAgICAgICAgICBtKFwidGFibGUudGFibGUudGFibGUtc2Nyb2xsLnRhYmxlLXN0cmlwZWRcIiwgW1xuICAgICAgICAgICAgICAgIG0oXCJ0clwiLCBbXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIlByb2R1Y3RcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIkFudGFsXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwidGhcIiwgXCJQcmlzXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwidGhcIiwgXCJUb3RhbFwiKVxuICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgIG9yZGVyLm9yZGVyX2l0ZW1zLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKG9yZGVyUm93LCBpdGVtKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgaW52b2ljZSA9IHtcbiAgICBvbmluaXQ6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIG9yZGVycy5nZXRPcmRlcih2bm9kZS5hdHRycy5pZCk7XG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImludm9pY2Uudmlldzogdm5vZGUuYXR0cnNcIiwgdm5vZGUuYXR0cnMpO1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbiwgb3JkZXJzLmN1cnJlbnRPcmRlcikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGludm9pY2UgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9pbnZvaWNlcy5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHsgaW52b2ljZXNNb2RlbCB9IGZyb20gXCIuLi9tb2RlbHMvaW52b2ljZXMuanNcIjtcblxuY29uc3QgaW52b2ljZXNSb3cgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IGludm9pY2UgPSB2bm9kZS5hdHRycztcblxuICAgICAgICByZXR1cm4gbShcInRyLnRyLWxpbmtcIiwge1xuICAgICAgICAgICAgb25jbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW52b2ljZSk7XG4gICAgICAgICAgICAgICAgbS5yb3V0ZS5zZXQoYC9pbnZvaWNlLyR7aW52b2ljZS5vcmRlcl9pZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgW1xuICAgICAgICAgICAgbShcInRkXCIsIGludm9pY2UubmFtZSksXG4gICAgICAgICAgICBtKFwidGQucmlnaHRcIiwgaW52b2ljZS50b3RhbF9wcmljZSlcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxubGV0IG1haW4gPSB7XG4gICAgb25pbml0OiBpbnZvaWNlc01vZGVsLmdldEFsbEludm9pY2VzLFxuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoaW52b2ljZXNNb2RlbC5pbnZvaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiRmFrdHVyb3JcIiksXG4gICAgICAgICAgICAgICAgbShcInBcIiwgXCJJbmdhIGZha3R1cm9yIGZpbm5zIHJlZ2lzdHJlcmFkZSFcIilcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIkZha3R1cm9yXCIpLFxuICAgICAgICAgICAgbShcInRhYmxlLnRhYmxlLnRhYmxlLXNjcm9sbC50YWJsZS1zdHJpcGVkXCIsIFtcbiAgICAgICAgICAgICAgICBtKFwidHJcIiwgW1xuICAgICAgICAgICAgICAgICAgICBtKFwidGhcIiwgXCJLdW5kXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwidGhcIiwgXCJTdW1tYVwiKVxuICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgIGludm9pY2VzTW9kZWwuaW52b2ljZXMubWFwKGZ1bmN0aW9uKGludm9pY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oaW52b2ljZXNSb3csIGludm9pY2UpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oXG4gICAgICAgICAgICAgICAgXCJhLmJ1dHRvbi5ncmVlbi1idXR0b24uZnVsbC13aWR0aC1idXR0b24uc3BhY2VcIixcbiAgICAgICAgICAgICAgICB7IGhyZWY6IFwiIyEvbmV3LWludm9pY2VcIiB9LFxuICAgICAgICAgICAgICAgIFwiU2thcGEgZW4gZmFrdHVyYVwiXG4gICAgICAgICAgICApXG4gICAgICAgIF07XG4gICAgfVxufTtcblxubGV0IGludm9pY2VzID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGludm9pY2VzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG4vLyBqcy92aWV3cy9sYXlvdXQuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuLi9tb2RlbHMvYXV0aC5qc1wiO1xuXG5sZXQgbGF5b3V0ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGxldCBuYXZFbGVtZW50cyA9IFtcbiAgICAgICAgICAgIHtuYW1lOiBcIkhvbWVcIiwgY2xhc3M6IFwiaG9tZVwiLCBsaW5rOiBcImhvbWVcIiwgbmF2OiBcIiMhL1wifVxuICAgICAgICBdO1xuXG4gICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICBuYXZFbGVtZW50cy5wdXNoKHtuYW1lOiBcIklubGV2ZXJhbnNcIiwgY2xhc3M6IFwibG9jYWxfc2hpcHBpbmdcIixcbiAgICAgICAgICAgICAgICBsaW5rOiBcImluZGVsaXZlcnlcIiwgbmF2OiBcIiMhL2luZGVsaXZlcnlcIn0pO1xuICAgICAgICAgICAgbmF2RWxlbWVudHMucHVzaCh7bmFtZTogXCJMYWdlcnNhbGRvXCIsIGNsYXNzOiBcImludmVudG9yeVwiLFxuICAgICAgICAgICAgICAgIGxpbms6IFwiaW52ZW50b3J5XCIsIG5hdjogXCIjIS9pbnZlbnRvcnlcIn0pO1xuICAgICAgICAgICAgbmF2RWxlbWVudHMucHVzaCh7bmFtZTogXCJQbG9ja2xpc3RhXCIsIGNsYXNzOiBcImNoZWNrbGlzdFwiLFxuICAgICAgICAgICAgICAgIGxpbms6IFwicGljay1saXN0c1wiLCBuYXY6IFwiIyEvcGljay1saXN0c1wifSk7XG4gICAgICAgICAgICBuYXZFbGVtZW50cy5wdXNoKHtuYW1lOiBcIkZha3R1cmFcIiwgY2xhc3M6IFwicmVjZWlwdFwiLFxuICAgICAgICAgICAgICAgIGxpbms6IFwiaW52b2ljZXNcIiwgbmF2OiBcIiMhL2ludm9pY2VzXCJ9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvdXRlOiBcIiwgbS5yb3V0ZS5nZXQoKS5zcGxpdChcIi9cIikpO1xuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBtLnJvdXRlLmdldCgpLnNwbGl0KFwiL1wiKVsxXSB8fCBcImhvbWVcIjtcblxuICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkOlwiLCBzZWxlY3RlZCk7XG5cbiAgICAgICAgbmF2RWxlbWVudHMgPSBuYXZFbGVtZW50cy5tYXAoZWxlbWVudCA9PiBnZW5lcmF0ZUJvdHRvbU5hdkVsZW1lbnQoZWxlbWVudCwgc2VsZWN0ZWQpKTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gbShcIm1haW4uY29udGFpbmVyXCIsIHZub2RlLmNoaWxkcmVuKSxcbiAgICAgICAgICAgIG0oXCJkaXYjcm9vdFwiLCB2bm9kZS5jaGlsZHJlbiksXG4gICAgICAgICAgICBtKFwibmF2LmJvdHRvbS1uYXZcIiwgbmF2RWxlbWVudHMpXG4gICAgICAgIF07XG4gICAgfVxufTtcblxubGV0IGdlbmVyYXRlQm90dG9tTmF2RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBzZWxlY3RlZCkge1xuICAgIGxldCBib3R0b21OYXZFbGVtZW50cyA9IFtdO1xuICAgIGxldCBhY3RpdmUgPSBcIlwiO1xuXG4gICAgaWYgKHNlbGVjdGVkID09PSBlbGVtZW50LmxpbmspIHtcbiAgICAgICAgYWN0aXZlID0gXCIuYWN0aXZlXCI7XG4gICAgfVxuXG4gICAgbGV0IG5hdkVsZW1lbnRBbmRDbGFzcyA9IFwiYVwiICsgYWN0aXZlO1xuXG4gICAgYm90dG9tTmF2RWxlbWVudHMucHVzaChcbiAgICAgICAgbShcbiAgICAgICAgICAgIG5hdkVsZW1lbnRBbmRDbGFzcyxcbiAgICAgICAgICAgIHsgaHJlZjogZWxlbWVudC5uYXYgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgICAgICBcImkubWF0ZXJpYWwtaWNvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc1xuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJzcGFuLmljb24tdGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm5hbWVcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgcmV0dXJuIGJvdHRvbU5hdkVsZW1lbnRzO1xufTtcblxuZXhwb3J0IHsgbGF5b3V0IH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvbG9naW4uanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSAnLi4vbW9kZWxzL2F1dGguanMnO1xuXG5sZXQgbWFpbiA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIkxvZ2dhIGluXCIpLFxuICAgICAgICAgICAgbShcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIG9uc3VibWl0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBhdXRoLmxvZ2luKCk7XG4gICAgICAgICAgICAgICAgfX0sIFtcbiAgICAgICAgICAgICAgICBtKFwibGFiZWwuaW5wdXQtbGFiZWxcIiwgXCJFLXBvc3RhZHJlc3NcIiksXG4gICAgICAgICAgICAgICAgbShcImlucHV0LmlucHV0W3R5cGU9ZW1haWxdW3BsYWNlaG9sZGVyPUUtcG9zdGFkcmVzc11bcmVxdWlyZWQ9cmVxdWlyZWRdXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgb25pbnB1dDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoLmVtYWlsID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXV0aC5lbWFpbFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIkzDtnNlbm9yZFwiKSxcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXQuaW5wdXRbdHlwZT1wYXNzd29yZF1bcGxhY2Vob2xkZXI9TMO2c2Vub3JkXVtyZXF1aXJlZD1yZXF1aXJlZF1cIiwge1xuICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGgucGFzc3dvcmQgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdXRoLnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJpbnB1dC5idXR0b24uZ3JlZW4tYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uW3R5cGU9c3VibWl0XVt2YWx1ZT1Mb2dpbl1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJMb2dnYSBpblwiXG4gICAgICAgICAgICAgICAgKV1cbiAgICAgICAgICAgICldO1xuICAgIH1cbn07XG5cbmxldCBsb2dpbiA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4pKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBsb2dpbiB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGpzL3ZpZXdzL25ldy1pbmRlbGl2ZXJ5LmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgbGFnZXIgfSBmcm9tIFwiLi4vbW9kZWxzL2xhZ2VyLmpzXCI7XG5cbmxldCBtYWluID0ge1xuICAgIG9uaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxhZ2VyLnJlc2V0Q3VycmVudEZvcm0oKTtcbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcImRpdi5mb3JtLWNvbnRhaW5lclwiLCBbXG4gICAgICAgICAgICBtKFwiaDJcIiwgXCJOeSBpbmxldmVyYW5zXCIpLFxuICAgICAgICAgICAgbShcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIG9uc3VibWl0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBsYWdlci5hZGRJbmRlbGl2ZXJ5KCk7XG4gICAgICAgICAgICAgICAgfSB9LCBbXG4gICAgICAgICAgICAgICAgbShcImxhYmVsLmlucHV0LWxhYmVsXCIsIFwiUHJvZHVrdFwiKSxcbiAgICAgICAgICAgICAgICBtKFwic2VsZWN0LmlucHV0W3JlcXVpcmVkPXJlcXVpcmVkXVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uY2hhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFnZXIuY3VycmVudEZvcm0ucHJvZHVjdF9pZCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgbGFnZXIuY3VycmVudC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcIm9wdGlvblwiLCB7IHZhbHVlOiBwcm9kdWN0LmlkIH0sIHByb2R1Y3QubmFtZSk7XG4gICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIkFudGFsXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJpbnB1dC5pbnB1dFt0eXBlPW51bWJlcl1bcGxhY2Vob2xkZXI9QW50YWxdW3JlcXVpcmVkPXJlcXVpcmVkXVttaW49MV1cIiwge1xuICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFnZXIuY3VycmVudEZvcm0uYW1vdW50ID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBsYWdlci5jdXJyZW50Rm9ybS5hbW91bnRcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWwuaW5wdXQtbGFiZWxcIiwgXCJMZXZlcmFuc2RhdHVtXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJpbnB1dC5pbnB1dFt0eXBlPWRhdGVdW3BsYWNlaG9sZGVyPUxldmVyYW5zZGF0dW1dW3JlcXVpcmVkPXJlcXVpcmVkXVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWdlci5jdXJyZW50Rm9ybS5kZWxpdmVyeV9kYXRlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBsYWdlci5jdXJyZW50Rm9ybS5kYXRlXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsLmlucHV0LWxhYmVsXCIsIFwiS29tbWVudGFyXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJ0ZXh0YXJlYS5pbnB1dFtjb2xzPTJdW3BsYWNlaG9sZGVyPUtvbW1lbnRhcl1cIiwge1xuICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFnZXIuY3VycmVudEZvcm0uY29tbWVudCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbGFnZXIuY3VycmVudEZvcm0uY29tbWVudFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG0oXG4gICAgICAgICAgICAgICAgICAgIFwiaW5wdXQuYnV0dG9uLmdyZWVuLWJ1dHRvbi5mdWxsLXdpZHRoLWJ1dHRvblt0eXBlPXN1Ym1pdF1bdmFsdWU9U2F2ZV1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJHw7ZyIGlubGV2ZXJhbnNcIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0pXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5cbmxldCBuZXdJbmRlbGl2ZXJ5ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IG5ld0luZGVsaXZlcnkgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9uZXctaW52b2ljZS5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCB7IG9yZGVycyB9IGZyb20gXCIuLi9tb2RlbHMvb3JkZXJzLmpzXCI7XG5pbXBvcnQgeyBpbnZvaWNlc01vZGVsIH0gZnJvbSBcIi4uL21vZGVscy9pbnZvaWNlcy5qc1wiO1xuXG5jb25zdCBvcmRlclJvdyA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBsZXQgcHJvZHVjdCA9IHZub2RlLmF0dHJzO1xuXG4gICAgICAgIHJldHVybiBtKFwidHJcIiwgW1xuICAgICAgICAgICAgbShcInRkXCIsIHByb2R1Y3QubmFtZSksXG4gICAgICAgICAgICBtKFwidGQucmlnaHRcIiwgcHJvZHVjdC5hbW91bnQpLFxuICAgICAgICAgICAgbShcInRkLnJpZ2h0XCIsIHByb2R1Y3QucHJpY2UpLFxuICAgICAgICAgICAgbShcInRkLnJpZ2h0XCIsICtwcm9kdWN0LmFtb3VudCAqICtwcm9kdWN0LnByaWNlKVxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG5sZXQgc2hvd09yZGVyID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGxldCBvcmRlciA9IHZub2RlLmF0dHJzO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNob3dPcmRlcjogb3JkZXJzLmNjdXJyZW50T3JkZXJcIiwgb3JkZXIpO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtKFwicC5pbmZvLXJvd1wiLCBvcmRlci5uYW1lKSxcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLmFkZHJlc3MpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIuemlwID8gb3JkZXIuemlwIDogJycgKyAnICcgKyBvcmRlci5jaXR5ID8gb3JkZXIuY2l0eSA6ICcnKSxcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLmNvdW50cnkpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIuYWRyZXNzKSxcbiAgICAgICAgICAgIG0oXCJ0YWJsZS50YWJsZS50YWJsZS1zY3JvbGwudGFibGUtc3RyaXBlZFwiLCBbXG4gICAgICAgICAgICAgICAgbShcInRyXCIsIFtcbiAgICAgICAgICAgICAgICAgICAgbShcInRoXCIsIFwiUHJvZHVjdFwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcInRoXCIsIFwiQW50YWxcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIlByaXNcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIlRvdGFsXCIpXG4gICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgb3JkZXIub3JkZXJfaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0ob3JkZXJSb3csIGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oXG4gICAgICAgICAgICAgICAgXCJpbnB1dC5idXR0b24uZ3JlZW4tYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uW3R5cGU9c3VibWl0XVt2YWx1ZT0nU2thcGEgZmFrdHVyYW4nXVwiXG4gICAgICAgICAgICApXG4gICAgICAgIF07XG4gICAgfVxufTtcblxubGV0IG1haW4gPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBvcmRlciA9IG9yZGVycy5jdXJyZW50T3JkZXI7XG5cbiAgICAgICAgcmV0dXJuIG0oXCJkaXYuZm9ybS1jb250YWluZXJcIiwgW1xuICAgICAgICAgICAgbShcImgyXCIsIFwiTnkgZmFrdHVyYVwiKSxcbiAgICAgICAgICAgIG0oXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBvbnN1Ym1pdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZXNNb2RlbC5zYXZlSW52b2ljZShvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIG0ucm91dGUuc2V0KFwiL2ludm9pY2VzXCIpO1xuICAgICAgICAgICAgICAgIH0gfSwgW1xuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIk9yZGVyXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJzZWxlY3QuaW5wdXRbcmVxdWlyZWQ9cmVxdWlyZWRdXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgb25jaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlciA9IG9yZGVycy5nZXRPcmRlcihlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1haW5cIiwgb3JkZXJzLmN1cnJlbnRPcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBvcmRlcnMuYWxsT3JkZXJzLmZpbHRlcihvcmRlciA9PiBvcmRlci5zdGF0dXNfaWQgPCA2MDApXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwib3B0aW9uXCIsIHsgdmFsdWU6IG9yZGVyLmlkIH0sIG9yZGVyLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgbShcImRpdiNpbnZvaWNlLWNvbnRhaW5lclwiLCBtKHNob3dPcmRlciwgb3JkZXIpKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxubGV0IG5ld0ludm9pY2UgPSB7XG4gICAgb25pbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG9yZGVycy5jdXJyZW50T3JkZXIgIT09ICcnKSB7XG4gICAgICAgICAgICBvcmRlcnMuY3VycmVudE9yZGVyID0gb3JkZXJzLmFsbE9yZGVycy5maWx0ZXIob3JkZXIgPT4gb3JkZXIuc3RhdHVzX2lkIDwgNjAwKVswXTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtKFwibWFpbi5jb250YWluZXJcIiwgbShtYWluKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgbmV3SW52b2ljZSB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIG9yZGVyLWRldGFpbHMuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbi8vIGltcG9ydCB7IHBpY2tMaXN0cyB9IGZyb20gXCIuL3BpY2stbGlzdHMuanNcIjtcbmltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSBcIi4uL21vZGVscy9wcm9kdWN0cy5qc1wiO1xuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4uL21vZGVscy9vcmRlcnMuanNcIjtcblxubGV0IG9yZGVySXRlbXMgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IG9yZGVyID0gdm5vZGUuYXR0cnM7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJvcmRlckl0ZW1zLT5vcmRlci5vcmRlcl9pdGVtczpcIiwgb3JkZXIub3JkZXJfaXRlbXMpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIG9yZGVyLm5hbWUpLFxuICAgICAgICAgICAgbShcImRsLnByb2R1Y3QtaW5mb1wiLCBvcmRlci5vcmRlcl9pdGVtcy5tYXAoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIlByb2R1Y3RcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkZFwiLCBwcm9kdWN0LnByb2R1Y3RfaWQpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJIeWxsYVwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QubG9jYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJCZXNrcml2bmluZ1wiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QuZGVzY3JpcHRpb24pXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICBdO1xuICAgIH1cbn07XG5cbmxldCBtYWluID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgb3JkZXIgPSBvcmRlcnMuY3VycmVudE9yZGVyO1xuXG4gICAgICAgIGxldCBpbmRlbGl2ZXJ5UG9zc2libGUgPSBwcm9kdWN0cy5hcmVQcm9kdWN0c09uU3RvY2sob3JkZXIub3JkZXJfaXRlbXMpO1xuXG4gICAgICAgIGlmIChpbmRlbGl2ZXJ5UG9zc2libGUpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbShvcmRlckl0ZW1zLCBvcmRlciksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJhLmJ1dHRvbi5ncmVlbi1idXR0b24uZnVsbC13aWR0aC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cob3JkZXIuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVycy51cGRhdGVPcmRlcihvcmRlci5pZCwgMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnJvdXRlLnNldCgnL3BpY2stbGlzdHMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJTw6R0dCBzb20gcGFja2F0XCJcbiAgICAgICAgICAgICAgICApXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtKG9yZGVySXRlbXMsIG9yZGVyKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmxldCBvcmRlckRldGFpbHMgPSB7XG4gICAgb25pbml0OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBvcmRlcnMuZ2V0T3JkZXIodm5vZGUuYXR0cnMuaWQpO1xuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4sIHZub2RlLmF0dHJzKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgb3JkZXJEZXRhaWxzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvcGljay1saXN0cy5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4uL21vZGVscy9vcmRlcnMuanNcIjtcblxuXG5jb25zdCBnZW5lcmF0ZU9yZGVyTGlzdCA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBsZXQgb3JkZXIgPSB2bm9kZS5hdHRycztcblxuICAgICAgICByZXR1cm4gbShcImRpdi5mbGV4LXJvd1wiLCB7XG4gICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlcik7XG4gICAgICAgICAgICAgICAgbS5yb3V0ZS5zZXQoYC9vcmRlci1kZXRhaWxzLyR7b3JkZXIuaWR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIFtcbiAgICAgICAgICAgIG0oXCJkaXYuZmxleC1pdGVtLmxlZnRcIiwgb3JkZXIubmFtZSksXG4gICAgICAgICAgICBtKFwiZGl2LmZsZXgtaXRlbS5yaWdodFwiLCBvcmRlci5pZCksXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5cbmxldCBtYWluID0ge1xuICAgIG9uaW5pdDogb3JkZXJzLmdldEFsbE9yZGVycyxcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIk55YSBvcmRyYXJcIiksXG4gICAgICAgICAgICBtKFwiZGl2Lmludi1jb250YWluZXJcIiwgKFxuICAgICAgICAgICAgICAgIG9yZGVycy5hbGxPcmRlcnMubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzLmFsbE9yZGVycy5maWx0ZXIob3JkZXIgPT4gb3JkZXIuc3RhdHVzX2lkID09PSAxMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShnZW5lcmF0ZU9yZGVyTGlzdCwgb3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkgOiBtKFwicFwiLCBcIkZpbm5zIGluZ2EgbnlhIG9yZHJhclwiKVxuICAgICAgICAgICAgKSlcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgcGlja0xpc3RzID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7XG4gICAgcGlja0xpc3RzXG59O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHByb2R1Y3QtZGV0YWlscy5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tIFwiLi4vbW9kZWxzL3Byb2R1Y3RzLmpzXCI7XG5cbmxldCBtYWluID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidm5vZGU6XCIsIHZub2RlKTtcbiAgICAgICAgbGV0IHByb2R1Y3QgPSBwcm9kdWN0cy5nZXRQcm9kdWN0KHZub2RlLmF0dHJzLmlkKTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnByb2R1Y3QtbmFtZVwiLCBwcm9kdWN0Lm5hbWUpLFxuICAgICAgICAgICAgbShcImRsLnByb2R1Y3QtaW5mb1wiLCBbXG4gICAgICAgICAgICAgICAgbShcImR0XCIsIFwiaWRcIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QuaWQpLFxuICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkFydGlrZWxudW1tZXJcIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QuYXJ0aWNsZV9udW1iZXIpLFxuICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkJlc2tyaXZuaW5nXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJkZFwiLCBwcm9kdWN0LmRlc2NyaXB0aW9uKSxcbiAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJTcGVjaWZpa2F0aW9uXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJkZFwiLCBwcm9kdWN0LnNwZWNpZmllcnMpLFxuICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkkgbGFnZXJcIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3Quc3RvY2spLFxuICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkh5bGxhXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJkZFwiLCBwcm9kdWN0LmxvY2F0aW9uKSxcbiAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJQcmlzXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJkZFwiLCBwcm9kdWN0LnByaWNlKSxcbiAgICAgICAgICAgIF0pXG4gICAgICAgIF07XG4gICAgfVxufTtcblxubGV0IHByb2R1Y3REZXRhaWxzID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJvZHVjdC1kZXRhaWxzXCIpO1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbiwgdm5vZGUuYXR0cnMpKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBwcm9kdWN0RGV0YWlscyB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGpzL3ZpZXdzL3JlZ2lzdGVyLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgYXV0aCB9IGZyb20gJy4uL21vZGVscy9hdXRoLmpzJztcblxubGV0IG1haW4gPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgXCJSZWdpc3RyZXJpbmdcIiksXG4gICAgICAgICAgICBtKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgb25zdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGF1dGgucmVnaXN0ZXIoKTtcbiAgICAgICAgICAgICAgICB9IH0sIFtcbiAgICAgICAgICAgICAgICBtKFwibGFiZWwuaW5wdXQtbGFiZWxcIiwgXCJFLXBvc3RhZHJlc3NcIiksXG4gICAgICAgICAgICAgICAgbShcImlucHV0LmlucHV0W3R5cGU9ZW1haWxdW3BsYWNlaG9sZGVyPUUtcG9zdGFkcmVzc11bcmVxdWlyZWQ9cmVxdWlyZWRdXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgb25pbnB1dDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoLmVtYWlsID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXV0aC5lbWFpbFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIkzDtnNlbm9yZFwiKSxcbiAgICAgICAgICAgICAgICBtKCdpbnB1dC5pbnB1dFt0eXBlPVwicGFzc3dvcmRcIl1bcGxhY2Vob2xkZXI9XCJMw7ZzZW5vcmRcIl1bcmVxdWlyZWQ9cmVxdWlyZWRdJywge1xuICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGgucGFzc3dvcmQgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdXRoLnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJpbnB1dC5idXR0b24uZ3JlZW4tYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uW3R5cGU9c3VibWl0XVt2YWx1ZT1SZWdpc3RyZXJhXVwiXG4gICAgICAgICAgICAgICAgKV1cbiAgICAgICAgICAgICldO1xuICAgIH1cbn07XG5cbmxldCByZWdpc3RlciA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4pKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyByZWdpc3RlciB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlbmRlciwgc2NoZWR1bGUsIGNvbnNvbGUpIHtcblx0dmFyIHN1YnNjcmlwdGlvbnMgPSBbXVxuXHR2YXIgcmVuZGVyaW5nID0gZmFsc2Vcblx0dmFyIHBlbmRpbmcgPSBmYWxzZVxuXG5cdGZ1bmN0aW9uIHN5bmMoKSB7XG5cdFx0aWYgKHJlbmRlcmluZykgdGhyb3cgbmV3IEVycm9yKFwiTmVzdGVkIG0ucmVkcmF3LnN5bmMoKSBjYWxsXCIpXG5cdFx0cmVuZGVyaW5nID0gdHJ1ZVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaXB0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuXHRcdFx0dHJ5IHsgcmVuZGVyKHN1YnNjcmlwdGlvbnNbaV0sIFZub2RlKHN1YnNjcmlwdGlvbnNbaSArIDFdKSwgcmVkcmF3KSB9XG5cdFx0XHRjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKGUpIH1cblx0XHR9XG5cdFx0cmVuZGVyaW5nID0gZmFsc2Vcblx0fVxuXG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcblx0XHRpZiAoIXBlbmRpbmcpIHtcblx0XHRcdHBlbmRpbmcgPSB0cnVlXG5cdFx0XHRzY2hlZHVsZShmdW5jdGlvbigpIHtcblx0XHRcdFx0cGVuZGluZyA9IGZhbHNlXG5cdFx0XHRcdHN5bmMoKVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHRyZWRyYXcuc3luYyA9IHN5bmNcblxuXHRmdW5jdGlvbiBtb3VudChyb290LCBjb21wb25lbnQpIHtcblx0XHRpZiAoY29tcG9uZW50ICE9IG51bGwgJiYgY29tcG9uZW50LnZpZXcgPT0gbnVsbCAmJiB0eXBlb2YgY29tcG9uZW50ICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJtLm1vdW50KGVsZW1lbnQsIGNvbXBvbmVudCkgZXhwZWN0cyBhIGNvbXBvbmVudCwgbm90IGEgdm5vZGVcIilcblx0XHR9XG5cblx0XHR2YXIgaW5kZXggPSBzdWJzY3JpcHRpb25zLmluZGV4T2Yocm9vdClcblx0XHRpZiAoaW5kZXggPj0gMCkge1xuXHRcdFx0c3Vic2NyaXB0aW9ucy5zcGxpY2UoaW5kZXgsIDIpXG5cdFx0XHRyZW5kZXIocm9vdCwgW10sIHJlZHJhdylcblx0XHR9XG5cblx0XHRpZiAoY29tcG9uZW50ICE9IG51bGwpIHtcblx0XHRcdHN1YnNjcmlwdGlvbnMucHVzaChyb290LCBjb21wb25lbnQpXG5cdFx0XHRyZW5kZXIocm9vdCwgVm5vZGUoY29tcG9uZW50KSwgcmVkcmF3KVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7bW91bnQ6IG1vdW50LCByZWRyYXc6IHJlZHJhd31cbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcbnZhciBtID0gcmVxdWlyZShcIi4uL3JlbmRlci9oeXBlcnNjcmlwdFwiKVxudmFyIFByb21pc2UgPSByZXF1aXJlKFwiLi4vcHJvbWlzZS9wcm9taXNlXCIpXG5cbnZhciBidWlsZFBhdGhuYW1lID0gcmVxdWlyZShcIi4uL3BhdGhuYW1lL2J1aWxkXCIpXG52YXIgcGFyc2VQYXRobmFtZSA9IHJlcXVpcmUoXCIuLi9wYXRobmFtZS9wYXJzZVwiKVxudmFyIGNvbXBpbGVUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi9wYXRobmFtZS9jb21waWxlVGVtcGxhdGVcIilcbnZhciBhc3NpZ24gPSByZXF1aXJlKFwiLi4vcGF0aG5hbWUvYXNzaWduXCIpXG5cbnZhciBzZW50aW5lbCA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdywgbW91bnRSZWRyYXcpIHtcblx0dmFyIGZpcmVBc3luY1xuXG5cdGZ1bmN0aW9uIHNldFBhdGgocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuXHRcdHBhdGggPSBidWlsZFBhdGhuYW1lKHBhdGgsIGRhdGEpXG5cdFx0aWYgKGZpcmVBc3luYyAhPSBudWxsKSB7XG5cdFx0XHRmaXJlQXN5bmMoKVxuXHRcdFx0dmFyIHN0YXRlID0gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdGUgOiBudWxsXG5cdFx0XHR2YXIgdGl0bGUgPSBvcHRpb25zID8gb3B0aW9ucy50aXRsZSA6IG51bGxcblx0XHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmVwbGFjZSkgJHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgdGl0bGUsIHJvdXRlLnByZWZpeCArIHBhdGgpXG5cdFx0XHRlbHNlICR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIHRpdGxlLCByb3V0ZS5wcmVmaXggKyBwYXRoKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdCR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJvdXRlLnByZWZpeCArIHBhdGhcblx0XHR9XG5cdH1cblxuXHR2YXIgY3VycmVudFJlc29sdmVyID0gc2VudGluZWwsIGNvbXBvbmVudCwgYXR0cnMsIGN1cnJlbnRQYXRoLCBsYXN0VXBkYXRlXG5cblx0dmFyIFNLSVAgPSByb3V0ZS5TS0lQID0ge31cblxuXHRmdW5jdGlvbiByb3V0ZShyb290LCBkZWZhdWx0Um91dGUsIHJvdXRlcykge1xuXHRcdGlmIChyb290ID09IG51bGwpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgdGhhdCB3YXMgcGFzc2VkIHRvIGBtLnJvdXRlYCBpcyBub3QgdW5kZWZpbmVkXCIpXG5cdFx0Ly8gMCA9IHN0YXJ0XG5cdFx0Ly8gMSA9IGluaXRcblx0XHQvLyAyID0gcmVhZHlcblx0XHR2YXIgc3RhdGUgPSAwXG5cblx0XHR2YXIgY29tcGlsZWQgPSBPYmplY3Qua2V5cyhyb3V0ZXMpLm1hcChmdW5jdGlvbihyb3V0ZSkge1xuXHRcdFx0aWYgKHJvdXRlWzBdICE9PSBcIi9cIikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUm91dGVzIG11c3Qgc3RhcnQgd2l0aCBhIGAvYFwiKVxuXHRcdFx0aWYgKCgvOihbXlxcL1xcLi1dKykoXFwuezN9KT86LykudGVzdChyb3V0ZSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUm91dGUgcGFyYW1ldGVyIG5hbWVzIG11c3QgYmUgc2VwYXJhdGVkIHdpdGggZWl0aGVyIGAvYCwgYC5gLCBvciBgLWBcIilcblx0XHRcdH1cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJvdXRlOiByb3V0ZSxcblx0XHRcdFx0Y29tcG9uZW50OiByb3V0ZXNbcm91dGVdLFxuXHRcdFx0XHRjaGVjazogY29tcGlsZVRlbXBsYXRlKHJvdXRlKSxcblx0XHRcdH1cblx0XHR9KVxuXHRcdHZhciBjYWxsQXN5bmMgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBzZXRUaW1lb3V0XG5cdFx0dmFyIHAgPSBQcm9taXNlLnJlc29sdmUoKVxuXHRcdHZhciBzY2hlZHVsZWQgPSBmYWxzZVxuXHRcdHZhciBvbnJlbW92ZVxuXG5cdFx0ZmlyZUFzeW5jID0gbnVsbFxuXG5cdFx0aWYgKGRlZmF1bHRSb3V0ZSAhPSBudWxsKSB7XG5cdFx0XHR2YXIgZGVmYXVsdERhdGEgPSBwYXJzZVBhdGhuYW1lKGRlZmF1bHRSb3V0ZSlcblxuXHRcdFx0aWYgKCFjb21waWxlZC5zb21lKGZ1bmN0aW9uIChpKSB7IHJldHVybiBpLmNoZWNrKGRlZmF1bHREYXRhKSB9KSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJEZWZhdWx0IHJvdXRlIGRvZXNuJ3QgbWF0Y2ggYW55IGtub3duIHJvdXRlc1wiKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlc29sdmVSb3V0ZSgpIHtcblx0XHRcdHNjaGVkdWxlZCA9IGZhbHNlXG5cdFx0XHQvLyBDb25zaWRlciB0aGUgcGF0aG5hbWUgaG9saXN0aWNhbGx5LiBUaGUgcHJlZml4IG1pZ2h0IGV2ZW4gYmUgaW52YWxpZCxcblx0XHRcdC8vIGJ1dCB0aGF0J3Mgbm90IG91ciBwcm9ibGVtLlxuXHRcdFx0dmFyIHByZWZpeCA9ICR3aW5kb3cubG9jYXRpb24uaGFzaFxuXHRcdFx0aWYgKHJvdXRlLnByZWZpeFswXSAhPT0gXCIjXCIpIHtcblx0XHRcdFx0cHJlZml4ID0gJHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKyBwcmVmaXhcblx0XHRcdFx0aWYgKHJvdXRlLnByZWZpeFswXSAhPT0gXCI/XCIpIHtcblx0XHRcdFx0XHRwcmVmaXggPSAkd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgcHJlZml4XG5cdFx0XHRcdFx0aWYgKHByZWZpeFswXSAhPT0gXCIvXCIpIHByZWZpeCA9IFwiL1wiICsgcHJlZml4XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIFRoaXMgc2VlbWluZ2x5IHVzZWxlc3MgYC5jb25jYXQoKWAgc3BlZWRzIHVwIHRoZSB0ZXN0cyBxdWl0ZSBhIGJpdCxcblx0XHRcdC8vIHNpbmNlIHRoZSByZXByZXNlbnRhdGlvbiBpcyBjb25zaXN0ZW50bHkgYSByZWxhdGl2ZWx5IHBvb3JseVxuXHRcdFx0Ly8gb3B0aW1pemVkIGNvbnMgc3RyaW5nLlxuXHRcdFx0dmFyIHBhdGggPSBwcmVmaXguY29uY2F0KClcblx0XHRcdFx0LnJlcGxhY2UoLyg/OiVbYS1mODldW2EtZjAtOV0pKy9naW0sIGRlY29kZVVSSUNvbXBvbmVudClcblx0XHRcdFx0LnNsaWNlKHJvdXRlLnByZWZpeC5sZW5ndGgpXG5cdFx0XHR2YXIgZGF0YSA9IHBhcnNlUGF0aG5hbWUocGF0aClcblxuXHRcdFx0YXNzaWduKGRhdGEucGFyYW1zLCAkd2luZG93Lmhpc3Rvcnkuc3RhdGUpXG5cblx0XHRcdGZ1bmN0aW9uIGZhaWwoKSB7XG5cdFx0XHRcdGlmIChwYXRoID09PSBkZWZhdWx0Um91dGUpIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCByZXNvbHZlIGRlZmF1bHQgcm91dGUgXCIgKyBkZWZhdWx0Um91dGUpXG5cdFx0XHRcdHNldFBhdGgoZGVmYXVsdFJvdXRlLCBudWxsLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0XHR9XG5cblx0XHRcdGxvb3AoMClcblx0XHRcdGZ1bmN0aW9uIGxvb3AoaSkge1xuXHRcdFx0XHQvLyAwID0gaW5pdFxuXHRcdFx0XHQvLyAxID0gc2NoZWR1bGVkXG5cdFx0XHRcdC8vIDIgPSBkb25lXG5cdFx0XHRcdGZvciAoOyBpIDwgY29tcGlsZWQubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoY29tcGlsZWRbaV0uY2hlY2soZGF0YSkpIHtcblx0XHRcdFx0XHRcdHZhciBwYXlsb2FkID0gY29tcGlsZWRbaV0uY29tcG9uZW50XG5cdFx0XHRcdFx0XHR2YXIgbWF0Y2hlZFJvdXRlID0gY29tcGlsZWRbaV0ucm91dGVcblx0XHRcdFx0XHRcdHZhciBsb2NhbENvbXAgPSBwYXlsb2FkXG5cdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gbGFzdFVwZGF0ZSA9IGZ1bmN0aW9uKGNvbXApIHtcblx0XHRcdFx0XHRcdFx0aWYgKHVwZGF0ZSAhPT0gbGFzdFVwZGF0ZSkgcmV0dXJuXG5cdFx0XHRcdFx0XHRcdGlmIChjb21wID09PSBTS0lQKSByZXR1cm4gbG9vcChpICsgMSlcblx0XHRcdFx0XHRcdFx0Y29tcG9uZW50ID0gY29tcCAhPSBudWxsICYmICh0eXBlb2YgY29tcC52aWV3ID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIGNvbXAgPT09IFwiZnVuY3Rpb25cIik/IGNvbXAgOiBcImRpdlwiXG5cdFx0XHRcdFx0XHRcdGF0dHJzID0gZGF0YS5wYXJhbXMsIGN1cnJlbnRQYXRoID0gcGF0aCwgbGFzdFVwZGF0ZSA9IG51bGxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFJlc29sdmVyID0gcGF5bG9hZC5yZW5kZXIgPyBwYXlsb2FkIDogbnVsbFxuXHRcdFx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IDIpIG1vdW50UmVkcmF3LnJlZHJhdygpXG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRlID0gMlxuXHRcdFx0XHRcdFx0XHRcdG1vdW50UmVkcmF3LnJlZHJhdy5zeW5jKClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gVGhlcmUncyBubyB1bmRlcnN0YXRpbmcgaG93IG11Y2ggSSAqd2lzaCogSSBjb3VsZFxuXHRcdFx0XHRcdFx0Ly8gdXNlIGBhc3luY2AvYGF3YWl0YCBoZXJlLi4uXG5cdFx0XHRcdFx0XHRpZiAocGF5bG9hZC52aWV3IHx8IHR5cGVvZiBwYXlsb2FkID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0cGF5bG9hZCA9IHt9XG5cdFx0XHRcdFx0XHRcdHVwZGF0ZShsb2NhbENvbXApXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChwYXlsb2FkLm9ubWF0Y2gpIHtcblx0XHRcdFx0XHRcdFx0cC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF5bG9hZC5vbm1hdGNoKGRhdGEucGFyYW1zLCBwYXRoLCBtYXRjaGVkUm91dGUpXG5cdFx0XHRcdFx0XHRcdH0pLnRoZW4odXBkYXRlLCBmYWlsKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB1cGRhdGUoXCJkaXZcIilcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmYWlsKClcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgaXQgdW5jb25kaXRpb25hbGx5IHNvIGBtLnJvdXRlLnNldGAgYW5kIGBtLnJvdXRlLkxpbmtgIGJvdGggd29yayxcblx0XHQvLyBldmVuIGlmIG5laXRoZXIgYHB1c2hTdGF0ZWAgbm9yIGBoYXNoY2hhbmdlYCBhcmUgc3VwcG9ydGVkLiBJdCdzXG5cdFx0Ly8gY2xlYXJlZCBpZiBgaGFzaGNoYW5nZWAgaXMgdXNlZCwgc2luY2UgdGhhdCBtYWtlcyBpdCBhdXRvbWF0aWNhbGx5XG5cdFx0Ly8gYXN5bmMuXG5cdFx0ZmlyZUFzeW5jID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIXNjaGVkdWxlZCkge1xuXHRcdFx0XHRzY2hlZHVsZWQgPSB0cnVlXG5cdFx0XHRcdGNhbGxBc3luYyhyZXNvbHZlUm91dGUpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdG9ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGZpcmVBc3luYywgZmFsc2UpXG5cdFx0XHR9XG5cdFx0XHQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBmaXJlQXN5bmMsIGZhbHNlKVxuXHRcdH0gZWxzZSBpZiAocm91dGUucHJlZml4WzBdID09PSBcIiNcIikge1xuXHRcdFx0ZmlyZUFzeW5jID0gbnVsbFxuXHRcdFx0b25yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCByZXNvbHZlUm91dGUsIGZhbHNlKVxuXHRcdFx0fVxuXHRcdFx0JHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCByZXNvbHZlUm91dGUsIGZhbHNlKVxuXHRcdH1cblxuXHRcdHJldHVybiBtb3VudFJlZHJhdy5tb3VudChyb290LCB7XG5cdFx0XHRvbmJlZm9yZXVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHN0YXRlID0gc3RhdGUgPyAyIDogMVxuXHRcdFx0XHRyZXR1cm4gISghc3RhdGUgfHwgc2VudGluZWwgPT09IGN1cnJlbnRSZXNvbHZlcilcblx0XHRcdH0sXG5cdFx0XHRvbmNyZWF0ZTogcmVzb2x2ZVJvdXRlLFxuXHRcdFx0b25yZW1vdmU6IG9ucmVtb3ZlLFxuXHRcdFx0dmlldzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghc3RhdGUgfHwgc2VudGluZWwgPT09IGN1cnJlbnRSZXNvbHZlcikgcmV0dXJuXG5cdFx0XHRcdC8vIFdyYXAgaW4gYSBmcmFnbWVudCB0byBwcmVzZXJ2ZSBleGlzdGluZyBrZXkgc2VtYW50aWNzXG5cdFx0XHRcdHZhciB2bm9kZSA9IFtWbm9kZShjb21wb25lbnQsIGF0dHJzLmtleSwgYXR0cnMpXVxuXHRcdFx0XHRpZiAoY3VycmVudFJlc29sdmVyKSB2bm9kZSA9IGN1cnJlbnRSZXNvbHZlci5yZW5kZXIodm5vZGVbMF0pXG5cdFx0XHRcdHJldHVybiB2bm9kZVxuXHRcdFx0fSxcblx0XHR9KVxuXHR9XG5cdHJvdXRlLnNldCA9IGZ1bmN0aW9uKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHRpZiAobGFzdFVwZGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXHRcdFx0b3B0aW9ucy5yZXBsYWNlID0gdHJ1ZVxuXHRcdH1cblx0XHRsYXN0VXBkYXRlID0gbnVsbFxuXHRcdHNldFBhdGgocGF0aCwgZGF0YSwgb3B0aW9ucylcblx0fVxuXHRyb3V0ZS5nZXQgPSBmdW5jdGlvbigpIHtyZXR1cm4gY3VycmVudFBhdGh9XG5cdHJvdXRlLnByZWZpeCA9IFwiIyFcIlxuXHRyb3V0ZS5MaW5rID0ge1xuXHRcdHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHZub2RlLmF0dHJzLm9wdGlvbnNcblx0XHRcdC8vIFJlbW92ZSB0aGVzZSBzbyB0aGV5IGRvbid0IGdldCBvdmVyd3JpdHRlblxuXHRcdFx0dmFyIGF0dHJzID0ge30sIG9uY2xpY2ssIGhyZWZcblx0XHRcdGFzc2lnbihhdHRycywgdm5vZGUuYXR0cnMpXG5cdFx0XHQvLyBUaGUgZmlyc3QgdHdvIGFyZSBpbnRlcm5hbCwgYnV0IHRoZSByZXN0IGFyZSBtYWdpYyBhdHRyaWJ1dGVzXG5cdFx0XHQvLyB0aGF0IG5lZWQgY2Vuc29yZWQgdG8gbm90IHNjcmV3IHVwIHJlbmRlcmluZy5cblx0XHRcdGF0dHJzLnNlbGVjdG9yID0gYXR0cnMub3B0aW9ucyA9IGF0dHJzLmtleSA9IGF0dHJzLm9uaW5pdCA9XG5cdFx0XHRhdHRycy5vbmNyZWF0ZSA9IGF0dHJzLm9uYmVmb3JldXBkYXRlID0gYXR0cnMub251cGRhdGUgPVxuXHRcdFx0YXR0cnMub25iZWZvcmVyZW1vdmUgPSBhdHRycy5vbnJlbW92ZSA9IG51bGxcblxuXHRcdFx0Ly8gRG8gdGhpcyBub3cgc28gd2UgY2FuIGdldCB0aGUgbW9zdCBjdXJyZW50IGBocmVmYCBhbmQgYGRpc2FibGVkYC5cblx0XHRcdC8vIFRob3NlIGF0dHJpYnV0ZXMgbWF5IGFsc28gYmUgc3BlY2lmaWVkIGluIHRoZSBzZWxlY3RvciwgYW5kIHdlXG5cdFx0XHQvLyBzaG91bGQgaG9ub3IgdGhhdC5cblx0XHRcdHZhciBjaGlsZCA9IG0odm5vZGUuYXR0cnMuc2VsZWN0b3IgfHwgXCJhXCIsIGF0dHJzLCB2bm9kZS5jaGlsZHJlbilcblxuXHRcdFx0Ly8gTGV0J3MgcHJvdmlkZSBhICpyaWdodCogd2F5IHRvIGRpc2FibGUgYSByb3V0ZSBsaW5rLCByYXRoZXIgdGhhblxuXHRcdFx0Ly8gbGV0dGluZyBwZW9wbGUgc2NyZXcgdXAgYWNjZXNzaWJpbGl0eSBvbiBhY2NpZGVudC5cblx0XHRcdC8vXG5cdFx0XHQvLyBUaGUgYXR0cmlidXRlIGlzIGNvZXJjZWQgc28gdXNlcnMgZG9uJ3QgZ2V0IHN1cnByaXNlZCBvdmVyXG5cdFx0XHQvLyBgZGlzYWJsZWQ6IDBgIHJlc3VsdGluZyBpbiBhIGJ1dHRvbiB0aGF0J3Mgc29tZWhvdyByb3V0YWJsZVxuXHRcdFx0Ly8gZGVzcGl0ZSBiZWluZyB2aXNpYmx5IGRpc2FibGVkLlxuXHRcdFx0aWYgKGNoaWxkLmF0dHJzLmRpc2FibGVkID0gQm9vbGVhbihjaGlsZC5hdHRycy5kaXNhYmxlZCkpIHtcblx0XHRcdFx0Y2hpbGQuYXR0cnMuaHJlZiA9IG51bGxcblx0XHRcdFx0Y2hpbGQuYXR0cnNbXCJhcmlhLWRpc2FibGVkXCJdID0gXCJ0cnVlXCJcblx0XHRcdFx0Ly8gSWYgeW91ICpyZWFsbHkqIGRvIHdhbnQgdG8gZG8gdGhpcyBvbiBhIGRpc2FibGVkIGxpbmssIHVzZVxuXHRcdFx0XHQvLyBhbiBgb25jcmVhdGVgIGhvb2sgdG8gYWRkIGl0LlxuXHRcdFx0XHRjaGlsZC5hdHRycy5vbmNsaWNrID0gbnVsbFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b25jbGljayA9IGNoaWxkLmF0dHJzLm9uY2xpY2tcblx0XHRcdFx0aHJlZiA9IGNoaWxkLmF0dHJzLmhyZWZcblx0XHRcdFx0Y2hpbGQuYXR0cnMuaHJlZiA9IHJvdXRlLnByZWZpeCArIGhyZWZcblx0XHRcdFx0Y2hpbGQuYXR0cnMub25jbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBvbmNsaWNrID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IG9uY2xpY2suY2FsbChlLmN1cnJlbnRUYXJnZXQsIGUpXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChvbmNsaWNrID09IG51bGwgfHwgdHlwZW9mIG9uY2xpY2sgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdC8vIGRvIG5vdGhpbmdcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvbmNsaWNrLmhhbmRsZUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdG9uY2xpY2suaGFuZGxlRXZlbnQoZSlcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBBZGFwdGVkIGZyb20gUmVhY3QgUm91dGVyJ3MgaW1wbGVtZW50YXRpb246XG5cdFx0XHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0VHJhaW5pbmcvcmVhY3Qtcm91dGVyL2Jsb2IvNTIwYTBhY2Q0OGFlMWIwNjZlYjBiMDdkNmQ0ZDE3OTBhMWQwMjQ4Mi9wYWNrYWdlcy9yZWFjdC1yb3V0ZXItZG9tL21vZHVsZXMvTGluay5qc1xuXHRcdFx0XHRcdC8vXG5cdFx0XHRcdFx0Ly8gVHJ5IHRvIGJlIGZsZXhpYmxlIGFuZCBpbnR1aXRpdmUgaW4gaG93IHdlIGhhbmRsZSBsaW5rcy5cblx0XHRcdFx0XHQvLyBGdW4gZmFjdDogbGlua3MgYXJlbid0IGFzIG9idmlvdXMgdG8gZ2V0IHJpZ2h0IGFzIHlvdVxuXHRcdFx0XHRcdC8vIHdvdWxkIGV4cGVjdC4gVGhlcmUncyBhIGxvdCBtb3JlIHZhbGlkIHdheXMgdG8gY2xpY2sgYVxuXHRcdFx0XHRcdC8vIGxpbmsgdGhhbiB0aGlzLCBhbmQgb25lIG1pZ2h0IHdhbnQgdG8gbm90IHNpbXBseSBjbGljayBhXG5cdFx0XHRcdFx0Ly8gbGluaywgYnV0IHJpZ2h0IGNsaWNrIG9yIGNvbW1hbmQtY2xpY2sgaXQgdG8gY29weSB0aGVcblx0XHRcdFx0XHQvLyBsaW5rIHRhcmdldCwgZXRjLiBOb3BlLCB0aGlzIGlzbid0IGp1c3QgZm9yIGJsaW5kIHBlb3BsZS5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQvLyBTa2lwIGlmIGBvbmNsaWNrYCBwcmV2ZW50ZWQgZGVmYXVsdFxuXHRcdFx0XHRcdFx0cmVzdWx0ICE9PSBmYWxzZSAmJiAhZS5kZWZhdWx0UHJldmVudGVkICYmXG5cdFx0XHRcdFx0XHQvLyBJZ25vcmUgZXZlcnl0aGluZyBidXQgbGVmdCBjbGlja3Ncblx0XHRcdFx0XHRcdChlLmJ1dHRvbiA9PT0gMCB8fCBlLndoaWNoID09PSAwIHx8IGUud2hpY2ggPT09IDEpICYmXG5cdFx0XHRcdFx0XHQvLyBMZXQgdGhlIGJyb3dzZXIgaGFuZGxlIGB0YXJnZXQ9X2JsYW5rYCwgZXRjLlxuXHRcdFx0XHRcdFx0KCFlLmN1cnJlbnRUYXJnZXQudGFyZ2V0IHx8IGUuY3VycmVudFRhcmdldC50YXJnZXQgPT09IFwiX3NlbGZcIikgJiZcblx0XHRcdFx0XHRcdC8vIE5vIG1vZGlmaWVyIGtleXNcblx0XHRcdFx0XHRcdCFlLmN0cmxLZXkgJiYgIWUubWV0YUtleSAmJiAhZS5zaGlmdEtleSAmJiAhZS5hbHRLZXlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0ZS5yZWRyYXcgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cm91dGUuc2V0KGhyZWYsIG51bGwsIG9wdGlvbnMpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hpbGRcblx0XHR9LFxuXHR9XG5cdHJvdXRlLnBhcmFtID0gZnVuY3Rpb24oa2V5KSB7XG5cdFx0cmV0dXJuIGF0dHJzICYmIGtleSAhPSBudWxsID8gYXR0cnNba2V5XSA6IGF0dHJzXG5cdH1cblxuXHRyZXR1cm4gcm91dGVcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBoeXBlcnNjcmlwdCA9IHJlcXVpcmUoXCIuL3JlbmRlci9oeXBlcnNjcmlwdFwiKVxuXG5oeXBlcnNjcmlwdC50cnVzdCA9IHJlcXVpcmUoXCIuL3JlbmRlci90cnVzdFwiKVxuaHlwZXJzY3JpcHQuZnJhZ21lbnQgPSByZXF1aXJlKFwiLi9yZW5kZXIvZnJhZ21lbnRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBoeXBlcnNjcmlwdFxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGh5cGVyc2NyaXB0ID0gcmVxdWlyZShcIi4vaHlwZXJzY3JpcHRcIilcbnZhciByZXF1ZXN0ID0gcmVxdWlyZShcIi4vcmVxdWVzdFwiKVxudmFyIG1vdW50UmVkcmF3ID0gcmVxdWlyZShcIi4vbW91bnQtcmVkcmF3XCIpXG5cbnZhciBtID0gZnVuY3Rpb24gbSgpIHsgcmV0dXJuIGh5cGVyc2NyaXB0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfVxubS5tID0gaHlwZXJzY3JpcHRcbm0udHJ1c3QgPSBoeXBlcnNjcmlwdC50cnVzdFxubS5mcmFnbWVudCA9IGh5cGVyc2NyaXB0LmZyYWdtZW50XG5tLm1vdW50ID0gbW91bnRSZWRyYXcubW91bnRcbm0ucm91dGUgPSByZXF1aXJlKFwiLi9yb3V0ZVwiKVxubS5yZW5kZXIgPSByZXF1aXJlKFwiLi9yZW5kZXJcIilcbm0ucmVkcmF3ID0gbW91bnRSZWRyYXcucmVkcmF3XG5tLnJlcXVlc3QgPSByZXF1ZXN0LnJlcXVlc3Rcbm0uanNvbnAgPSByZXF1ZXN0Lmpzb25wXG5tLnBhcnNlUXVlcnlTdHJpbmcgPSByZXF1aXJlKFwiLi9xdWVyeXN0cmluZy9wYXJzZVwiKVxubS5idWlsZFF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4vcXVlcnlzdHJpbmcvYnVpbGRcIilcbm0ucGFyc2VQYXRobmFtZSA9IHJlcXVpcmUoXCIuL3BhdGhuYW1lL3BhcnNlXCIpXG5tLmJ1aWxkUGF0aG5hbWUgPSByZXF1aXJlKFwiLi9wYXRobmFtZS9idWlsZFwiKVxubS52bm9kZSA9IHJlcXVpcmUoXCIuL3JlbmRlci92bm9kZVwiKVxubS5Qcm9taXNlUG9seWZpbGwgPSByZXF1aXJlKFwiLi9wcm9taXNlL3BvbHlmaWxsXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gbVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIHJlbmRlciA9IHJlcXVpcmUoXCIuL3JlbmRlclwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2FwaS9tb3VudC1yZWRyYXdcIikocmVuZGVyLCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIGNvbnNvbGUpXG4iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UpIHtcblx0aWYoc291cmNlKSBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV0gfSlcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBidWlsZFF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4uL3F1ZXJ5c3RyaW5nL2J1aWxkXCIpXG52YXIgYXNzaWduID0gcmVxdWlyZShcIi4vYXNzaWduXCIpXG5cbi8vIFJldHVybnMgYHBhdGhgIGZyb20gYHRlbXBsYXRlYCArIGBwYXJhbXNgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlLCBwYXJhbXMpIHtcblx0aWYgKCgvOihbXlxcL1xcLi1dKykoXFwuezN9KT86LykudGVzdCh0ZW1wbGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJUZW1wbGF0ZSBwYXJhbWV0ZXIgbmFtZXMgKm11c3QqIGJlIHNlcGFyYXRlZFwiKVxuXHR9XG5cdGlmIChwYXJhbXMgPT0gbnVsbCkgcmV0dXJuIHRlbXBsYXRlXG5cdHZhciBxdWVyeUluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZihcIj9cIilcblx0dmFyIGhhc2hJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoXCIjXCIpXG5cdHZhciBxdWVyeUVuZCA9IGhhc2hJbmRleCA8IDAgPyB0ZW1wbGF0ZS5sZW5ndGggOiBoYXNoSW5kZXhcblx0dmFyIHBhdGhFbmQgPSBxdWVyeUluZGV4IDwgMCA/IHF1ZXJ5RW5kIDogcXVlcnlJbmRleFxuXHR2YXIgcGF0aCA9IHRlbXBsYXRlLnNsaWNlKDAsIHBhdGhFbmQpXG5cdHZhciBxdWVyeSA9IHt9XG5cblx0YXNzaWduKHF1ZXJ5LCBwYXJhbXMpXG5cblx0dmFyIHJlc29sdmVkID0gcGF0aC5yZXBsYWNlKC86KFteXFwvXFwuLV0rKShcXC57M30pPy9nLCBmdW5jdGlvbihtLCBrZXksIHZhcmlhZGljKSB7XG5cdFx0ZGVsZXRlIHF1ZXJ5W2tleV1cblx0XHQvLyBJZiBubyBzdWNoIHBhcmFtZXRlciBleGlzdHMsIGRvbid0IGludGVycG9sYXRlIGl0LlxuXHRcdGlmIChwYXJhbXNba2V5XSA9PSBudWxsKSByZXR1cm4gbVxuXHRcdC8vIEVzY2FwZSBub3JtYWwgcGFyYW1ldGVycywgYnV0IG5vdCB2YXJpYWRpYyBvbmVzLlxuXHRcdHJldHVybiB2YXJpYWRpYyA/IHBhcmFtc1trZXldIDogZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhwYXJhbXNba2V5XSkpXG5cdH0pXG5cblx0Ly8gSW4gY2FzZSB0aGUgdGVtcGxhdGUgc3Vic3RpdHV0aW9uIGFkZHMgbmV3IHF1ZXJ5L2hhc2ggcGFyYW1ldGVycy5cblx0dmFyIG5ld1F1ZXJ5SW5kZXggPSByZXNvbHZlZC5pbmRleE9mKFwiP1wiKVxuXHR2YXIgbmV3SGFzaEluZGV4ID0gcmVzb2x2ZWQuaW5kZXhPZihcIiNcIilcblx0dmFyIG5ld1F1ZXJ5RW5kID0gbmV3SGFzaEluZGV4IDwgMCA/IHJlc29sdmVkLmxlbmd0aCA6IG5ld0hhc2hJbmRleFxuXHR2YXIgbmV3UGF0aEVuZCA9IG5ld1F1ZXJ5SW5kZXggPCAwID8gbmV3UXVlcnlFbmQgOiBuZXdRdWVyeUluZGV4XG5cdHZhciByZXN1bHQgPSByZXNvbHZlZC5zbGljZSgwLCBuZXdQYXRoRW5kKVxuXG5cdGlmIChxdWVyeUluZGV4ID49IDApIHJlc3VsdCArPSB0ZW1wbGF0ZS5zbGljZShxdWVyeUluZGV4LCBxdWVyeUVuZClcblx0aWYgKG5ld1F1ZXJ5SW5kZXggPj0gMCkgcmVzdWx0ICs9IChxdWVyeUluZGV4IDwgMCA/IFwiP1wiIDogXCImXCIpICsgcmVzb2x2ZWQuc2xpY2UobmV3UXVlcnlJbmRleCwgbmV3UXVlcnlFbmQpXG5cdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcocXVlcnkpXG5cdGlmIChxdWVyeXN0cmluZykgcmVzdWx0ICs9IChxdWVyeUluZGV4IDwgMCAmJiBuZXdRdWVyeUluZGV4IDwgMCA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmdcblx0aWYgKGhhc2hJbmRleCA+PSAwKSByZXN1bHQgKz0gdGVtcGxhdGUuc2xpY2UoaGFzaEluZGV4KVxuXHRpZiAobmV3SGFzaEluZGV4ID49IDApIHJlc3VsdCArPSAoaGFzaEluZGV4IDwgMCA/IFwiXCIgOiBcIiZcIikgKyByZXNvbHZlZC5zbGljZShuZXdIYXNoSW5kZXgpXG5cdHJldHVybiByZXN1bHRcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBwYXJzZVBhdGhuYW1lID0gcmVxdWlyZShcIi4vcGFyc2VcIilcblxuLy8gQ29tcGlsZXMgYSB0ZW1wbGF0ZSBpbnRvIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIHJlc29sdmVkIHBhdGggKHdpdGhvdXQgcXVlcnlcbi8vIHN0cmluZ3MpIGFuZCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSB0ZW1wbGF0ZSBwYXJhbWV0ZXJzIHdpdGggdGhlaXJcbi8vIHBhcnNlZCB2YWx1ZXMuIFRoaXMgZXhwZWN0cyB0aGUgaW5wdXQgb2YgdGhlIGNvbXBpbGVkIHRlbXBsYXRlIHRvIGJlIHRoZVxuLy8gb3V0cHV0IG9mIGBwYXJzZVBhdGhuYW1lYC4gTm90ZSB0aGF0IGl0IGRvZXMgKm5vdCogcmVtb3ZlIHF1ZXJ5IHBhcmFtZXRlcnNcbi8vIHNwZWNpZmllZCBpbiB0aGUgdGVtcGxhdGUuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cdHZhciB0ZW1wbGF0ZURhdGEgPSBwYXJzZVBhdGhuYW1lKHRlbXBsYXRlKVxuXHR2YXIgdGVtcGxhdGVLZXlzID0gT2JqZWN0LmtleXModGVtcGxhdGVEYXRhLnBhcmFtcylcblx0dmFyIGtleXMgPSBbXVxuXHR2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIHRlbXBsYXRlRGF0YS5wYXRoLnJlcGxhY2UoXG5cdFx0Ly8gSSBlc2NhcGUgbGl0ZXJhbCB0ZXh0IHNvIHBlb3BsZSBjYW4gdXNlIHRoaW5ncyBsaWtlIGA6ZmlsZS46ZXh0YCBvclxuXHRcdC8vIGA6bGFuZy06bG9jYWxlYCBpbiByb3V0ZXMuIFRoaXMgaXMgYWxsIG1lcmdlZCBpbnRvIG9uZSBwYXNzIHNvIElcblx0XHQvLyBkb24ndCBhbHNvIGFjY2lkZW50YWxseSBlc2NhcGUgYC1gIGFuZCBtYWtlIGl0IGhhcmRlciB0byBkZXRlY3QgaXQgdG9cblx0XHQvLyBiYW4gaXQgZnJvbSB0ZW1wbGF0ZSBwYXJhbWV0ZXJzLlxuXHRcdC86KFteXFwvLi1dKykoXFwuezN9fFxcLig/IVxcLil8LSk/fFtcXFxcXiQqKy4oKXxcXFtcXF17fV0vZyxcblx0XHRmdW5jdGlvbihtLCBrZXksIGV4dHJhKSB7XG5cdFx0XHRpZiAoa2V5ID09IG51bGwpIHJldHVybiBcIlxcXFxcIiArIG1cblx0XHRcdGtleXMucHVzaCh7azoga2V5LCByOiBleHRyYSA9PT0gXCIuLi5cIn0pXG5cdFx0XHRpZiAoZXh0cmEgPT09IFwiLi4uXCIpIHJldHVybiBcIiguKilcIlxuXHRcdFx0aWYgKGV4dHJhID09PSBcIi5cIikgcmV0dXJuIFwiKFteL10rKVxcXFwuXCJcblx0XHRcdHJldHVybiBcIihbXi9dKylcIiArIChleHRyYSB8fCBcIlwiKVxuXHRcdH1cblx0KSArIFwiJFwiKVxuXHRyZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuXHRcdC8vIEZpcnN0LCBjaGVjayB0aGUgcGFyYW1zLiBVc3VhbGx5LCB0aGVyZSBpc24ndCBhbnksIGFuZCBpdCdzIGp1c3Rcblx0XHQvLyBjaGVja2luZyBhIHN0YXRpYyBzZXQuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZUtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0ZW1wbGF0ZURhdGEucGFyYW1zW3RlbXBsYXRlS2V5c1tpXV0gIT09IGRhdGEucGFyYW1zW3RlbXBsYXRlS2V5c1tpXV0pIHJldHVybiBmYWxzZVxuXHRcdH1cblx0XHQvLyBJZiBubyBpbnRlcnBvbGF0aW9ucyBleGlzdCwgbGV0J3Mgc2tpcCBhbGwgdGhlIGNlcmVtb255XG5cdFx0aWYgKCFrZXlzLmxlbmd0aCkgcmV0dXJuIHJlZ2V4cC50ZXN0KGRhdGEucGF0aClcblx0XHR2YXIgdmFsdWVzID0gcmVnZXhwLmV4ZWMoZGF0YS5wYXRoKVxuXHRcdGlmICh2YWx1ZXMgPT0gbnVsbCkgcmV0dXJuIGZhbHNlXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRkYXRhLnBhcmFtc1trZXlzW2ldLmtdID0ga2V5c1tpXS5yID8gdmFsdWVzW2kgKyAxXSA6IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaSArIDFdKVxuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgcGFyc2VRdWVyeVN0cmluZyA9IHJlcXVpcmUoXCIuLi9xdWVyeXN0cmluZy9wYXJzZVwiKVxuXG4vLyBSZXR1cm5zIGB7cGF0aCwgcGFyYW1zfWAgZnJvbSBgdXJsYFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwpIHtcblx0dmFyIHF1ZXJ5SW5kZXggPSB1cmwuaW5kZXhPZihcIj9cIilcblx0dmFyIGhhc2hJbmRleCA9IHVybC5pbmRleE9mKFwiI1wiKVxuXHR2YXIgcXVlcnlFbmQgPSBoYXNoSW5kZXggPCAwID8gdXJsLmxlbmd0aCA6IGhhc2hJbmRleFxuXHR2YXIgcGF0aEVuZCA9IHF1ZXJ5SW5kZXggPCAwID8gcXVlcnlFbmQgOiBxdWVyeUluZGV4XG5cdHZhciBwYXRoID0gdXJsLnNsaWNlKDAsIHBhdGhFbmQpLnJlcGxhY2UoL1xcL3syLH0vZywgXCIvXCIpXG5cblx0aWYgKCFwYXRoKSBwYXRoID0gXCIvXCJcblx0ZWxzZSB7XG5cdFx0aWYgKHBhdGhbMF0gIT09IFwiL1wiKSBwYXRoID0gXCIvXCIgKyBwYXRoXG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMSAmJiBwYXRoW3BhdGgubGVuZ3RoIC0gMV0gPT09IFwiL1wiKSBwYXRoID0gcGF0aC5zbGljZSgwLCAtMSlcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHBhdGg6IHBhdGgsXG5cdFx0cGFyYW1zOiBxdWVyeUluZGV4IDwgMFxuXHRcdFx0PyB7fVxuXHRcdFx0OiBwYXJzZVF1ZXJ5U3RyaW5nKHVybC5zbGljZShxdWVyeUluZGV4ICsgMSwgcXVlcnlFbmQpKSxcblx0fVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcbi8qKiBAY29uc3RydWN0b3IgKi9cbnZhciBQcm9taXNlUG9seWZpbGwgPSBmdW5jdGlvbihleGVjdXRvcikge1xuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZVBvbHlmaWxsKSkgdGhyb3cgbmV3IEVycm9yKFwiUHJvbWlzZSBtdXN0IGJlIGNhbGxlZCB3aXRoIGBuZXdgXCIpXG5cdGlmICh0eXBlb2YgZXhlY3V0b3IgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcImV4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvblwiKVxuXG5cdHZhciBzZWxmID0gdGhpcywgcmVzb2x2ZXJzID0gW10sIHJlamVjdG9ycyA9IFtdLCByZXNvbHZlQ3VycmVudCA9IGhhbmRsZXIocmVzb2x2ZXJzLCB0cnVlKSwgcmVqZWN0Q3VycmVudCA9IGhhbmRsZXIocmVqZWN0b3JzLCBmYWxzZSlcblx0dmFyIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2UgPSB7cmVzb2x2ZXJzOiByZXNvbHZlcnMsIHJlamVjdG9yczogcmVqZWN0b3JzfVxuXHR2YXIgY2FsbEFzeW5jID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRmdW5jdGlvbiBoYW5kbGVyKGxpc3QsIHNob3VsZEFic29yYikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBleGVjdXRlKHZhbHVlKSB7XG5cdFx0XHR2YXIgdGhlblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNob3VsZEFic29yYiAmJiB2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpICYmIHR5cGVvZiAodGhlbiA9IHZhbHVlLnRoZW4pID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IHNlbGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIHcvIGl0c2VsZlwiKVxuXHRcdFx0XHRcdGV4ZWN1dGVPbmNlKHRoZW4uYmluZCh2YWx1ZSkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2FsbEFzeW5jKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKCFzaG91bGRBYnNvcmIgJiYgbGlzdC5sZW5ndGggPT09IDApIGNvbnNvbGUuZXJyb3IoXCJQb3NzaWJsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246XCIsIHZhbHVlKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSBsaXN0W2ldKHZhbHVlKVxuXHRcdFx0XHRcdFx0cmVzb2x2ZXJzLmxlbmd0aCA9IDAsIHJlamVjdG9ycy5sZW5ndGggPSAwXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5zdGF0ZSA9IHNob3VsZEFic29yYlxuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmV0cnkgPSBmdW5jdGlvbigpIHtleGVjdXRlKHZhbHVlKX1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRyZWplY3RDdXJyZW50KGUpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGV4ZWN1dGVPbmNlKHRoZW4pIHtcblx0XHR2YXIgcnVucyA9IDBcblx0XHRmdW5jdGlvbiBydW4oZm4pIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAocnVucysrID4gMCkgcmV0dXJuXG5cdFx0XHRcdGZuKHZhbHVlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb25lcnJvciA9IHJ1bihyZWplY3RDdXJyZW50KVxuXHRcdHRyeSB7dGhlbihydW4ocmVzb2x2ZUN1cnJlbnQpLCBvbmVycm9yKX0gY2F0Y2ggKGUpIHtvbmVycm9yKGUpfVxuXHR9XG5cblx0ZXhlY3V0ZU9uY2UoZXhlY3V0b3IpXG59XG5Qcm9taXNlUG9seWZpbGwucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3Rpb24pIHtcblx0dmFyIHNlbGYgPSB0aGlzLCBpbnN0YW5jZSA9IHNlbGYuX2luc3RhbmNlXG5cdGZ1bmN0aW9uIGhhbmRsZShjYWxsYmFjaywgbGlzdCwgbmV4dCwgc3RhdGUpIHtcblx0XHRsaXN0LnB1c2goZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgbmV4dCh2YWx1ZSlcblx0XHRcdGVsc2UgdHJ5IHtyZXNvbHZlTmV4dChjYWxsYmFjayh2YWx1ZSkpfSBjYXRjaCAoZSkge2lmIChyZWplY3ROZXh0KSByZWplY3ROZXh0KGUpfVxuXHRcdH0pXG5cdFx0aWYgKHR5cGVvZiBpbnN0YW5jZS5yZXRyeSA9PT0gXCJmdW5jdGlvblwiICYmIHN0YXRlID09PSBpbnN0YW5jZS5zdGF0ZSkgaW5zdGFuY2UucmV0cnkoKVxuXHR9XG5cdHZhciByZXNvbHZlTmV4dCwgcmVqZWN0TmV4dFxuXHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7cmVzb2x2ZU5leHQgPSByZXNvbHZlLCByZWplY3ROZXh0ID0gcmVqZWN0fSlcblx0aGFuZGxlKG9uRnVsZmlsbGVkLCBpbnN0YW5jZS5yZXNvbHZlcnMsIHJlc29sdmVOZXh0LCB0cnVlKSwgaGFuZGxlKG9uUmVqZWN0aW9uLCBpbnN0YW5jZS5yZWplY3RvcnMsIHJlamVjdE5leHQsIGZhbHNlKVxuXHRyZXR1cm4gcHJvbWlzZVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS5jYXRjaCA9IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XG5cdHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pXG59XG5Qcm9taXNlUG9seWZpbGwucHJvdG90eXBlLmZpbmFsbHkgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRyZXR1cm4gdGhpcy50aGVuKFxuXHRcdGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlXG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0ZnVuY3Rpb24ocmVhc29uKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2VQb2x5ZmlsbC5yZWplY3QocmVhc29uKTtcblx0XHRcdH0pXG5cdFx0fVxuXHQpXG59XG5Qcm9taXNlUG9seWZpbGwucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2VQb2x5ZmlsbCkgcmV0dXJuIHZhbHVlXG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUpIHtyZXNvbHZlKHZhbHVlKX0pXG59XG5Qcm9taXNlUG9seWZpbGwucmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7cmVqZWN0KHZhbHVlKX0pXG59XG5Qcm9taXNlUG9seWZpbGwuYWxsID0gZnVuY3Rpb24obGlzdCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHR2YXIgdG90YWwgPSBsaXN0Lmxlbmd0aCwgY291bnQgPSAwLCB2YWx1ZXMgPSBbXVxuXHRcdGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkgcmVzb2x2ZShbXSlcblx0XHRlbHNlIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0KGZ1bmN0aW9uKGkpIHtcblx0XHRcdFx0ZnVuY3Rpb24gY29uc3VtZSh2YWx1ZSkge1xuXHRcdFx0XHRcdGNvdW50Kytcblx0XHRcdFx0XHR2YWx1ZXNbaV0gPSB2YWx1ZVxuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gdG90YWwpIHJlc29sdmUodmFsdWVzKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChsaXN0W2ldICE9IG51bGwgJiYgKHR5cGVvZiBsaXN0W2ldID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBsaXN0W2ldID09PSBcImZ1bmN0aW9uXCIpICYmIHR5cGVvZiBsaXN0W2ldLnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGxpc3RbaV0udGhlbihjb25zdW1lLCByZWplY3QpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBjb25zdW1lKGxpc3RbaV0pXG5cdFx0XHR9KShpKVxuXHRcdH1cblx0fSlcbn1cblByb21pc2VQb2x5ZmlsbC5yYWNlID0gZnVuY3Rpb24obGlzdCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxpc3RbaV0udGhlbihyZXNvbHZlLCByZWplY3QpXG5cdFx0fVxuXHR9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2VQb2x5ZmlsbFxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFByb21pc2VQb2x5ZmlsbCA9IHJlcXVpcmUoXCIuL3BvbHlmaWxsXCIpXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2Ygd2luZG93LlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHR3aW5kb3cuUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxuXHR9IGVsc2UgaWYgKCF3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseSkge1xuXHRcdHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS5maW5hbGx5ID0gUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS5maW5hbGx5XG5cdH1cblx0bW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuUHJvbWlzZVxufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsLlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRnbG9iYWwuUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxuXHR9IGVsc2UgaWYgKCFnbG9iYWwuUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseSkge1xuXHRcdGdsb2JhbC5Qcm9taXNlLnByb3RvdHlwZS5maW5hbGx5ID0gUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS5maW5hbGx5XG5cdH1cblx0bW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuUHJvbWlzZVxufSBlbHNlIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlUG9seWZpbGxcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikgcmV0dXJuIFwiXCJcblxuXHR2YXIgYXJncyA9IFtdXG5cdGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcblx0XHRkZXN0cnVjdHVyZShrZXksIG9iamVjdFtrZXldKVxuXHR9XG5cblx0cmV0dXJuIGFyZ3Muam9pbihcIiZcIilcblxuXHRmdW5jdGlvbiBkZXN0cnVjdHVyZShrZXksIHZhbHVlKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGRlc3RydWN0dXJlKGtleSArIFwiW1wiICsgaSArIFwiXVwiLCB2YWx1ZVtpXSlcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuXHRcdFx0Zm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkgKyBcIltcIiArIGkgKyBcIl1cIiwgdmFsdWVbaV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgYXJncy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IFwiXCIgPyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkgOiBcIlwiKSlcblx0fVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0aWYgKHN0cmluZyA9PT0gXCJcIiB8fCBzdHJpbmcgPT0gbnVsbCkgcmV0dXJuIHt9XG5cdGlmIChzdHJpbmcuY2hhckF0KDApID09PSBcIj9cIikgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDEpXG5cblx0dmFyIGVudHJpZXMgPSBzdHJpbmcuc3BsaXQoXCImXCIpLCBjb3VudGVycyA9IHt9LCBkYXRhID0ge31cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudHJ5ID0gZW50cmllc1tpXS5zcGxpdChcIj1cIilcblx0XHR2YXIga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGVudHJ5WzBdKVxuXHRcdHZhciB2YWx1ZSA9IGVudHJ5Lmxlbmd0aCA9PT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChlbnRyeVsxXSkgOiBcIlwiXG5cblx0XHRpZiAodmFsdWUgPT09IFwidHJ1ZVwiKSB2YWx1ZSA9IHRydWVcblx0XHRlbHNlIGlmICh2YWx1ZSA9PT0gXCJmYWxzZVwiKSB2YWx1ZSA9IGZhbHNlXG5cblx0XHR2YXIgbGV2ZWxzID0ga2V5LnNwbGl0KC9cXF1cXFs/fFxcWy8pXG5cdFx0dmFyIGN1cnNvciA9IGRhdGFcblx0XHRpZiAoa2V5LmluZGV4T2YoXCJbXCIpID4gLTEpIGxldmVscy5wb3AoKVxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGV2ZWxzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHR2YXIgbGV2ZWwgPSBsZXZlbHNbal0sIG5leHRMZXZlbCA9IGxldmVsc1tqICsgMV1cblx0XHRcdHZhciBpc051bWJlciA9IG5leHRMZXZlbCA9PSBcIlwiIHx8ICFpc05hTihwYXJzZUludChuZXh0TGV2ZWwsIDEwKSlcblx0XHRcdGlmIChsZXZlbCA9PT0gXCJcIikge1xuXHRcdFx0XHR2YXIga2V5ID0gbGV2ZWxzLnNsaWNlKDAsIGopLmpvaW4oKVxuXHRcdFx0XHRpZiAoY291bnRlcnNba2V5XSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y291bnRlcnNba2V5XSA9IEFycmF5LmlzQXJyYXkoY3Vyc29yKSA/IGN1cnNvci5sZW5ndGggOiAwXG5cdFx0XHRcdH1cblx0XHRcdFx0bGV2ZWwgPSBjb3VudGVyc1trZXldKytcblx0XHRcdH1cblx0XHRcdC8vIERpc2FsbG93IGRpcmVjdCBwcm90b3R5cGUgcG9sbHV0aW9uXG5cdFx0XHRlbHNlIGlmIChsZXZlbCA9PT0gXCJfX3Byb3RvX19cIikgYnJlYWtcblx0XHRcdGlmIChqID09PSBsZXZlbHMubGVuZ3RoIC0gMSkgY3Vyc29yW2xldmVsXSA9IHZhbHVlXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gUmVhZCBvd24gcHJvcGVydGllcyBleGNsdXNpdmVseSB0byBkaXNhbGxvdyBpbmRpcmVjdFxuXHRcdFx0XHQvLyBwcm90b3R5cGUgcG9sbHV0aW9uXG5cdFx0XHRcdHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjdXJzb3IsIGxldmVsKVxuXHRcdFx0XHRpZiAoZGVzYyAhPSBudWxsKSBkZXNjID0gZGVzYy52YWx1ZVxuXHRcdFx0XHRpZiAoZGVzYyA9PSBudWxsKSBjdXJzb3JbbGV2ZWxdID0gZGVzYyA9IGlzTnVtYmVyID8gW10gOiB7fVxuXHRcdFx0XHRjdXJzb3IgPSBkZXNjXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3JlbmRlci9yZW5kZXJcIikod2luZG93KVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxudmFyIGh5cGVyc2NyaXB0Vm5vZGUgPSByZXF1aXJlKFwiLi9oeXBlcnNjcmlwdFZub2RlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB2bm9kZSA9IGh5cGVyc2NyaXB0Vm5vZGUuYXBwbHkoMCwgYXJndW1lbnRzKVxuXG5cdHZub2RlLnRhZyA9IFwiW1wiXG5cdHZub2RlLmNoaWxkcmVuID0gVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4odm5vZGUuY2hpbGRyZW4pXG5cdHJldHVybiB2bm9kZVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxudmFyIGh5cGVyc2NyaXB0Vm5vZGUgPSByZXF1aXJlKFwiLi9oeXBlcnNjcmlwdFZub2RlXCIpXG5cbnZhciBzZWxlY3RvclBhcnNlciA9IC8oPzooXnwjfFxcLikoW14jXFwuXFxbXFxdXSspKXwoXFxbKC4rPykoPzpcXHMqPVxccyooXCJ8J3wpKCg/OlxcXFxbXCInXFxdXXwuKSo/KVxcNSk/XFxdKS9nXG52YXIgc2VsZWN0b3JDYWNoZSA9IHt9XG52YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHlcblxuZnVuY3Rpb24gaXNFbXB0eShvYmplY3QpIHtcblx0Zm9yICh2YXIga2V5IGluIG9iamVjdCkgaWYgKGhhc093bi5jYWxsKG9iamVjdCwga2V5KSkgcmV0dXJuIGZhbHNlXG5cdHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcikge1xuXHR2YXIgbWF0Y2gsIHRhZyA9IFwiZGl2XCIsIGNsYXNzZXMgPSBbXSwgYXR0cnMgPSB7fVxuXHR3aGlsZSAobWF0Y2ggPSBzZWxlY3RvclBhcnNlci5leGVjKHNlbGVjdG9yKSkge1xuXHRcdHZhciB0eXBlID0gbWF0Y2hbMV0sIHZhbHVlID0gbWF0Y2hbMl1cblx0XHRpZiAodHlwZSA9PT0gXCJcIiAmJiB2YWx1ZSAhPT0gXCJcIikgdGFnID0gdmFsdWVcblx0XHRlbHNlIGlmICh0eXBlID09PSBcIiNcIikgYXR0cnMuaWQgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiLlwiKSBjbGFzc2VzLnB1c2godmFsdWUpXG5cdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XG5cdFx0XHR2YXIgYXR0clZhbHVlID0gbWF0Y2hbNl1cblx0XHRcdGlmIChhdHRyVmFsdWUpIGF0dHJWYWx1ZSA9IGF0dHJWYWx1ZS5yZXBsYWNlKC9cXFxcKFtcIiddKS9nLCBcIiQxXCIpLnJlcGxhY2UoL1xcXFxcXFxcL2csIFwiXFxcXFwiKVxuXHRcdFx0aWYgKG1hdGNoWzRdID09PSBcImNsYXNzXCIpIGNsYXNzZXMucHVzaChhdHRyVmFsdWUpXG5cdFx0XHRlbHNlIGF0dHJzW21hdGNoWzRdXSA9IGF0dHJWYWx1ZSA9PT0gXCJcIiA/IGF0dHJWYWx1ZSA6IGF0dHJWYWx1ZSB8fCB0cnVlXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc2VzLmxlbmd0aCA+IDApIGF0dHJzLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIilcblx0cmV0dXJuIHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdID0ge3RhZzogdGFnLCBhdHRyczogYXR0cnN9XG59XG5cbmZ1bmN0aW9uIGV4ZWNTZWxlY3RvcihzdGF0ZSwgdm5vZGUpIHtcblx0dmFyIGF0dHJzID0gdm5vZGUuYXR0cnNcblx0dmFyIGNoaWxkcmVuID0gVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4odm5vZGUuY2hpbGRyZW4pXG5cdHZhciBoYXNDbGFzcyA9IGhhc093bi5jYWxsKGF0dHJzLCBcImNsYXNzXCIpXG5cdHZhciBjbGFzc05hbWUgPSBoYXNDbGFzcyA/IGF0dHJzLmNsYXNzIDogYXR0cnMuY2xhc3NOYW1lXG5cblx0dm5vZGUudGFnID0gc3RhdGUudGFnXG5cdHZub2RlLmF0dHJzID0gbnVsbFxuXHR2bm9kZS5jaGlsZHJlbiA9IHVuZGVmaW5lZFxuXG5cdGlmICghaXNFbXB0eShzdGF0ZS5hdHRycykgJiYgIWlzRW1wdHkoYXR0cnMpKSB7XG5cdFx0dmFyIG5ld0F0dHJzID0ge31cblxuXHRcdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBrZXkpKSBuZXdBdHRyc1trZXldID0gYXR0cnNba2V5XVxuXHRcdH1cblxuXHRcdGF0dHJzID0gbmV3QXR0cnNcblx0fVxuXG5cdGZvciAodmFyIGtleSBpbiBzdGF0ZS5hdHRycykge1xuXHRcdGlmIChoYXNPd24uY2FsbChzdGF0ZS5hdHRycywga2V5KSAmJiBrZXkgIT09IFwiY2xhc3NOYW1lXCIgJiYgIWhhc093bi5jYWxsKGF0dHJzLCBrZXkpKXtcblx0XHRcdGF0dHJzW2tleV0gPSBzdGF0ZS5hdHRyc1trZXldXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc05hbWUgIT0gbnVsbCB8fCBzdGF0ZS5hdHRycy5jbGFzc05hbWUgIT0gbnVsbCkgYXR0cnMuY2xhc3NOYW1lID1cblx0XHRjbGFzc05hbWUgIT0gbnVsbFxuXHRcdFx0PyBzdGF0ZS5hdHRycy5jbGFzc05hbWUgIT0gbnVsbFxuXHRcdFx0XHQ/IFN0cmluZyhzdGF0ZS5hdHRycy5jbGFzc05hbWUpICsgXCIgXCIgKyBTdHJpbmcoY2xhc3NOYW1lKVxuXHRcdFx0XHQ6IGNsYXNzTmFtZVxuXHRcdFx0OiBzdGF0ZS5hdHRycy5jbGFzc05hbWUgIT0gbnVsbFxuXHRcdFx0XHQ/IHN0YXRlLmF0dHJzLmNsYXNzTmFtZVxuXHRcdFx0XHQ6IG51bGxcblxuXHRpZiAoaGFzQ2xhc3MpIGF0dHJzLmNsYXNzID0gbnVsbFxuXG5cdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdGlmIChoYXNPd24uY2FsbChhdHRycywga2V5KSAmJiBrZXkgIT09IFwia2V5XCIpIHtcblx0XHRcdHZub2RlLmF0dHJzID0gYXR0cnNcblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG5cblx0aWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXSAhPSBudWxsICYmIGNoaWxkcmVuWzBdLnRhZyA9PT0gXCIjXCIpIHtcblx0XHR2bm9kZS50ZXh0ID0gY2hpbGRyZW5bMF0uY2hpbGRyZW5cblx0fSBlbHNlIHtcblx0XHR2bm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuXG5cdH1cblxuXHRyZXR1cm4gdm5vZGVcbn1cblxuZnVuY3Rpb24gaHlwZXJzY3JpcHQoc2VsZWN0b3IpIHtcblx0aWYgKHNlbGVjdG9yID09IG51bGwgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzZWxlY3Rvci52aWV3ICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBFcnJvcihcIlRoZSBzZWxlY3RvciBtdXN0IGJlIGVpdGhlciBhIHN0cmluZyBvciBhIGNvbXBvbmVudC5cIik7XG5cdH1cblxuXHR2YXIgdm5vZGUgPSBoeXBlcnNjcmlwdFZub2RlLmFwcGx5KDEsIGFyZ3VtZW50cylcblxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dm5vZGUuY2hpbGRyZW4gPSBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbih2bm9kZS5jaGlsZHJlbilcblx0XHRpZiAoc2VsZWN0b3IgIT09IFwiW1wiKSByZXR1cm4gZXhlY1NlbGVjdG9yKHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdIHx8IGNvbXBpbGVTZWxlY3RvcihzZWxlY3RvciksIHZub2RlKVxuXHR9XG5cblx0dm5vZGUudGFnID0gc2VsZWN0b3Jcblx0cmV0dXJuIHZub2RlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwZXJzY3JpcHRcbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcblxuLy8gQ2FsbCB2aWEgYGh5cGVyc2NyaXB0Vm5vZGUuYXBwbHkoc3RhcnRPZmZzZXQsIGFyZ3VtZW50cylgXG4vL1xuLy8gVGhlIHJlYXNvbiBJIGRvIGl0IHRoaXMgd2F5LCBmb3J3YXJkaW5nIHRoZSBhcmd1bWVudHMgYW5kIHBhc3NpbmcgdGhlIHN0YXJ0XG4vLyBvZmZzZXQgaW4gYHRoaXNgLCBpcyBzbyBJIGRvbid0IGhhdmUgdG8gY3JlYXRlIGEgdGVtcG9yYXJ5IGFycmF5IGluIGFcbi8vIHBlcmZvcm1hbmNlLWNyaXRpY2FsIHBhdGguXG4vL1xuLy8gSW4gbmF0aXZlIEVTNiwgSSdkIGluc3RlYWQgYWRkIGEgZmluYWwgYC4uLmFyZ3NgIHBhcmFtZXRlciB0byB0aGVcbi8vIGBoeXBlcnNjcmlwdGAgYW5kIGBmcmFnbWVudGAgZmFjdG9yaWVzIGFuZCBkZWZpbmUgdGhpcyBhc1xuLy8gYGh5cGVyc2NyaXB0Vm5vZGUoLi4uYXJncylgLCBzaW5jZSBtb2Rlcm4gZW5naW5lcyBkbyBvcHRpbWl6ZSB0aGF0IGF3YXkuIEJ1dFxuLy8gRVM1ICh3aGF0IE1pdGhyaWwgcmVxdWlyZXMgdGhhbmtzIHRvIElFIHN1cHBvcnQpIGRvZXNuJ3QgZ2l2ZSBtZSB0aGF0IGx1eHVyeSxcbi8vIGFuZCBlbmdpbmVzIGFyZW4ndCBuZWFybHkgaW50ZWxsaWdlbnQgZW5vdWdoIHRvIGRvIGVpdGhlciBvZiB0aGVzZTpcbi8vXG4vLyAxLiBFbGlkZSB0aGUgYWxsb2NhdGlvbiBmb3IgYFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKWAgd2hlbiBpdCdzIHBhc3NlZCB0b1xuLy8gICAgYW5vdGhlciBmdW5jdGlvbiBvbmx5IHRvIGJlIGluZGV4ZWQuXG4vLyAyLiBFbGlkZSBhbiBgYXJndW1lbnRzYCBhbGxvY2F0aW9uIHdoZW4gaXQncyBwYXNzZWQgdG8gYW55IGZ1bmN0aW9uIG90aGVyXG4vLyAgICB0aGFuIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgIG9yIGBSZWZsZWN0LmFwcGx5YC5cbi8vXG4vLyBJbiBFUzYsIGl0J2QgcHJvYmFibHkgbG9vayBjbG9zZXIgdG8gdGhpcyAoSSdkIG5lZWQgdG8gcHJvZmlsZSBpdCwgdGhvdWdoKTpcbi8vIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXR0cnMsIC4uLmNoaWxkcmVuKSB7XG4vLyAgICAgaWYgKGF0dHJzID09IG51bGwgfHwgdHlwZW9mIGF0dHJzID09PSBcIm9iamVjdFwiICYmIGF0dHJzLnRhZyA9PSBudWxsICYmICFBcnJheS5pc0FycmF5KGF0dHJzKSkge1xuLy8gICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIEFycmF5LmlzQXJyYXkoY2hpbGRyZW5bMF0pKSBjaGlsZHJlbiA9IGNoaWxkcmVuWzBdXG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgY2hpbGRyZW4gPSBjaGlsZHJlbi5sZW5ndGggPT09IDAgJiYgQXJyYXkuaXNBcnJheShhdHRycykgPyBhdHRycyA6IFthdHRycywgLi4uY2hpbGRyZW5dXG4vLyAgICAgICAgIGF0dHJzID0gdW5kZWZpbmVkXG4vLyAgICAgfVxuLy9cbi8vICAgICBpZiAoYXR0cnMgPT0gbnVsbCkgYXR0cnMgPSB7fVxuLy8gICAgIHJldHVybiBWbm9kZShcIlwiLCBhdHRycy5rZXksIGF0dHJzLCBjaGlsZHJlbilcbi8vIH1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBhdHRycyA9IGFyZ3VtZW50c1t0aGlzXSwgc3RhcnQgPSB0aGlzICsgMSwgY2hpbGRyZW5cblxuXHRpZiAoYXR0cnMgPT0gbnVsbCkge1xuXHRcdGF0dHJzID0ge31cblx0fSBlbHNlIGlmICh0eXBlb2YgYXR0cnMgIT09IFwib2JqZWN0XCIgfHwgYXR0cnMudGFnICE9IG51bGwgfHwgQXJyYXkuaXNBcnJheShhdHRycykpIHtcblx0XHRhdHRycyA9IHt9XG5cdFx0c3RhcnQgPSB0aGlzXG5cdH1cblxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gc3RhcnQgKyAxKSB7XG5cdFx0Y2hpbGRyZW4gPSBhcmd1bWVudHNbc3RhcnRdXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkgY2hpbGRyZW4gPSBbY2hpbGRyZW5dXG5cdH0gZWxzZSB7XG5cdFx0Y2hpbGRyZW4gPSBbXVxuXHRcdHdoaWxlIChzdGFydCA8IGFyZ3VtZW50cy5sZW5ndGgpIGNoaWxkcmVuLnB1c2goYXJndW1lbnRzW3N0YXJ0KytdKVxuXHR9XG5cblx0cmV0dXJuIFZub2RlKFwiXCIsIGF0dHJzLmtleSwgYXR0cnMsIGNoaWxkcmVuKVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyICRkb2MgPSAkd2luZG93ICYmICR3aW5kb3cuZG9jdW1lbnRcblx0dmFyIGN1cnJlbnRSZWRyYXdcblxuXHR2YXIgbmFtZVNwYWNlID0ge1xuXHRcdHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuXHRcdG1hdGg6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiXG5cdH1cblxuXHRmdW5jdGlvbiBnZXROYW1lU3BhY2Uodm5vZGUpIHtcblx0XHRyZXR1cm4gdm5vZGUuYXR0cnMgJiYgdm5vZGUuYXR0cnMueG1sbnMgfHwgbmFtZVNwYWNlW3Zub2RlLnRhZ11cblx0fVxuXG5cdC8vc2FuaXR5IGNoZWNrIHRvIGRpc2NvdXJhZ2UgcGVvcGxlIGZyb20gZG9pbmcgYHZub2RlLnN0YXRlID0gLi4uYFxuXHRmdW5jdGlvbiBjaGVja1N0YXRlKHZub2RlLCBvcmlnaW5hbCkge1xuXHRcdGlmICh2bm9kZS5zdGF0ZSAhPT0gb3JpZ2luYWwpIHRocm93IG5ldyBFcnJvcihcImB2bm9kZS5zdGF0ZWAgbXVzdCBub3QgYmUgbW9kaWZpZWRcIilcblx0fVxuXG5cdC8vTm90ZTogdGhlIGhvb2sgaXMgcGFzc2VkIGFzIHRoZSBgdGhpc2AgYXJndW1lbnQgdG8gYWxsb3cgcHJveHlpbmcgdGhlXG5cdC8vYXJndW1lbnRzIHdpdGhvdXQgcmVxdWlyaW5nIGEgZnVsbCBhcnJheSBhbGxvY2F0aW9uIHRvIGRvIHNvLiBJdCBhbHNvXG5cdC8vdGFrZXMgYWR2YW50YWdlIG9mIHRoZSBmYWN0IHRoZSBjdXJyZW50IGB2bm9kZWAgaXMgdGhlIGZpcnN0IGFyZ3VtZW50IGluXG5cdC8vYWxsIGxpZmVjeWNsZSBtZXRob2RzLlxuXHRmdW5jdGlvbiBjYWxsSG9vayh2bm9kZSkge1xuXHRcdHZhciBvcmlnaW5hbCA9IHZub2RlLnN0YXRlXG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiB0aGlzLmFwcGx5KG9yaWdpbmFsLCBhcmd1bWVudHMpXG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGNoZWNrU3RhdGUodm5vZGUsIG9yaWdpbmFsKVxuXHRcdH1cblx0fVxuXG5cdC8vIElFMTEgKGF0IGxlYXN0KSB0aHJvd3MgYW4gVW5zcGVjaWZpZWRFcnJvciB3aGVuIGFjY2Vzc2luZyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IHdoZW5cblx0Ly8gaW5zaWRlIGFuIGlmcmFtZS4gQ2F0Y2ggYW5kIHN3YWxsb3cgdGhpcyBlcnJvciwgYW5kIGhlYXZ5LWhhbmRpZGx5IHJldHVybiBudWxsLlxuXHRmdW5jdGlvbiBhY3RpdmVFbGVtZW50KCkge1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gJGRvYy5hY3RpdmVFbGVtZW50XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR9XG5cdH1cblx0Ly9jcmVhdGVcblx0ZnVuY3Rpb24gY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCBlbmQsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHRjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAodHlwZW9mIHRhZyA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB7fVxuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRcdHN3aXRjaCAodGFnKSB7XG5cdFx0XHRcdGNhc2UgXCIjXCI6IGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpOyBicmVha1xuXHRcdFx0XHRjYXNlIFwiPFwiOiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5zLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdGNhc2UgXCJbXCI6IGNyZWF0ZUZyYWdtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpOyBicmVha1xuXHRcdFx0XHRkZWZhdWx0OiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgY3JlYXRlQ29tcG9uZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlVGV4dChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdHZub2RlLmRvbSA9ICRkb2MuY3JlYXRlVGV4dE5vZGUodm5vZGUuY2hpbGRyZW4pXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIHZub2RlLmRvbSwgbmV4dFNpYmxpbmcpXG5cdH1cblx0dmFyIHBvc3NpYmxlUGFyZW50cyA9IHtjYXB0aW9uOiBcInRhYmxlXCIsIHRoZWFkOiBcInRhYmxlXCIsIHRib2R5OiBcInRhYmxlXCIsIHRmb290OiBcInRhYmxlXCIsIHRyOiBcInRib2R5XCIsIHRoOiBcInRyXCIsIHRkOiBcInRyXCIsIGNvbGdyb3VwOiBcInRhYmxlXCIsIGNvbDogXCJjb2xncm91cFwifVxuXHRmdW5jdGlvbiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciBtYXRjaCA9IHZub2RlLmNoaWxkcmVuLm1hdGNoKC9eXFxzKj88KFxcdyspL2ltKSB8fCBbXVxuXHRcdC8vIG5vdCB1c2luZyB0aGUgcHJvcGVyIHBhcmVudCBtYWtlcyB0aGUgY2hpbGQgZWxlbWVudChzKSB2YW5pc2guXG5cdFx0Ly8gICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5cdFx0Ly8gICAgIGRpdi5pbm5lckhUTUwgPSBcIjx0ZD5pPC90ZD48dGQ+ajwvdGQ+XCJcblx0XHQvLyAgICAgY29uc29sZS5sb2coZGl2LmlubmVySFRNTClcblx0XHQvLyAtLT4gXCJpalwiLCBubyA8dGQ+IGluIHNpZ2h0LlxuXHRcdHZhciB0ZW1wID0gJGRvYy5jcmVhdGVFbGVtZW50KHBvc3NpYmxlUGFyZW50c1ttYXRjaFsxXV0gfHwgXCJkaXZcIilcblx0XHRpZiAobnMgPT09IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIikge1xuXHRcdFx0dGVtcC5pbm5lckhUTUwgPSBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIj5cIiArIHZub2RlLmNoaWxkcmVuICsgXCI8L3N2Zz5cIlxuXHRcdFx0dGVtcCA9IHRlbXAuZmlyc3RDaGlsZFxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0ZW1wLmlubmVySFRNTCA9IHZub2RlLmNoaWxkcmVuXG5cdFx0fVxuXHRcdHZub2RlLmRvbSA9IHRlbXAuZmlyc3RDaGlsZFxuXHRcdHZub2RlLmRvbVNpemUgPSB0ZW1wLmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0Ly8gQ2FwdHVyZSBub2RlcyB0byByZW1vdmUsIHNvIHdlIGRvbid0IGNvbmZ1c2UgdGhlbS5cblx0XHR2bm9kZS5pbnN0YW5jZSA9IFtdXG5cdFx0dmFyIGZyYWdtZW50ID0gJGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHR2YXIgY2hpbGRcblx0XHR3aGlsZSAoY2hpbGQgPSB0ZW1wLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHZub2RlLmluc3RhbmNlLnB1c2goY2hpbGQpXG5cdFx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZClcblx0XHR9XG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGZyYWdtZW50LCBuZXh0U2libGluZylcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVGcmFnbWVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIGZyYWdtZW50ID0gJGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHRpZiAodm5vZGUuY2hpbGRyZW4gIT0gbnVsbCkge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdGNyZWF0ZU5vZGVzKGZyYWdtZW50LCBjaGlsZHJlbiwgMCwgY2hpbGRyZW4ubGVuZ3RoLCBob29rcywgbnVsbCwgbnMpXG5cdFx0fVxuXHRcdHZub2RlLmRvbSA9IGZyYWdtZW50LmZpcnN0Q2hpbGRcblx0XHR2bm9kZS5kb21TaXplID0gZnJhZ21lbnQuY2hpbGROb2Rlcy5sZW5ndGhcblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZnJhZ21lbnQsIG5leHRTaWJsaW5nKVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciB0YWcgPSB2bm9kZS50YWdcblx0XHR2YXIgYXR0cnMgPSB2bm9kZS5hdHRyc1xuXHRcdHZhciBpcyA9IGF0dHJzICYmIGF0dHJzLmlzXG5cblx0XHRucyA9IGdldE5hbWVTcGFjZSh2bm9kZSkgfHwgbnNcblxuXHRcdHZhciBlbGVtZW50ID0gbnMgP1xuXHRcdFx0aXMgPyAkZG9jLmNyZWF0ZUVsZW1lbnROUyhucywgdGFnLCB7aXM6IGlzfSkgOiAkZG9jLmNyZWF0ZUVsZW1lbnROUyhucywgdGFnKSA6XG5cdFx0XHRpcyA/ICRkb2MuY3JlYXRlRWxlbWVudCh0YWcsIHtpczogaXN9KSA6ICRkb2MuY3JlYXRlRWxlbWVudCh0YWcpXG5cdFx0dm5vZGUuZG9tID0gZWxlbWVudFxuXG5cdFx0aWYgKGF0dHJzICE9IG51bGwpIHtcblx0XHRcdHNldEF0dHJzKHZub2RlLCBhdHRycywgbnMpXG5cdFx0fVxuXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXG5cdFx0aWYgKCFtYXliZVNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSkpIHtcblx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHZub2RlLnRleHQgIT09IFwiXCIpIGVsZW1lbnQudGV4dENvbnRlbnQgPSB2bm9kZS50ZXh0XG5cdFx0XHRcdGVsc2Ugdm5vZGUuY2hpbGRyZW4gPSBbVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB2bm9kZS50ZXh0LCB1bmRlZmluZWQsIHVuZGVmaW5lZCldXG5cdFx0XHR9XG5cdFx0XHRpZiAodm5vZGUuY2hpbGRyZW4gIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdFx0XHRjcmVhdGVOb2RlcyhlbGVtZW50LCBjaGlsZHJlbiwgMCwgY2hpbGRyZW4ubGVuZ3RoLCBob29rcywgbnVsbCwgbnMpXG5cdFx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYgYXR0cnMgIT0gbnVsbCkgc2V0TGF0ZVNlbGVjdEF0dHJzKHZub2RlLCBhdHRycylcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaW5pdENvbXBvbmVudCh2bm9kZSwgaG9va3MpIHtcblx0XHR2YXIgc2VudGluZWxcblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZy52aWV3ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gT2JqZWN0LmNyZWF0ZSh2bm9kZS50YWcpXG5cdFx0XHRzZW50aW5lbCA9IHZub2RlLnN0YXRlLnZpZXdcblx0XHRcdGlmIChzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCAhPSBudWxsKSByZXR1cm5cblx0XHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gdHJ1ZVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IHZvaWQgMFxuXHRcdFx0c2VudGluZWwgPSB2bm9kZS50YWdcblx0XHRcdGlmIChzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCAhPSBudWxsKSByZXR1cm5cblx0XHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gdHJ1ZVxuXHRcdFx0dm5vZGUuc3RhdGUgPSAodm5vZGUudGFnLnByb3RvdHlwZSAhPSBudWxsICYmIHR5cGVvZiB2bm9kZS50YWcucHJvdG90eXBlLnZpZXcgPT09IFwiZnVuY3Rpb25cIikgPyBuZXcgdm5vZGUudGFnKHZub2RlKSA6IHZub2RlLnRhZyh2bm9kZSlcblx0XHR9XG5cdFx0aW5pdExpZmVjeWNsZSh2bm9kZS5zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSBpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0dm5vZGUuaW5zdGFuY2UgPSBWbm9kZS5ub3JtYWxpemUoY2FsbEhvb2suY2FsbCh2bm9kZS5zdGF0ZS52aWV3LCB2bm9kZSkpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlID09PSB2bm9kZSkgdGhyb3cgRXJyb3IoXCJBIHZpZXcgY2Fubm90IHJldHVybiB0aGUgdm5vZGUgaXQgcmVjZWl2ZWQgYXMgYXJndW1lbnRcIilcblx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IG51bGxcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHRjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR2bm9kZS5kb20gPSB2bm9kZS5pbnN0YW5jZS5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSB2bm9kZS5kb20gIT0gbnVsbCA/IHZub2RlLmluc3RhbmNlLmRvbVNpemUgOiAwXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IDBcblx0XHR9XG5cdH1cblxuXHQvL3VwZGF0ZVxuXHQvKipcblx0ICogQHBhcmFtIHtFbGVtZW50fEZyYWdtZW50fSBwYXJlbnQgLSB0aGUgcGFyZW50IGVsZW1lbnRcblx0ICogQHBhcmFtIHtWbm9kZVtdIHwgbnVsbH0gb2xkIC0gdGhlIGxpc3Qgb2Ygdm5vZGVzIG9mIHRoZSBsYXN0IGByZW5kZXIoKWAgY2FsbCBmb3Jcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyBwYXJ0IG9mIHRoZSB0cmVlXG5cdCAqIEBwYXJhbSB7Vm5vZGVbXSB8IG51bGx9IHZub2RlcyAtIGFzIGFib3ZlLCBidXQgZm9yIHRoZSBjdXJyZW50IGByZW5kZXIoKWAgY2FsbC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbltdfSBob29rcyAtIGFuIGFjY3VtdWxhdG9yIG9mIHBvc3QtcmVuZGVyIGhvb2tzIChvbmNyZWF0ZS9vbnVwZGF0ZSlcblx0ICogQHBhcmFtIHtFbGVtZW50IHwgbnVsbH0gbmV4dFNpYmxpbmcgLSB0aGUgbmV4dCBET00gbm9kZSBpZiB3ZSdyZSBkZWFsaW5nIHdpdGggYVxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYWdtZW50IHRoYXQgaXMgbm90IHRoZSBsYXN0IGl0ZW0gaW4gaXRzXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50XG5cdCAqIEBwYXJhbSB7J3N2ZycgfCAnbWF0aCcgfCBTdHJpbmcgfCBudWxsfSBucykgLSB0aGUgY3VycmVudCBYTUwgbmFtZXNwYWNlLCBpZiBhbnlcblx0ICogQHJldHVybnMgdm9pZFxuXHQgKi9cblx0Ly8gVGhpcyBmdW5jdGlvbiBkaWZmcyBhbmQgcGF0Y2hlcyBsaXN0cyBvZiB2bm9kZXMsIGJvdGgga2V5ZWQgYW5kIHVua2V5ZWQuXG5cdC8vXG5cdC8vIFdlIHdpbGw6XG5cdC8vXG5cdC8vIDEuIGRlc2NyaWJlIGl0cyBnZW5lcmFsIHN0cnVjdHVyZVxuXHQvLyAyLiBmb2N1cyBvbiB0aGUgZGlmZiBhbGdvcml0aG0gb3B0aW1pemF0aW9uc1xuXHQvLyAzLiBkaXNjdXNzIERPTSBub2RlIG9wZXJhdGlvbnMuXG5cblx0Ly8gIyMgT3ZlcnZpZXc6XG5cdC8vXG5cdC8vIFRoZSB1cGRhdGVOb2RlcygpIGZ1bmN0aW9uOlxuXHQvLyAtIGRlYWxzIHdpdGggdHJpdmlhbCBjYXNlc1xuXHQvLyAtIGRldGVybWluZXMgd2hldGhlciB0aGUgbGlzdHMgYXJlIGtleWVkIG9yIHVua2V5ZWQgYmFzZWQgb24gdGhlIGZpcnN0IG5vbi1udWxsIG5vZGVcblx0Ly8gICBvZiBlYWNoIGxpc3QuXG5cdC8vIC0gZGlmZnMgdGhlbSBhbmQgcGF0Y2hlcyB0aGUgRE9NIGlmIG5lZWRlZCAodGhhdCdzIHRoZSBicnVudCBvZiB0aGUgY29kZSlcblx0Ly8gLSBtYW5hZ2VzIHRoZSBsZWZ0b3ZlcnM6IGFmdGVyIGRpZmZpbmcsIGFyZSB0aGVyZTpcblx0Ly8gICAtIG9sZCBub2RlcyBsZWZ0IHRvIHJlbW92ZT9cblx0Ly8gXHQgLSBuZXcgbm9kZXMgdG8gaW5zZXJ0P1xuXHQvLyBcdCBkZWFsIHdpdGggdGhlbSFcblx0Ly9cblx0Ly8gVGhlIGxpc3RzIGFyZSBvbmx5IGl0ZXJhdGVkIG92ZXIgb25jZSwgd2l0aCBhbiBleGNlcHRpb24gZm9yIHRoZSBub2RlcyBpbiBgb2xkYCB0aGF0XG5cdC8vIGFyZSB2aXNpdGVkIGluIHRoZSBmb3VydGggcGFydCBvZiB0aGUgZGlmZiBhbmQgaW4gdGhlIGByZW1vdmVOb2Rlc2AgbG9vcC5cblxuXHQvLyAjIyBEaWZmaW5nXG5cdC8vXG5cdC8vIFJlYWRpbmcgaHR0cHM6Ly9naXRodWIuY29tL2xvY2Fsdm9pZC9pdmkvYmxvYi9kZGMwOWQwNmFiYWVmNDUyNDhlNjEzM2Y3MDQwZDAwZDNjNmJlODUzL3BhY2thZ2VzL2l2aS9zcmMvdmRvbS9pbXBsZW1lbnRhdGlvbi50cyNMNjE3LUw4Mzdcblx0Ly8gbWF5IGJlIGdvb2QgZm9yIGNvbnRleHQgb24gbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLWJhc2VkIGxvZ2ljIGZvciBtb3Zpbmcgbm9kZXMuXG5cdC8vXG5cdC8vIEluIG9yZGVyIHRvIGRpZmYga2V5ZWQgbGlzdHMsIG9uZSBoYXMgdG9cblx0Ly9cblx0Ly8gMSkgbWF0Y2ggbm9kZXMgaW4gYm90aCBsaXN0cywgcGVyIGtleSwgYW5kIHVwZGF0ZSB0aGVtIGFjY29yZGluZ2x5XG5cdC8vIDIpIGNyZWF0ZSB0aGUgbm9kZXMgcHJlc2VudCBpbiB0aGUgbmV3IGxpc3QsIGJ1dCBhYnNlbnQgaW4gdGhlIG9sZCBvbmVcblx0Ly8gMykgcmVtb3ZlIHRoZSBub2RlcyBwcmVzZW50IGluIHRoZSBvbGQgbGlzdCwgYnV0IGFic2VudCBpbiB0aGUgbmV3IG9uZVxuXHQvLyA0KSBmaWd1cmUgb3V0IHdoYXQgbm9kZXMgaW4gMSkgdG8gbW92ZSBpbiBvcmRlciB0byBtaW5pbWl6ZSB0aGUgRE9NIG9wZXJhdGlvbnMuXG5cdC8vXG5cdC8vIFRvIGFjaGlldmUgMSkgb25lIGNhbiBjcmVhdGUgYSBkaWN0aW9uYXJ5IG9mIGtleXMgPT4gaW5kZXggKGZvciB0aGUgb2xkIGxpc3QpLCB0aGVuIGl0ZXJhdGVcblx0Ly8gb3ZlciB0aGUgbmV3IGxpc3QgYW5kIGZvciBlYWNoIG5ldyB2bm9kZSwgZmluZCB0aGUgY29ycmVzcG9uZGluZyB2bm9kZSBpbiB0aGUgb2xkIGxpc3QgdXNpbmdcblx0Ly8gdGhlIG1hcC5cblx0Ly8gMikgaXMgYWNoaWV2ZWQgaW4gdGhlIHNhbWUgc3RlcDogaWYgYSBuZXcgbm9kZSBoYXMgbm8gY29ycmVzcG9uZGluZyBlbnRyeSBpbiB0aGUgbWFwLCBpdCBpcyBuZXdcblx0Ly8gYW5kIG11c3QgYmUgY3JlYXRlZC5cblx0Ly8gRm9yIHRoZSByZW1vdmFscywgd2UgYWN0dWFsbHkgcmVtb3ZlIHRoZSBub2RlcyB0aGF0IGhhdmUgYmVlbiB1cGRhdGVkIGZyb20gdGhlIG9sZCBsaXN0LlxuXHQvLyBUaGUgbm9kZXMgdGhhdCByZW1haW4gaW4gdGhhdCBsaXN0IGFmdGVyIDEpIGFuZCAyKSBoYXZlIGJlZW4gcGVyZm9ybWVkIGNhbiBiZSBzYWZlbHkgcmVtb3ZlZC5cblx0Ly8gVGhlIGZvdXJ0aCBzdGVwIGlzIGEgYml0IG1vcmUgY29tcGxleCBhbmQgcmVsaWVzIG9uIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2UgKExJUylcblx0Ly8gYWxnb3JpdGhtLlxuXHQvL1xuXHQvLyB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIGlzIHRoZSBsaXN0IG9mIG5vZGVzIHRoYXQgY2FuIHJlbWFpbiBpbiBwbGFjZS4gSW1hZ2luZSBnb2luZ1xuXHQvLyBmcm9tIGAxLDIsMyw0LDVgIHRvIGA0LDUsMSwyLDNgIHdoZXJlIHRoZSBudW1iZXJzIGFyZSBub3QgbmVjZXNzYXJpbHkgdGhlIGtleXMsIGJ1dCB0aGUgaW5kaWNlc1xuXHQvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSBrZXllZCBub2RlcyBpbiB0aGUgb2xkIGxpc3QgKGtleWVkIG5vZGVzIGBlLGQsYyxiLGFgID0+IGBiLGEsZSxkLGNgIHdvdWxkXG5cdC8vICBtYXRjaCB0aGUgYWJvdmUgbGlzdHMsIGZvciBleGFtcGxlKS5cblx0Ly9cblx0Ly8gSW4gdGhlcmUgYXJlIHR3byBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlczogYDQsNWAgYW5kIGAxLDIsM2AsIHRoZSBsYXR0ZXIgYmVpbmcgdGhlIGxvbmdlc3QuIFdlXG5cdC8vIGNhbiB1cGRhdGUgdGhvc2Ugbm9kZXMgd2l0aG91dCBtb3ZpbmcgdGhlbSwgYW5kIG9ubHkgY2FsbCBgaW5zZXJ0Tm9kZWAgb24gYDRgIGFuZCBgNWAuXG5cdC8vXG5cdC8vIEBsb2NhbHZvaWQgYWRhcHRlZCB0aGUgYWxnbyB0byBhbHNvIHN1cHBvcnQgbm9kZSBkZWxldGlvbnMgYW5kIGluc2VydGlvbnMgKHRoZSBgbGlzYCBpcyBhY3R1YWxseVxuXHQvLyB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlICpvZiBvbGQgbm9kZXMgc3RpbGwgcHJlc2VudCBpbiB0aGUgbmV3IGxpc3QqKS5cblx0Ly9cblx0Ly8gSXQgaXMgYSBnZW5lcmFsIGFsZ29yaXRobSB0aGF0IGlzIGZpcmVwcm9vZiBpbiBhbGwgY2lyY3Vtc3RhbmNlcywgYnV0IGl0IHJlcXVpcmVzIHRoZSBhbGxvY2F0aW9uXG5cdC8vIGFuZCB0aGUgY29uc3RydWN0aW9uIG9mIGEgYGtleSA9PiBvbGRJbmRleGAgbWFwLCBhbmQgdGhyZWUgYXJyYXlzIChvbmUgd2l0aCBgbmV3SW5kZXggPT4gb2xkSW5kZXhgLFxuXHQvLyB0aGUgYExJU2AgYW5kIGEgdGVtcG9yYXJ5IG9uZSB0byBjcmVhdGUgdGhlIExJUykuXG5cdC8vXG5cdC8vIFNvIHdlIGNoZWF0IHdoZXJlIHdlIGNhbjogaWYgdGhlIHRhaWxzIG9mIHRoZSBsaXN0cyBhcmUgaWRlbnRpY2FsLCB0aGV5IGFyZSBndWFyYW50ZWVkIHRvIGJlIHBhcnQgb2Zcblx0Ly8gdGhlIExJUyBhbmQgY2FuIGJlIHVwZGF0ZWQgd2l0aG91dCBtb3ZpbmcgdGhlbS5cblx0Ly9cblx0Ly8gSWYgdHdvIG5vZGVzIGFyZSBzd2FwcGVkLCB0aGV5IGFyZSBndWFyYW50ZWVkIG5vdCB0byBiZSBwYXJ0IG9mIHRoZSBMSVMsIGFuZCBtdXN0IGJlIG1vdmVkICh3aXRoXG5cdC8vIHRoZSBleGNlcHRpb24gb2YgdGhlIGxhc3Qgbm9kZSBpZiB0aGUgbGlzdCBpcyBmdWxseSByZXZlcnNlZCkuXG5cdC8vXG5cdC8vICMjIEZpbmRpbmcgdGhlIG5leHQgc2libGluZy5cblx0Ly9cblx0Ly8gYHVwZGF0ZU5vZGUoKWAgYW5kIGBjcmVhdGVOb2RlKClgIGV4cGVjdCBhIG5leHRTaWJsaW5nIHBhcmFtZXRlciB0byBwZXJmb3JtIERPTSBvcGVyYXRpb25zLlxuXHQvLyBXaGVuIHRoZSBsaXN0IGlzIGJlaW5nIHRyYXZlcnNlZCB0b3AtZG93biwgYXQgYW55IGluZGV4LCB0aGUgRE9NIG5vZGVzIHVwIHRvIHRoZSBwcmV2aW91c1xuXHQvLyB2bm9kZSByZWZsZWN0IHRoZSBjb250ZW50IG9mIHRoZSBuZXcgbGlzdCwgd2hlcmVhcyB0aGUgcmVzdCBvZiB0aGUgRE9NIG5vZGVzIHJlZmxlY3QgdGhlIG9sZFxuXHQvLyBsaXN0LiBUaGUgbmV4dCBzaWJsaW5nIG11c3QgYmUgbG9va2VkIGZvciBpbiB0aGUgb2xkIGxpc3QgdXNpbmcgYGdldE5leHRTaWJsaW5nKC4uLiBvbGRTdGFydCArIDEgLi4uKWAuXG5cdC8vXG5cdC8vIEluIHRoZSBvdGhlciBzY2VuYXJpb3MgKHN3YXBzLCB1cHdhcmRzIHRyYXZlcnNhbCwgbWFwLWJhc2VkIGRpZmYpLFxuXHQvLyB0aGUgbmV3IHZub2RlcyBsaXN0IGlzIHRyYXZlcnNlZCB1cHdhcmRzLiBUaGUgRE9NIG5vZGVzIGF0IHRoZSBib3R0b20gb2YgdGhlIGxpc3QgcmVmbGVjdCB0aGVcblx0Ly8gYm90dG9tIHBhcnQgb2YgdGhlIG5ldyB2bm9kZXMgbGlzdCwgYW5kIHdlIGNhbiB1c2UgdGhlIGB2LmRvbWAgIHZhbHVlIG9mIHRoZSBwcmV2aW91cyBub2RlXG5cdC8vIGFzIHRoZSBuZXh0IHNpYmxpbmcgKGNhY2hlZCBpbiB0aGUgYG5leHRTaWJsaW5nYCB2YXJpYWJsZSkuXG5cblxuXHQvLyAjIyBET00gbm9kZSBtb3Zlc1xuXHQvL1xuXHQvLyBJbiBtb3N0IHNjZW5hcmlvcyBgdXBkYXRlTm9kZSgpYCBhbmQgYGNyZWF0ZU5vZGUoKWAgcGVyZm9ybSB0aGUgRE9NIG9wZXJhdGlvbnMuIEhvd2V2ZXIsXG5cdC8vIHRoaXMgaXMgbm90IHRoZSBjYXNlIGlmIHRoZSBub2RlIG1vdmVkIChzZWNvbmQgYW5kIGZvdXJ0aCBwYXJ0IG9mIHRoZSBkaWZmIGFsZ28pLiBXZSBtb3ZlXG5cdC8vIHRoZSBvbGQgRE9NIG5vZGVzIGJlZm9yZSB1cGRhdGVOb2RlIHJ1bnMgYmVjYXVzZSBpdCBlbmFibGVzIHVzIHRvIHVzZSB0aGUgY2FjaGVkIGBuZXh0U2libGluZ2Bcblx0Ly8gdmFyaWFibGUgcmF0aGVyIHRoYW4gZmV0Y2hpbmcgaXQgdXNpbmcgYGdldE5leHRTaWJsaW5nKClgLlxuXHQvL1xuXHQvLyBUaGUgZm91cnRoIHBhcnQgb2YgdGhlIGRpZmYgY3VycmVudGx5IGluc2VydHMgbm9kZXMgdW5jb25kaXRpb25hbGx5LCBsZWFkaW5nIHRvIGlzc3Vlc1xuXHQvLyBsaWtlICMxNzkxIGFuZCAjMTk5OS4gV2UgbmVlZCB0byBiZSBzbWFydGVyIGFib3V0IHRob3NlIHNpdHVhdGlvbnMgd2hlcmUgYWRqYXNjZW50IG9sZFxuXHQvLyBub2RlcyByZW1haW4gdG9nZXRoZXIgaW4gdGhlIG5ldyBsaXN0IGluIGEgd2F5IHRoYXQgaXNuJ3QgY292ZXJlZCBieSBwYXJ0cyBvbmUgYW5kXG5cdC8vIHRocmVlIG9mIHRoZSBkaWZmIGFsZ28uXG5cblx0ZnVuY3Rpb24gdXBkYXRlTm9kZXMocGFyZW50LCBvbGQsIHZub2RlcywgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGlmIChvbGQgPT09IHZub2RlcyB8fCBvbGQgPT0gbnVsbCAmJiB2bm9kZXMgPT0gbnVsbCkgcmV0dXJuXG5cdFx0ZWxzZSBpZiAob2xkID09IG51bGwgfHwgb2xkLmxlbmd0aCA9PT0gMCkgY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIDAsIHZub2Rlcy5sZW5ndGgsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0ZWxzZSBpZiAodm5vZGVzID09IG51bGwgfHwgdm5vZGVzLmxlbmd0aCA9PT0gMCkgcmVtb3ZlTm9kZXMocGFyZW50LCBvbGQsIDAsIG9sZC5sZW5ndGgpXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgaXNPbGRLZXllZCA9IG9sZFswXSAhPSBudWxsICYmIG9sZFswXS5rZXkgIT0gbnVsbFxuXHRcdFx0dmFyIGlzS2V5ZWQgPSB2bm9kZXNbMF0gIT0gbnVsbCAmJiB2bm9kZXNbMF0ua2V5ICE9IG51bGxcblx0XHRcdHZhciBzdGFydCA9IDAsIG9sZFN0YXJ0ID0gMFxuXHRcdFx0aWYgKCFpc09sZEtleWVkKSB3aGlsZSAob2xkU3RhcnQgPCBvbGQubGVuZ3RoICYmIG9sZFtvbGRTdGFydF0gPT0gbnVsbCkgb2xkU3RhcnQrK1xuXHRcdFx0aWYgKCFpc0tleWVkKSB3aGlsZSAoc3RhcnQgPCB2bm9kZXMubGVuZ3RoICYmIHZub2Rlc1tzdGFydF0gPT0gbnVsbCkgc3RhcnQrK1xuXHRcdFx0aWYgKGlzS2V5ZWQgPT09IG51bGwgJiYgaXNPbGRLZXllZCA9PSBudWxsKSByZXR1cm4gLy8gYm90aCBsaXN0cyBhcmUgZnVsbCBvZiBudWxsc1xuXHRcdFx0aWYgKGlzT2xkS2V5ZWQgIT09IGlzS2V5ZWQpIHtcblx0XHRcdFx0cmVtb3ZlTm9kZXMocGFyZW50LCBvbGQsIG9sZFN0YXJ0LCBvbGQubGVuZ3RoKVxuXHRcdFx0XHRjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIHZub2Rlcy5sZW5ndGgsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHR9IGVsc2UgaWYgKCFpc0tleWVkKSB7XG5cdFx0XHRcdC8vIERvbid0IGluZGV4IHBhc3QgdGhlIGVuZCBvZiBlaXRoZXIgbGlzdCAoY2F1c2VzIGRlb3B0cykuXG5cdFx0XHRcdHZhciBjb21tb25MZW5ndGggPSBvbGQubGVuZ3RoIDwgdm5vZGVzLmxlbmd0aCA/IG9sZC5sZW5ndGggOiB2bm9kZXMubGVuZ3RoXG5cdFx0XHRcdC8vIFJld2luZCBpZiBuZWNlc3NhcnkgdG8gdGhlIGZpcnN0IG5vbi1udWxsIGluZGV4IG9uIGVpdGhlciBzaWRlLlxuXHRcdFx0XHQvLyBXZSBjb3VsZCBhbHRlcm5hdGl2ZWx5IGVpdGhlciBleHBsaWNpdGx5IGNyZWF0ZSBvciByZW1vdmUgbm9kZXMgd2hlbiBgc3RhcnQgIT09IG9sZFN0YXJ0YFxuXHRcdFx0XHQvLyBidXQgdGhhdCB3b3VsZCBiZSBvcHRpbWl6aW5nIGZvciBzcGFyc2UgbGlzdHMgd2hpY2ggYXJlIG1vcmUgcmFyZSB0aGFuIGRlbnNlIG9uZXMuXG5cdFx0XHRcdHN0YXJ0ID0gc3RhcnQgPCBvbGRTdGFydCA/IHN0YXJ0IDogb2xkU3RhcnRcblx0XHRcdFx0Zm9yICg7IHN0YXJ0IDwgY29tbW9uTGVuZ3RoOyBzdGFydCsrKSB7XG5cdFx0XHRcdFx0byA9IG9sZFtzdGFydF1cblx0XHRcdFx0XHR2ID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0XHRcdGlmIChvID09PSB2IHx8IG8gPT0gbnVsbCAmJiB2ID09IG51bGwpIGNvbnRpbnVlXG5cdFx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdiwgaG9va3MsIG5zLCBnZXROZXh0U2libGluZyhvbGQsIHN0YXJ0ICsgMSwgbmV4dFNpYmxpbmcpKVxuXHRcdFx0XHRcdGVsc2UgaWYgKHYgPT0gbnVsbCkgcmVtb3ZlTm9kZShwYXJlbnQsIG8pXG5cdFx0XHRcdFx0ZWxzZSB1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgc3RhcnQgKyAxLCBuZXh0U2libGluZyksIG5zKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvbGQubGVuZ3RoID4gY29tbW9uTGVuZ3RoKSByZW1vdmVOb2RlcyhwYXJlbnQsIG9sZCwgc3RhcnQsIG9sZC5sZW5ndGgpXG5cdFx0XHRcdGlmICh2bm9kZXMubGVuZ3RoID4gY29tbW9uTGVuZ3RoKSBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIHZub2Rlcy5sZW5ndGgsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBrZXllZCBkaWZmXG5cdFx0XHRcdHZhciBvbGRFbmQgPSBvbGQubGVuZ3RoIC0gMSwgZW5kID0gdm5vZGVzLmxlbmd0aCAtIDEsIG1hcCwgbywgdiwgb2UsIHZlLCB0b3BTaWJsaW5nXG5cblx0XHRcdFx0Ly8gYm90dG9tLXVwXG5cdFx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdFx0b2UgPSBvbGRbb2xkRW5kXVxuXHRcdFx0XHRcdHZlID0gdm5vZGVzW2VuZF1cblx0XHRcdFx0XHRpZiAob2Uua2V5ICE9PSB2ZS5rZXkpIGJyZWFrXG5cdFx0XHRcdFx0aWYgKG9lICE9PSB2ZSkgdXBkYXRlTm9kZShwYXJlbnQsIG9lLCB2ZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdFx0XHRpZiAodmUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gdmUuZG9tXG5cdFx0XHRcdFx0b2xkRW5kLS0sIGVuZC0tXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gdG9wLWRvd25cblx0XHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0XHRvID0gb2xkW29sZFN0YXJ0XVxuXHRcdFx0XHRcdHYgPSB2bm9kZXNbc3RhcnRdXG5cdFx0XHRcdFx0aWYgKG8ua2V5ICE9PSB2LmtleSkgYnJlYWtcblx0XHRcdFx0XHRvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdFx0aWYgKG8gIT09IHYpIHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRTdGFydCwgbmV4dFNpYmxpbmcpLCBucylcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBzd2FwcyBhbmQgbGlzdCByZXZlcnNhbHNcblx0XHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0XHRpZiAoc3RhcnQgPT09IGVuZCkgYnJlYWtcblx0XHRcdFx0XHRpZiAoby5rZXkgIT09IHZlLmtleSB8fCBvZS5rZXkgIT09IHYua2V5KSBicmVha1xuXHRcdFx0XHRcdHRvcFNpYmxpbmcgPSBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZylcblx0XHRcdFx0XHRtb3ZlTm9kZXMocGFyZW50LCBvZSwgdG9wU2libGluZylcblx0XHRcdFx0XHRpZiAob2UgIT09IHYpIHVwZGF0ZU5vZGUocGFyZW50LCBvZSwgdiwgaG9va3MsIHRvcFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRcdGlmICgrK3N0YXJ0IDw9IC0tZW5kKSBtb3ZlTm9kZXMocGFyZW50LCBvLCBuZXh0U2libGluZylcblx0XHRcdFx0XHRpZiAobyAhPT0gdmUpIHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2ZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdFx0XHRpZiAodmUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gdmUuZG9tXG5cdFx0XHRcdFx0b2xkU3RhcnQrKzsgb2xkRW5kLS1cblx0XHRcdFx0XHRvZSA9IG9sZFtvbGRFbmRdXG5cdFx0XHRcdFx0dmUgPSB2bm9kZXNbZW5kXVxuXHRcdFx0XHRcdG8gPSBvbGRbb2xkU3RhcnRdXG5cdFx0XHRcdFx0diA9IHZub2Rlc1tzdGFydF1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBib3R0b20gdXAgb25jZSBhZ2FpblxuXHRcdFx0XHR3aGlsZSAob2xkRW5kID49IG9sZFN0YXJ0ICYmIGVuZCA+PSBzdGFydCkge1xuXHRcdFx0XHRcdGlmIChvZS5rZXkgIT09IHZlLmtleSkgYnJlYWtcblx0XHRcdFx0XHRpZiAob2UgIT09IHZlKSB1cGRhdGVOb2RlKHBhcmVudCwgb2UsIHZlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRcdGlmICh2ZS5kb20gIT0gbnVsbCkgbmV4dFNpYmxpbmcgPSB2ZS5kb21cblx0XHRcdFx0XHRvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0XHRvZSA9IG9sZFtvbGRFbmRdXG5cdFx0XHRcdFx0dmUgPSB2bm9kZXNbZW5kXVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdGFydCA+IGVuZCkgcmVtb3ZlTm9kZXMocGFyZW50LCBvbGQsIG9sZFN0YXJ0LCBvbGRFbmQgKyAxKVxuXHRcdFx0XHRlbHNlIGlmIChvbGRTdGFydCA+IG9sZEVuZCkgY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCBlbmQgKyAxLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBpbnNwaXJlZCBieSBpdmkgaHR0cHM6Ly9naXRodWIuY29tL2l2aWpzL2l2aS8gYnkgQm9yaXMgS2F1bFxuXHRcdFx0XHRcdHZhciBvcmlnaW5hbE5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcsIHZub2Rlc0xlbmd0aCA9IGVuZCAtIHN0YXJ0ICsgMSwgb2xkSW5kaWNlcyA9IG5ldyBBcnJheSh2bm9kZXNMZW5ndGgpLCBsaT0wLCBpPTAsIHBvcyA9IDIxNDc0ODM2NDcsIG1hdGNoZWQgPSAwLCBtYXAsIGxpc0luZGljZXNcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgdm5vZGVzTGVuZ3RoOyBpKyspIG9sZEluZGljZXNbaV0gPSAtMVxuXHRcdFx0XHRcdGZvciAoaSA9IGVuZDsgaSA+PSBzdGFydDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRpZiAobWFwID09IG51bGwpIG1hcCA9IGdldEtleU1hcChvbGQsIG9sZFN0YXJ0LCBvbGRFbmQgKyAxKVxuXHRcdFx0XHRcdFx0dmUgPSB2bm9kZXNbaV1cblx0XHRcdFx0XHRcdHZhciBvbGRJbmRleCA9IG1hcFt2ZS5rZXldXG5cdFx0XHRcdFx0XHRpZiAob2xkSW5kZXggIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRwb3MgPSAob2xkSW5kZXggPCBwb3MpID8gb2xkSW5kZXggOiAtMSAvLyBiZWNvbWVzIC0xIGlmIG5vZGVzIHdlcmUgcmUtb3JkZXJlZFxuXHRcdFx0XHRcdFx0XHRvbGRJbmRpY2VzW2ktc3RhcnRdID0gb2xkSW5kZXhcblx0XHRcdFx0XHRcdFx0b2UgPSBvbGRbb2xkSW5kZXhdXG5cdFx0XHRcdFx0XHRcdG9sZFtvbGRJbmRleF0gPSBudWxsXG5cdFx0XHRcdFx0XHRcdGlmIChvZSAhPT0gdmUpIHVwZGF0ZU5vZGUocGFyZW50LCBvZSwgdmUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRcdFx0XHRcdGlmICh2ZS5kb20gIT0gbnVsbCkgbmV4dFNpYmxpbmcgPSB2ZS5kb21cblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCsrXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5leHRTaWJsaW5nID0gb3JpZ2luYWxOZXh0U2libGluZ1xuXHRcdFx0XHRcdGlmIChtYXRjaGVkICE9PSBvbGRFbmQgLSBvbGRTdGFydCArIDEpIHJlbW92ZU5vZGVzKHBhcmVudCwgb2xkLCBvbGRTdGFydCwgb2xkRW5kICsgMSlcblx0XHRcdFx0XHRpZiAobWF0Y2hlZCA9PT0gMCkgY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCBlbmQgKyAxLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHBvcyA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0Ly8gdGhlIGluZGljZXMgb2YgdGhlIGluZGljZXMgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIHBhcnQgb2YgdGhlXG5cdFx0XHRcdFx0XHRcdC8vIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBpbiB0aGUgb2xkSW5kaWNlcyBsaXN0XG5cdFx0XHRcdFx0XHRcdGxpc0luZGljZXMgPSBtYWtlTGlzSW5kaWNlcyhvbGRJbmRpY2VzKVxuXHRcdFx0XHRcdFx0XHRsaSA9IGxpc0luZGljZXMubGVuZ3RoIC0gMVxuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSBlbmQ7IGkgPj0gc3RhcnQ7IGktLSkge1xuXHRcdFx0XHRcdFx0XHRcdHYgPSB2bm9kZXNbaV1cblx0XHRcdFx0XHRcdFx0XHRpZiAob2xkSW5kaWNlc1tpLXN0YXJ0XSA9PT0gLTEpIGNyZWF0ZU5vZGUocGFyZW50LCB2LCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGxpc0luZGljZXNbbGldID09PSBpIC0gc3RhcnQpIGxpLS1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgbW92ZU5vZGVzKHBhcmVudCwgdiwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmICh2LmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IHZub2Rlc1tpXS5kb21cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gZW5kOyBpID49IHN0YXJ0OyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0XHR2ID0gdm5vZGVzW2ldXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9sZEluZGljZXNbaS1zdGFydF0gPT09IC0xKSBjcmVhdGVOb2RlKHBhcmVudCwgdiwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdFx0XHRcdFx0XHRpZiAodi5kb20gIT0gbnVsbCkgbmV4dFNpYmxpbmcgPSB2bm9kZXNbaV0uZG9tXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTm9kZShwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR2YXIgb2xkVGFnID0gb2xkLnRhZywgdGFnID0gdm5vZGUudGFnXG5cdFx0aWYgKG9sZFRhZyA9PT0gdGFnKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IG9sZC5zdGF0ZVxuXHRcdFx0dm5vZGUuZXZlbnRzID0gb2xkLmV2ZW50c1xuXHRcdFx0aWYgKHNob3VsZE5vdFVwZGF0ZSh2bm9kZSwgb2xkKSkgcmV0dXJuXG5cdFx0XHRpZiAodHlwZW9mIG9sZFRhZyA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAob2xkVGFnKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIiNcIjogdXBkYXRlVGV4dChvbGQsIHZub2RlKTsgYnJlYWtcblx0XHRcdFx0XHRjYXNlIFwiPFwiOiB1cGRhdGVIVE1MKHBhcmVudCwgb2xkLCB2bm9kZSwgbnMsIG5leHRTaWJsaW5nKTsgYnJlYWtcblx0XHRcdFx0XHRjYXNlIFwiW1wiOiB1cGRhdGVGcmFnbWVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpOyBicmVha1xuXHRcdFx0XHRcdGRlZmF1bHQ6IHVwZGF0ZUVsZW1lbnQob2xkLCB2bm9kZSwgaG9va3MsIG5zKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHVwZGF0ZUNvbXBvbmVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmVtb3ZlTm9kZShwYXJlbnQsIG9sZClcblx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlVGV4dChvbGQsIHZub2RlKSB7XG5cdFx0aWYgKG9sZC5jaGlsZHJlbi50b1N0cmluZygpICE9PSB2bm9kZS5jaGlsZHJlbi50b1N0cmluZygpKSB7XG5cdFx0XHRvbGQuZG9tLm5vZGVWYWx1ZSA9IHZub2RlLmNoaWxkcmVuXG5cdFx0fVxuXHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVIVE1MKHBhcmVudCwgb2xkLCB2bm9kZSwgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0aWYgKG9sZC5jaGlsZHJlbiAhPT0gdm5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdHJlbW92ZUhUTUwocGFyZW50LCBvbGQpXG5cdFx0XHRjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5zLCBuZXh0U2libGluZylcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHRcdHZub2RlLmluc3RhbmNlID0gb2xkLmluc3RhbmNlXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUZyYWdtZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdHVwZGF0ZU5vZGVzKHBhcmVudCwgb2xkLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHR2YXIgZG9tU2l6ZSA9IDAsIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHR2bm9kZS5kb20gPSBudWxsXG5cdFx0aWYgKGNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQuZG9tICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAodm5vZGUuZG9tID09IG51bGwpIHZub2RlLmRvbSA9IGNoaWxkLmRvbVxuXHRcdFx0XHRcdGRvbVNpemUgKz0gY2hpbGQuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb21TaXplICE9PSAxKSB2bm9kZS5kb21TaXplID0gZG9tU2l6ZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIGhvb2tzLCBucykge1xuXHRcdHZhciBlbGVtZW50ID0gdm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdG5zID0gZ2V0TmFtZVNwYWNlKHZub2RlKSB8fCBuc1xuXG5cdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgPT0gbnVsbCkgdm5vZGUuYXR0cnMgPSB7fVxuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2bm9kZS5hdHRycy52YWx1ZSA9IHZub2RlLnRleHQgLy9GSVhNRSBoYW5kbGUgbXVsdGlwbGUgY2hpbGRyZW5cblx0XHRcdFx0dm5vZGUudGV4dCA9IHVuZGVmaW5lZFxuXHRcdFx0fVxuXHRcdH1cblx0XHR1cGRhdGVBdHRycyh2bm9kZSwgb2xkLmF0dHJzLCB2bm9kZS5hdHRycywgbnMpXG5cdFx0aWYgKCFtYXliZVNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSkpIHtcblx0XHRcdGlmIChvbGQudGV4dCAhPSBudWxsICYmIHZub2RlLnRleHQgIT0gbnVsbCAmJiB2bm9kZS50ZXh0ICE9PSBcIlwiKSB7XG5cdFx0XHRcdGlmIChvbGQudGV4dC50b1N0cmluZygpICE9PSB2bm9kZS50ZXh0LnRvU3RyaW5nKCkpIG9sZC5kb20uZmlyc3RDaGlsZC5ub2RlVmFsdWUgPSB2bm9kZS50ZXh0XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKG9sZC50ZXh0ICE9IG51bGwpIG9sZC5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG9sZC50ZXh0LCB1bmRlZmluZWQsIG9sZC5kb20uZmlyc3RDaGlsZCldXG5cdFx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHZub2RlLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdm5vZGUudGV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXVxuXHRcdFx0XHR1cGRhdGVOb2RlcyhlbGVtZW50LCBvbGQuY2hpbGRyZW4sIHZub2RlLmNoaWxkcmVuLCBob29rcywgbnVsbCwgbnMpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR2bm9kZS5pbnN0YW5jZSA9IFZub2RlLm5vcm1hbGl6ZShjYWxsSG9vay5jYWxsKHZub2RlLnN0YXRlLnZpZXcsIHZub2RlKSlcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSB1cGRhdGVMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZC5pbnN0YW5jZSA9PSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvbGQuaW5zdGFuY2UsIHZub2RlLmluc3RhbmNlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuaW5zdGFuY2UuZG9tU2l6ZVxuXHRcdH1cblx0XHRlbHNlIGlmIChvbGQuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0cmVtb3ZlTm9kZShwYXJlbnQsIG9sZC5pbnN0YW5jZSlcblx0XHRcdHZub2RlLmRvbSA9IHVuZGVmaW5lZFxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IDBcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gZ2V0S2V5TWFwKHZub2Rlcywgc3RhcnQsIGVuZCkge1xuXHRcdHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0Zm9yICg7IHN0YXJ0IDwgZW5kOyBzdGFydCsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbc3RhcnRdXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIga2V5ID0gdm5vZGUua2V5XG5cdFx0XHRcdGlmIChrZXkgIT0gbnVsbCkgbWFwW2tleV0gPSBzdGFydFxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWFwXG5cdH1cblx0Ly8gTGlmdGVkIGZyb20gaXZpIGh0dHBzOi8vZ2l0aHViLmNvbS9pdmlqcy9pdmkvXG5cdC8vIHRha2VzIGEgbGlzdCBvZiB1bmlxdWUgbnVtYmVycyAoLTEgaXMgc3BlY2lhbCBhbmQgY2FuXG5cdC8vIG9jY3VyIG11bHRpcGxlIHRpbWVzKSBhbmQgcmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBpbmRpY2VzXG5cdC8vIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBwYXJ0IG9mIHRoZSBsb25nZXN0IGluY3JlYXNpbmdcblx0Ly8gc3Vic2VxdWVjZVxuXHR2YXIgbGlzVGVtcCA9IFtdXG5cdGZ1bmN0aW9uIG1ha2VMaXNJbmRpY2VzKGEpIHtcblx0XHR2YXIgcmVzdWx0ID0gWzBdXG5cdFx0dmFyIHUgPSAwLCB2ID0gMCwgaSA9IDBcblx0XHR2YXIgaWwgPSBsaXNUZW1wLmxlbmd0aCA9IGEubGVuZ3RoXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbDsgaSsrKSBsaXNUZW1wW2ldID0gYVtpXVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaWw7ICsraSkge1xuXHRcdFx0aWYgKGFbaV0gPT09IC0xKSBjb250aW51ZVxuXHRcdFx0dmFyIGogPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdXG5cdFx0XHRpZiAoYVtqXSA8IGFbaV0pIHtcblx0XHRcdFx0bGlzVGVtcFtpXSA9IGpcblx0XHRcdFx0cmVzdWx0LnB1c2goaSlcblx0XHRcdFx0Y29udGludWVcblx0XHRcdH1cblx0XHRcdHUgPSAwXG5cdFx0XHR2ID0gcmVzdWx0Lmxlbmd0aCAtIDFcblx0XHRcdHdoaWxlICh1IDwgdikge1xuXHRcdFx0XHQvLyBGYXN0IGludGVnZXIgYXZlcmFnZSB3aXRob3V0IG92ZXJmbG93LlxuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuXHRcdFx0XHR2YXIgYyA9ICh1ID4+PiAxKSArICh2ID4+PiAxKSArICh1ICYgdiAmIDEpXG5cdFx0XHRcdGlmIChhW3Jlc3VsdFtjXV0gPCBhW2ldKSB7XG5cdFx0XHRcdFx0dSA9IGMgKyAxXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0diA9IGNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGFbaV0gPCBhW3Jlc3VsdFt1XV0pIHtcblx0XHRcdFx0aWYgKHUgPiAwKSBsaXNUZW1wW2ldID0gcmVzdWx0W3UgLSAxXVxuXHRcdFx0XHRyZXN1bHRbdV0gPSBpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHUgPSByZXN1bHQubGVuZ3RoXG5cdFx0diA9IHJlc3VsdFt1IC0gMV1cblx0XHR3aGlsZSAodS0tID4gMCkge1xuXHRcdFx0cmVzdWx0W3VdID0gdlxuXHRcdFx0diA9IGxpc1RlbXBbdl1cblx0XHR9XG5cdFx0bGlzVGVtcC5sZW5ndGggPSAwXG5cdFx0cmV0dXJuIHJlc3VsdFxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0TmV4dFNpYmxpbmcodm5vZGVzLCBpLCBuZXh0U2libGluZykge1xuXHRcdGZvciAoOyBpIDwgdm5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAodm5vZGVzW2ldICE9IG51bGwgJiYgdm5vZGVzW2ldLmRvbSAhPSBudWxsKSByZXR1cm4gdm5vZGVzW2ldLmRvbVxuXHRcdH1cblx0XHRyZXR1cm4gbmV4dFNpYmxpbmdcblx0fVxuXG5cdC8vIFRoaXMgY292ZXJzIGEgcmVhbGx5IHNwZWNpZmljIGVkZ2UgY2FzZTpcblx0Ly8gLSBQYXJlbnQgbm9kZSBpcyBrZXllZCBhbmQgY29udGFpbnMgY2hpbGRcblx0Ly8gLSBDaGlsZCBpcyByZW1vdmVkLCByZXR1cm5zIHVucmVzb2x2ZWQgcHJvbWlzZSBpbiBgb25iZWZvcmVyZW1vdmVgXG5cdC8vIC0gUGFyZW50IG5vZGUgaXMgbW92ZWQgaW4ga2V5ZWQgZGlmZlxuXHQvLyAtIFJlbWFpbmluZyBjaGlsZHJlbiBzdGlsbCBuZWVkIG1vdmVkIGFwcHJvcHJpYXRlbHlcblx0Ly9cblx0Ly8gSWRlYWxseSwgSSdkIHRyYWNrIHJlbW92ZWQgbm9kZXMgYXMgd2VsbCwgYnV0IHRoYXQgaW50cm9kdWNlcyBhIGxvdCBtb3JlXG5cdC8vIGNvbXBsZXhpdHkgYW5kIEknbSBub3QgZXhhY3RseSBpbnRlcmVzdGVkIGluIGRvaW5nIHRoYXQuXG5cdGZ1bmN0aW9uIG1vdmVOb2RlcyhwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdHZhciBmcmFnID0gJGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHRtb3ZlQ2hpbGRUb0ZyYWcocGFyZW50LCBmcmFnLCB2bm9kZSlcblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZnJhZywgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gbW92ZUNoaWxkVG9GcmFnKHBhcmVudCwgZnJhZywgdm5vZGUpIHtcblx0XHQvLyBEb2RnZSB0aGUgcmVjdXJzaW9uIG92ZXJoZWFkIGluIGEgZmV3IG9mIHRoZSBtb3N0IGNvbW1vbiBjYXNlcy5cblx0XHR3aGlsZSAodm5vZGUuZG9tICE9IG51bGwgJiYgdm5vZGUuZG9tLnBhcmVudE5vZGUgPT09IHBhcmVudCkge1xuXHRcdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0dm5vZGUgPSB2bm9kZS5pbnN0YW5jZVxuXHRcdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkgY29udGludWVcblx0XHRcdH0gZWxzZSBpZiAodm5vZGUudGFnID09PSBcIjxcIikge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZub2RlLmluc3RhbmNlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZCh2bm9kZS5pbnN0YW5jZVtpXSlcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh2bm9kZS50YWcgIT09IFwiW1wiKSB7XG5cdFx0XHRcdC8vIERvbid0IHJlY3Vyc2UgZm9yIHRleHQgbm9kZXMgKm9yKiBlbGVtZW50cywganVzdCBmcmFnbWVudHNcblx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZCh2bm9kZS5kb20pXG5cdFx0XHR9IGVsc2UgaWYgKHZub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHR2bm9kZSA9IHZub2RlLmNoaWxkcmVuWzBdXG5cdFx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSBjb250aW51ZVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IHZub2RlLmNoaWxkcmVuW2ldXG5cdFx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwpIG1vdmVDaGlsZFRvRnJhZyhwYXJlbnQsIGZyYWcsIGNoaWxkKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluc2VydE5vZGUocGFyZW50LCBkb20sIG5leHRTaWJsaW5nKSB7XG5cdFx0aWYgKG5leHRTaWJsaW5nICE9IG51bGwpIHBhcmVudC5pbnNlcnRCZWZvcmUoZG9tLCBuZXh0U2libGluZylcblx0XHRlbHNlIHBhcmVudC5hcHBlbmRDaGlsZChkb20pXG5cdH1cblxuXHRmdW5jdGlvbiBtYXliZVNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSkge1xuXHRcdGlmICh2bm9kZS5hdHRycyA9PSBudWxsIHx8IChcblx0XHRcdHZub2RlLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA9PSBudWxsICYmIC8vIGF0dHJpYnV0ZVxuXHRcdFx0dm5vZGUuYXR0cnMuY29udGVudEVkaXRhYmxlID09IG51bGwgLy8gcHJvcGVydHlcblx0XHQpKSByZXR1cm4gZmFsc2Vcblx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdGlmIChjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXS50YWcgPT09IFwiPFwiKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNoaWxkcmVuWzBdLmNoaWxkcmVuXG5cdFx0XHRpZiAodm5vZGUuZG9tLmlubmVySFRNTCAhPT0gY29udGVudCkgdm5vZGUuZG9tLmlubmVySFRNTCA9IGNvbnRlbnRcblx0XHR9XG5cdFx0ZWxzZSBpZiAodm5vZGUudGV4dCAhPSBudWxsIHx8IGNoaWxkcmVuICE9IG51bGwgJiYgY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBub2RlIG9mIGEgY29udGVudGVkaXRhYmxlIG11c3QgYmUgdHJ1c3RlZFwiKVxuXHRcdHJldHVybiB0cnVlXG5cdH1cblxuXHQvL3JlbW92ZVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCkge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSByZW1vdmVOb2RlKHBhcmVudCwgdm5vZGUpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGUocGFyZW50LCB2bm9kZSkge1xuXHRcdHZhciBtYXNrID0gMFxuXHRcdHZhciBvcmlnaW5hbCA9IHZub2RlLnN0YXRlXG5cdFx0dmFyIHN0YXRlUmVzdWx0LCBhdHRyc1Jlc3VsdFxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5zdGF0ZS5vbmJlZm9yZXJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gY2FsbEhvb2suY2FsbCh2bm9kZS5zdGF0ZS5vbmJlZm9yZXJlbW92ZSwgdm5vZGUpXG5cdFx0XHRpZiAocmVzdWx0ICE9IG51bGwgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0bWFzayA9IDFcblx0XHRcdFx0c3RhdGVSZXN1bHQgPSByZXN1bHRcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHZub2RlLmF0dHJzICYmIHR5cGVvZiB2bm9kZS5hdHRycy5vbmJlZm9yZXJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gY2FsbEhvb2suY2FsbCh2bm9kZS5hdHRycy5vbmJlZm9yZXJlbW92ZSwgdm5vZGUpXG5cdFx0XHRpZiAocmVzdWx0ICE9IG51bGwgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2Vcblx0XHRcdFx0bWFzayB8PSAyXG5cdFx0XHRcdGF0dHJzUmVzdWx0ID0gcmVzdWx0XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNoZWNrU3RhdGUodm5vZGUsIG9yaWdpbmFsKVxuXG5cdFx0Ly8gSWYgd2UgY2FuLCB0cnkgdG8gZmFzdC1wYXRoIGl0IGFuZCBhdm9pZCBhbGwgdGhlIG92ZXJoZWFkIG9mIGF3YWl0aW5nXG5cdFx0aWYgKCFtYXNrKSB7XG5cdFx0XHRvbnJlbW92ZSh2bm9kZSlcblx0XHRcdHJlbW92ZUNoaWxkKHBhcmVudCwgdm5vZGUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzdGF0ZVJlc3VsdCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG5cdFx0XHRcdFx0aWYgKG1hc2sgJiAxKSB7IG1hc2sgJj0gMjsgaWYgKCFtYXNrKSByZWFsbHlSZW1vdmUoKSB9XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhdGVSZXN1bHQudGhlbihuZXh0LCBuZXh0KVxuXHRcdFx0fVxuXHRcdFx0aWYgKGF0dHJzUmVzdWx0ICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2Vcblx0XHRcdFx0XHRpZiAobWFzayAmIDIpIHsgbWFzayAmPSAxOyBpZiAoIW1hc2spIHJlYWxseVJlbW92ZSgpIH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhdHRyc1Jlc3VsdC50aGVuKG5leHQsIG5leHQpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVhbGx5UmVtb3ZlKCkge1xuXHRcdFx0Y2hlY2tTdGF0ZSh2bm9kZSwgb3JpZ2luYWwpXG5cdFx0XHRvbnJlbW92ZSh2bm9kZSlcblx0XHRcdHJlbW92ZUNoaWxkKHBhcmVudCwgdm5vZGUpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZUhUTUwocGFyZW50LCB2bm9kZSkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm5vZGUuaW5zdGFuY2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBhcmVudC5yZW1vdmVDaGlsZCh2bm9kZS5pbnN0YW5jZVtpXSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcmVtb3ZlQ2hpbGQocGFyZW50LCB2bm9kZSkge1xuXHRcdC8vIERvZGdlIHRoZSByZWN1cnNpb24gb3ZlcmhlYWQgaW4gYSBmZXcgb2YgdGhlIG1vc3QgY29tbW9uIGNhc2VzLlxuXHRcdHdoaWxlICh2bm9kZS5kb20gIT0gbnVsbCAmJiB2bm9kZS5kb20ucGFyZW50Tm9kZSA9PT0gcGFyZW50KSB7XG5cdFx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHR2bm9kZSA9IHZub2RlLmluc3RhbmNlXG5cdFx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSBjb250aW51ZVxuXHRcdFx0fSBlbHNlIGlmICh2bm9kZS50YWcgPT09IFwiPFwiKSB7XG5cdFx0XHRcdHJlbW92ZUhUTUwocGFyZW50LCB2bm9kZSlcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2bm9kZS50YWcgIT09IFwiW1wiKSB7XG5cdFx0XHRcdFx0cGFyZW50LnJlbW92ZUNoaWxkKHZub2RlLmRvbSlcblx0XHRcdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkodm5vZGUuY2hpbGRyZW4pKSBicmVha1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2bm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHR2bm9kZSA9IHZub2RlLmNoaWxkcmVuWzBdXG5cdFx0XHRcdFx0aWYgKHZub2RlICE9IG51bGwpIGNvbnRpbnVlXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIGNoaWxkID0gdm5vZGUuY2hpbGRyZW5baV1cblx0XHRcdFx0XHRcdGlmIChjaGlsZCAhPSBudWxsKSByZW1vdmVDaGlsZChwYXJlbnQsIGNoaWxkKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gb25yZW1vdmUodm5vZGUpIHtcblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygdm5vZGUuc3RhdGUub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgY2FsbEhvb2suY2FsbCh2bm9kZS5zdGF0ZS5vbnJlbW92ZSwgdm5vZGUpXG5cdFx0aWYgKHZub2RlLmF0dHJzICYmIHR5cGVvZiB2bm9kZS5hdHRycy5vbnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSBjYWxsSG9vay5jYWxsKHZub2RlLmF0dHJzLm9ucmVtb3ZlLCB2bm9kZSlcblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIG9ucmVtb3ZlKHZub2RlLmluc3RhbmNlKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuXHRcdFx0XHRcdGlmIChjaGlsZCAhPSBudWxsKSBvbnJlbW92ZShjaGlsZClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vYXR0cnNcblx0ZnVuY3Rpb24gc2V0QXR0cnModm5vZGUsIGF0dHJzLCBucykge1xuXHRcdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdFx0c2V0QXR0cih2bm9kZSwga2V5LCBudWxsLCBhdHRyc1trZXldLCBucylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gc2V0QXR0cih2bm9kZSwga2V5LCBvbGQsIHZhbHVlLCBucykge1xuXHRcdGlmIChrZXkgPT09IFwia2V5XCIgfHwga2V5ID09PSBcImlzXCIgfHwgdmFsdWUgPT0gbnVsbCB8fCBpc0xpZmVjeWNsZU1ldGhvZChrZXkpIHx8IChvbGQgPT09IHZhbHVlICYmICFpc0Zvcm1BdHRyaWJ1dGUodm5vZGUsIGtleSkpICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIikgcmV0dXJuXG5cdFx0aWYgKGtleVswXSA9PT0gXCJvXCIgJiYga2V5WzFdID09PSBcIm5cIikgcmV0dXJuIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXksIHZhbHVlKVxuXHRcdGlmIChrZXkuc2xpY2UoMCwgNikgPT09IFwieGxpbms6XCIpIHZub2RlLmRvbS5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwga2V5LnNsaWNlKDYpLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChrZXkgPT09IFwic3R5bGVcIikgdXBkYXRlU3R5bGUodm5vZGUuZG9tLCBvbGQsIHZhbHVlKVxuXHRcdGVsc2UgaWYgKGhhc1Byb3BlcnR5S2V5KHZub2RlLCBrZXksIG5zKSkge1xuXHRcdFx0aWYgKGtleSA9PT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRcdC8vIE9ubHkgZG8gdGhlIGNvZXJjaW9uIGlmIHdlJ3JlIGFjdHVhbGx5IGdvaW5nIHRvIGNoZWNrIHRoZSB2YWx1ZS5cblx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8taW1wbGljaXQtY29lcmNpb24gKi9cblx0XHRcdFx0Ly9zZXR0aW5nIGlucHV0W3ZhbHVlXSB0byBzYW1lIHZhbHVlIGJ5IHR5cGluZyBvbiBmb2N1c2VkIGVsZW1lbnQgbW92ZXMgY3Vyc29yIHRvIGVuZCBpbiBDaHJvbWVcblx0XHRcdFx0aWYgKCh2bm9kZS50YWcgPT09IFwiaW5wdXRcIiB8fCB2bm9kZS50YWcgPT09IFwidGV4dGFyZWFcIikgJiYgdm5vZGUuZG9tLnZhbHVlID09PSBcIlwiICsgdmFsdWUgJiYgdm5vZGUuZG9tID09PSBhY3RpdmVFbGVtZW50KCkpIHJldHVyblxuXHRcdFx0XHQvL3NldHRpbmcgc2VsZWN0W3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0XHRpZiAodm5vZGUudGFnID09PSBcInNlbGVjdFwiICYmIG9sZCAhPT0gbnVsbCAmJiB2bm9kZS5kb20udmFsdWUgPT09IFwiXCIgKyB2YWx1ZSkgcmV0dXJuXG5cdFx0XHRcdC8vc2V0dGluZyBvcHRpb25bdmFsdWVdIHRvIHNhbWUgdmFsdWUgd2hpbGUgaGF2aW5nIHNlbGVjdCBvcGVuIGJsaW5rcyBzZWxlY3QgZHJvcGRvd24gaW4gQ2hyb21lXG5cdFx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwib3B0aW9uXCIgJiYgb2xkICE9PSBudWxsICYmIHZub2RlLmRvbS52YWx1ZSA9PT0gXCJcIiArIHZhbHVlKSByZXR1cm5cblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1pbXBsaWNpdC1jb2VyY2lvbiAqL1xuXHRcdFx0fVxuXHRcdFx0Ly8gSWYgeW91IGFzc2lnbiBhbiBpbnB1dCB0eXBlIHRoYXQgaXMgbm90IHN1cHBvcnRlZCBieSBJRSAxMSB3aXRoIGFuIGFzc2lnbm1lbnQgZXhwcmVzc2lvbiwgYW4gZXJyb3Igd2lsbCBvY2N1ci5cblx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwiaW5wdXRcIiAmJiBrZXkgPT09IFwidHlwZVwiKSB2bm9kZS5kb20uc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpXG5cdFx0XHRlbHNlIHZub2RlLmRvbVtrZXldID0gdmFsdWVcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRcdFx0aWYgKHZhbHVlKSB2bm9kZS5kb20uc2V0QXR0cmlidXRlKGtleSwgXCJcIilcblx0XHRcdFx0ZWxzZSB2bm9kZS5kb20ucmVtb3ZlQXR0cmlidXRlKGtleSlcblx0XHRcdH1cblx0XHRcdGVsc2Ugdm5vZGUuZG9tLnNldEF0dHJpYnV0ZShrZXkgPT09IFwiY2xhc3NOYW1lXCIgPyBcImNsYXNzXCIgOiBrZXksIHZhbHVlKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVBdHRyKHZub2RlLCBrZXksIG9sZCwgbnMpIHtcblx0XHRpZiAoa2V5ID09PSBcImtleVwiIHx8IGtleSA9PT0gXCJpc1wiIHx8IG9sZCA9PSBudWxsIHx8IGlzTGlmZWN5Y2xlTWV0aG9kKGtleSkpIHJldHVyblxuXHRcdGlmIChrZXlbMF0gPT09IFwib1wiICYmIGtleVsxXSA9PT0gXCJuXCIgJiYgIWlzTGlmZWN5Y2xlTWV0aG9kKGtleSkpIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXksIHVuZGVmaW5lZClcblx0XHRlbHNlIGlmIChrZXkgPT09IFwic3R5bGVcIikgdXBkYXRlU3R5bGUodm5vZGUuZG9tLCBvbGQsIG51bGwpXG5cdFx0ZWxzZSBpZiAoXG5cdFx0XHRoYXNQcm9wZXJ0eUtleSh2bm9kZSwga2V5LCBucylcblx0XHRcdCYmIGtleSAhPT0gXCJjbGFzc05hbWVcIlxuXHRcdFx0JiYgIShrZXkgPT09IFwidmFsdWVcIiAmJiAoXG5cdFx0XHRcdHZub2RlLnRhZyA9PT0gXCJvcHRpb25cIlxuXHRcdFx0XHR8fCB2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYgdm5vZGUuZG9tLnNlbGVjdGVkSW5kZXggPT09IC0xICYmIHZub2RlLmRvbSA9PT0gYWN0aXZlRWxlbWVudCgpXG5cdFx0XHQpKVxuXHRcdFx0JiYgISh2bm9kZS50YWcgPT09IFwiaW5wdXRcIiAmJiBrZXkgPT09IFwidHlwZVwiKVxuXHRcdCkge1xuXHRcdFx0dm5vZGUuZG9tW2tleV0gPSBudWxsXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBuc0xhc3RJbmRleCA9IGtleS5pbmRleE9mKFwiOlwiKVxuXHRcdFx0aWYgKG5zTGFzdEluZGV4ICE9PSAtMSkga2V5ID0ga2V5LnNsaWNlKG5zTGFzdEluZGV4ICsgMSlcblx0XHRcdGlmIChvbGQgIT09IGZhbHNlKSB2bm9kZS5kb20ucmVtb3ZlQXR0cmlidXRlKGtleSA9PT0gXCJjbGFzc05hbWVcIiA/IFwiY2xhc3NcIiA6IGtleSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gc2V0TGF0ZVNlbGVjdEF0dHJzKHZub2RlLCBhdHRycykge1xuXHRcdGlmIChcInZhbHVlXCIgaW4gYXR0cnMpIHtcblx0XHRcdGlmKGF0dHJzLnZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5kb20uc2VsZWN0ZWRJbmRleCAhPT0gLTEpIHZub2RlLmRvbS52YWx1ZSA9IG51bGxcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBub3JtYWxpemVkID0gXCJcIiArIGF0dHJzLnZhbHVlIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW1wbGljaXQtY29lcmNpb25cblx0XHRcdFx0aWYgKHZub2RlLmRvbS52YWx1ZSAhPT0gbm9ybWFsaXplZCB8fCB2bm9kZS5kb20uc2VsZWN0ZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0XHR2bm9kZS5kb20udmFsdWUgPSBub3JtYWxpemVkXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKFwic2VsZWN0ZWRJbmRleFwiIGluIGF0dHJzKSBzZXRBdHRyKHZub2RlLCBcInNlbGVjdGVkSW5kZXhcIiwgbnVsbCwgYXR0cnMuc2VsZWN0ZWRJbmRleCwgdW5kZWZpbmVkKVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUF0dHJzKHZub2RlLCBvbGQsIGF0dHJzLCBucykge1xuXHRcdGlmIChhdHRycyAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcblx0XHRcdFx0c2V0QXR0cih2bm9kZSwga2V5LCBvbGQgJiYgb2xkW2tleV0sIGF0dHJzW2tleV0sIG5zKVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgdmFsXG5cdFx0aWYgKG9sZCAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gb2xkKSB7XG5cdFx0XHRcdGlmICgoKHZhbCA9IG9sZFtrZXldKSAhPSBudWxsKSAmJiAoYXR0cnMgPT0gbnVsbCB8fCBhdHRyc1trZXldID09IG51bGwpKSB7XG5cdFx0XHRcdFx0cmVtb3ZlQXR0cih2bm9kZSwga2V5LCB2YWwsIG5zKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGlzRm9ybUF0dHJpYnV0ZSh2bm9kZSwgYXR0cikge1xuXHRcdHJldHVybiBhdHRyID09PSBcInZhbHVlXCIgfHwgYXR0ciA9PT0gXCJjaGVja2VkXCIgfHwgYXR0ciA9PT0gXCJzZWxlY3RlZEluZGV4XCIgfHwgYXR0ciA9PT0gXCJzZWxlY3RlZFwiICYmIHZub2RlLmRvbSA9PT0gYWN0aXZlRWxlbWVudCgpIHx8IHZub2RlLnRhZyA9PT0gXCJvcHRpb25cIiAmJiB2bm9kZS5kb20ucGFyZW50Tm9kZSA9PT0gJGRvYy5hY3RpdmVFbGVtZW50XG5cdH1cblx0ZnVuY3Rpb24gaXNMaWZlY3ljbGVNZXRob2QoYXR0cikge1xuXHRcdHJldHVybiBhdHRyID09PSBcIm9uaW5pdFwiIHx8IGF0dHIgPT09IFwib25jcmVhdGVcIiB8fCBhdHRyID09PSBcIm9udXBkYXRlXCIgfHwgYXR0ciA9PT0gXCJvbnJlbW92ZVwiIHx8IGF0dHIgPT09IFwib25iZWZvcmVyZW1vdmVcIiB8fCBhdHRyID09PSBcIm9uYmVmb3JldXBkYXRlXCJcblx0fVxuXHRmdW5jdGlvbiBoYXNQcm9wZXJ0eUtleSh2bm9kZSwga2V5LCBucykge1xuXHRcdC8vIEZpbHRlciBvdXQgbmFtZXNwYWNlZCBrZXlzXG5cdFx0cmV0dXJuIG5zID09PSB1bmRlZmluZWQgJiYgKFxuXHRcdFx0Ly8gSWYgaXQncyBhIGN1c3RvbSBlbGVtZW50LCBqdXN0IGtlZXAgaXQuXG5cdFx0XHR2bm9kZS50YWcuaW5kZXhPZihcIi1cIikgPiAtMSB8fCB2bm9kZS5hdHRycyAhPSBudWxsICYmIHZub2RlLmF0dHJzLmlzIHx8XG5cdFx0XHQvLyBJZiBpdCdzIGEgbm9ybWFsIGVsZW1lbnQsIGxldCdzIHRyeSB0byBhdm9pZCBhIGZldyBicm93c2VyIGJ1Z3MuXG5cdFx0XHRrZXkgIT09IFwiaHJlZlwiICYmIGtleSAhPT0gXCJsaXN0XCIgJiYga2V5ICE9PSBcImZvcm1cIiAmJiBrZXkgIT09IFwid2lkdGhcIiAmJiBrZXkgIT09IFwiaGVpZ2h0XCIvLyAmJiBrZXkgIT09IFwidHlwZVwiXG5cdFx0XHQvLyBEZWZlciB0aGUgcHJvcGVydHkgY2hlY2sgdW50aWwgKmFmdGVyKiB3ZSBjaGVjayBldmVyeXRoaW5nLlxuXHRcdCkgJiYga2V5IGluIHZub2RlLmRvbVxuXHR9XG5cblx0Ly9zdHlsZVxuXHR2YXIgdXBwZXJjYXNlUmVnZXggPSAvW0EtWl0vZ1xuXHRmdW5jdGlvbiB0b0xvd2VyQ2FzZShjYXBpdGFsKSB7IHJldHVybiBcIi1cIiArIGNhcGl0YWwudG9Mb3dlckNhc2UoKSB9XG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZUtleShrZXkpIHtcblx0XHRyZXR1cm4ga2V5WzBdID09PSBcIi1cIiAmJiBrZXlbMV0gPT09IFwiLVwiID8ga2V5IDpcblx0XHRcdGtleSA9PT0gXCJjc3NGbG9hdFwiID8gXCJmbG9hdFwiIDpcblx0XHRcdFx0a2V5LnJlcGxhY2UodXBwZXJjYXNlUmVnZXgsIHRvTG93ZXJDYXNlKVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKGVsZW1lbnQsIG9sZCwgc3R5bGUpIHtcblx0XHRpZiAob2xkID09PSBzdHlsZSkge1xuXHRcdFx0Ly8gU3R5bGVzIGFyZSBlcXVpdmFsZW50LCBkbyBub3RoaW5nLlxuXHRcdH0gZWxzZSBpZiAoc3R5bGUgPT0gbnVsbCkge1xuXHRcdFx0Ly8gTmV3IHN0eWxlIGlzIG1pc3NpbmcsIGp1c3QgY2xlYXIgaXQuXG5cdFx0XHRlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygc3R5bGUgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdC8vIE5ldyBzdHlsZSBpcyBhIHN0cmluZywgbGV0IGVuZ2luZSBkZWFsIHdpdGggcGF0Y2hpbmcuXG5cdFx0XHRlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZVxuXHRcdH0gZWxzZSBpZiAob2xkID09IG51bGwgfHwgdHlwZW9mIG9sZCAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gYG9sZGAgaXMgbWlzc2luZyBvciBhIHN0cmluZywgYHN0eWxlYCBpcyBhbiBvYmplY3QuXG5cdFx0XHRlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiXG5cdFx0XHQvLyBBZGQgbmV3IHN0eWxlIHByb3BlcnRpZXNcblx0XHRcdGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBzdHlsZVtrZXldXG5cdFx0XHRcdGlmICh2YWx1ZSAhPSBudWxsKSBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KG5vcm1hbGl6ZUtleShrZXkpLCBTdHJpbmcodmFsdWUpKVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBCb3RoIG9sZCAmIG5ldyBhcmUgKGRpZmZlcmVudCkgb2JqZWN0cy5cblx0XHRcdC8vIFVwZGF0ZSBzdHlsZSBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSBjaGFuZ2VkXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gc3R5bGVba2V5XVxuXHRcdFx0XHRpZiAodmFsdWUgIT0gbnVsbCAmJiAodmFsdWUgPSBTdHJpbmcodmFsdWUpKSAhPT0gU3RyaW5nKG9sZFtrZXldKSkge1xuXHRcdFx0XHRcdGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkobm9ybWFsaXplS2V5KGtleSksIHZhbHVlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBSZW1vdmUgc3R5bGUgcHJvcGVydGllcyB0aGF0IG5vIGxvbmdlciBleGlzdFxuXHRcdFx0Zm9yICh2YXIga2V5IGluIG9sZCkge1xuXHRcdFx0XHRpZiAob2xkW2tleV0gIT0gbnVsbCAmJiBzdHlsZVtrZXldID09IG51bGwpIHtcblx0XHRcdFx0XHRlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KG5vcm1hbGl6ZUtleShrZXkpKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gSGVyZSdzIGFuIGV4cGxhbmF0aW9uIG9mIGhvdyB0aGlzIHdvcmtzOlxuXHQvLyAxLiBUaGUgZXZlbnQgbmFtZXMgYXJlIGFsd2F5cyAoYnkgZGVzaWduKSBwcmVmaXhlZCBieSBgb25gLlxuXHQvLyAyLiBUaGUgRXZlbnRMaXN0ZW5lciBpbnRlcmZhY2UgYWNjZXB0cyBlaXRoZXIgYSBmdW5jdGlvbiBvciBhbiBvYmplY3Rcblx0Ly8gICAgd2l0aCBhIGBoYW5kbGVFdmVudGAgbWV0aG9kLlxuXHQvLyAzLiBUaGUgb2JqZWN0IGRvZXMgbm90IGluaGVyaXQgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAsIHRvIGF2b2lkXG5cdC8vICAgIGFueSBwb3RlbnRpYWwgaW50ZXJmZXJlbmNlIHdpdGggdGhhdCAoZS5nLiBzZXR0ZXJzKS5cblx0Ly8gNC4gVGhlIGV2ZW50IG5hbWUgaXMgcmVtYXBwZWQgdG8gdGhlIGhhbmRsZXIgYmVmb3JlIGNhbGxpbmcgaXQuXG5cdC8vIDUuIEluIGZ1bmN0aW9uLWJhc2VkIGV2ZW50IGhhbmRsZXJzLCBgZXYudGFyZ2V0ID09PSB0aGlzYC4gV2UgcmVwbGljYXRlXG5cdC8vICAgIHRoYXQgYmVsb3cuXG5cdC8vIDYuIEluIGZ1bmN0aW9uLWJhc2VkIGV2ZW50IGhhbmRsZXJzLCBgcmV0dXJuIGZhbHNlYCBwcmV2ZW50cyB0aGUgZGVmYXVsdFxuXHQvLyAgICBhY3Rpb24gYW5kIHN0b3BzIGV2ZW50IHByb3BhZ2F0aW9uLiBXZSByZXBsaWNhdGUgdGhhdCBiZWxvdy5cblx0ZnVuY3Rpb24gRXZlbnREaWN0KCkge1xuXHRcdC8vIFNhdmUgdGhpcywgc28gdGhlIGN1cnJlbnQgcmVkcmF3IGlzIGNvcnJlY3RseSB0cmFja2VkLlxuXHRcdHRoaXMuXyA9IGN1cnJlbnRSZWRyYXdcblx0fVxuXHRFdmVudERpY3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRFdmVudERpY3QucHJvdG90eXBlLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKGV2KSB7XG5cdFx0dmFyIGhhbmRsZXIgPSB0aGlzW1wib25cIiArIGV2LnR5cGVdXG5cdFx0dmFyIHJlc3VsdFxuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSByZXN1bHQgPSBoYW5kbGVyLmNhbGwoZXYuY3VycmVudFRhcmdldCwgZXYpXG5cdFx0ZWxzZSBpZiAodHlwZW9mIGhhbmRsZXIuaGFuZGxlRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgaGFuZGxlci5oYW5kbGVFdmVudChldilcblx0XHRpZiAodGhpcy5fICYmIGV2LnJlZHJhdyAhPT0gZmFsc2UpICgwLCB0aGlzLl8pKClcblx0XHRpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKClcblx0XHR9XG5cdH1cblxuXHQvL2V2ZW50XG5cdGZ1bmN0aW9uIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXksIHZhbHVlKSB7XG5cdFx0aWYgKHZub2RlLmV2ZW50cyAhPSBudWxsKSB7XG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleV0gPT09IHZhbHVlKSByZXR1cm5cblx0XHRcdGlmICh2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5ldmVudHNba2V5XSA9PSBudWxsKSB2bm9kZS5kb20uYWRkRXZlbnRMaXN0ZW5lcihrZXkuc2xpY2UoMiksIHZub2RlLmV2ZW50cywgZmFsc2UpXG5cdFx0XHRcdHZub2RlLmV2ZW50c1trZXldID0gdmFsdWVcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2bm9kZS5ldmVudHNba2V5XSAhPSBudWxsKSB2bm9kZS5kb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihrZXkuc2xpY2UoMiksIHZub2RlLmV2ZW50cywgZmFsc2UpXG5cdFx0XHRcdHZub2RlLmV2ZW50c1trZXldID0gdW5kZWZpbmVkXG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpKSB7XG5cdFx0XHR2bm9kZS5ldmVudHMgPSBuZXcgRXZlbnREaWN0KClcblx0XHRcdHZub2RlLmRvbS5hZGRFdmVudExpc3RlbmVyKGtleS5zbGljZSgyKSwgdm5vZGUuZXZlbnRzLCBmYWxzZSlcblx0XHRcdHZub2RlLmV2ZW50c1trZXldID0gdmFsdWVcblx0XHR9XG5cdH1cblxuXHQvL2xpZmVjeWNsZVxuXHRmdW5jdGlvbiBpbml0TGlmZWN5Y2xlKHNvdXJjZSwgdm5vZGUsIGhvb2tzKSB7XG5cdFx0aWYgKHR5cGVvZiBzb3VyY2Uub25pbml0ID09PSBcImZ1bmN0aW9uXCIpIGNhbGxIb29rLmNhbGwoc291cmNlLm9uaW5pdCwgdm5vZGUpXG5cdFx0aWYgKHR5cGVvZiBzb3VyY2Uub25jcmVhdGUgPT09IFwiZnVuY3Rpb25cIikgaG9va3MucHVzaChjYWxsSG9vay5iaW5kKHNvdXJjZS5vbmNyZWF0ZSwgdm5vZGUpKVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUxpZmVjeWNsZShzb3VyY2UsIHZub2RlLCBob29rcykge1xuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9udXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIGhvb2tzLnB1c2goY2FsbEhvb2suYmluZChzb3VyY2Uub251cGRhdGUsIHZub2RlKSlcblx0fVxuXHRmdW5jdGlvbiBzaG91bGROb3RVcGRhdGUodm5vZGUsIG9sZCkge1xuXHRcdGRvIHtcblx0XHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsICYmIHR5cGVvZiB2bm9kZS5hdHRycy5vbmJlZm9yZXVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHZhciBmb3JjZSA9IGNhbGxIb29rLmNhbGwodm5vZGUuYXR0cnMub25iZWZvcmV1cGRhdGUsIHZub2RlLCBvbGQpXG5cdFx0XHRcdGlmIChmb3JjZSAhPT0gdW5kZWZpbmVkICYmICFmb3JjZSkgYnJlYWtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5zdGF0ZS5vbmJlZm9yZXVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHZhciBmb3JjZSA9IGNhbGxIb29rLmNhbGwodm5vZGUuc3RhdGUub25iZWZvcmV1cGRhdGUsIHZub2RlLCBvbGQpXG5cdFx0XHRcdGlmIChmb3JjZSAhPT0gdW5kZWZpbmVkICYmICFmb3JjZSkgYnJlYWtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH0gd2hpbGUgKGZhbHNlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cblx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdFx0dm5vZGUuaW5zdGFuY2UgPSBvbGQuaW5zdGFuY2Vcblx0XHQvLyBPbmUgd291bGQgdGhpbmsgaGF2aW5nIHRoZSBhY3R1YWwgbGF0ZXN0IGF0dHJpYnV0ZXMgd291bGQgYmUgaWRlYWwsXG5cdFx0Ly8gYnV0IGl0IGRvZXNuJ3QgbGV0IHVzIHByb3Blcmx5IGRpZmYgYmFzZWQgb24gb3VyIGN1cnJlbnQgaW50ZXJuYWxcblx0XHQvLyByZXByZXNlbnRhdGlvbi4gV2UgaGF2ZSB0byBzYXZlIG5vdCBvbmx5IHRoZSBvbGQgRE9NIGluZm8sIGJ1dCBhbHNvXG5cdFx0Ly8gdGhlIGF0dHJpYnV0ZXMgdXNlZCB0byBjcmVhdGUgaXQsIGFzIHdlIGRpZmYgKnRoYXQqLCBub3QgYWdhaW5zdCB0aGVcblx0XHQvLyBET00gZGlyZWN0bHkgKHdpdGggYSBmZXcgZXhjZXB0aW9ucyBpbiBgc2V0QXR0cmApLiBBbmQsIG9mIGNvdXJzZSwgd2Vcblx0XHQvLyBuZWVkIHRvIHNhdmUgdGhlIGNoaWxkcmVuIGFuZCB0ZXh0IGFzIHRoZXkgYXJlIGNvbmNlcHR1YWxseSBub3Rcblx0XHQvLyB1bmxpa2Ugc3BlY2lhbCBcImF0dHJpYnV0ZXNcIiBpbnRlcm5hbGx5LlxuXHRcdHZub2RlLmF0dHJzID0gb2xkLmF0dHJzXG5cdFx0dm5vZGUuY2hpbGRyZW4gPSBvbGQuY2hpbGRyZW5cblx0XHR2bm9kZS50ZXh0ID0gb2xkLnRleHRcblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uKGRvbSwgdm5vZGVzLCByZWRyYXcpIHtcblx0XHRpZiAoIWRvbSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgcGFzc2VkIHRvIG0ucm91dGUvbS5tb3VudC9tLnJlbmRlciBpcyBub3QgdW5kZWZpbmVkLlwiKVxuXHRcdHZhciBob29rcyA9IFtdXG5cdFx0dmFyIGFjdGl2ZSA9IGFjdGl2ZUVsZW1lbnQoKVxuXHRcdHZhciBuYW1lc3BhY2UgPSBkb20ubmFtZXNwYWNlVVJJXG5cblx0XHQvLyBGaXJzdCB0aW1lIHJlbmRlcmluZyBpbnRvIGEgbm9kZSBjbGVhcnMgaXQgb3V0XG5cdFx0aWYgKGRvbS52bm9kZXMgPT0gbnVsbCkgZG9tLnRleHRDb250ZW50ID0gXCJcIlxuXG5cdFx0dm5vZGVzID0gVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4oQXJyYXkuaXNBcnJheSh2bm9kZXMpID8gdm5vZGVzIDogW3Zub2Rlc10pXG5cdFx0dmFyIHByZXZSZWRyYXcgPSBjdXJyZW50UmVkcmF3XG5cdFx0dHJ5IHtcblx0XHRcdGN1cnJlbnRSZWRyYXcgPSB0eXBlb2YgcmVkcmF3ID09PSBcImZ1bmN0aW9uXCIgPyByZWRyYXcgOiB1bmRlZmluZWRcblx0XHRcdHVwZGF0ZU5vZGVzKGRvbSwgZG9tLnZub2Rlcywgdm5vZGVzLCBob29rcywgbnVsbCwgbmFtZXNwYWNlID09PSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiA/IHVuZGVmaW5lZCA6IG5hbWVzcGFjZSlcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0Y3VycmVudFJlZHJhdyA9IHByZXZSZWRyYXdcblx0XHR9XG5cdFx0ZG9tLnZub2RlcyA9IHZub2Rlc1xuXHRcdC8vIGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBjYW4gcmV0dXJuIG51bGw6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2ludGVyYWN0aW9uLmh0bWwjZG9tLWRvY3VtZW50LWFjdGl2ZWVsZW1lbnRcblx0XHRpZiAoYWN0aXZlICE9IG51bGwgJiYgYWN0aXZlRWxlbWVudCgpICE9PSBhY3RpdmUgJiYgdHlwZW9mIGFjdGl2ZS5mb2N1cyA9PT0gXCJmdW5jdGlvblwiKSBhY3RpdmUuZm9jdXMoKVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG9va3MubGVuZ3RoOyBpKyspIGhvb2tzW2ldKClcblx0fVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGh0bWwpIHtcblx0aWYgKGh0bWwgPT0gbnVsbCkgaHRtbCA9IFwiXCJcblx0cmV0dXJuIFZub2RlKFwiPFwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgaHRtbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG5mdW5jdGlvbiBWbm9kZSh0YWcsIGtleSwgYXR0cnMsIGNoaWxkcmVuLCB0ZXh0LCBkb20pIHtcblx0cmV0dXJuIHt0YWc6IHRhZywga2V5OiBrZXksIGF0dHJzOiBhdHRycywgY2hpbGRyZW46IGNoaWxkcmVuLCB0ZXh0OiB0ZXh0LCBkb206IGRvbSwgZG9tU2l6ZTogdW5kZWZpbmVkLCBzdGF0ZTogdW5kZWZpbmVkLCBldmVudHM6IHVuZGVmaW5lZCwgaW5zdGFuY2U6IHVuZGVmaW5lZH1cbn1cblZub2RlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKG5vZGUpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHJldHVybiBWbm9kZShcIltcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKG5vZGUpLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0aWYgKG5vZGUgPT0gbnVsbCB8fCB0eXBlb2Ygbm9kZSA9PT0gXCJib29sZWFuXCIpIHJldHVybiBudWxsXG5cdGlmICh0eXBlb2Ygbm9kZSA9PT0gXCJvYmplY3RcIikgcmV0dXJuIG5vZGVcblx0cmV0dXJuIFZub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgU3RyaW5nKG5vZGUpLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcbn1cblZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0dmFyIGNoaWxkcmVuID0gW11cblx0aWYgKGlucHV0Lmxlbmd0aCkge1xuXHRcdHZhciBpc0tleWVkID0gaW5wdXRbMF0gIT0gbnVsbCAmJiBpbnB1dFswXS5rZXkgIT0gbnVsbFxuXHRcdC8vIE5vdGU6IHRoaXMgaXMgYSAqdmVyeSogcGVyZi1zZW5zaXRpdmUgY2hlY2suXG5cdFx0Ly8gRnVuIGZhY3Q6IG1lcmdpbmcgdGhlIGxvb3AgbGlrZSB0aGlzIGlzIHNvbWVob3cgZmFzdGVyIHRoYW4gc3BsaXR0aW5nXG5cdFx0Ly8gaXQsIG5vdGljZWFibHkgc28uXG5cdFx0Zm9yICh2YXIgaSA9IDE7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKChpbnB1dFtpXSAhPSBudWxsICYmIGlucHV0W2ldLmtleSAhPSBudWxsKSAhPT0gaXNLZXllZCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiVm5vZGVzIG11c3QgZWl0aGVyIGFsd2F5cyBoYXZlIGtleXMgb3IgbmV2ZXIgaGF2ZSBrZXlzIVwiKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjaGlsZHJlbltpXSA9IFZub2RlLm5vcm1hbGl6ZShpbnB1dFtpXSlcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNoaWxkcmVuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVm5vZGVcbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBQcm9taXNlUG9seWZpbGwgPSByZXF1aXJlKFwiLi9wcm9taXNlL3Byb21pc2VcIilcbnZhciBtb3VudFJlZHJhdyA9IHJlcXVpcmUoXCIuL21vdW50LXJlZHJhd1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3JlcXVlc3QvcmVxdWVzdFwiKSh3aW5kb3csIFByb21pc2VQb2x5ZmlsbCwgbW91bnRSZWRyYXcucmVkcmF3KVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGJ1aWxkUGF0aG5hbWUgPSByZXF1aXJlKFwiLi4vcGF0aG5hbWUvYnVpbGRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkd2luZG93LCBQcm9taXNlLCBvbmNvbXBsZXRpb24pIHtcblx0dmFyIGNhbGxiYWNrQ291bnQgPSAwXG5cblx0ZnVuY3Rpb24gUHJvbWlzZVByb3h5KGV4ZWN1dG9yKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGV4ZWN1dG9yKVxuXHR9XG5cblx0Ly8gSW4gY2FzZSB0aGUgZ2xvYmFsIFByb21pc2UgaXMgc29tZSB1c2VybGFuZCBsaWJyYXJ5J3Mgd2hlcmUgdGhleSByZWx5IG9uXG5cdC8vIGBmb28gaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yYCwgYHRoaXMuY29uc3RydWN0b3IucmVzb2x2ZSh2YWx1ZSlgLCBvclxuXHQvLyBzaW1pbGFyLiBMZXQncyAqbm90KiBicmVhayB0aGVtLlxuXHRQcm9taXNlUHJveHkucHJvdG90eXBlID0gUHJvbWlzZS5wcm90b3R5cGVcblx0UHJvbWlzZVByb3h5Ll9fcHJvdG9fXyA9IFByb21pc2UgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b1xuXG5cdGZ1bmN0aW9uIG1ha2VSZXF1ZXN0KGZhY3RvcnkpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24odXJsLCBhcmdzKSB7XG5cdFx0XHRpZiAodHlwZW9mIHVybCAhPT0gXCJzdHJpbmdcIikgeyBhcmdzID0gdXJsOyB1cmwgPSB1cmwudXJsIH1cblx0XHRcdGVsc2UgaWYgKGFyZ3MgPT0gbnVsbCkgYXJncyA9IHt9XG5cdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRmYWN0b3J5KGJ1aWxkUGF0aG5hbWUodXJsLCBhcmdzLnBhcmFtcyksIGFyZ3MsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBhcmdzLnR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YVtpXSA9IG5ldyBhcmdzLnR5cGUoZGF0YVtpXSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBkYXRhID0gbmV3IGFyZ3MudHlwZShkYXRhKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXNvbHZlKGRhdGEpXG5cdFx0XHRcdH0sIHJlamVjdClcblx0XHRcdH0pXG5cdFx0XHRpZiAoYXJncy5iYWNrZ3JvdW5kID09PSB0cnVlKSByZXR1cm4gcHJvbWlzZVxuXHRcdFx0dmFyIGNvdW50ID0gMFxuXHRcdFx0ZnVuY3Rpb24gY29tcGxldGUoKSB7XG5cdFx0XHRcdGlmICgtLWNvdW50ID09PSAwICYmIHR5cGVvZiBvbmNvbXBsZXRpb24gPT09IFwiZnVuY3Rpb25cIikgb25jb21wbGV0aW9uKClcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHdyYXAocHJvbWlzZSlcblxuXHRcdFx0ZnVuY3Rpb24gd3JhcChwcm9taXNlKSB7XG5cdFx0XHRcdHZhciB0aGVuID0gcHJvbWlzZS50aGVuXG5cdFx0XHRcdC8vIFNldCB0aGUgY29uc3RydWN0b3IsIHNvIGVuZ2luZXMga25vdyB0byBub3QgYXdhaXQgb3IgcmVzb2x2ZVxuXHRcdFx0XHQvLyB0aGlzIGFzIGEgbmF0aXZlIHByb21pc2UuIEF0IHRoZSB0aW1lIG9mIHdyaXRpbmcsIHRoaXMgaXNcblx0XHRcdFx0Ly8gb25seSBuZWNlc3NhcnkgZm9yIFY4LCBidXQgdGhlaXIgYmVoYXZpb3IgaXMgdGhlIGNvcnJlY3Rcblx0XHRcdFx0Ly8gYmVoYXZpb3IgcGVyIHNwZWMuIFNlZSB0aGlzIHNwZWMgaXNzdWUgZm9yIG1vcmUgZGV0YWlsczpcblx0XHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvZWNtYTI2Mi9pc3N1ZXMvMTU3Ny4gQWxzbywgc2VlIHRoZVxuXHRcdFx0XHQvLyBjb3JyZXNwb25kaW5nIGNvbW1lbnQgaW4gYHJlcXVlc3QvdGVzdHMvdGVzdC1yZXF1ZXN0LmpzYCBmb3Jcblx0XHRcdFx0Ly8gYSBiaXQgbW9yZSBiYWNrZ3JvdW5kIG9uIHRoZSBpc3N1ZSBhdCBoYW5kLlxuXHRcdFx0XHRwcm9taXNlLmNvbnN0cnVjdG9yID0gUHJvbWlzZVByb3h5XG5cdFx0XHRcdHByb21pc2UudGhlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvdW50Kytcblx0XHRcdFx0XHR2YXIgbmV4dCA9IHRoZW4uYXBwbHkocHJvbWlzZSwgYXJndW1lbnRzKVxuXHRcdFx0XHRcdG5leHQudGhlbihjb21wbGV0ZSwgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0Y29tcGxldGUoKVxuXHRcdFx0XHRcdFx0aWYgKGNvdW50ID09PSAwKSB0aHJvdyBlXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRyZXR1cm4gd3JhcChuZXh0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwcm9taXNlXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFzSGVhZGVyKGFyZ3MsIG5hbWUpIHtcblx0XHRmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSB7XG5cdFx0XHRpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChhcmdzLmhlYWRlcnMsIGtleSkgJiYgbmFtZS50ZXN0KGtleSkpIHJldHVybiB0cnVlXG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRyZXF1ZXN0OiBtYWtlUmVxdWVzdChmdW5jdGlvbih1cmwsIGFyZ3MsIHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dmFyIG1ldGhvZCA9IGFyZ3MubWV0aG9kICE9IG51bGwgPyBhcmdzLm1ldGhvZC50b1VwcGVyQ2FzZSgpIDogXCJHRVRcIlxuXHRcdFx0dmFyIGJvZHkgPSBhcmdzLmJvZHlcblx0XHRcdHZhciBhc3N1bWVKU09OID0gKGFyZ3Muc2VyaWFsaXplID09IG51bGwgfHwgYXJncy5zZXJpYWxpemUgPT09IEpTT04uc2VyaWFsaXplKSAmJiAhKGJvZHkgaW5zdGFuY2VvZiAkd2luZG93LkZvcm1EYXRhKVxuXHRcdFx0dmFyIHJlc3BvbnNlVHlwZSA9IGFyZ3MucmVzcG9uc2VUeXBlIHx8ICh0eXBlb2YgYXJncy5leHRyYWN0ID09PSBcImZ1bmN0aW9uXCIgPyBcIlwiIDogXCJqc29uXCIpXG5cblx0XHRcdHZhciB4aHIgPSBuZXcgJHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpLCBhYm9ydGVkID0gZmFsc2Vcblx0XHRcdHZhciBvcmlnaW5hbCA9IHhociwgcmVwbGFjZWRBYm9ydFxuXHRcdFx0dmFyIGFib3J0ID0geGhyLmFib3J0XG5cblx0XHRcdHhoci5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhYm9ydGVkID0gdHJ1ZVxuXHRcdFx0XHRhYm9ydC5jYWxsKHRoaXMpXG5cdFx0XHR9XG5cblx0XHRcdHhoci5vcGVuKG1ldGhvZCwgdXJsLCBhcmdzLmFzeW5jICE9PSBmYWxzZSwgdHlwZW9mIGFyZ3MudXNlciA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MudXNlciA6IHVuZGVmaW5lZCwgdHlwZW9mIGFyZ3MucGFzc3dvcmQgPT09IFwic3RyaW5nXCIgPyBhcmdzLnBhc3N3b3JkIDogdW5kZWZpbmVkKVxuXG5cdFx0XHRpZiAoYXNzdW1lSlNPTiAmJiBib2R5ICE9IG51bGwgJiYgIWhhc0hlYWRlcihhcmdzLCAvXmNvbnRlbnQtdHlwZSQvaSkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZGVzZXJpYWxpemUgIT09IFwiZnVuY3Rpb25cIiAmJiAhaGFzSGVhZGVyKGFyZ3MsIC9eYWNjZXB0JC9pKSkge1xuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvKlwiKVxuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZ3Mud2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gYXJncy53aXRoQ3JlZGVudGlhbHNcblx0XHRcdGlmIChhcmdzLnRpbWVvdXQpIHhoci50aW1lb3V0ID0gYXJncy50aW1lb3V0XG5cdFx0XHR4aHIucmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlXG5cblx0XHRcdGZvciAodmFyIGtleSBpbiBhcmdzLmhlYWRlcnMpIHtcblx0XHRcdFx0aWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoYXJncy5oZWFkZXJzLCBrZXkpKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBhcmdzLmhlYWRlcnNba2V5XSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgdGhyb3cgZXJyb3JzIG9uIHhoci5hYm9ydCgpLlxuXHRcdFx0XHRpZiAoYWJvcnRlZCkgcmV0dXJuXG5cblx0XHRcdFx0aWYgKGV2LnRhcmdldC5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhciBzdWNjZXNzID0gKGV2LnRhcmdldC5zdGF0dXMgPj0gMjAwICYmIGV2LnRhcmdldC5zdGF0dXMgPCAzMDApIHx8IGV2LnRhcmdldC5zdGF0dXMgPT09IDMwNCB8fCAoL15maWxlOlxcL1xcLy9pKS50ZXN0KHVybClcblx0XHRcdFx0XHRcdC8vIFdoZW4gdGhlIHJlc3BvbnNlIHR5cGUgaXNuJ3QgXCJcIiBvciBcInRleHRcIixcblx0XHRcdFx0XHRcdC8vIGB4aHIucmVzcG9uc2VUZXh0YCBpcyB0aGUgd3JvbmcgdGhpbmcgdG8gdXNlLlxuXHRcdFx0XHRcdFx0Ly8gQnJvd3NlcnMgZG8gdGhlIHJpZ2h0IHRoaW5nIGFuZCB0aHJvdyBoZXJlLCBhbmQgd2Vcblx0XHRcdFx0XHRcdC8vIHNob3VsZCBob25vciB0aGF0IGFuZCBkbyB0aGUgcmlnaHQgdGhpbmcgYnlcblx0XHRcdFx0XHRcdC8vIHByZWZlcnJpbmcgYHhoci5yZXNwb25zZWAgd2hlcmUgcG9zc2libGUvcHJhY3RpY2FsLlxuXHRcdFx0XHRcdFx0dmFyIHJlc3BvbnNlID0gZXYudGFyZ2V0LnJlc3BvbnNlLCBtZXNzYWdlXG5cblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZVR5cGUgPT09IFwianNvblwiKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEZvciBJRSBhbmQgRWRnZSwgd2hpY2ggZG9uJ3QgaW1wbGVtZW50XG5cdFx0XHRcdFx0XHRcdC8vIGByZXNwb25zZVR5cGU6IFwianNvblwiYC5cblx0XHRcdFx0XHRcdFx0aWYgKCFldi50YXJnZXQucmVzcG9uc2VUeXBlICYmIHR5cGVvZiBhcmdzLmV4dHJhY3QgIT09IFwiZnVuY3Rpb25cIikgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGV2LnRhcmdldC5yZXNwb25zZVRleHQpXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSBcInRleHRcIikge1xuXHRcdFx0XHRcdFx0XHQvLyBPbmx5IHVzZSB0aGlzIGRlZmF1bHQgaWYgaXQncyB0ZXh0LiBJZiBhIHBhcnNlZFxuXHRcdFx0XHRcdFx0XHQvLyBkb2N1bWVudCBpcyBuZWVkZWQgb24gb2xkIElFIGFuZCBmcmllbmRzIChhbGxcblx0XHRcdFx0XHRcdFx0Ly8gdW5zdXBwb3J0ZWQpLCB0aGUgdXNlciBzaG91bGQgdXNlIGEgY3VzdG9tXG5cdFx0XHRcdFx0XHRcdC8vIGBjb25maWdgIGluc3RlYWQuIFRoZXkncmUgYWxyZWFkeSB1c2luZyB0aGlzIGF0XG5cdFx0XHRcdFx0XHRcdC8vIHRoZWlyIG93biByaXNrLlxuXHRcdFx0XHRcdFx0XHRpZiAocmVzcG9uc2UgPT0gbnVsbCkgcmVzcG9uc2UgPSBldi50YXJnZXQucmVzcG9uc2VUZXh0XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgYXJncy5leHRyYWN0ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBhcmdzLmV4dHJhY3QoZXYudGFyZ2V0LCBhcmdzKVxuXHRcdFx0XHRcdFx0XHRzdWNjZXNzID0gdHJ1ZVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYXJncy5kZXNlcmlhbGl6ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gYXJncy5kZXNlcmlhbGl6ZShyZXNwb25zZSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdWNjZXNzKSByZXNvbHZlKHJlc3BvbnNlKVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7IG1lc3NhZ2UgPSBldi50YXJnZXQucmVzcG9uc2VUZXh0IH1cblx0XHRcdFx0XHRcdFx0Y2F0Y2ggKGUpIHsgbWVzc2FnZSA9IHJlc3BvbnNlIH1cblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpXG5cdFx0XHRcdFx0XHRcdGVycm9yLmNvZGUgPSBldi50YXJnZXQuc3RhdHVzXG5cdFx0XHRcdFx0XHRcdGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2Vcblx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgYXJncy5jb25maWcgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHR4aHIgPSBhcmdzLmNvbmZpZyh4aHIsIGFyZ3MsIHVybCkgfHwgeGhyXG5cblx0XHRcdFx0Ly8gUHJvcGFnYXRlIHRoZSBgYWJvcnRgIHRvIGFueSByZXBsYWNlbWVudCBYSFIgYXMgd2VsbC5cblx0XHRcdFx0aWYgKHhociAhPT0gb3JpZ2luYWwpIHtcblx0XHRcdFx0XHRyZXBsYWNlZEFib3J0ID0geGhyLmFib3J0XG5cdFx0XHRcdFx0eGhyLmFib3J0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRhYm9ydGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0cmVwbGFjZWRBYm9ydC5jYWxsKHRoaXMpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChib2R5ID09IG51bGwpIHhoci5zZW5kKClcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBhcmdzLnNlcmlhbGl6ZSA9PT0gXCJmdW5jdGlvblwiKSB4aHIuc2VuZChhcmdzLnNlcmlhbGl6ZShib2R5KSlcblx0XHRcdGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiAkd2luZG93LkZvcm1EYXRhKSB4aHIuc2VuZChib2R5KVxuXHRcdFx0ZWxzZSB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShib2R5KSlcblx0XHR9KSxcblx0XHRqc29ucDogbWFrZVJlcXVlc3QoZnVuY3Rpb24odXJsLCBhcmdzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHZhciBjYWxsYmFja05hbWUgPSBhcmdzLmNhbGxiYWNrTmFtZSB8fCBcIl9taXRocmlsX1wiICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikgKyBcIl9cIiArIGNhbGxiYWNrQ291bnQrK1xuXHRcdFx0dmFyIHNjcmlwdCA9ICR3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKVxuXHRcdFx0JHdpbmRvd1tjYWxsYmFja05hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVzb2x2ZShkYXRhKVxuXHRcdFx0fVxuXHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGVsZXRlICR3aW5kb3dbY2FsbGJhY2tOYW1lXVxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpXG5cdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJKU09OUCByZXF1ZXN0IGZhaWxlZFwiKSlcblx0XHRcdH1cblx0XHRcdHNjcmlwdC5zcmMgPSB1cmwgKyAodXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCIpICtcblx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGFyZ3MuY2FsbGJhY2tLZXkgfHwgXCJjYWxsYmFja1wiKSArIFwiPVwiICtcblx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGNhbGxiYWNrTmFtZSlcblx0XHRcdCR3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9KSxcblx0fVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIG1vdW50UmVkcmF3ID0gcmVxdWlyZShcIi4vbW91bnQtcmVkcmF3XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vYXBpL3JvdXRlclwiKSh3aW5kb3csIG1vdW50UmVkcmF3KVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGluZGV4LmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tIFwiLi92aWV3cy9sYXlvdXQuanNcIjtcbmltcG9ydCB7IGhvbWUgfSBmcm9tIFwiLi92aWV3cy9ob21lLmpzXCI7XG5pbXBvcnQgeyBpbnZlbnRvcnkgfSBmcm9tIFwiLi92aWV3cy9pbnZlbnRvcnkuanNcIjtcbmltcG9ydCB7IHByb2R1Y3REZXRhaWxzIH0gZnJvbSBcIi4vdmlld3MvcHJvZHVjdC1kZXRhaWxzLmpzXCI7XG5pbXBvcnQgeyBwaWNrTGlzdHMgfSBmcm9tIFwiLi92aWV3cy9waWNrLWxpc3RzLmpzXCI7XG5pbXBvcnQgeyBvcmRlckRldGFpbHMgfSBmcm9tIFwiLi92aWV3cy9vcmRlci1kZXRhaWxzLmpzXCI7XG5pbXBvcnQgeyBpbmRlbGl2ZXJ5IH0gZnJvbSBcIi4vdmlld3MvaW5kZWxpdmVyeS5qc1wiO1xuaW1wb3J0IHsgbmV3SW5kZWxpdmVyeSB9IGZyb20gXCIuL3ZpZXdzL25ldy1pbmRlbGl2ZXJ5LmpzXCI7XG5pbXBvcnQgeyBpbnZvaWNlcyB9IGZyb20gXCIuL3ZpZXdzL2ludm9pY2VzLmpzXCI7XG5pbXBvcnQgeyBpbnZvaWNlIH0gZnJvbSBcIi4vdmlld3MvaW52b2ljZS5qc1wiO1xuaW1wb3J0IHsgbmV3SW52b2ljZSB9IGZyb20gXCIuL3ZpZXdzL25ldy1pbnZvaWNlLmpzXCI7XG5pbXBvcnQgeyBsb2dpbiB9IGZyb20gXCIuL3ZpZXdzL2xvZ2luLmpzXCI7XG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gXCIuL3ZpZXdzL3JlZ2lzdGVyLmpzXCI7XG5cbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9tb2RlbHMvYXV0aC5qc1wiO1xuXG5tLnJvdXRlKGRvY3VtZW50LmJvZHksIFwiL1wiLCB7XG4gICAgXCIvXCI6IHtcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShob21lKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiL2ludmVudG9yeVwiOiB7XG4gICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW52ZW50b3J5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXV0aC5jYWxsYmFjayA9IFwiaW52ZW50b3J5XCI7XG4gICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoXCIvbG9naW5cIik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0oaW52ZW50b3J5KSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiL3Byb2R1Y3QtZGV0YWlscy86aWRcIjoge1xuICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3REZXRhaWxzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KFwiL2xvZ2luXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0ocHJvZHVjdERldGFpbHMsIHZub2RlLmF0dHJzKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiL3BpY2stbGlzdHNcIjoge1xuICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBpY2tMaXN0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF1dGguY2FsbGJhY2sgPSBcInBpY2stbGlzdHNcIjtcbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShwaWNrTGlzdHMpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCIvb3JkZXItZGV0YWlscy86aWRcIjoge1xuICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyRGV0YWlscztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKG9yZGVyRGV0YWlscywgdm5vZGUuYXR0cnMpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCIvaW5kZWxpdmVyeVwiOiB7XG4gICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZWxpdmVyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF1dGguY2FsbGJhY2sgPSBcImluZGVsaXZlcnlcIjtcbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShpbmRlbGl2ZXJ5KSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiL25ldy1pbmRlbGl2ZXJ5XCI6IHtcbiAgICAgICAgb25tYXRjaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoYXV0aC50b2tlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdJbmRlbGl2ZXJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KFwiL2xvZ2luXCIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKG5ld0luZGVsaXZlcnkpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCIvaW52b2ljZXNcIjoge1xuICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludm9pY2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXV0aC5jYWxsYmFjayA9IFwiaW52b2ljZXNcIjtcbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShpbnZvaWNlcykpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcIi9pbnZvaWNlLzppZFwiOiB7XG4gICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW52b2ljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF1dGguY2FsbGJhY2sgPSBcImludm9pY2VcIjtcbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKGludm9pY2UsIHZub2RlLmF0dHJzKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiL25ldy1pbnZvaWNlXCI6IHtcbiAgICAgICAgb25tYXRjaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoYXV0aC50b2tlbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnZvaWNlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShuZXdJbnZvaWNlKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiL2xvZ2luXCI6IHtcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShsb2dpbikpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcIi9yZWdpc3RlclwiOiB7XG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0ocmVnaXN0ZXIpKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==