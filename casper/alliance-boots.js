/*
* This file should be run by this paramteres as it uses https
* casperjs --ssl-protocol=tlsv1 alliance-boots.js

Normal Base url 
var baseUrl = 'http://www.boots.com/webapp/wcs/stores/servlet/StoreLocator?requiredAction=displayStoreLookupPage&displayView=StoreLookupView&langId=-1&storeId=10052&catalogId=11051&langId=-1&storeId=10052&catalogId=11051',

Mobile base url: 
var baseUrl = 'https://m.boots.com/h5/storeLocator_hub?pageType=storeLocator&unCountry=uk',
*/

var baseUrl = 'https://m.boots.com/h5/storeLocator_hub?pageType=storeLocator&unCountry=uk',
    postcodePrefixes = ["CM7","E1","B1","CA99","B4"], // b series work but others not! 
    abortedPrefixes = [],
    shopTotalPerPage,
    i = -1,
    shopInfo = [],
    finalList = [],
    fs = require('fs');

var casper = require('casper').create({
    verbose: false,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});



casper.start(baseUrl);


casper.eachThen(postcodePrefixes, function stealShopInfo() {
    i++;
    casper.echo("MR I IS NOW:" + i + "\n" );
    casper.thenOpen(baseUrl);
    casper.then(function postcodeFormFiller() {
        this.fill('form#storLocator',
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

        this.capture(i+'afterForm.png', {
            top: 0,
            left: 0,
            width: 900,
            height: 800
        });
}, function ifTimedOut() {
    // Ontimeout, for afterFormSubmitted
        abortedPrefixes.push(postcodePrefixes[i]);
        request.abort();
    });
});

/*casper.then(function ouputToFile() {
        
        var shopInfoLength = shopInfo.length;
          for(var l = 0; l < shopInfoLength; l++) {  
              
               casper.echo("shopInfo len Is: " + Object.keys(shopInfo[l]).length);
           for( var j = 0; j < Object.keys(shopInfo[l]).length; j++) {
               
               finalList.push(
                   '['+shopInfo[l].shopLats[j],
                   shopInfo[l].shopLangs[j], 
                   JSON.stringify(shopInfo[l].shopNames[j]) + ']' 
               );
               
 
           }
        }
});
*/




casper.then(function echoValues() {



    // casper.echo(JSON.stringify(finalList));
    // casper.echo(JSON.stringify(shopInfo));
    // casper.echo(JSON.stringify(finalList));
    // casper.echo(finalList);
    // casper.echo(shopInfo);

    var data = shopInfo; 
    
    var finalData = [];
    data.forEach(function(item) {
        item.shopLats.forEach(function(lat, index) {
            var arr = [lat, item.shopLangs[index], item.shopNames[index]];
            finalData.push(arr)
        });
    });

    function onlyUnique(items) { 
        for (var ix=0; ix<items.length; ix++) {
        var listI = items[ix];
        loopJ: for (var jx=0; jx<items.length; jx++) {
            var listJ = items[jx];
            if (listI === listJ) continue; //Ignore itself
            for (var kx=listJ.length; kx>=0; kx--) {
                if (listJ[kx] !== listI[kx]) continue loopJ;
            }
            // At this point, their values are equal.
            items.splice(jx, 1);
            }
        }

        return items;
    }








    // keep only unique elements
    var finalUniqData = []; 
    finalUniqData = onlyUnique(finalData);

    casper.echo(JSON.stringify(finalData));

    casper.echo(" \n Hello! \n This prefix returned nothing and was aborted: " + 
    abortedPrefixes + "\n Total aborted prefixes: " +
    abortedPrefixes.length + "\n total shops returned: " +
    finalData.length +
    "\n total unique shops returned: " +
    finalUniqData.length +
    "\n Successful prefixes: " +
    shopInfo.length + "\n \n");
/*
    require('utils').dump(casper.steps.map(function(step) {
            return step.toString();
    }));
*/
});

casper.run();    
