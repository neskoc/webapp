/* jshint esversion: 8 */
/* jshint node: true */

// js/models/lager.js

"use strict";

import m from 'mithril';
import { auth } from "./auth.js";

let lager = {
    current: {
        deliveries: [],
        products: []
    },
    currentForm: {},
    loadAllDeliveries: function() {
        return m.request({
            method: "GET",
            url: `${auth.baseUrl}/deliveries?api_key=${auth.apiKey}`
        }).then(function(result) {
            lager.current.deliveries = result.data;
        }).finally (function() {
            m.request({
                method: "GET",
                url: `${auth.baseUrl}/products?api_key=${auth.apiKey}`
            }).then(function(result) {
                lager.current.products = result.data;
                // console.log("lager.current.products: ", lager.current.products);
            });
        });
    },
    addIndelivery: function() {
        lager.currentForm.api_key = auth.apiKey;
        console.log("lager.currentForm: ", lager.currentForm);

        return m.request({
            method: "POST",
            url: `${auth.baseUrl}/deliveries`,
            body: lager.currentForm
        }).then(function() {
            console.log("lager.currentForm: ", lager.currentForm);
            let requestBody = {
                api_key: auth.apiKey,
                id: lager.currentForm.product_id,
                name: lager.current.products.filter(
                    product => product.id == lager.currentForm.product_id
                )[0].name,
                stock: (+lager.currentForm.amount + // prefix +string converts it to number
                    +lager.current.products.filter(
                        product => product.id == lager.currentForm.product_id
                    )[0].stock)
            };

            console.log("requestBody: ", requestBody);
            m.request({
                method: "PUT",
                url: `${auth.baseUrl}/products`,
                body: requestBody
            }).then(function(response) {
                console.log("update product response: ",  response);
            });
        }).finally(function() {
            lager.resetCurrentForm();

            return m.route.set("/indelivery");
        });
    },
    resetCurrentForm: function() {
        lager.currentForm = {};
    }
};

export { lager };
