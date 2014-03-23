define(["react", "js/build/jsx/app.js"], function(React, App) {

    var mountNode = document.body;
    React.renderComponent(App({name: "astraeus"}), mountNode);

});
