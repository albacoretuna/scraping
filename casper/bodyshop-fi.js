
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
verbose: 0,
logLevel: 'debug',
pageSettings: {
loadImages:  false,
loadPlugins: false
}
});
casper.options.waitTimeout = 20000;
var baseUrl= 'http://www.thebodyshop.fi/fi/yritys/ota-yhteytta';
casper.start(baseUrl);

casper.then(function grabAddresses(){

addressPostcodeNames = casper.evaluate(function EvalGrabAdd(){
  var addresses = [];
  for(var i = 9; i < 21; i++) {
  addresses.push( 
  document.querySelector('#pagecontent > div > section.gcol.gcol2.content.basic_content > p:nth-child('+i+')').innerHTML);
  }
  var all = addresses.join();
  var postCodes = all.match(/([^#])([\d]{5})([\sA-Z])/g);
  postCodes = postCodes.map(function(val){return val.replace(/>/g,'')});
   
  var names = all.match(/\b(?!AINOA|VERKKOKAUPPA)([A-ZÄÖÅ]{2,})/g);
   
  var addressLines = all.match(/([A-ZÄÖÅ][a-zA-Z_äöåÄÖ]+[\s]?[a-zA-Z_äöåÄÖ]*[\s]?[a-zA-Z_äöåÄÖ]*[\s]+[\d]+|Kauppakeskus Mylly)[^\.]/g);
  addressLines = addressLines.map(function(val){return val.replace(/-?<?/g,'')});
  var pack = [];
  for(var j = 0; j < names.length; j++){
    pack.push([addressLines[j],postCodes[j],names[j]])
    }
 
 return pack; 
    });
  });


casper.then(function askGoogle(){
  var k = -1;
  casper.repeat(addressPostcodeNames.length, function(){
    casper.then(function(){
          var googleQuery= 'https://maps.googleapis.com/maps/api/geocode/json?address='+addressPostcodeNames[k][0]+'&components=postal_code:'+addressPostcodeNames[k][1].trim()+'|country:FI&key=AIzaSyC9Jl9-s3AfgKTwdWBQV_PCwrCeWrWOvg8';
 
      casper.open(googleQuery);

      });
    casper.then(function(){
      var googleResponse = casper.getPageContent();
      var jsonStr = JSON.parse(googleResponse);
      if(jsonStr != null && jsonStr.results[0] != null){

      var shopLocation = jsonStr.results[0].geometry.location;
      /* casper.echo('2. shopLocationLat is: '+shopLocation.lat); */
      shopInfo.push([
        shopLocation.lat, 
        shopLocation.lng,
        addressPostcodeNames[k][2]
        ]);
      } else {
        casper.echo('No result for:'+addressPostcodeNames[k][2]+ ' - '+addressPostcodeNames[k][0]);
// starting nested then
        casper.then(function(){
          casper.then(function(){
          // change google query!  
          var googleQuery= 'https://maps.googleapis.com/maps/api/geocode/json?address='+addressPostcodeNames[k][0]+'&components=country:FI&key=AIzaSyC9Jl9-s3AfgKTwdWBQV_PCwrCeWrWOvg8';
          casper.open(googleQuery);
            });
          casper.then(function(){
          
            var googleResponse = casper.getPageContent();
            var jsonStr = JSON.parse(googleResponse);
            if(jsonStr != null && jsonStr.results[0] != null){

            var shopLocation = jsonStr.results[0].geometry.location;
            /* casper.echo('2. shopLocationLat is: '+shopLocation.lat); */
            shopInfo.push([
              shopLocation.lat, 
              shopLocation.lng,
              addressPostcodeNames[k][2]
              ]);
            }
            });
          // 
        });

// ending nested then
        }
      });
    k++;
});
});

casper.then(function saveLogBye(){
  saveToFile(shopInfo, "thebodyshop");
  /* casper.echo(JSON.stringify(addressPostcodeNames)); */
  
  });

casper.run();
