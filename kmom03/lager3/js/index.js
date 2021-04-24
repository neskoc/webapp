/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// index.js

import m from 'mithril';

import { layout } from "./views/layout.js";
import { home } from "./views/home.js";
import { indelivery } from "./views/indelivery.js";
import { newIndelivery } from "./views/new-indelivery.js";

m.route(document.body, "/", {
    "/": {
        render: function() {
            return m(layout, m(home));
        }
    },
    "/indelivery": {
        render: function() {
            return m(layout, m(indelivery));
        }
    },
    "/new-indelivery": {
        render: function() {
            return m(layout, m(newIndelivery));
        }
    }
});
