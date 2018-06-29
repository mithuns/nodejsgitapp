var http = require('http');
var stack = require('stack');
var creationix = require('creationix');
var gitmodule = require('./gitmodule');


var UserController = require('./UserController');
app.use('/users', UserController);

var vfs = require('vfs-local')({
  root: __dirname + "/public/"
})


var server = http.createServer(stack(
  creationix.log(),
  function (req, res, next) {
    if (req.method === "GET") {
      if (req.url === '/') {
        req.url = '/index.html';
      }
      next();
      return;
    }
    if (req.method === "POST") {
      
      var inputtext = "";
      var output = ""; 
      req.setEncoding("utf8");
      req.on("data", function (chunk) {
        inputtext += chunk;
        console.log(chunk);
      });
      req.on("end", function() {
        
        var dataPromise = gitmodule(inputtext);
        dataPromise.then(function(result) {
          var stringresult = JSON.stringify(result);
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(stringresult)
          });
          res.end(stringresult);
      }, function(err) {
          console.log(err);
      });
        
       
      });
      }
  },
  require('vfs-http-adapter')("/", vfs)
)).listen(8080, function () {
  console.log("Http server listening at http://localhost:8080/");
});
