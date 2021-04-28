/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

// js/views/register.js

import m from 'mithril';
import { auth } from '../models/auth.js';

let main = {
    view: function() {
        return [
            m("h1.title", "Registrering"),
            m("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    auth.register();
                } }, [
                m("label.input-label", "E-postadress"),
                m("input.input[type=email][placeholder=E-postadress][required=required]", {
                    oninput: function (event) {
                        auth.email = event.target.value;
                    },
                    value: auth.email
                }),
                m("label.input-label", "Lösenord"),
                m('input.input[type="password"][placeholder="Lösenord"][required=required]', {
                    oninput: function (event) {
                        auth.password = event.target.value;
                    },
                    value: auth.password
                }),
                m(
                    "input.button.green-button.full-width-button[type=submit][value=Registrera]"
                )]
            )];
    }
};

let register = {
    view: function() {
        return m("main.container", m(main));
    }
};

export { register };
