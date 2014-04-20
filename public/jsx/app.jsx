/** @jsx React.DOM */

define(["lodash", "react", "inventory"], function(_, React, inv) {

    function Host(inventory, host) {
        var groups = inv.getGroups(inventory, host),
            template = "${host} - (${inventories})",
            context = {
                inventories: _.keys(groups).join(", "),
                host: host
            };

        return (
        <li>
           {  _.template(template, context) }
        </li>
        );
    }

    function Inventory(inventory) {
        var name = inventory.path,
            inventory = inventory.inventory,
            hosts = inv.getHosts(inventory);

        return (
        <div>
            <span>
              { name }
            </span>
            <ul>
              { _.map(hosts, _.partial(Host, inventory), this) }
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
