/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// orders.js

import { apiKey, baseUrl } from "./vars.js";
import { products } from "./products.js";
import { newOrders } from "./new-orders.js";

let orders = {
    allOrders: [],

    getAllOrders: function(callback, noCache = false) {
        if (noCache) {
            this.allOrders = [];
        } else if (orders.allOrders.length > 0) {
            return callback();
        }

        fetch(`${baseUrl}/orders?api_key=${apiKey}`)
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
            api_key: apiKey
        };

        console.log("order:", order);

        let fetchObject = {
            body: JSON.stringify(order),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        };

        await fetch(`${baseUrl}/orders`, fetchObject)
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
                api_key: apiKey
            };

            console.log("productDetails:", productDetails);

            products.updateProduct(productDetails);
        });

        newOrders.showNewOrders(true);
    }
};

export { orders };
