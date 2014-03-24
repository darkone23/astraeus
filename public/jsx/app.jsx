/** @jsx React.DOM */

define(["lodash", "react"], function(_, React) {

    function Inventory(inventory) {
        return <span> { inventory.path } </span>;
    }

    return React.createClass({
        render: function() {
            var inventories = _.map(this.props.inventories, Inventory, this);
            return <div> { inventories } </div>;
        }
    });

});
