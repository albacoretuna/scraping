/*
 * to scrape BHS uk
 - open baseUrl
 - request the api
 - read JSON reply
 - filter needed data and put it into shopInfo
 */

'use strict';
var i = -1,
    shopInfo = [],
    links = [],
    shopCoords = [],
    linksAndNames = [],
    page = [],
    pageData,
    cityQty,
    globals = {};

var startExecutionTime = new Date().getTime();

var casper = require('casper').create({
verbose: 1,
logLevel: 'debug',
pageSettings: {
loadImages: false,
loadPlugins: false
}
});
casper.options.waitTimeout = 20000;

function onlyUnique(items) {
  for (var ix = 0; ix < items.length; ix++) {
    var listI = items[ix];
loopJ: for (var jx = 0; jx < items.length; jx++) {
         var listJ = items[jx];
         if (listI === listJ) {
           continue;
         } //Ignore itself
         for (var kx = listJ.length; kx >= 0; kx--) {
           if (listJ[kx] !== listI[kx]) {
             continue loopJ;
           }
         }
         // At this point, their values are equal.
         items.splice(jx, 1);
       }
  }

  return items;
}

function saveToFile(finalData, branchName) {

  var date = new Date(),
      minute = ('0' + date.getMinutes()).slice(-2),
      day = ('0' + date.getDate()).slice(-2),
      hours = ('0' + (date.getHours())).slice(-2),
      month = ('0' + (date.getMonth() + 1)).slice(-2),
      year = date.getFullYear();
  var fs = require('fs');

  var fname = branchName + '-' + year + month + day + '-' + hours + minute + '.txt';
  var savePath = fs.pathJoin(fs.workingDirectory, 'output', fname);
  fs.write(savePath, JSON.stringify(finalData), 'w');

  var completionTime = new Date().getTime();
  var executionTime = (completionTime - startExecutionTime) / 60000;
  var fLogName = 'main-report.txt';
  var report = '\n ----------- ' +
    'Date: ' +
     year + '/' + month + '/' + day + '  ' + hours + ':' + minute +
    ' ----------- \n ' +
    'Branch name: ' +
    branchName +
    '\n Number of shops returned: ' +
    finalData.length +
    '\n Execution Time (minute): ' +
      executionTime +
      '\n Results are saved in: \n' +
      savePath +
      '\n ---\n';

  var logSavePath = fs.pathJoin(fs.workingDirectory, 'output', fLogName);
  fs.write(logSavePath, report, 'a');

  casper.echo(JSON.stringify(finalData));
  casper.echo('------------------------== REPORT ==----------------');
  casper.echo(report);
}

var baseUrl = 'http://store.api.arcadiagroup.co.uk/storestock/storestock?brand=13077&jsonp_callback=CALLBACK&lat=51.5073509&long=-0.12775829999998223&dist=10000&res=1000&_=1432127011728';
casper.start(baseUrl);

casper.then(function readJSON(){
  pageData = casper.getPageContent();
  if(pageData.indexOf('CALLBACK') > 0){
    var index = pageData.indexOf('CALLBACK(') + 9;
    pageData = pageData.substring(index);
    pageData = pageData.replace(');</body></html>', '');

    globals.json = JSON.parse(pageData);



    }

  });

casper.then(function filterJSON(){
  var stores = globals.json.stores;
  for(var j = 0; j < stores.store.length; j++ ){
    shopInfo.push(
    [
    +stores.store[j].latitude,
    +stores.store[j].longitude,
    stores.store[j].storeName
    ]
    );
  }
});

casper.then(function saveLogBye(){
 saveToFile(shopInfo, 'BHS');
});

casper.run();
