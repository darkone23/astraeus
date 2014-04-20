define(["lodash"], function(_) {

    function concat(a, b) {
        // concat([1], [2]) => [1,2]
        return a.concat(b);
    }

    function conj(a /*, xs... */) {
        // conj([1], 2, 3) => [1,2,3]
        return concat(a, Array.prototype.slice.call(arguments, 1));
    }

    function get(obj, key, _default) {
        // get({a: 1}, 'b', 2) => 2
        return _.has(obj, key) ? obj[key] : _default;
    }

    function getIn(obj, keys, _default) {
        // getIn({foo: {bar: 'baz'}}, ['foo', 'bar'], 'quux') => 'baz'
        return _.reduce(keys, function(key) {
            return get(obj, key, _default);
        }, obj);
    }

    function mapcat(coll, f, _this) {
        // mapcat([1,2,3], fn(x) { return [x, x]; }) => [1,1,2,2,3,3]
        return _.map(coll, f, _this).reduce(concat, []);
    }

    function getHosts(inventory) {
        var hosts =  mapcat(inventory, function(group) {
            return get(group, 'hosts', []);
        });
        return _.uniq(hosts).sort();
    }

    function getGroups(inventory, host) {
        return findAncestors(partition(inventory));

        function partition(inventory) {
            // partition an inventory into ancestors and hostgroups
            var parts = { ancestors: {}, groups: {} }
            return _.reduce(inventory, function(parts, group, name) {
                var grp = cloneGroup(group, name);
                if (_.contains(group.hosts, host)) {
                    parts.groups = _.assign(parts.groups, grp)
                }
                if (_.has(group, 'children')) {
                    parts.children = _.assign(parts.ancestors, grp);
                }
                return parts;
            }, parts);
        }

        function findAncestors(parts) {
            // recursively resolve ancestors by comparing
            // the intersection of an ancestors children and known groups
            var recur = false;

            _.each(parts.ancestors, function(group, name) {
                var children = get(group, 'children', []),
                    names = _.keys(parts.groups), grp;
                if (_.contains(names, name)) return;
                children = _.intersection(names, children)
                if (children.length) {
                    grp = cloneGroup(ancestor(group, children), name);
                    parts.groups = _.assign(parts.groups, grp);
                    recur = true;
                }
            });

            if (!recur) return parts.groups;
            return findAncestors(parts);
        }

        function ancestor(group, cause) {
            return _.assign(_.cloneDeep(group), { ancestor: cause });
        }

        function cloneGroup(group, name) {
            var namedGroup = {};
            group = _.cloneDeep(group);
            namedGroup[name] = _.assign(group, { name: name });
            return namedGroup;
        }

    }

    function getVars(inventory, host, groups) {
        // get vars in isolated scopes
        var allvars = getIn(inventory, ['all', 'vars'], {}),
            hostvars = getIn(inventory, ['_meta', 'hostvars', host], {}),
            groups = groups || getGroups(inventory, host),
            groupvars = _.reduce(groups, function(vars, group, name) {
                return _.assign(vars, get(group, 'vars', {}));
            }, {});

        return {
            mergedvars: _.assign({}, allvars, groupvars, hostvars),
            groupvars: groupvars,
            allvars: allvars,
            hostvars: hostvars,
            collisions: findCollisions(groups)
        }

        function findCollisions(groups) {
            var table = {},
                collisions = {};

            // build frequency table
            _.each(groups, function(group, name) {
                var vars = get(group, 'vars', {}),
                    keys = _.keys(vars);
                _.each(keys, function(key) {
                    table[key] = conj(get(table, key, []), name);
                });
            });

            // push vars with frequency greater than 1
            _.each(table, function(groups, varname) {
                var vals;
                if (groups.length > 1) {
                    vals = _.map(groups, function(group) {
                        return getIn(groups, [group, 'vars', varname]);
                    });
                    collisions[varname] = {
                        groups: groups,
                        vals: vals
                    };
                }
            });

            return collisions;
        }
    }

    // module exports
    return {
        getHosts: getHosts,
        getGroups: getGroups,
        getVars: getVars
    };

})
