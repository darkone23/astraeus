define(["vendor/react/react.js", "js/build/jsx/app.js"], function(React, App) {

    var mountNode = document.getElementById("app");
    React.renderComponent(App({name: "astraeus"}), mountNode);

});
