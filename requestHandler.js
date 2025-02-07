const fs = require("fs");
const main_view = fs.readFileSync("./main.html");
const path = require("path")

function main(response) {
  console.log("main");
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(main_view);
  response.end();
}

let handle = {}; // key:value
handle["/"] = main;

exports.handle = handle;
