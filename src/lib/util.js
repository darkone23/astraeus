var ini   = require("ini"),
    m     = require("mori"),
    q     = require("q"),
    fs    = require('q-io/fs'),
    spawn = require('child_process').spawn,
    perms = require('mode-to-permissions');

function invalidEntry(hostgroup, category) {
    var invalidGroup    = hostgroup.indexOf(" ") !== -1,
        invalidCategory = (category !== "vars") &&
                          (category !== "children") &&
                          (category !== "hosts");

    return invalidGroup || invalidCategory;
};

function ansibleIni(str) {
    var parsed     = ini.parse(str),
        inventory  = m.hash_map(),
        datastruct = m.js_to_clj(parsed);

    m.each(datastruct, function(entry) {
        var key       = m.first(entry),
            val       = m.last(entry),
            meta      = key.split(":"),
            hostgroup = m.first(meta),
            category  = m.last(meta);

        category = (meta.length === 1) ? "hosts" : category;

	if (invalidEntry(hostgroup, category)) {
	    throw new Error("Unsupported or invalid inventory file");
        }

        val = (category === "hosts" ||
               category === "children") ? m.keys(val) : val;

        inventory = m.assoc_in(inventory, [hostgroup, category], val);
    });

    return m.clj_to_js(inventory);
};

function isExecuteable(stats) {
    return perms(stats.node.mode).execute.owner;
};

function readInventoryScript(path) {
    var deferred = q.defer(),
        proc     = spawn(path, ["--list"]),
        stdout   = "", stderr="";

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

function readInventoryIni(path) {
    return fs.read(path).then(ansibleIni);
};

function readByStats(path, stats) {
    return isExecuteable(stats) ?
        readInventoryScript(path) :
        readInventoryIni(path);
}

function readInventory(path) {
    var read = m.partial(readByStats, path);
    return fs.stat(path).then(read);
};

module.exports = {
    readInventory: readInventory
};
