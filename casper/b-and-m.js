var baseUrl = 'http://www.bmstores.co.uk/stores?location=';
var cities = ["St. Albans, Hertfordshire ","Cambridge, Cambridgeshire"];
var i = -1,
    shopInfo = [],
    shopNames = [],
    shopNamesCollection = []
    finalList=[];
var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});


function getShopNames() {
    var shopNames = document.querySelectorAll('th');

    return Array.prototype.map.call(shopNames, function(e) {

        // return all the names
        return e.textContent.replace(/\n/g,'');
    });
}


casper.start(baseUrl);

casper.then(function() {
    casper.each(cities, function() {
        i++;
        casper.thenOpen((baseUrl + cities[i]), function() {
            shopInfo[i] = casper.evaluate(function() {
                return aItems;
            });
            shopNamesCollection[i] = casper.evaluate(getShopNames);  
           for( var j = 0; j < shopInfo[i].length; j++) {
               finalList.push('['+shopInfo[i][j]['lat'],shopInfo[i][j]['lng'], JSON.stringify(shopNamesCollection[i][j]) + ']');
               
           }
            
        });
    });
});

/*
casper.then(function() {
*/


casper.run(function() {
    casper.echo(finalList);
    
    }); 
