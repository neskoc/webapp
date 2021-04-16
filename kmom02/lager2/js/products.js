/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// products.js

import { apiKey, baseUrl } from "./vars.js";

let products = {
    allProducts: [],

    getAllProducts: async function(callback, orderItems = [], noCache = false) {
        if (noCache) {
            products.allProducts = [];
        } else if (products.allProducts.length > 0) {
            console.log("return callback: getAllProducts");
            return callback();
        }

        await fetch(`${baseUrl}/products?api_key=${apiKey}`)
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

        await fetch(`${baseUrl}/products`, fetchObject)
            .then(function (response) {
                console.log("updateProduct response: ", response);

                return response;
            });
    }
};

export { products };
