/*
 * to scrape Marimekko FI
 * Remember to run this with this param: --ssl-protocol=tlsv1
 - open baseUrl
 - everything is in this var:
   Drupal.settings.openlayers.
   maps["openlayers-map-d5c66f33"].
   layers.shop_locator_openlayers_1.
   features
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
verbose: 0,
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

var baseUrl = 'https://www.marimekko.fi/shops/shop-locator?country=FI&city=&shop_type=All';

casper.start(baseUrl);

casper.then(function readJS(){
  casper.echo('\n\n **IMPORTANT** This script won\'t work without this param: --ssl-protocol=tlsv1 **IMPORTANT** \n', 'INFO');
  pageData = casper.evaluate(function(){
    return Drupal.settings
           .openlayers
           .maps['openlayers-map-d5c66f33']
           .layers.shop_locator_openlayers_1
           .features;
    });
  });

casper.then(function formatData(){
  for(var j = 0; j < pageData.length; j++){
    var locWrapper = pageData[j].wkt;
    locWrapper = locWrapper.replace(/POINT\(/, '');
    locWrapper = locWrapper.replace(/\)/, '');
    locWrapper = locWrapper.split(' ');
    var lat = locWrapper[1];
    var long = locWrapper[0];
    var name = pageData[j].attributes.title;
    shopInfo.push([+lat, +long, name]);
    }
  });

casper.then(function saveLogBye(){
 saveToFile(shopInfo, 'marimekko');
});

casper.run();
