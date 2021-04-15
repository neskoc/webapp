/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// orders.js

import { apiKey, baseUrl } from "./vars.js";

let orders = {
    allOrders: [],

    getAllOrders: function(callback, noCach = false) {
        if (noCach) {
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
    }
};

export { orders };
