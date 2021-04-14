/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// menu.js

import { home } from "./home.js";
import { inventory } from "./inventory.js";

let menu = (function () {
    let showMenu = function (selected) {
        window.navigation.innerHTML = "";

        let navElements = [{name: "Home", class: "home", nav: home.showHome},
            {name: "Lagersaldo", class: "inventory", nav: inventory.showInventory}];

        navElements.forEach(function (element) {
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
        });

        window.rootElement.appendChild(window.navigation);
    };

    return {
        showMenu: showMenu
    };
})();

export {
    menu
};
