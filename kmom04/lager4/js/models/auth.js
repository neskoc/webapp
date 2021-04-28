/* jshint esversion: 8 */
/* jshint node: true */

// js/models/auth.js

"use strict";

import m from 'mithril';
import { apiKey, baseUrl } from "../vars.js";
// import { apiKey, baseUrl, token } from "../vars.js";


let auth = {
    baseUrl: baseUrl,
    apiKey: apiKey,
    urlLogin: `${baseUrl}/auth/login`,
    urlRegister: `${baseUrl}/auth/register`,
    email: "",
    password: "",
    // TODO: change token to ""
    token: "", //token,
    currentForm: {},
    callback: "",
    error: "",
    login: async function() {
        return m.request({
            method: "POST",
            url: auth.urlLogin,
            body: {
                email: auth.email,
                password: auth.password,
                api_key: apiKey
            }
        }).then(function(result) {
            console.log(result.data.token);
            auth.token = result.data.token;
            return m.route.set(`/${auth.callback}`);
        });
    },
    register: async function() {
        return m.request({
            method: "POST",
            url: auth.urlRegister,
            body: {
                email: auth.email,
                password: auth.password,
                api_key: apiKey
            }
        }).then(function(result) {
            console.log("Register.result.data:", result);
            return m.route.set(`/${auth.callback}`);
        }).catch(function(err) {
            let errJson = JSON.parse(err);

            console.error("Error:", errJson);
            console.log("Error name:", errJson.name);
            // return m.route.set(`/register`);
        });
    }
};

export { auth, baseUrl, apiKey };
