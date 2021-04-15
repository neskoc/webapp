/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

// github.js

import { menu } from "./menu.js";

let github = (function () {
    let showGithub = function () {
        window.mainContainer.innerHTML = "";

        let title = document.createElement("h1");

        title.className = "title";
        title.textContent = "Github";

        window.mainContainer.appendChild(title);

        fetch("https://api.github.com/users/neskoc/repos").then(function (response) {
            return response.json();
        }).then(function(data) {
            data.forEach(function(repo) {
                let repoElement = document.createElement("p");

                repoElement.className = "p-center";
                repoElement.textContent = repo.name;
                window.mainContainer.appendChild(repoElement);
            });

            window.rootElement.appendChild(window.mainContainer);

            menu.showMenu("folder");
        }).catch(function(error) {
            console.log('The fetch operation failed due to the following error: ', error.message);
        });
    };

    return {
        showGithub: showGithub
    };
})();


export {
    github
};
