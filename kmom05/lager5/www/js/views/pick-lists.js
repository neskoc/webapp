/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/pick-lists.js

import m from 'mithril';

import { orders } from "../models/orders.js";


const generateOrderList = {
    view: function(vnode) {
        let order = vnode.attrs;

        return m("div.flex-row", {
            onclick: function() {
                console.log(order);
                m.route.set(`/order-details/${order.id}`);
            }
        }, [
            m("div.flex-item.left", order.name),
            m("div.flex-item.right", order.id),
        ]);
    }
};

let main = {
    oninit: orders.getAllOrders,
    view: function() {
        return [
            m("h1.title", "Nya ordrar"),
            m("div.inv-container", (
                orders.allOrders.length === 0 ?
                    orders.allOrders.filter(order => order.status_id === 100)
                        .map(order => {
                            return m(generateOrderList, order);
                        }) : m("p", "Finns inga nya ordrar")
            ))
        ];
    }
};

let pickLists = {
    view: function() {
        return m("main.container", m(main));
    }
};

export {
    pickLists
};
