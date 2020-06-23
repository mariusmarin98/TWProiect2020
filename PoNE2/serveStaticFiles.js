"use strict";
const fs = require("fs");
const pathPublic = __dirname + "\\public\\";
module.exports = (request, response) => {
  const availableExtensions = [
    { name: ".css", mimeType: "text/css" },
    { name: ".js", mimeType: "text/javascript" },
    { name: ".html", mimeType: "text/html" },
  ];
  var i, readStream;
  for (i = 0; i < availableExtensions.length; i++) {
    if (request.url.endsWith(availableExtensions[i].name)) {
      response.writeHead(200, {
        "Content-type": availableExtensions[i].mimeType,
      });
      readStream = fs.createReadStream(pathPublic + request.url, "utf-8");
      readStream.pipe(response);
      return true;
    }
  }
  return false;
};
