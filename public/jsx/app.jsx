/** @jsx React.DOM */

define(["lodash", "react"], function(_, React) {

    function concat(a, b) {
        return a.concat(b);
    }

    function mapcat(coll, f, _this) {
        return _
            .map(coll, f, _this)
            .reduce(concat, []);
    }

    function getHosts(inventory) {
        var hosts =  mapcat(inventory, function(val) {
            return _.isArray(val.hosts) ? val.hosts : [];
        });
        return _.uniq(hosts).sort();
    }

    function Host(host) {
        return <li> { host } </li>;
    }

    function Inventory(inventory) {
        var hosts = getHosts(inventory.inventory),
            hosts = _.map(hosts, Host, this);
        return (
        <div>
            <span>
              { inventory.path }
            </span>
            <ul>
              { hosts }
            </ul>
        </div>
        );
    }

    return React.createClass({
        render: function() {
            var inventories = _.map(this.props.inventories, Inventory, this);
            return <div> { inventories } </div>;
        }
    });

});
