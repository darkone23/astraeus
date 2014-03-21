var inventories = require("../src/lib/inventories.js"),
    chai = require("chai"),
    should = chai.should(),
    promises = chai.use(require("chai-as-promised"));

describe('ansible inventories', function() {
    describe('loading from disk', function() {
        it('should run executeable inventory scripts', function() {
            return inventories.load("test/fixtures/hosts.sh").should.eventually.equal("script");
        });
        it('should parse non-executeable inventories as ini', function() {
            return inventories.load("test/fixtures/hosts.ini").should.eventually.equal("ini");
        });
    });
});
