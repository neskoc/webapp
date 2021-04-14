/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// home.js

import { menu } from "./menu.js";

let home = (function () {
    let showHome = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Lagerapp";

        let greeting = document.createElement("p");
        let timeOfDayGreeting = "Hej besökaren";
        let now = new Date();

        if (now.getHours() <= 10) {
            timeOfDayGreeting = "Godmorgon";
        } else if (now.getHours() >= 17) {
            timeOfDayGreeting = "Godkväll";
        }

        greeting.textContent = timeOfDayGreeting +
            ", det här är en SPA för kursen Webapp.";

        let image = document.createElement("img");

        image.src = "img/AI-head2.jpg";
        image.alt = "AI head";

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(greeting);
        window.mainContainer.appendChild(image);

        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("home");
    };

    return {
        showHome: showHome
    };
})();

export {
    home
};
