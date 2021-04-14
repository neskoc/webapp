/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// menu.js

import { home } from "./home.js";
import { inventory } from "./inventory.js";
import { newOrders } from "./new-orders.js";

let menu = (function () {
    let showMenu = function (selected) {
        window.navigation.innerHTML = "";

        let navElements = [{name: "Home", class: "home", nav: home.showHome},
            {name: "Lagersaldo", class: "inventory", nav: inventory.showInventory},
            {name: "Plocklista", class: "checklist", nav: newOrders.showNewOrders}];

        navElements.map(element => drawBottomNavElement (element, selected));

        window.rootElement.appendChild(window.navigation);
    };

    let drawBottomNavElement = function (element, selected) {
        let navElement = document.createElement("a");

        if (selected === element.class) {
            navElement.className = "active";
        }

        navElement.addEventListener("click", element.nav);

        let icon = document.createElement("i");

        icon.className = "material-icons";
        icon.textContent = element.class;
        navElement.appendChild(icon);

        let text = document.createElement("span");

        text.className = "icon-text";
        text.textContent = element.name;
        navElement.appendChild(text);

        window.navigation.appendChild(navElement);
    };

    return {
        showMenu: showMenu
    };
})();

export {
    menu
};
