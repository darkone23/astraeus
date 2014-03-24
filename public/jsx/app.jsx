/** @jsx React.DOM */

define(["lodash", "react"], function(_, React) {

    return React.createClass({
        render: function() {
            return <div>Hello { _.keys(this.props).join(" ") }</div>;
        }
    });

});
