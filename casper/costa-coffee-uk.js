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

var baseUrl = 'http://www.costa.co.uk/api/map/getStores?bbox=-10.17389297485351562&bbox=0.49805708407405&bbox=10.08162498474121094&bbox=58.51461834694225&cpoint=51.50633771550815&cpoint=-0.12775897979736328'
//var baseUrl = 'http://www.costa.co.uk/api/map/getStores?bbox=-0.17389297485351562&bbox=51.49805708407405&bbox=-0.08162498474121094&bbox=51.51461834694225&cpoint=51.50633771550815&cpoint=-0.12775897979736328'
casper.start();

casper.then(function() {
  this.open(baseUrl, {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    }
  });
});

casper.then(function () {
  var stores = JSON.parse(this.getPageContent()).features;
  //require('utils').dump(stores);
  for(var j = 0; j < stores.length; j++ ){
    //require('utils').dump(stores[j]);
    var rawAddress = stores[j].properties.Address1;
    var address = rawAddress.replace(/(^[,\s]+)|([,\s]+$)/g, "");
    shopInfo.push(
    [
    +stores[j].geometry.coordinates[0],
    +stores[j].geometry.coordinates[1],
    address
    ]
    );
  }
});

casper.then(function saveLogBye(){
 saveToFile(shopInfo, 'costa-coffee-uk');
});

casper.run(function() {
  this.exit();
});
