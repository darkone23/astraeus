"use strict";

var util = require("./util.js"),
    m    = require("mori"),
    q    = require("q");

function buildInventory(path, inventory) {
    return { path: path, inventory: inventory };
};

function getInventory(path) {
    var build = m.partial(buildInventory, path);
    return util.readInventory(path).then(build);
};

function getInventories(paths) {
    var inventories = paths.map(getInventory);
    return q.all(inventories);
};

module.exports = {
    getInventory:   getInventory,
    getInventories: getInventories,
    buildInventory: buildInventory
};
