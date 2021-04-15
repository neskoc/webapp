/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// home.js

import { menu } from "./menu.js";

let home = (function () {
    let showHome = function () {
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Nenad Cuturic";

        let greeting = document.createElement("p");
        let timeOfDayGreeting = "Hej";
        let now = new Date();

        greeting.className = "p-center";
        if (now.getHours() <= 10) {
            timeOfDayGreeting = "Godmorgon";
        } else if (now.getHours() >= 17) {
            timeOfDayGreeting = "Godkväll";
        }

        greeting.textContent = timeOfDayGreeting +
            ", jag heter Nenad Cuturic och är student i kursen webapp.";

        let image = document.createElement("img");

        image.className = "profile-pic";
        image.src = "img/me-cy.jpg";
        image.alt = "Nenad Cuturic profile picture";

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
