/*
 * to scrape pret.co.uk
 - request link is:
 - https://www.pret.co.uk/en-gb/find-a-pret/ub1/
 - where ub1 is a uk prefix code
 - loop over prefixes array
 - read h3 as shop names
 - read attribute data-position as geolocation
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

var baseUrl = 'https://www.pret.co.uk/en-gb/find-a-pret/ub1/';

casper.start(baseUrl);

casper.then(function readJS(){
  casper.echo('\n\n **IMPORTANT** This script won\'t work without this param: --ssl-protocol=tlsv1 **IMPORTANT** \n', 'INFO');

  pageData = casper.evaluate(function(){
    var namesTags = document.querySelectorAll('.panel-heading>h3');
    var names = Array.prototype.map.call(namesTags, function(val){
    return val.innerHTML; });
    var geoData = document.querySelectorAll('[data-position]');
    var arGeo = Array.prototype.map.call(geoData, function(val){return val.getAttribute('data-position'); });

    return names;
    });
  });

casper.then(function readGlobalVar(){
  });

casper.then(function saveLogBye(){
  console.log(JSON.stringify(pageData));
 //saveToFile(shopInfo, 'pret-uk');
});

casper.run();
