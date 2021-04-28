/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/invoice.js

import m from 'mithril';
import { orders } from "../models/orders.js";

const orderRow = {
    view: function(vnode) {
        let product = vnode.attrs;

        return m("tr", [
            m("td", product.name),
            m("td.right", product.amount),
            m("td.right", product.price),
            m("td.right", +product.amount * +product.price)
        ]);
    }
};

let main = {
    view: function(vnode) {
        let order = vnode.attrs;

        return [
            m("h2", "Fakturainfo"),
            m("p.info-row", order.name),
            m("p.info-row", order.address),
            m("p.info-row", order.zip ? order.zip : '' + ' ' + order.city ? order.city : ''),
            m("p.info-row", order.country),
            m("p.info-row", order.adress),
            m("table.table.table-scroll.table-striped", [
                m("tr", [
                    m("th", "Product"),
                    m("th", "Antal"),
                    m("th", "Pris"),
                    m("th", "Total")
                ]),
                order.order_items.map(function(item) {
                    return m(orderRow, item);
                })
            ])
        ];
    }
};

let invoice = {
    oninit: function(vnode) {
        orders.getOrder(vnode.attrs.id);
    },
    view: function(vnode) {
        console.log("invoice.view: vnode.attrs", vnode.attrs);
        return m("main.container", m(main, orders.currentOrder));
    }
};

export { invoice };
