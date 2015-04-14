var baseUrl = 'http://www.johnlewis.com/assets/store_locator/jlshopinfo_locations.xml?_=1428972173883';

var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});
var fs = require('fs'),
    shopInfo;

function getShopInfo() {
    var shopNames = document.querySelectorAll('marker > name');
    var shopLats = document.querySelectorAll('marker > lat');
    var shopLngs = document.querySelectorAll('marker > lng');
        
    shopNames = Array.prototype.map.call(shopNames, function(e) {
        return e.textContent;
    });
    shopLats = Array.prototype.map.call(shopLats, function(e) {
        return e.textContent;
    });
    shopLngs = Array.prototype.map.call(shopLngs, function(e) {
        return e.textContent;
    });
    
    return {
            shopNames: shopNames, 
            shopLats:  shopLats, 
            shopLngs:  shopLngs
            }; 

}

casper.start(baseUrl);
casper.then(function(){
    shopInfo = casper.evaluate(getShopInfo);
    casper.echo(JSON.stringify(shopInfo));
}); 

casper.then(function(){
   var i,
       j,
       shopsTotal,
       outputString,
       savePath, 
       fname = 'johnlewis.txt';
       finalList = [];
  shopsTotal = shopInfo.shopNames.length;

  
  for(i = 0; i < shopsTotal; i++) {
          finalList.push('['+ shopInfo.shopLats[i],shopInfo.shopLngs[i], JSON.stringify(shopInfo.shopNames[i]) + ']'); 

  }
    outputString = 'Jown Lewis Partnership \n ['+finalList+']'; 
    savePath = fs.pathJoin(fs.workingDirectory, 'output',fname);
    fs.write(savePath, outputString, 'w');
}); 


casper.run();
