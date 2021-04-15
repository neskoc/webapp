/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// menu.js

import { home } from "./home.js";
import { about } from "./about.js";
import { github } from "./github.js";
import { report } from "./report.js";

let menu = (function () {
    let showMenu = function (selected) {
        window.navigation.innerHTML = "";

        let navElements = [{name: "Me", class: "home", nav: home.showHome},
            {name: "Om", class: "free_breakfast", nav: about.showAbout},
            {name: "Github", class: "folder", nav: github.showGithub},
            {name: "Redovisning", class: "people", nav: report.showReport}];

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
