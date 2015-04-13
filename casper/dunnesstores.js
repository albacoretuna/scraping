var baseUrl = 'http://m.dunnesstores.com/pws/StoreFinder.ice?country=GB&countryRegion=&findStore=findStore&page=stores';

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

casper.start(baseUrl);
casper.then(function(){
    shopInfo = casper.evaluate(function() {
        return BTFRESCA.storeFinder.getAllStores();
    });
}); 

casper.then(function(){
   var i,
       j,
       shopsTotal,
       outputString,
       savePath, 
       fname = 'dunnesstores.txt';
       finalList = [];
  shopsTotal = shopInfo.length;
  for(i = 0; i < shopsTotal; i++) {
          finalList.push('['+ shopInfo[i].lat,shopInfo[i].lon, JSON.stringify(shopInfo[i].name) + ']'); 

  }
    outputString = 'Dunnes Stores \n ['+finalList+']'; 
    savePath = fs.pathJoin(fs.workingDirectory, 'output',fname);
    fs.write(savePath, outputString, 'w');
}); 


casper.run();
