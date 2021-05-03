/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/invoices.js

import m from 'mithril';

import { invoicesModel } from "../models/invoices.js";

const invoicesRow = {
    view: function(vnode) {
        let invoice = vnode.attrs;

        return m("tr.tr-link", {
            onclick: function() {
                console.log(invoice);
                m.route.set(`/invoice/${invoice.order_id}`);
            }
        }, [
            m("td", invoice.name),
            m("td.right", invoice.total_price)
        ]);
    }
};

let main = {
    oninit: invoicesModel.getAllInvoices,
    view: function() {
        if (invoicesModel.invoices.length === 0) {
            return [
                m("h1.title", "Fakturor"),
                m("p", "Inga fakturor finns registrerade!")
            ];
        }
        return [
            m("h1.title", "Fakturor"),
            m("table.table.table-scroll.table-striped", [
                m("tr", [
                    m("th", "Kund"),
                    m("th", "Summa")
                ]),
                invoicesModel.invoices.map(function(invoice) {
                    return m(invoicesRow, invoice);
                })
            ]),
            m(
                "a.button.green-button.full-width-button.space",
                { href: "#!/new-invoice" },
                "Skapa en faktura"
            )
        ];
    }
};

let invoices = {
    view: function() {
        return m("main.container", m(main));
    }
};

export { invoices };
