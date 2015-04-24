/* 
 * to scrape lebara.co.uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    pageContent,
    totalPages;

var prefCoords = [["AB10",57.131086,-2.122482],["AB10",57.131086,-2.122482],["E1",51.514997,-0.058707],["AB11",57.13121,-2.082261],["E2",51.529447,-0.060197]];

var baseUrl = "http://www.lebara.co.uk/view/StoreLocatorComponentController?findStores=true&lat=53.8007554&lng=-1.5490773999999874&currentLocation=Leeds&distance=0&distanceUnit=Miles&offeringType=SIM&_offeringType=on&_offeringType=on&defaultSearchableLocs=STORE%2C+HOTSPOT%2C+MICROEVENT%2C+BRANDED_STORE&pageNumber="+i;


var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
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

function saveToFile(finalData, branchName) {

var date = new Date(),
    minute = date.getMinutes(),
    day = date.getDate(),
    hours = date.getHours() +1,
    month = date.getMonth() + 1, 
    fs = require('fs');

var fname = branchName+'-'+month+'-'+day+'-'+hours+'-'+minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, finalData, 'w');

}

casper.start();
casper.thenOpen(baseUrl, function() {
    pageContent = casper.evaluate(function() {
        return document.querySelector('body').textContent; 
    });
    pageContent = JSON.parse(pageContent);
    totalPages = pageContent.totalPages;
});
casper.then(function(){
    casper.echo("pageContent is now: "+pageContent);
    for(var i = 0; i < totalPages; i++) {
        casper.thenOpen(baseUrl+i, function(){
            shopsOnPage = casper.evaluate(function() {
                pageContent = document.querySelector('body').textContent;
                pageContent = JSON.parse(pageContent);
                return  pageContent.storesList.map(function(val) {
                    return [            
                        val.latitude,
                        val.longitude,
                        val.storeName
                        ]
                    });
            });
            shopInfo = shopInfo.concat(shopsOnPage);
            onlyUnique(shopInfo);
            });

    }
});
casper.then(function() {
            casper.echo("\n and shopInfo is: "+ JSON.stringify(shopInfo));
            saveToFile(JSON.stringify(shopInfo),"Lebara");

});
casper.run();
