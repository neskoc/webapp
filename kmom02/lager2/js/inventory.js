/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// inventory.js

import { menu } from "./menu.js";
import { apiKey, baseUrl } from "./vars.js";
import { productDetails } from "./product-details.js";

let inventory = (function () {
    let showInventory = function () {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Lagersaldo";

        let productList = document.createElement("div");

        productList.className = "inv-container";

        fetch(`${baseUrl}/products?api_key=${apiKey}`)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);

                jsonData.data.forEach(function (product) {
                    // console.log(product);
                    let productRow = document.createElement("div");

                    productRow.className = "flex-row";

                    let productName = document.createElement("div");

                    productName.className = "flex-item left";
                    productName.textContent = product.name;

                    let productCount = document.createElement("div");

                    productCount.className = "flex-item right";
                    productCount.textContent = product.stock;

                    productRow.addEventListener("click", function handleClick() {
                        console.log(product);
                        productDetails.showProduct(product);
                    });

                    productRow.appendChild(productName);
                    productRow.appendChild(productCount);
                    productList.appendChild(productRow);
                });
            });

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(productList);

        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("inventory");
    };

    return {
        showInventory: showInventory
    };
})();

export {
    inventory
};
