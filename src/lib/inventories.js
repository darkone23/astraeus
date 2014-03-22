"use strict";

var fs = require('q-io/fs'),
    _ = require("mori"),
    q = require("q"),
    ini = require("ini"),
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
	}
    });

    return deferred.promise;
};

function invalidEntry(hostgroup, category) {
    var invalidGroup = hostgroup.indexOf(" ") !== -1,
        invalidCategory = (category !== "vars") &&
                          (category !== "children") &&
                          (category !== "hosts");

    return invalidGroup || invalidCategory;
}

function parseAnsibleIni(str) {
    var parsed = ini.parse(str),
        datastruct = _.js_to_clj(parsed),
        inventory = _.hash_map();

    _.each(datastruct, function(entry) {
        var key = _.first(entry),
            val = _.last(entry),
            meta = key.split(":"),
            hostgroup = _.first(meta),
            category;

        category = (meta.length === 1) ? "hosts" : _.nth(meta, 1);
        val = (category === "hosts" || category === "children") ? _.keys(val) : val;

	if (invalidEntry(hostgroup, category)) {
	    throw new Error("Unsupported or invalid inventory file");
        } else {
            inventory = _.assoc_in(inventory, [hostgroup, category], val);
        }
    });

    return _.clj_to_js(inventory);
};

function readInventoryIni(path) {
    return fs.read(path).then(parseAnsibleIni);
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
