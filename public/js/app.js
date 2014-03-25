define(["superagent", "react", "js/build/jsx/app.js"], function(req, React, Inventories) {

    function mount(node, endpoint) {
        return req(endpoint).end(function(res) {
            var props = { inventories: res.body },
                inventories = Inventories(props);
            React.renderComponent(inventories, node);
        });
    }

    return {  mount: mount };

});
