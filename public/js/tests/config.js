var require = {
    baseUrl: "/",
    paths: {
        superagent: 'vendor/superagent/superagent',
        react: 'vendor/react/react',
        lodash: 'vendor/lodash/dist/lodash',
    }
}

mocha.setup('bdd');
var expect = chai.expect;
