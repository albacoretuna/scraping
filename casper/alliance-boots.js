/*
* This file should be run by this paramteres as it uses https
* casperjs --ssl-protocol=tlsv1 alliance-boots.js
*/

var baseUrl = 'https://m.boots.com/h5/storeLocator_hub?pageType=storeLocator&unCountry=uk',
    postcodePrefixes = ['B1','B5'],
    shopTotalPerPage,
    i = -1,
    shopInfo = [],
    fs = require('fs');
var shopsOnPage = [],
    shopNames,
    shopLats,
    shopLangs;

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});



casper.start(baseUrl);
casper.each(postcodePrefixes, function() {
    casper.thenOpen(baseUrl);
    i++;
    casper.then(function() {
        this.fill('form#storLocator', { 'postcode' : 'B1'}, true);
    });
    casper.then(function () {    
    shopInfo[i] = casper.evaluate(function() {
        var shopTotalPerPage = map.entities.getLength();
        for(var k = 1; k < shopTotalPerPage; k++) {
          shopsOnPage.push(map.entities.get(k));
           
        }

        return shopsOnPage;
    });
});
});
casper.then(function() {
    casper.echo(JSON.stringify(shopInfo));
});

casper.run();    
