var inventories = require("./lib/inventories.js"),
    restify = require('restify'),
    nconf = require("nconf"),
    server;

nconf.argv()
    .env()
    .file({ file: './config.json' })
    .defaults({ port: 8080, inventories: [] });

server = restify.createServer();

server.get("/api/inventories", function(req, res, next) {
    var invs = nconf.get("inventories"),
        send = res.send.bind(res);
    return inventories.loadAll(invs).then(send).done(next);
});

server.get(/.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

server.listen(nconf.get("port"), function() {
  console.log('%s listening at %s', server.name, server.url);
});
