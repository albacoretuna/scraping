
/* 
 * to scrape Tesco Mobile UK! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];

var startExecutionTime = new Date().getTime();

var prefCoords= [["AB10",57.131086,-2.122482],["AB10",57.131086,-2.122482],["E1",51.514997,-0.058707],["AB11",57.13121,-2.082261],["E2",51.529447,-0.060197]];


// prefCoords[i][1] = lat and [i][2] = long

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
// To get around the JSONP response
var storeLocatorLite = {
    "getNearestStoresResponse": function(input){
                                return input;
                                }
    };

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

function saveToFile(finalData, branchName) {

var date = new Date(),
    minute = date.getMinutes(),
    day = date.getDate(),
    hours = date.getHours() +1,
    month = date.getMonth() + 1, 
    fs = require('fs');

var fname = branchName+'-'+month+'-'+day+'-'+hours+'-'+minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, finalData, 'w');

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

}

casper.start();

casper.eachThen(prefCoords, function reqAndGrab() {
    var baseUrl = "http://www.tesco.com/store-locator/uk/asp/getNearestStores.asp?lat="+prefCoords[i][1]+"&lon="+prefCoords[i][2]+"&searchField=phoneStores&rad=1&rL=2000&resultsRequired=10000";

    casper.thenOpen(baseUrl);
    casper.then(function() {
    
    var data = eval(casper.getPageContent());
    casper.echo(data);
    shopsOnPage = data.resources.map(function(val) {
        return [
            +val.lat,
            +val.lon,
            val.name
        ];
         }); 
    // removing the first element, as it's info not shop
    shopsOnPage.splice(0,1);

    // add shops on this page to the main array
    shopInfo = shopInfo.concat(shopsOnPage);
});



    i++;
});

casper.then(function(){
    onlyUnique(JSON.stringify(shopInfo));
    saveToFile(shopInfo, "TescoMobile");
    logToMainReport(shopInfo, "Tesco Mobile");
});

casper.run();
