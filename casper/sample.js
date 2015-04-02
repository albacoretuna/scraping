var casper = require('casper').create();

casper.start('http://www.aleksi13.fi/myymalat/', function() {
    this.echo(this.getTitle());
     console.log(window.A13Shops);
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo(this.getTitle());
});

casper.run();
