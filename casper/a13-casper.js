var shopNames = [];
var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});
var fs = require('fs');
function getShopNames() {
    var shopNames = document.querySelectorAll('#shop-list h3');

    return Array.prototype.map.call(shopNames, function(e) {

        // return all the names
        return e.textContent.replace("Aleksi 13 ","");
    });
}

casper.start('http://www.aleksi13.fi/myymalat/', function() {
});

casper.then(function() {
   var shopsCoords,
       i,
       j,
       shopsTotal,
       outputString,
       savePath, 
       fname = 'aleksi13.txt';
       finalList = [];

    var shopsCoords = casper.evaluate(function() {
        return A13Shops;
    });

    shopNames = this.evaluate(getShopNames);


  shopsTotal = shopsCoords.length;
  for(i = 0; i < shopsTotal; i++) {
          finalList.push('['+ shopsCoords[i].coordinates.lat,shopsCoords[i].coordinates.lng, JSON.stringify(shopNames[i]) + ']'); 

  }
    outputString = 'Aleksi 13 \n ['+finalList+']'; 
    savePath = fs.pathJoin(fs.workingDirectory, 'output',fname);
    fs.write(savePath, outputString, 'w');
});


casper.run(); 

