/*
* This file should be run by this paramteres as it uses https
* casperjs --ssl-protocol=tlsv1 alliance-boots.js
*/

var baseUrl = 'https://m.boots.com/h5/storeLocator_hub?pageType=storeLocator&unCountry=uk',
    postcodePrefixes = ['AB10','AB11','AB12','AB13'],
    fs = require('fs');

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});

//*[@id="postcode"]
casper.start(baseUrl, function() {
    });
casper.then(function() {
    this.fill('form#storLocator', { 'postcode' : 'B1'}, true);
});
casper.run();    
