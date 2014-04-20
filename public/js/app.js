define(["crossroads", "superagent", "react", "js/build/jsx/app.js"], function(crossroads, ajax, React, Inventories) {

    function mount(node, endpoint) {
        return ajax(endpoint).end(function(res) {
            var props = { inventories: res.body },
                inventories = Inventories(props);
            React.renderComponent(inventories, node);
        });
    }

    return {  mount: mount };

});
