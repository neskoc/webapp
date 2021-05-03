/* jshint esversion: 8 */
/* jshint node: true */

// js/models/auth.js

"use strict";

import m from 'mithril';

import { apiKey, baseUrl } from "../vars.js";
import { fileModel } from "./filemodel.js";
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
            if (fileModel.file) {
                console.log("in login fileModel.file:", fileModel.file);
                fileModel.writeToFile(fileModel.file, auth.token);
            }
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
    },
    checkTokenValidity: async function() {
        if (auth.token === "") {
            await fileModel.checkIfFileExist("token.txt", auth.fileExists, auth.fileDoesNotExist);
        }
    },
    fileExists: function(fileEntry) {
        fileModel.file = fileEntry;
        console.log("fileEntry in callback from readFromFile: ", fileEntry);
        fileModel.readFromFile(fileEntry, auth.checkToken);
    },
    checkToken: function(token) {
        console.log("after file read in fileExist");
        if (token !== "") {
            auth.token = token;
            if (auth.getAllInvoices()) {
                console.log("Token is valid!");
            } else {
                auth.token = "";
                console.log("Token is invalid!");
            }
        }
    },
    fileDoesNotExist: function() {
        console.log("file does not exist");
        fileModel.createFile();
    },
    getAllInvoices: async function() {
        return m.request({
            method: "GET",
            url: `${auth.baseUrl}/invoices?api_key=${auth.apiKey}`,
            headers: {
                'x-access-token': auth.token,
            }
        }).then(function(result) {
            console.log("Invoices.getAllInvoices:", result.data);
        });
    }
};

export { auth, baseUrl, apiKey };
