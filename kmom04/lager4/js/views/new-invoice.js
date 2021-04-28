/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/new-invoice.js

import m from 'mithril';
import { orders } from "../models/orders.js";
import { invoicesModel } from "../models/invoices.js";

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

let showOrder = {
    view: function(vnode) {
        let order = vnode.attrs;
        // console.log("showOrder: orders.ccurrentOrder", order);

        return [
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
            ]),
            m(
                "input.button.green-button.full-width-button[type=submit][value='Skapa fakturan']"
            )
        ];
    }
};

let main = {
    view: function() {
        let order = orders.currentOrder;

        return m("div.form-container", [
            m("h2", "Ny faktura"),
            m("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    invoicesModel.saveInvoice(order);
                    m.route.set("/invoices");
                } }, [
                m("label.input-label", "Order"),
                m("select.input[required=required]", {
                    onchange: function (e) {
                        order = orders.getOrder(e.target.value);
                        console.log("main", orders.currentOrder);
                    }
                }, orders.allOrders.filter(order => order.status_id < 600)
                    .map(function(order) {
                        return m("option", { value: order.id }, order.name);
                    })
                ),
                m("div#invoice-container", m(showOrder, order))
            ])
        ]);
    }
};

let newInvoice = {
    oninit: function() {
        if (orders.currentOrder !== '') {
            orders.currentOrder = orders.allOrders.filter(order => order.status_id < 600)[0];
        }
    },
    view: function() {
        return m("main.container", m(main));
    }
};

export { newInvoice };
