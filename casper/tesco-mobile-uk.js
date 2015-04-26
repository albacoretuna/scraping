
/* 
 * to scrape Tesco Mobile UK! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [];

var prefCoords= [["AB10",57.131086,-2.122482],["AB10",57.131086,-2.122482],["E1",51.514997,-0.058707],["AB11",57.13121,-2.082261],["E2",51.529447,-0.060197]];


// prefCoords[i][1] = lat and [i][2] = long

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
// To get around the JSONP response
var storeLocatorLite = {
    "getNearestStoresResponse": function(input){
                                return input;
                                }
    };

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
casper.start();

casper.eachThen(prefCoords, function reqAndGrab() {
    var baseUrl = "http://www.tesco.com/store-locator/uk/asp/getNearestStores.asp?lat="+prefCoords[i][1]+"&lon="+prefCoords[i][2]+"&searchField=phoneStores&rad=1&rL=2000&resultsRequired=10000";

    casper.thenOpen(baseUrl);
    casper.then(function() {
    
    var data = eval(casper.getPageContent());
    casper.echo(data);
    shopsOnPage = data.resources.map(function(val) {
        return [
            +val.lat,
            +val.lon,
            val.name
        ];
         }); 
    // removing the first element, as it's info not shop
    shopsOnPage.splice(0,1);

    // add shops on this page to the main array
    shopInfo = shopInfo.concat(shopsOnPage);
});



    i++;
});

casper.then(function(){
    onlyUnique(shopInfo);
    casper.echo(JSON.stringify(shopInfo));
    });

casper.run();
