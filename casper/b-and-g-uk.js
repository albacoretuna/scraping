/* 
 * to scrape B&G uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [];


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
    minute = ('0'+ date.getMinutes()).slice(-2),
    day = ('0' + date.getDate()).slice(-2),
    hours = ('0' + (date.getHours())).slice(-2),
    month = ('0' + (date.getMonth() + 1)).slice(-2), 
    year = date.getFullYear(),
    fs = require('fs');

var fname = branchName+'-'+year+month+day+'-'+ hours + minute+'.txt';
var savePath = fs.pathJoin(fs.workingDirectory,'output',fname);
    fs.write(savePath, JSON.stringify(finalData), 'w');

var completionTime = new Date().getTime();
var executionTime = (completionTime - startExecutionTime)/60000;
var fLogName = 'main-report.txt';
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
             '\n Results are saved in: \n'+
             savePath +
             '\n ---\n';

var logSavePath = fs.pathJoin(fs.workingDirectory,'output',fLogName);
    fs.write(logSavePath, report, 'a');

    casper.echo(JSON.stringify(finalData));
    casper.echo('------------------------== REPORT ==----------------');
    casper.echo(report);
}

var casper = require('casper').create({
    verbose: false,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });

var baseUrl= 'http://www.diy.com/find-a-store';

casper.start(baseUrl);


/* casper.wait(10000); */
casper.then(function fillTheForm(){
    casper.waitForSelector('#searchLocationMain' ,function isFormReady() {    
        casper.fillSelectors('form#searchLocationMain',
                 { '#search_store_location' : 'b1, uk'}, true);
    });

});

casper.then(function captureScreen(){
    
    });
casper.then(function requestAndGrab(){
    shopsOnPage = casper.evaluate(function(){
    
    var tags = document.querySelectorAll('li[data-lat]');
     
    var latlangs = Array.prototype.map.call(tags, function(val){ 
        return [val.getAttribute('data-lat'), val.getAttribute('data-lng')]
        });
     
    var nameTags = document.querySelectorAll('h3[data-info-prop]');
    var names = Array.prototype.map.call(nameTags, function(val){ return val.textContent});
     
    var shopsOnPage = [];
    for(var i = 0; i < latlangs.length; i++ ) { 
        shopsOnPage.push([latlangs[i][0], latlangs[i][1], names[i]]) 
        }

    return shopsOnPage;

        });
   casper.echo(shopsOnPage); 
    });
casper.run();
