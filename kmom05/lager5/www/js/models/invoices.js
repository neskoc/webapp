/* jshint esversion: 8 */
/* jshint node: true */

// js/models/invoices.js

"use strict";

import m from 'mithril';

import { orders } from "../models/orders.js";
import { auth } from "../models/auth.js";

let invoicesModel = {
    url: `${auth.baseUrl}/invoices?api_key=${auth.apiKey}`,
    invoices: [],

    getAllInvoices: async function() {
        console.log(`auth.token: ${auth.token}`);
        return m.request({
            method: "GET",
            url: invoicesModel.url,
            headers: {
                'x-access-token': auth.token,
            }
        }).then(function(result) {
            console.log("Invoices.getAllInvoices:", result.data);
            invoicesModel.invoices = result.data;
        });
    },

    saveInvoice: async function(order) {
        const formatYmd = date => date.toISOString().slice(0, 10);
        let currentDate = formatYmd(new Date());

        let sum = 0;

        order.order_items.forEach(function(product) {
            sum += +product.price * +product.amount;
        });

        let body = {
            order_id: order.id,
            api_key: auth.apiKey,
            total_price: sum,
            creation_date: currentDate
        };

        console.log("saveInvoice: body", body);

        return m.request({
            method: "POST",
            url: `${auth.baseUrl}/invoices`,
            body: body,
            headers: {
                'x-access-token': auth.token,
            }
        }).then(function(result) {
            console.log("saveInvoice: result: ", result);
            orders.updateOrder(order.id, 600);
        });
    }
};

export { invoicesModel };
