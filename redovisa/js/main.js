/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// main.js

import { home } from "./home.js";

(function IIFE() {
    window.rootElement = document.getElementById("root");

    window.mainContainer = document.createElement("main");
    window.mainContainer.className = "container";

    window.navigation = document.createElement("nav");
    window.navigation.className = "bottom-nav";

    home.showHome();
})();
