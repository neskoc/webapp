/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// utils.js

const utils = {
    createElement: function(options) {
        let element = document.createElement(options.type || "div");

        for (let property in options) {
            if (Object.prototype.hasOwnProperty.call(options, property)) {
                element[property] = options[property];
            }
        }

        return element;
    },

    removeNodes: function(id) {
        let element = document.getElementById(id);

        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    cleanWindow: function() {
        window.topNavigation.innerHTML = "";
        window.mainContainer.innerHTML = "";
        window.commandStripe.innerHTML = "";
    },

    generateProductListForPick: function(products) {
        let elementList = [];

        products.forEach(function(product) {
            let detailsForPick = utils.createElement({
                type: "dl",
                className: "product-info"
            });

            detailsForPick.appendChild(utils.createElement({
                type: "dt",
                textContent: "Produkt:"
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dd",
                textContent: product.name
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dt",
                textContent: "Hylla:"
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dd",
                textContent: product.location
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dt",
                textContent: "Antal:"
            }));

            detailsForPick.appendChild(utils.createElement({
                type: "dd",
                textContent: product.amount
            }));

            elementList.push(detailsForPick);
        });

        return elementList;
    }
};

export { utils };
