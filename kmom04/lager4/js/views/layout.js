/* jshint esversion: 8 */
/* jshint node: true */

// js/views/layout.js

"use strict";

import m from 'mithril';

let layout = {
    view: function(vnode) {
        let navElements = [
            {name: "Home", class: "home", link: "home", nav: "#!/"},
            {name: "Inleverans", class: "local_shipping", link: "indelivery", nav: "#!/indelivery"}
        ];

        // console.log("route: ", m.route.get().split("/"));
        let selected = m.route.get().split("/")[1] || "home";

        console.log("selected:", selected);

        navElements = navElements.map(element => generateBottomNavElement(element, selected));

        return [
            m("main.container", vnode.children),
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
