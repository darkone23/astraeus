var inventories = require("../src/lib/inventories.js"),
    inventory = require("./fixtures/hosts.json"),
    chai = require("chai"),
    promises = require("chai-as-promised");

chai.use(promises);
chai.should();

describe('ansible inventories', function() {
    describe('loaded from disk', function() {
        it('should run executeable inventory scripts', function() {
            return inventories.load("test/fixtures/hosts.sh")
                .should.eventually.become(inventory);
        });
        it('should reject executeable inventory that exit non-zero', function() {
            return inventories.load("test/fixtures/bad.sh")
                .should.be.rejected;
        });
        it('should parse non-executeable inventories', function() {
            return inventories.load("test/fixtures/hosts.ini")
                .should.eventually.become(inventory);
        });
        it('should reject non-parseable inventories', function() {
            return inventories.load("test/fixtures/bad.ini")
                .should.be.rejected;
        });
    });
});
