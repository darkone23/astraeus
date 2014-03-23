var inventories = require("./lib/inventories.js"),
    restify = require('restify'),
    server;

server = restify.createServer();

server.get(/.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
