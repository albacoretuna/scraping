/* 
 * to scrape beales uk
 - open baseUrl
 - iterate over shop lists (a div of linkes)
 - grab names and links 
 - go inside google map iframe, read lang lat
 */


var i = -1,
    shopInfo = [],
    links = [],
    shopCoords = [],
    linksAndNames = [],
    page = [],
    addressQuery,
    address,
    addressPostcodeNames = [],
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
verbose: 1,
logLevel: 'debug',
pageSettings: {
loadImages:  false,
loadPlugins: false
}
});
casper.options.waitTimeout = 20000;
var baseUrl= 'http://www.beales.co.uk/about-beales.html';
casper.start(baseUrl);
casper.then(function getLinks(){
  linksAndNames = casper.evaluate(function evalGetLinks(){
    var links = document.querySelectorAll(' .pointer_cursor.Container.clearfix.grpelem.wp-panel  a');
    links = Array.prototype.map.call(links, function(val){
    var href = 'http://www.beales.co.uk/' + val.getAttribute('href');
    return href;
    });
     
    var names = document.querySelectorAll('.pointer_cursor.Container.clearfix.grpelem.wp-panel p');
    names = Array.prototype.map.call(names, function(val){
      return val.textContent;
    });
     
    var linksNames = [];
    for(var j = 0; j < links.length; j++) {
      linksNames.push([links[j],names[j]]);
    }
 
    return linksNames;
    });
  });
casper.then(function testLinks(){
  casper.echo(JSON.stringify(linksAndNames));
  });
casper.then(function repeatWrapper(){
  casper.repeat(linksAndNames.length+1, function repeatMapRead(){

    casper.then(function openCurLink(){
    if(linksAndNames[i] != null){
      casper.open(linksAndNames[i][0]);
    }
    });

    casper.then(function readIframeWrapper(){
      casper.withFrame(0, function frameReader(){
        page = casper.getPageContent();
        var scripts = casper.evaluate(function(){
          var scripts = document.querySelectorAll('script');
          return scripts;
          });
        });
    casper.then(function readLongLat(){
      var re = /u0026ll=(\d+\.\d+,-?\d+\.\d+)/; 
      var str = page;
      var m;
       
      if ((m = re.exec(str)) !== null) {
          if (m.index === re.lastIndex) {
              re.lastIndex++;
          }
          // View your result using the m-variable.
          // eg m[0] etc.
      }  
      if(m != null){
        m[1] = m[1].split(',');
      shopCoords.push([+m[1][0],+m[1][1]]);
      }{
        casper.echo("Regex failed for u0026ll");
        }
    
        });
        /* casper.echo(JSON.stringify(page)); */
        });
      i++;
      });
});
casper.then(function packData(){
  for(var k = 0; k < linksAndNames.length; k++){
    if(linksAndNames[k] && shopCoords[k]){
      shopInfo.push([shopCoords[k][0],shopCoords[k][1],linksAndNames[k][1]]);
    }
    
    }
  });
casper.then(function saveLogBye(){
  saveToFile(shopInfo, 'beals');
  });
casper.run();
