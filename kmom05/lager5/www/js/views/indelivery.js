/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/indelivery.js

import m from 'mithril';
import { lager } from "../models/lager.js";

const indeliveryComponent = {
    view: function(vnode) {
        let current = vnode.attrs;

        return m("div.card", [
            m("p.card-title", current.product_name),
            m("dl.product-info",
                [
                    m("dt", "Produkt"),
                    m("dd", current.product_id),
                    m("dt", "Antal"),
                    m("dd", current.amount),
                    m("dt", "Leveransdatum"),
                    m("dd", current.delivery_date),
                    m("dt", "Kommentar"),
                    m("dd", current.comment)
                ]
            ),
        ]);
    }
};

let main = {
    oninit: lager.loadAllDeliveries,
    view: function() {
        if (lager.current.deliveries.length < 1) {
            return [
                m("h1.title", "Inleveranser"),
                m("p", "Inga inleveranser finns registrerade!")
            ];
        }
        return [
            m("h1.title", "Inleveranser"),
            m(
                "a.button.blue-button.full-width-button",
                { href: "#!/new-indelivery" },
                "Ny inleverans"
            ),
            m("div.delivery-container", lager.current.deliveries.map(function(delivery) {
                return m(indeliveryComponent, delivery);
            }))
        ];
    }
};

let indelivery = {
    view: function() {
        return m("main.container", m(main));
    }
};

export { indelivery };
