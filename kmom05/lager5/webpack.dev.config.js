/* jshint esversion: 8 */
/* jshint node: true */

"use strict";

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: './www/js/index.js',
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })
    ],
    output: {
        path: path.resolve(__dirname, 'www/dist'),
        filename: 'bundle.js'
    }
};
