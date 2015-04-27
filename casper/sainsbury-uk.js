/* 
 * to scrape Sainsbury phones uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];

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
var baseUrl = 'http://www.phoneshopbysainsburys.co.uk/store-locator';


casper.start(baseUrl);
casper.then(function() {
    shopInfo = casper.evaluate(function(){
            var scripts = document.getElementsByTagName('script');
           for(var i=50; i<scripts.length; i++){
            var scr = scripts[i];
            var html = scr.innerHTML;
            if(html.indexOf('new TTCore.App.Modules.StoreLocator')>0){
            var index = html.indexOf('{"id":');
            var str = html.substring(index);
            str = str.replace("); }($j));",'');
            var json = JSON.parse(str);
            }
            } 

            json.locations = json.locations.map(function(val){
                return [
                    val.lat,
                    val.long,
                    val.name
                    ]
                });
            return json.locations;       
        });
        this.capture('screenshots/sainsbury.png');
    });
casper.then(function() {
    casper.echo(JSON.stringify(shopInfo));
    onlyUnique(shopInfo);
    saveToFile(shopInfo, "sainsburys-mobile");

    });

casper.run();
