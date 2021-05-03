/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/inventory.js

import m from 'mithril';

import { products } from "../models/products.js";

const inventoryComponent = {
    view: function(vnode) {
        let product = vnode.attrs;
        // console.log("vnode.attrs:", vnode.attrs);

        return m("div.flex-row", {
            onclick: function() {
                console.log("view:product-details/:id", product.id);
                return m.route.set(`/product-details/${product.id}`);
            }
        }, [
            m("div.flex-item.left", product.name),
            m("div.flex-item.right", product.stock),
        ]);
    }
};

let main = {
    oninit: products.getAllProducts,
    view: function() {
        return [
            m("h1.title", "Lagersaldo"),
            m("div.inv-container", products.allProducts.map(product => {
                // console.log("inventory.view:product", product);
                return m(inventoryComponent, product);
            }))
        ];
    }
};

let inventory = {
    view: function() {
        return m("main.container", m(main));
    }
};

export { inventory };
