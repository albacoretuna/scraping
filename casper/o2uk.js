/* 
 * to scrape o2.co.uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [];

var prefCoords= [["AB10",57.131086,-2.122482],["AB10",57.131086,-2.122482],["E1",51.514997,-0.058707],["AB11",57.13121,-2.082261],["E2",51.529447,-0.060197]];

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
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


casper.start();



casper.eachThen(prefCoords, function reqAndGrab() {
    var baseUrl = "http://stores.ws.o2.co.uk/storestock/stores?nearlatlon="+prefCoords[i][1]+","+prefCoords[i][2]+"&limit=1000";
    casper.thenOpen(baseUrl);
    casper.then(function() {


    shopsOnPage =  JSON.parse(casper.getPageContent());
    shopsOnPage = shopsOnPage.map(function(val) {
        return [
            val.lat,
            val.lon,
            val.name
        ];
         }); 

    shopInfo = shopInfo.concat(shopsOnPage);
    onlyUnique(shopInfo);
});



    i++;
});
casper.then(function() {
    
    casper.echo(JSON.stringify(shopInfo));

});

casper.run();
