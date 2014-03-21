"use strict";

var fs = require('q-io/fs'),
    _ = require("mori"),
    q = require("q"),
    spawn = require('child_process').spawn,
    modeToPermissions = require('mode-to-permissions');

function isExecuteable(stats) {
    return modeToPermissions(stats.node.mode).execute.owner;
};

function readInventoryScript(path) {
    var deferred = q.defer(),
        proc = spawn(path, ["--list"]),
        stdout = "", stderr="";

    proc.stdout.on("data", function(chunk) { stdout += chunk; });
    proc.stderr.on("data", function(chunk) { stderr += chunk; });

    proc.on("close", function(code) {
       if (code === 0) {
            deferred.resolve(JSON.parse(stdout));
	} else {
            deferred.reject(new Error(stderr));
	};
    });

    return deferred.promise;
};

function readInventoryIni(path) {
    return "ini";
};

function readInventory(path) {
    return function(stats) {
        return isExecuteable(stats) ?
            readInventoryScript(path) :
            readInventoryIni(path);
    };
};

function getInventory(path) {
    return fs.stat(path).then(readInventory(path));
};

function getInventories(inventoryPaths) {
    var intoMap = _.partial(_.zipmap, inventoryPaths);
    return q.all(inventoryPaths.map(getInventory)).then(intoMap);
};

module.exports = {
    load: getInventory,
    loadAll: getInventories
};
