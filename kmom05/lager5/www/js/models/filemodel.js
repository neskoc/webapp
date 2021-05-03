/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */

"use strict";

var fileModel = {
    current: "",
    file: null,
    readText: "",

    createFile: function() {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {
            console.log('file system open: ' + fs.name);
            fs.root.getFile(
                "token.txt",
                {
                    create: true,
                    exclusive: false
                },
                function (fileEntry) {
                    console.log("fileEntry: ", fileEntry);
                    fileModel.file = fileEntry;
                    // fileModel.writeToFile(fileModel.file, null, false);
                    fileModel.readFromFile(fileEntry);
                },
                function() {
                    console.error("Error loading file");
                });
        }, function() {
            console.error("Error loading filesystem");
        });
    },

    writeToFile: function(fileEntry, data, append) {
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            if (append) {
                try {
                    fileWriter.seek(fileWriter.length);
                } catch (e) {
                    console.log("file doesn't exist!");
                }
            }

            if (data) {
                fileWriter.write(data);
            }
        });
    },

    readFromFile: function(fileEntry, callback) {
        console.log("readFromFile");
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                fileModel.readText = this.result;
                if (callback) {
                    console.log("callback in readFromFile: ", this.result);
                    callback(this.result);
                }
                // m.redraw();
            };

            reader.readAsText(file);
        }, function() {
            console.error("Error reading from file");
            return false;
        });
    },

    checkIfFileExist: async function(path, fileExists, fileDoesNotExist) {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function() {
            window.requestFileSystem(
                window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.root.getFile(
                        path,
                        { create: false },
                        fileExists,
                        fileDoesNotExist
                    );
                }, fileModel.getFSFail); //of requestFileSystem
        });
    },

    getFSFail: function(evt) {
        console.log(evt.target.error.code);
    }
};

export { fileModel };
