/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// orders.js

import m from 'mithril';

import { auth } from "./auth.js";
import { products } from "./products.js";
// import { pickLists } from "../views/pick-lists.js";

let orders = {
    allOrders: [],
    currentOrder: '',
    current: { order: ''},

    getAllOrders: async function(noCache = false) {
        if (noCache) {
            console.log("noCache", noCache);
            products.allProducts = [];
            orders.allOrders = [];
        } else if (orders.allOrders.length > 0) {
            return orders.allOrders;
        }

        return m.request({
            method: "GET",
            url: `${auth.baseUrl}/orders?api_key=${auth.apiKey}`
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
            api_key: auth.apiKey
        };

        // console.log("order:", order);
        return m.request({
            // body: JSON.stringify(order),
            body: order,
            method: 'PUT',
            url: `${auth.baseUrl}/orders`
        }).then(function(result) {
            console.log(result);
            let fullOrder = orders.getOrder(orderId);

            console.log("fullOrder", fullOrder);

            fullOrder.order_items.forEach(function(item) {
                let newStock = item.stock - item.amount;
                let productDetails = {
                    id: item.product_id,
                    stock: newStock,
                    api_key: auth.apiKey
                };

                console.log("productDetails:", productDetails);

                products.updateProduct(productDetails);
            });
        }).finally(function() {
            orders.getAllOrders(true);
        });
    }
};

export { orders };
