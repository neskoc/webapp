/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// order-items.js

import { menu } from "./menu.js";
import { newOrders } from "./new-orders.js";
import { utils } from "./utils.js";

let orderItems = {
    showOrderItems: function (order) {
        utils.cleanWindow();

        let topNavElement = document.createElement("a");

        topNavElement.textContent = "New orders";
        topNavElement.addEventListener("click", newOrders.showNewOrders);

        window.topNavigation.appendChild(topNavElement);

        let orderName = document.createElement("h1");

        orderName.className = "product-name";
        orderName.textContent = order.name;

        let orderInfoList = document.createElement("dl");

        orderInfoList.className = "product-info";

        for (let key in order) {
            if (key !== "name" && key !== "order_items") {
                let orderInfoTerm = document.createElement("dt");
                let orderInfoDescription = document.createElement("dd");

                orderInfoTerm.textContent = key + ":";
                orderInfoDescription.textContent = order[key];

                orderInfoList.appendChild(orderInfoTerm);
                orderInfoList.appendChild(orderInfoDescription);
            }
        }

        window.mainContainer.appendChild(orderName);
        window.mainContainer.appendChild(orderInfoList);

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("checklist");
    }
};

export { orderItems };
