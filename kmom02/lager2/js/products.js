/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// products.js

import { apiKey, baseUrl } from "./vars.js";

let products = {
    allProducts: [],

    getAllProducts: function(callback, noCach = false) {
        if (noCach) {
            this.allProducts = [];
        } else if (this.allProducts.length > 0) {
            return callback();
        }

        fetch(`${baseUrl}/products?api_key=${apiKey}`)
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

export { products };
