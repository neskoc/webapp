/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */

"use strict";

// index.js

import m from 'mithril';
import fileModel from "../models/filemodel.js";

import { layout } from "./views/layout.js";
import { home } from "./views/home.js";
import { inventory } from "./views/inventory.js";
import { productDetails } from "./views/product-details.js";
import { pickLists } from "./views/pick-lists.js";
import { orderDetails } from "./views/order-details.js";
import { indelivery } from "./views/indelivery.js";
import { newIndelivery } from "./views/new-indelivery.js";
import { invoices } from "./views/invoices.js";
import { invoice } from "./views/invoice.js";
import { newInvoice } from "./views/new-invoice.js";
import { login } from "./views/login.js";
import { register } from "./views/register.js";

import { auth } from "./models/auth.js";

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');

    m.route(document.body, "/", {
        "/": {
            render: function() {
                return m(layout, m(home));
            }
        },
        "/inventory": {
            onmatch: function() {
                if (auth.token) {
                    return inventory;
                }
                auth.callback = "inventory";
                return m.route.set("/login");
            },
            render: function() {
                return m(layout, m(inventory));
            }
        },
        "/product-details/:id": {
            onmatch: function() {
                if (auth.token) {
                    return productDetails;
                }
                return m.route.set("/login");
            },
            render: function(vnode) {
                return m(layout, m(productDetails, vnode.attrs));
            }
        },
        "/pick-lists": {
            onmatch: function() {
                if (auth.token) {
                    return pickLists;
                }
                auth.callback = "pick-lists";
                return m.route.set("/login");
            },
            render: function() {
                return m(layout, m(pickLists));
            }
        },
        "/order-details/:id": {
            onmatch: function() {
                if (auth.token) {
                    return orderDetails;
                }
                return m.route.set("/login");
            },
            render: function(vnode) {
                return m(layout, m(orderDetails, vnode.attrs));
            }
        },
        "/indelivery": {
            onmatch: function() {
                if (auth.token) {
                    return indelivery;
                }
                auth.callback = "indelivery";
                return m.route.set("/login");
            },
            render: function() {
                return m(layout, m(indelivery));
            }
        },
        "/new-indelivery": {
            onmatch: function() {
                if (auth.token) {
                    return newIndelivery;
                }
                return m.route.set("/login");
            },
            render: function() {
                return m(layout, m(newIndelivery));
            }
        },
        "/invoices": {
            onmatch: function() {
                if (auth.token) {
                    return invoices;
                }
                auth.callback = "invoices";
                return m.route.set("/login");
            },
            render: function() {
                return m(layout, m(invoices));
            }
        },
        "/invoice/:id": {
            onmatch: function() {
                if (auth.token) {
                    return invoice;
                }
                auth.callback = "invoice";
                return m.route.set("/login");
            },
            render: function(vnode) {
                return m(layout, m(invoice, vnode.attrs));
            }
        },
        "/new-invoice": {
            onmatch: function() {
                if (auth.token) {
                    return invoices;
                }
                return m.route.set("/login");
            },
            render: function() {
                return m(layout, m(newInvoice));
            }
        },
        "/login": {
            render: function() {
                return m(layout, m(login));
            }
        },
        "/register": {
            render: function() {
                return m(layout, m(register));
            }
        }
    });
}
