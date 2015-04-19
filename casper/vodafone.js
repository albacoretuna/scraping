
/*

This one is quick and clean, as it reads everything from a single JavaScript object.
*/

var baseUrl = 'http://www.vodafone.co.uk/find-a-store/';

var casper = require('casper').create({
    verbose: false,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});


var fs = require('fs'),
    shopInfo,
    savePath, 
    date = new Date(),
    secondsNow = date.getSeconds(),
    day = date.getDate(),
    month = date.getMonth() + 1, 
    fname = 'vodafone-'+month+day+secondsNow+'.txt';

function saveToFile(finalData) {
    savePath = fs.pathJoin(fs.workingDirectory,
     'output',fname);
    fs.write(savePath, JSON.stringify(finalData), 'w');

}

casper.start(baseUrl);
casper.then(function grabStoresVariable(){
    shopInfo = casper.evaluate(function evaluateStores() {
        return window.stores;
    });
casper.then(function makeFinalString() {
  var shopTotal = shopInfo.length,
      finalArray =[],
      eachShop = [];

  for(var i = 0; i < shopTotal; i++) {
     eachShop = [+shopInfo[i].lat, +shopInfo[i].lng,shopInfo[i].name];
     
     finalArray.push(eachShop);
  }

  saveToFile(finalArray);  
//casper.echo(JSON.stringify(finalArray));

});
//casper.echo(JSON.stringify(shopInfo));

}); 

casper.run();

