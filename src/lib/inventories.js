"use strict";

var fs = require('fs'),
    mori = require("mori"),
    Q = require("q"),
    modeToPermissions = require('mode-to-permissions');

function isExecuteable(stats) {
    return modeToPermissions(stats.mode).execute.owner;
};

function readInventoryScript(path) {
    return "script";
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
    return Q.denodeify(fs.stat)(path)
        .then(readInventory(path));
};

function getInventories(inventoryPaths) {
    var q = Q.defer();
    Q.all(inventoryPaths.map(getInventory))
        .then(function(inventories) {
            q.resolve(mori.zipmap(inventoryPaths, inventories));
        });
    return q.promise;
};

module.exports = {
    load: getInventory,
    loadAll: getInventories
};
