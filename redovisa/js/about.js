/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// about.js

import { menu } from "./menu.js";

let about = (function () {
    let showAbout = function () {
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Om";

        let greeting = document.createElement("p");

        greeting.textContent = "Detta är kursen webapp, " +
            "där vi skapar tillgängliga och användbara applikationer " +
            "för mobila enheter. Än så länge känns det som en bra kurs.";

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(greeting);

        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("free_breakfast");
    };

    return {
        showAbout: showAbout
    };
})();

export {
    about
};
