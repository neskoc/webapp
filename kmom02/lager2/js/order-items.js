/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// order-items.js

import { menu } from "./menu.js";
import { newOrders } from "./new-orders.js";

let orderItems = (function () {
    let showOrderItems = function (product) {
        window.topNavigation.innerHTML = "";

        let topNavElement = document.createElement("a");

        topNavElement.textContent = "New orders";
        topNavElement.addEventListener("click", newOrders.showNewOrders);

        window.topNavigation.appendChild(topNavElement);

        window.mainContainer.innerHTML = "";

        let productName = document.createElement("h1");

        productName.className = "product-name";
        productName.textContent = product.name;

        let productInfoList = document.createElement("dl");

        productInfoList.className = "product-info";

        for (let key in product) {
            if (key !== "name" && key !== "order_items") {
                let productInfoTerm = document.createElement("dt");
                let productInfoDescription = document.createElement("dd");

                productInfoTerm.textContent = key + ":";
                productInfoDescription.textContent = product[key];

                productInfoList.appendChild(productInfoTerm);
                productInfoList.appendChild(productInfoDescription);
            }
        }

        window.mainContainer.appendChild(productName);
        window.mainContainer.appendChild(productInfoList);

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("checklist");
    };

    return {
        showOrderItems: showOrderItems
    };
})();

export {
    orderItems
};
