/*
* To extract addresses from Aleksi13.
Format: 
Bauhaus
[[60.163803, 24.708853, "Espoo"], [61.46711, 23.723173, "Tampere"], [60.482516, 22.210751, "Turku"], [60.277366, 24.984283, "Vantaa"], [64.981828, 25.514374, "Oulu"]] 

*/
var webPage = require('webpage'),
    page = webPage.create();

page.open('http://www.aleksi13.fi/myymalat/', function(status) {
  var shopsCoords,
      i,
      j,
      shopsTotal,
      eachShop = [],
      finalList = [];

  shopsCoords = page.evaluate(function() {
    return A13Shops; 
  });
  shopsTotal = shopsCoords.length;
  for(i = 0; i < shopsTotal; i++) {
          eachShop.push('['+ shopsCoords[i].coordinates.lat,shopsCoords[i].coordinates.lng, JSON.stringify("SHOPNAMEHERE") + ']'); 

  }
      console.log('['+eachShop+']');
  phantom.exit();

});
