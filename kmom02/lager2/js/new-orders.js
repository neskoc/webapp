/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// js/new-orders.js

import { menu } from "./old.menu.js";
import { apiKey, baseUrl } from "./vars.js";
import { orderItems } from "./order-items.js";

let newOrders = (function () {
    let showNewOrders = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "New orders";

        let orderList = document.createElement("div");

        orderList.className = "inv-container";

        fetch(`${baseUrl}/orders?api_key=${apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);
                let orderRows = jsonData.data.map(order => generateOrderList(order));

                orderRows.map(orderRow => orderList.appendChild(orderRow));
            });

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(orderList);

        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("new-orders");
    };

    let publicAPI = {
        showNewOrders: showNewOrders
    };

    return publicAPI;
})();

let generateOrderList = function (order) {
    // console.log(order);
    let orderRow = document.createElement("div");

    orderRow.className = "flex-row";

    let orderName = document.createElement("div");

    orderName.className = "flex-item left";
    orderName.textContent = order.name;

    let orderId = document.createElement("div");

    orderId.className = "flex-item right";
    orderId.textContent = order.id;

    orderRow.addEventListener("click", function handleClick() {
        console.log(order);
        orderItems.showOrderItems(order);
    });

    orderRow.appendChild(orderName);
    orderRow.appendChild(orderId);

    return orderRow;
};

export {
    newOrders
};
