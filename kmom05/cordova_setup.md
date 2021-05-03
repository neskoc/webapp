# Cordova setup

cordova platform add --save android
cordova platform add --save browser
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-network-information
cordova plugin add cordova-plugin-splashscreen --save
npm install --save mithril
npm install --save-dev webpack webpack-cli clean-webpack-plugin

## Android-studio

echo export PATH=${PATH}:/home/nesko/Android/Sdk/platform-tools/ >> ~/.profile
