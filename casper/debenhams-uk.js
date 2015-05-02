/* 
 * to scrape Debenhams uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];
var prefCoords =[] ;
var prefCoords= [["AB10",57.131086,-2.122482],["AB10",57.131086,-2.122482],["E1",51.514997,-0.058707],["AB11",57.13121,-2.082261],["E2",51.529447,-0.060197]];




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

function saveToFile(finalData, branchName) {

var date = new Date(),
    minute = date.getMinutes(),
    day = date.getDate(),
    hours = date.getHours(),
    month = date.getMonth() + 1, 
    year = date.getFullYear(),
    fs = require('fs');

var fname = branchName+'-'+month+'-'+day+'-'+hours+'-'+minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, JSON.stringify(finalData), 'w');

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

var logSavePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(logSavePath, report, 'a');

    casper.echo(report);
}

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });

// prefCoords[i][1] = lat and [i][2] = long
var baseUrl = 'http://mystore.debenhams.com/data/search.json?lat='+prefCoords[i][1]+'&lng='+prefCoords[i][2];


casper.start(baseUrl);

casper.eachThen(prefCoords,function(){
        casper.open(baseUrl);
        var pageContent = JSON.parse(casper.getPageContent());
        /* casper.echo(JSON.stringify(shopsOnPage)); */
        shopsOnPage = pageContent.map(function(val){
            return [
                +val.lat,
                +val.lon,
                val.name
            ];
            });
        casper.echo(shopInfo);

        shopInfo = shopInfo.concat(shopsOnPage);
        i++;
    
});

casper.then(function finalSteps(){
    
    });
casper.run();
