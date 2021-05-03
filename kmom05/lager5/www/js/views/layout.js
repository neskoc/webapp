/* jshint esversion: 8 */
/* jshint node: true */

// js/views/layout.js

"use strict";

import m from 'mithril';
import { auth } from "../models/auth.js";

let layout = {
    view: function(vnode) {
        let navElements = [
            {name: "Home", class: "home", link: "home", nav: "#!/"}
        ];

        if (auth.token) {
            navElements.push({name: "Inleverans", class: "local_shipping",
                link: "indelivery", nav: "#!/indelivery"});
            navElements.push({name: "Lagersaldo", class: "inventory",
                link: "inventory", nav: "#!/inventory"});
            navElements.push({name: "Plocklista", class: "checklist",
                link: "pick-lists", nav: "#!/pick-lists"});
            navElements.push({name: "Faktura", class: "receipt",
                link: "invoices", nav: "#!/invoices"});
        }
        // console.log("route: ", m.route.get().split("/"));
        let selected = m.route.get().split("/")[1] || "home";

        console.log("selected:", selected);

        navElements = navElements.map(element => generateBottomNavElement(element, selected));

        return [
            // m("main.container", vnode.children),
            m("div#root", vnode.children),
            m("nav.bottom-nav", navElements)
        ];
    }
};

let generateBottomNavElement = function (element, selected) {
    let bottomNavElements = [];
    let active = "";

    if (selected === element.link) {
        active = ".active";
    }

    let navElementAndClass = "a" + active;

    bottomNavElements.push(
        m(
            navElementAndClass,
            { href: element.nav },
            [
                m(
                    "i.material-icons",
                    element.class
                ),
                m(
                    "span.icon-text",
                    element.name
                )
            ]
        )
    );

    return bottomNavElements;
};

export { layout };
