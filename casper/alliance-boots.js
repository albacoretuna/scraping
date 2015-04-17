/*
* This file should be run by this paramteres as it uses https
* casperjs --ssl-protocol=tlsv1 alliance-boots.js

Normal Base url 
http://www.boots.com/webapp/wcs/stores/servlet/StoreLocator?requiredAction=displayStoreLookupPage&displayView=StoreLookupView&langId=-1&storeId=10052&catalogId=11051&langId=-1&storeId=10052&catalogId=11051

Mobile base url: 
var baseUrl = 'https://m.boots.com/h5/storeLocator_hub?pageType=storeLocator&unCountry=uk',
*/

var baseUrl = 'http://www.boots.com/webapp/wcs/stores/servlet/StoreLocator?requiredAction=displayStoreLookupPage&displayView=StoreLookupView&langId=-1&storeId=10052&catalogId=11051&langId=-1&storeId=10052&catalogId=11051',
    postcodePrefixes = ["E1","B1"], // b series work but others not! 
    shopTotalPerPage,
    i = -1,
    shopInfo = [],
    finalList = [],
    fs = require('fs');

var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});



casper.start(baseUrl);


casper.each(postcodePrefixes, function stealShopInfo() {
    i++;
    casper.echo("MR I IS NOW:" + i + "\n" );
    casper.thenOpen(baseUrl);
    casper.then(function postcodeFormFiller() {
        this.fill('form#StoreLookupForm',
                 { 'postcode' : postcodePrefixes[i]}, true);
        this.capture(i+'google.png', {
            top: 0,
            left: 0,
            width: 900,
            height: 800
        });
    });
    casper.waitForSelector('#myMap' ,function afterFormSubmitted() {    
        shopInfo.push( casper.evaluate(function readMapEntities() {
            var shopTotalPerPage = map.entities.getLength();
            var shopsOnPage = [],
                shopNames = [],
                shopLats = [],
                shopLangs = [];
                    for(var k = 1; k < shopTotalPerPage; k++) {

               shopNames.push(map.entities.get(k).cm1002_er_etr.text.title);
               shopLats.push(map.entities.get(k)._location.latitude);
               shopLangs.push(map.entities.get(k)._location.longitude);
           
        }

        return {
            shopNames : shopNames,
            shopLats  : shopLats,
            shopLangs : shopLangs
        }
    }));
         /*  if(shopInfo[i]) {
           for( var j = 0; j < shopInfo[i].length; j++) {
               finalList.push('['+shopInfo[i].shopLats[j],shopInfo[i].shopLangs[j], JSON.stringify(shopInfo[i].shopNames[j]) + ']');
               
           }
           } */
        this.capture(i+'afterForm.png', {
            top: 0,
            left: 0,
            width: 900,
            height: 800
        });
});
});

casper.then(function echoValues() {
    casper.echo(JSON.stringify(shopInfo));
/*
    require('utils').dump(casper.steps.map(function(step) {
            return step.toString();
    }));
*/
});

casper.run();    
