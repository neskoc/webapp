/* jshint esversion: 8 */
/* jshint node: true */

// js/models/lager.js

"use strict";

import m from 'mithril';
import { apiKey, baseUrl } from "../vars.js";

let lager = {
    current: {
        deliveries: [],
        products: []
    },
    currentForm: {},
    loadAllDeliveries: function() {
        return m.request({
            method: "GET",
            url: `${baseUrl}/deliveries?api_key=${apiKey}`
        }).then(function(result) {
            lager.current.deliveries = result.data;
        }).finally (function() {
            m.request({
                method: "GET",
                url: `${baseUrl}/products?api_key=${apiKey}`
            }).then(function(result) {
                lager.current.products = result.data;
                // console.log("lager.current.products: ", lager.current.products);
            });
        });
    },
    addIndelivery: function() {
        lager.currentForm.api_key = apiKey;
        console.log("lager.currentForm: ", lager.currentForm);

        return m.request({
            method: "POST",
            url: `${baseUrl}/deliveries`,
            body: lager.currentForm
        }).then(function() {
            console.log("lager.currentForm: ", lager.currentForm);
            let requestBody = {
                api_key: apiKey,
                id: lager.currentForm.product_id,
                name: lager.current.products.filter(
                    product => product.id == lager.currentForm.product_id
                )[0].name,
                stock: (+lager.currentForm.amount +
                    +lager.current.products.filter(
                        product => product.id == lager.currentForm.product_id
                    )[0].stock)
            };

            console.log("requestBody: ", requestBody);
            m.request({
                method: "PUT",
                url: `${baseUrl}/products`,
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
        lager.ccurrentForm = {};
    }
};

export { lager };
