/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/home.js

import m from 'mithril';

import { orders } from "../models/orders.js";
import { products } from "../models/products.js";
import { auth } from "../models/auth.js";

let main = {
    oninit: function() {
        orders.getAllOrders();
        products.getAllProducts();
        auth.checkTokenValidity();
        orders.currentOrder = orders.allOrders.filter(order => order.status_id < 600)[0];
    },
    view: function() {
        let greeting = "Det här är en SPA för kursen Webapp";
        let image = {
            src: "img/AI-head2.jpg",
            alt: "AI head"
        };

        if (auth.token) {
            return [
                m("h1.title", "Lagerapp"),
                m("p", greeting),
                m("img", image, greeting)
            ];
        } else {
            return [
                m("h1.title", "Lagerapp"),
                m("p", greeting),
                m(
                    "a.button.blue-button.full-width-button",
                    { href: "#!/login" },
                    "Logga in"
                ),
                m(
                    "a.button.green-button.full-width-button",
                    { href: "#!/register" },
                    "Registrera"
                ),
                m("img", image, greeting)
            ];
        }
    }
};

let home = {
    view: function() {
        return m("main.container", m(main));
    }
};

export { home };
