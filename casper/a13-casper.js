var shopNames = [];
var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});

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
       eachShop = [],
       finalList = [];

    var shopsCoords = casper.evaluate(function() {
        return A13Shops;
    });

    shopNames = this.evaluate(getShopNames);


  shopsTotal = shopsCoords.length;
  for(i = 0; i < shopsTotal; i++) {
          eachShop.push('['+ shopsCoords[i].coordinates.lat,shopsCoords[i].coordinates.lng, JSON.stringify(shopNames[i]) + ']'); 

  }
      console.log('['+eachShop+']');
});


casper.run(function() {
});
