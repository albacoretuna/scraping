/*
* This file should be run by this paramteres as it uses https
* casperjs --ssl-protocol=tlsv1 alliance-boots.js
*/

var baseUrl = 'https://m.boots.com/h5/storeLocator_hub?pageType=storeLocator&unCountry=uk',
    postcodePrefixes = ['B1','B4','B5','B2'],
    shopTotalPerPage,
    i = -1,
    shopInfo = [],
    finalList = [],
    fs = require('fs');

var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});



casper.start(baseUrl);
casper.each(postcodePrefixes, function stealShopInfo() {
    casper.thenOpen(baseUrl);
    i++;
    casper.then(function postcodeFormFiller() {
        this.fill('form#storLocator', { 'postcode' : 'B1'}, true);
    });
    casper.then(function afterFormSubmitted() {    
    shopInfo[i] = casper.evaluate(function readMapEntities() {
        var shopTotalPerPage = map.entities.getLength();
        var shopsOnPage = [],
            shopNames = [],
            shopLats = [],
            shopLangs = [];
                for(var k = 1; k < shopTotalPerPage; k++) {
           //shopsOnPage.push(map.entities.get(k));
           shopNames.push(map.entities.get(k).cm1002_er_etr.text.title);
           shopLats.push(map.entities.get(k)._location.latitude);
           shopLangs.push(map.entities.get(k)._location.longitude);
           
        }

        return {
            shopNames : shopNames,
            shopLats  : shopLats,
            shopLangs : shopLangs
        }
    });
         /*  if(shopInfo[i]) {
           for( var j = 0; j < shopInfo[i].length; j++) {
               finalList.push('['+shopInfo[i].shopLats[j],shopInfo[i].shopLangs[j], JSON.stringify(shopInfo[i].shopNames[j]) + ']');
               
           }
           } */
});
});

casper.then(function echoValues() {
    casper.echo(JSON.stringify(shopInfo));
});

casper.run();    
