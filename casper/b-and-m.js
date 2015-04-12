var baseUrl = 'http://www.bmstores.co.uk/stores?location=';
var cities = ["St. Albans, Hertfordshire ","Cambridge, Cambridgeshire"];
var i = -1,
    shopInfo = [];
var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});


casper.start(baseUrl);

casper.then(function() {
    casper.each(cities, function() {
        i++;
        casper.thenOpen((baseUrl + cities[i]), function() {
            shopInfo[i] = casper.evaluate(function() {
                return aItems;
            });
            casper.echo(shopInfo[i][i]['lat'] +
            " and total" +
            shopInfo[i].length 
             );
        });
    });
});


casper.run(); 
