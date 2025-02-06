let http = require("http");
let url = require("url");
let fs = require("fs");
let path = require("path");

function start(route, handle) {

  function onRequest(req, res) {
    let pathname = url.parse(req.url).pathname;
    let filePath = pathname === "/" ? path.join(__dirname, "main.html") : path.join(__dirname, pathname);
    let ext = path.extname(filePath);
    

    let validExtensions = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif"
    };

    if (validExtensions[ext]) {
      fs.readFile(filePath, function (err, data) {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write("404 Not Found - server");
        } else {
          res.writeHead(200, { "Content-Type": validExtensions[ext] });
          res.write(data);
        }
        res.end();
      });
      return;
    }



    let queryData = url.parse(req.url, true).query;
    
    route(pathname, handle, res, queryData.productId);
  }

  http.createServer(onRequest).listen(8888);
}

exports.start = start;
