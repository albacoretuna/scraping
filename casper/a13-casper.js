var casper = require('casper').create();

function getShopNames() {
    var names = document.queryselectorAll('ul h3');

    return Array.prototype.map.call(names, function(e) {

        // return all the names
        return e.getAttribute('href');
    });
}

casper.start('http://www.aleksi13.fi/myymalat/', function() {
    
    var shopsCoords = casper.evaluate(function() {
        return A13Shops;
    });
  var shopsCoords,
      i,
      j,
      shopsTotal,
      eachShop = [],
      finalList = [];

  shopsTotal = shopsCoords.length;
  for(i = 0; i < shopsTotal; i++) {
          eachShop.push('['+ shopsCoords[i].coordinates.lat,shopsCoords[i].coordinates.lng, JSON.stringify("SHOPNAMEHERE") + ']'); 

  }
      console.log('['+eachShop+']');
});

casper.thenOpen('http://phantomjs.org', function() {
});

casper.run();
