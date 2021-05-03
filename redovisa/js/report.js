/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// report.js

import { menu } from "./menu.js";

let md = window.markdownit();

let report = (function () {
    let showReport = async function () {
        let innerHtml = "";

        window.mainContainer.innerHTML = "";

        await fetch("markdown/kmom01.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                innerHtml += md.render(result);
            });

        await fetch("markdown/kmom02.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                innerHtml += md.render(result);
            });

        await fetch("markdown/kmom03.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                innerHtml += md.render(result);
                console.log(innerHtml);
                // window.mainContainer.innerHTML = md.render(result);
            });

        await fetch("markdown/kmom04.md")
            .then(function(response) {
                return response.text();
            })
            .then(function(result) {
                innerHtml += md.render(result);
                console.log(innerHtml);
                // window.mainContainer.innerHTML = md.render(result);
            });

        window.mainContainer.innerHTML = innerHtml;
        // window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("people");
    };

    return {
        showReport: showReport
    };
})();

export {
    report
};
