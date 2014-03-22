/** @jsx React.DOM */

define(["vendor/react/react.js"], function(React) {

    return React.createClass({
        render: function() {
            return <div>Hello {this.props.name}</div>;
        }
    });

});
