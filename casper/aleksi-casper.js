var shops = [];
var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    },
    clientScripts: [
    ]
    
});

casper.start('http://www.aleksi13.fi/myymalat/', function() {
    
    var shopsCoords = casper.evaluate(function() {
        return A13Shops;
    });
    shops = casper.evaluate(function getShopNames(){ 
        $('li h3').each(function(i, elm) {shops[i] = $(this).text();
    });
    return shops.length;    

});
    console.log(shops);
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


casper.run();
