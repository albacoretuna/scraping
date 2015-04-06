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
    var shopNames = document.querySelectorAll('h3');

    return Array.prototype.map.call(shopNames, function(e) {

        // return all the names
        return e.textContent;
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

casper.then(function() {
    shopNames = this.evaluate(getShopNames);
});


casper.run(function() {
    this.echo(shopNames);
});
