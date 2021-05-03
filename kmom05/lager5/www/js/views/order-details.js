/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// order-details.js

import m from 'mithril';

// import { pickLists } from "./pick-lists.js";
import { products } from "../models/products.js";
import { orders } from "../models/orders.js";

let orderItems = {
    view: function(vnode) {
        let order = vnode.attrs;

        console.log("orderItems->order.order_items:", order.order_items);
        return [
            m("h1.title", order.name),
            m("dl.product-info", order.order_items.map(function(product) {
                return [
                    m("dt", "Product"),
                    m("dd", product.product_id),
                    m("dt", "Hylla"),
                    m("dd", product.location),
                    m("dt", "Beskrivning"),
                    m("dd", product.description)
                ];
            }))
        ];
    }
};

let main = {
    view: function() {
        let order = orders.currentOrder;

        let indeliveryPossible = products.areProductsOnStock(order.order_items);

        if (indeliveryPossible) {
            return [
                m(orderItems, order),
                m(
                    "a.button.green-button.full-width-button",
                    {
                        onclick: function() {
                            console.log(order.id);
                            orders.updateOrder(order.id, 200);
                            m.route.set('/pick-lists');
                        }
                    },
                    "Sätt som packat"
                )];
        } else {
            return m(orderItems, order);
        }
    }
};

let orderDetails = {
    oninit: function(vnode) {
        orders.getOrder(vnode.attrs.id);
    },
    view: function(vnode) {
        return m("main.container", m(main, vnode.attrs));
    }
};

export { orderDetails };
