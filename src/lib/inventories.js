"use strict";

var fs = require('fs'),
    _ = require("mori"),
    q = require("q"),
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
            readInventoryScript(path) : readInventoryIni(path);
    };
};

function getInventory(path) {
    return q.denodeify(fs.stat)(path).then(readInventory(path));
};

function getInventories(inventoryPaths) {
    var intoMap = _.partial(_.zipmap, inventoryPaths);
    return q.all(inventoryPaths.map(getInventory)).then(intoMap);
};

module.exports = {
    load: getInventory,
    loadAll: getInventories
};
