/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// js/new-orders.js

import { menu } from "./menu.js";
import { orders } from "./orders.js";
import { orderDetails } from "./order-details.js";

let newOrders = {
    showNewOrders: function() {
        orders.getAllOrders(newOrders.renderOrders);
    },

    renderOrders: function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Nya ordrar";

        let orderList = document.createElement("div");

        orderList.className = "inv-container";

        let newOrders = orders.allOrders.filter(order => order.status === 'Ny');
        let orderRows = newOrders.map(order => generateOrderList(order));

        orderRows.map(orderRow => orderList.appendChild(orderRow));

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(orderList);

        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("checklist");
    }
};

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
        orderDetails.showProductListForPick(order);
    });

    orderRow.appendChild(orderName);
    orderRow.appendChild(orderId);

    return orderRow;
};

export {
    newOrders
};
