/* 
 * to scrape ee.co.uk! 
 */


var i = 0;
var prefCoords = [["AB10",57.131086,-2.122482],["AB11",57.13121,-2.082261]];

// prefCoords[i][1] = lat and [i][2] = long
var shopInfo = [],
    shopsOnPage = [];



var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });

casper.start();

casper.eachThen(prefCoords, function reqAndGrab() {
var baseUrl = "http://www.three.co.uk/storelocator/locate?lat="+prefCoords[i][1]+"&lng="+prefCoords[i][2]+"&radius=300";
    casper.thenOpen(baseUrl);
    shopInfo = shopInfo.concat(shopsOnPage);
    shopsOnPage = casper.evaluate(function(){ 
    var storeNames = document.querySelectorAll('stores >store > name'); 
    var storeLats = document.querySelectorAll('stores > store > lat'); 
    var storeLongs = document.querySelectorAll('stores > store > lng'); 
    storeNames = Array.prototype.map.call(storeNames, function(e) {
        return e.textContent;
    });
    storeLats = Array.prototype.map.call(storeLats, function(e) {
        return e.textContent;
    });
    storeLongs = Array.prototype.map.call(storeLongs, function(e) {
        return e.textContent;
    });

    var shopsPerPage = storeNames.length;
    for(var ix = 0; ix < shopsPerPage; ix++){
        shopsOnPage.push([storeLats[ix], storeLongs[ix],storeNames[ix]]);
}
        return shopsOnPage;
    });
    
    i++;
});

    
    casper.echo(JSON.stringify(shopInfo)); 

casper.run();
