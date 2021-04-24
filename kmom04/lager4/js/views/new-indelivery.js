/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/newIndelivery.js

import m from 'mithril';
import { lager } from "../models/lager.js";

let newIndelivery = {
    oninit: function() {
        lager.resetCurrentForm();
    },
    view: function() {
        return m("div.form-container", [
            m("h2", "Ny inleverans"),
            m("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    lager.addIndelivery();
                } }, [
                m("label.input-label", "Produkt"),
                m("select.input[required=required]", {
                    onchange: function (e) {
                        lager.currentForm.product_id = e.target.value;
                    }
                }, lager.current.products.map(function(product) {
                    return m("option", { value: product.id }, product.name);
                })),
                m("label.input-label", "Antal"),
                m("input.input[type=number][placeholder=Antal][required=required][min=1]", {
                    oninput: function (e) {
                        lager.currentForm.amount = e.target.value;
                    },
                    value: lager.currentForm.amount
                }),
                m("label.input-label", "Leveransdatum"),
                m("input.input[type=date][placeholder=Leveransdatum][required=required]", {
                    oninput: function (e) {
                        lager.currentForm.delivery_date = e.target.value;
                    },
                    value: lager.currentForm.date
                }),
                m("label.input-label", "Kommentar"),
                m("textarea.input[cols=2][placeholder=Kommentar]", {
                    oninput: function (e) {
                        lager.currentForm.comment = e.target.value;
                    },
                    value: lager.currentForm.comment
                }),
                m(
                    "input.button.green-button.full-width-button[type=submit][value=Save]",
                    "Gör inleverans"
                )
            ])
        ]);
    }
};

export { newIndelivery };
