/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// inventory.js

import { menu } from "./menu.js";
import { productDetails } from "./product-details.js";
import { products } from "./products.js";
import { utils } from "./utils.js";

let inventory = {
    showInventory: function() {
        products.getAllProducts(inventory.renderProducts);
    },

    renderProducts: function() {
        if (document.contains(document.getElementById("top-nav"))) {
            window.rootElement.removeChild(window.topNavigation);
        }
        utils.cleanWindow();

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Lagersaldo";

        let productList = document.createElement("div");

        productList.className = "inv-container";

        let productRows = products.allProducts.map(product => generateProductList(product));

        productRows.map(productRow => productList.appendChild(productRow));

        window.mainContainer.appendChild(title);
        window.mainContainer.appendChild(productList);

        window.rootElement.appendChild(window.mainContainer);

        menu.showMenu("inventory");
    }
};

let generateProductList = function (product) {
    // console.log(product);
    let productRow = document.createElement("div");

    productRow.className = "flex-row";

    let productName = document.createElement("div");

    productName.className = "flex-item left";
    productName.textContent = product.name;

    let productAmount = document.createElement("div");

    productAmount.className = "flex-item right";
    productAmount.textContent = product.stock;

    productRow.addEventListener("click", function handleClick() {
        console.log(product);
        productDetails.showProductDetails(product);
    });

    productRow.appendChild(productName);
    productRow.appendChild(productAmount);

    return productRow;
};

export { inventory };
