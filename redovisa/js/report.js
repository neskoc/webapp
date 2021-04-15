/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// report.js

import { menu } from "./menu.js";

let md = window.markdownit();

let report = (function () {
    let showReport = function () {
        window.mainContainer.innerHTML = "";

        fetch("markdown/kmom01.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                window.mainContainer.innerHTML = md.render(result);
            });

        menu.showMenu("people");
    };

    return {
        showReport: showReport
    };
})();

export {
    report
};
