/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// report.js

import { menu } from "./menu.js";

let md = window.markdownit();

let report = (function () {
    let showReport = function () {
        let innerHtml = "";

        window.mainContainer.innerHTML = "";

        fetch("markdown/kmom01.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                innerHtml += md.render(result);
                console.log(innerHtml);
            });

        fetch("markdown/kmom02.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                innerHtml += md.render(result);
                console.log(innerHtml);
                // window.mainContainer.innerHTML = md.render(result);
            });

        window.mainContainer.innerHTML = innerHtml;

        menu.showMenu("people");
    };

    return {
        showReport: showReport
    };
})();

export {
    report
};
