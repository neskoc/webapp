/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// order-details.js

import { menu } from "./menu.js";
import { utils } from "./utils.js";
import { newOrders } from "./new-orders.js";

let orderDetails = {
    showProductListForPick: function(order) {
        let completeElementList = [];

        window.topNavigation.innerHTML = "";

        window.topNavigation.appendChild(utils.createElement({
            type: "a",
            href: "#",
            textContent: "Nya ordrar",
            onclick: newOrders.showNewOrders
        }));

        window.mainContainer.innerHTML = "";

        completeElementList.push(utils.createElement({
            type: "h1",
            className: "title",
            textContent: order.name
        }));

        let elementList = utils.generateProductListForPick(order.order_items);

        elementList.forEach(element => completeElementList.push(element));

        completeElementList.forEach(element =>  window.mainContainer.appendChild(element));

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("checklist");
    }
};

export { orderDetails };
