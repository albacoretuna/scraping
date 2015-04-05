var casper = require('casper').create();

casper.start('http://www.aleksi13.fi/myymalat/', function() {
    var a13 = casper.evaluate(function() {
        return A13Shops;
    });
     console.log(a13);
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo(this.getTitle());
});

casper.run();
