"use strict";
const PORT = 80;
const pathPublic = __dirname + "\\public\\";

const http = require("http");
const fs = require("fs");
const url = require("url");
const getExercises = require(".\\getExercises");
const serveStaticFiles = require(".\\serveStaticFiles");

var routingSpecificExercise = (request, response) => {

};
var server = http.createServer((request, response) => {
    console.log(`@${request.url}@`);
    if (serveStaticFiles(request, response)) return;
    if (routingSpecificExercise(request, response)) return;
    switch (request.url) {
        case "/":
            response.writeHead(200, { "Content-type": "text/html" });
            var readStream = fs.createReadStream(
                pathPublic + "\\index.html",
                "utf-8"
            );
            readStream.pipe(response);
            break;
        case "/exercises/all":
            response.writeHead(200, { "Content-type": "text/json" });
            var readStream = fs.createReadStream("allExercises.json", "utf-8");
            readStream.pipe(response);
        default:
            break;
    }
});

server.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}...`);
});