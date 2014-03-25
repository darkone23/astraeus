require(["js/app"], function(App) {
    
    describe('A functioning system', function() {
        it('can assert', function() {
            expect(1 + 1).to.be.equal(2);
        });
    });

    mocha.run();
});
