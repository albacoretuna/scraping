/* 
 * to scrape virginmedia! 
 */


var baseUrl = "http://spatial.virtualearth.net/REST/v1/data/f5593f40a3e8492181e452bbe4247db0/VirginMediaStoreLocatorEntries/VirginMediaStoreLocatorEntries?spatialFilter=nearby(52.47952651977539,-1.911009430885315,400)&$select=*&$top=200&$format=json&key=AjF8l9J6TH-WM5tkfFYdYE8NVUx9SFe4ya9aBaxKFFPBImvFWWHPOsRMSBesWblU";

var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
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
    minute = date.getMinutes();
    month = date.getMonth() + 1, 
    fname = 'virginmedia-'+month+'-'+day+'-'+minute+'-'+secondsNow+'.txt';

function saveToFile(finalData, branchName) {
    savePath = fs.pathJoin(fs.workingDirectory,
     'output',fname);
    fs.write(savePath, finalData, 'w');

}

// a stuped with to work around the format that Microsoft is sending us the JSON
function jQuery18305426675335038453_1429531451051() {
  return arguments[0];
  
}

casper.start(baseUrl, {
            method: 'get',
            headers: {
            'Accept': 'application/json'
                    }});
casper.then(function getData(){


    var rawData = this.getPageContent();
    
        shopInfo = JSON.parse(this.getPageContent());
    var resultPack = shopInfo.d.results;

    var finalData = resultPack.map(function(val){
    return [
              val.Latitude,
              val.Longitude,
              val.EntityStoreName
           ];
    });
    
    saveToFile(JSON.stringify(finalData), "Virginmedia"); 
    casper.echo("\n Hello! I just returned " + finalData.length
    + " shops");

});
casper.run();
