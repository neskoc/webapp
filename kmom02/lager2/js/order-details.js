/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// order-details.js

import { menu } from "./menu.js";
import { utils } from "./utils.js";
import { newOrders } from "./new-orders.js";
import { products } from "./products.js";
import { orders } from "./orders.js";

let orderDetails = {
    showProductListForPick: function(order) {
        let completeElementList = [];

        utils.cleanWindow();

        window.topNavigation.appendChild(utils.createElement({
            type: "a",
            href: "#",
            textContent: "Nya ordrar",
            onclick: newOrders.showNewOrders
        }));

        completeElementList.push(utils.createElement({
            type: "h1",
            className: "title",
            textContent: order.name
        }));

        let elementList = utils.generateProductListForPick(order.order_items);

        elementList.forEach(element => completeElementList.push(element));

        completeElementList.forEach(element => window.mainContainer.appendChild(element));

        if (products.areProductsOnStock(order.order_items)) {
            let itemElement = utils.createElement({
                type: "a",
                href: "#",
                className: "button blue-button full-width-button",
                textContent: "Sätt som packat"
            });

            itemElement.addEventListener("click", function handleClick() {
                console.log(order.id);
                orders.updateOrder(order.id, 200);
            });
            window.commandStripe.appendChild(itemElement);
        }

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);
        window.rootElement.appendChild(window.commandStripe);

        menu.showMenu("checklist");
    }
};

export { orderDetails };
