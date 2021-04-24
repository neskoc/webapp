/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/home.js

import m from 'mithril';

let home = {
    view: function() {
        let now = new Date();
        let timeOfDayGreeting = "Hej besökaren";
        let image = {
            src: "img/AI-head2.jpg",
            alt: "AI head"
        };

        if (now.getHours() <= 10) {
            timeOfDayGreeting = "Godmorgon";
        } else if (now.getHours() >= 17) {
            timeOfDayGreeting = "Godkväll";
        }

        timeOfDayGreeting += ", det här är en SPA för kursen Webapp.";

        return [
            m("h1.title", "Lagerapp"),
            m("p", timeOfDayGreeting),
            m("img", image, timeOfDayGreeting)
        ];
    }
};

export { home };
