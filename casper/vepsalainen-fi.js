/* 
 * to scrape vespalainen  FI! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];

var baseUrl = 'http://www.vepsalainen.com/fi/myymalat/';

var startExecutionTime = new Date().getTime();

function onlyUnique(items) { 
    for (var ix=0; ix<items.length; ix++) {
    var listI = items[ix];
    loopJ: for (var jx=0; jx<items.length; jx++) {
        var listJ = items[jx];
        if (listI === listJ) continue; //Ignore itself
        for (var kx=listJ.length; kx>=0; kx--) {
            if (listJ[kx] !== listI[kx]) continue loopJ;
        }
        // At this point, their values are equal.
        items.splice(jx, 1);
        }
    }

    return items;
}

function zeroLongLatRemover(items){
      return items.filter(function(val){
              return (val[0] !== 0 && val[1] !== 0 ) ;
                });
      }

function saveToFile(finalData, branchName) {

var date = new Date(),
    minute = date.getMinutes(),
    day = date.getDate(),
    hours = date.getHours() +1,
    month = date.getMonth() + 1, 
    fs = require('fs');

var fname = branchName+'-'+month+'-'+day+'-'+hours+'-'+minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, JSON.stringify(finalData), 'w');

}

function logToMainReport(finalData, branchName) {

var date = new Date(),
    minute = date.getMinutes(),
    day = date.getDate(),
    hours = date.getHours() +1,
    month = date.getMonth() + 1, 
    year = date.getFullYear();
    fs = require('fs');

var completionTime = new Date().getTime();
var executionTime = (completionTime - startExecutionTime)/60000;
var fname = 'main-report.txt';
var report = '\n ----------- ' + 
             'Date: ' +
             + year +'/'+ month +'/'+ day +'  '+ hours +':'+ minute +
             ' ----------- \n ' + 
             'Branch name: ' +
             branchName + 
             '\n Number of shops returned: ' +
             finalData.length +
             '\n Execution Time (minute): '+
             executionTime  +  
             '\n ---\n';

var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, report, 'a');

    casper.echo(report);

}
var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
casper.start(baseUrl);
casper.then(function readDataDiv(){
        shopsOnPage = casper.evaluate(function(){
        return document.querySelector('div [data-location]').getAttribute('data-location');
        });

        shopsOnPage = JSON.parse(shopsOnPage);
        shopInfo = shopsOnPage.map(function(val){
            return [
                +val.lat,
                +val.lng,
                val.name
            
            ]
            });


});
casper.then(function removeDuplicatesSaveAndLog(){
    //onlyUnique(shopInfo);
casper.echo(JSON.stringify(shopInfo));
    // removing all the shops with 0,0 coordination numbers
    //shopInfo = zeroLongLatRemover(shopInfo);
    //saveToFile(shopInfo, 'sodexo');
    //logToMainReport(shopInfo, 'sodexo');   
    
    });


casper.run();
