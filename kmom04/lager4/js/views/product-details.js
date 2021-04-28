/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// product-details.js

import m from 'mithril';

import { products } from "../models/products.js";

let main = {
    view: function(vnode) {
        console.log("vnode:", vnode);
        let product = products.getProduct(vnode.attrs.id);

        return [
            m("h1.product-name", product.name),
            m("dl.product-info", [
                m("dt", "id"),
                m("dd", product.id),
                m("dt", "Artikelnummer"),
                m("dd", product.article_number),
                m("dt", "Beskrivning"),
                m("dd", product.description),
                m("dt", "Specifikation"),
                m("dd", product.specifiers),
                m("dt", "I lager"),
                m("dd", product.stock),
                m("dt", "Hylla"),
                m("dd", product.location),
                m("dt", "Pris"),
                m("dd", product.price),
            ])
        ];
    }
};

let productDetails = {
    view: function(vnode) {
        console.log("product-details");
        return m("main.container", m(main, vnode.attrs));
    }
};

export { productDetails };
