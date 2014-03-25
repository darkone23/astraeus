require.config({
    baseUrl: "..",
    paths: { "js/app": "js/build/rjs/app" }
});

require(["js/app"], function(app) {
    app.mount(document.body, "/api/inventories");
});
