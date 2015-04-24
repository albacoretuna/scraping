/* 
 * to scrape lebara.co.uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    pageContent,
    totalPages;

var prefCoords = [["AB10",57.131086,-2.122482],["AB10",57.131086,-2.122482],["E1",51.514997,-0.058707],["AB11",57.13121,-2.082261],["E2",51.529447,-0.060197]];

var baseUrl = "http://www.lebara.co.uk/view/StoreLocatorComponentController?findStores=true&lat=53.8007554&lng=-1.5490773999999874&currentLocation=Leeds&distance=0&distanceUnit=Miles&offeringType=SIM&_offeringType=on&_offeringType=on&defaultSearchableLocs=STORE%2C+HOTSPOT%2C+MICROEVENT%2C+BRANDED_STORE&pageNumber=0";
var baseUrlVar = "http://www.lebara.co.uk/view/StoreLocatorComponentController?findStores=true&lat=53.8007554&lng=-1.5490773999999874&currentLocation=Leeds&distance=0&distanceUnit=Miles&offeringType=SIM&_offeringType=on&_offeringType=on&defaultSearchableLocs=STORE%2C+HOTSPOT%2C+MICROEVENT%2C+BRANDED_STORE&pageNumber="+i;


var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });

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
        casper.thenOpen(baseUrlVar, function(){
            
            });

    }
});
casper.run();
