define(["lodash"], function(_) {
    // helper fns
    function concat(a, b) {
        return a.concat(b);
    }

    function get(obj, key, _default) {
        return _.has(obj, key) ? obj[key] : _default;
    }

    function mapcat(coll, f, _this) {
        return _.map(coll, f, _this).reduce(concat, []);
    }

    // inventory fns
    function getHosts(inventory) {
        var hosts =  mapcat(inventory, function(group) {
            return get(group, 'hosts', []);
        });
        return _.uniq(hosts).sort();
    }

    function getGroups(inventory, host) {
        // recursively searches for groups a host is in
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

    return {
        getHosts: getHosts,
        getGroups: getGroups
    };

})
