define(["superagent", "react", "js/build/jsx/app.js"], function(req, React, Inventories) {

    var mount = document.body,
        inventories = req("/api/inventories");

    inventories.end(function(res) {
        React.renderComponent(Inventories(res.body), mount);
    });

});
