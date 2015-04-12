var shopNames = [],
    urls;
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

casper.start('http://www.bmstores.co.uk/stores', function() {
});

casper.then(function() {
   var shopsCoords,
       i,
       j,
       shopsTotal,
       outputString,
       savePath, 
       fname = 'b-and-m.txt';
       finalList = [];

    var shopsCoords = casper.evaluate(function() {
        return aItems;
    });

    shopNames = this.evaluate(getShopNames);


  shopsTotal = shopsCoords.length;
  for(i = 0; i < shopsTotal; i++) {
          finalList.push('['+ shopsCoords[i].coordinates.lat,shopsCoords[i].coordinates.lng, JSON.stringify(shopNames[i]) + ']'); 

  }
    outputString = 'B and M \n ['+finalList+']'; 
    savePath = fs.pathJoin(fs.workingDirectory, 'output',fname);
    fs.write(savePath, outputString, 'w');
});


casper.run(); 

