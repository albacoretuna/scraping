
/* 
 * to scrape thebodyshop.fi
 - open baseUrl
 - read addresses and names
 - askGoogle for coords
 */


var i = 0,
    shopInfo = [],
    links = [],
    shopCoords = [],
    linksAndNames = [],
    addressQuery,
    address,
    addressPostcode = [],
    cityQty, 
    linksTotal;

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
verbose: 0,
logLevel: 'info',
pageSettings: {
loadImages:  false,
loadPlugins: false
}
});
casper.options.waitTimeout = 20000;
var baseUrl= 'http://www.thebodyshop.fi/fi/yritys/ota-yhteytta';
casper.start(baseUrl);

casper.then(function(){
  
  });
