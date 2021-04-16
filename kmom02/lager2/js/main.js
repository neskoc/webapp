/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// main.js

import { home } from "./home.js";

(function MAIN_IIFE() {
    window.rootElement = document.getElementById("root");

    window.topNavigation = document.createElement("nav");
    window.topNavigation.className = "top-nav";
    window.topNavigation.id = "top-nav";

    window.mainContainer = document.createElement("main");
    window.mainContainer.className = "container";

    window.commandStripe = document.createElement("div");
    window.commandStripe.id = "command-stripe";

    window.navigation = document.createElement("nav");
    window.navigation.className = "bottom-nav";

    home.showHome();
})();
