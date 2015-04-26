/* 
 * to scrape thorntons uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];

var startExecutionTime = new Date().getTime();

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

var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
var baseUrl = 'http://www.thorntons.co.uk/custserv/locate_store.cmd';


casper.start(baseUrl);

casper.then(function() {
  shopInfo = casper.getGlobal('allStores'); 
  shopInfo = shopInfo.map(function(val){
      return [
        val.LATITUDE,
        val.LONGITUDE,
        val.STORE_NAME
      ]
      });

    });
casper.then(function() {
    onlyUnique(shopInfo);
  casper.echo(shopInfo);

    });
casper.run();
