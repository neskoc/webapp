/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// productDetails.js

import { menu } from "./menu.js";
import { inventory } from "./inventory.js";

let productDetails = (function () {
    let showProduct = function (product) {
        window.topNavigation.innerHTML = "";

        /* let topNav = document.createElement("ul");
        topNav.className = "top-ul";

        let listItem = document.createElement("li");
        listItem.className = "top-li"; */

        let topNavElement = document.createElement("a");

        topNavElement.textContent = "Lagersaldo";
        topNavElement.addEventListener("click", inventory.showInventory);

        /* listItem.appendChild(listItemAnchor);
        topNav.appendChild(listItem); */
        window.topNavigation.appendChild(topNavElement);

        window.mainContainer.innerHTML = "";

        let productName = document.createElement("h1");

        productName.className = "product-name";
        productName.textContent = product.name;

        let productInfoList = document.createElement("dl");

        productInfoList.className = "product-info";

        for (let key in product) {
            if (key !== "name") {
                let productInfoTerm = document.createElement("dt");
                let productInfoDescription = document.createElement("dd");

                productInfoTerm.textContent = key + ":";
                productInfoDescription.textContent = product[key];

                productInfoList.appendChild(productInfoTerm);
                productInfoList.appendChild(productInfoDescription);
            }
        }

        window.mainContainer.appendChild(productName);
        window.mainContainer.appendChild(productInfoList);

        window.rootElement.appendChild(window.topNavigation);
        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("inventory");
    };

    return {
        showProduct: showProduct
    };
})();

export {
    productDetails
};
