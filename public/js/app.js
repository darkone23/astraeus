define(["superagent", "react", "js/build/jsx/app.js"], function(req, React, Inventories) {

    var mount = document.body,
        inventories = req("/api/inventories");

    inventories.end(function(res) {
        var props = { inventories: res.body },
            inventories = Inventories(props);
        React.renderComponent(inventories, mount);
    });

});
