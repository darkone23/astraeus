var inventories = require("../src/lib/inventories.js"),
    inventory = require("./fixtures/hosts.json"),
    chai = require("chai"),
    promises = require("chai-as-promised");

chai.use(promises);
chai.should();

describe('ansible inventories', function() {
    describe('loaded from disk', function() {
        it('should run executeable inventory scripts', function() {
            var path = "test/fixtures/hosts.sh",
                inv = inventories.buildInventory(path, inventory);
            return inventories.getInventory(path)
                .should.eventually.become(inv);
        });
        it('should reject executeable inventory that exit non-zero', function() {
            return inventories.getInventory("test/fixtures/bad.sh")
                .should.be.rejected;
        });
        it('should parse non-executeable inventories', function() {
            var path = "test/fixtures/hosts.ini",
                inv = inventories.buildInventory(path, inventory);
            return inventories.getInventory(path)
                .should.eventually.become(inv);
        });
        it('should reject non-parseable inventories', function() {
            return inventories.getInventory("test/fixtures/bad.ini")
                .should.be.rejected;
        });
    });
});
