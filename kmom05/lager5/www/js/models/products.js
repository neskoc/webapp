/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// products.js

import m from 'mithril';

import { auth } from "./auth.js";

let products = {
    allProducts: [],

    getAllProducts: function(noCache = false) {
        if (noCache) {
            products.allProducts = [];
        } else if (products.allProducts.length > 0) {
            // console.log("return: getAllProducts");
            return products.allProducts;
        }

        return m.request({
            method: "GET",
            url: `${auth.baseUrl}/products?api_key=${auth.apiKey}`
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

        m.request({
            method: "PUT",
            url: `${auth.baseUrl}/products`,
            body: productDetails
        }).then(function(response) {
            console.log("update product response: ",  response);
        });
    }
};

export { products };
