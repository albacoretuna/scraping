/* 
 * to scrape unikulma.fi
 - open page
 - read all names, address and postcodes
 - loop through that array, ask google for geocodes 
 */


var i = 0,
    shopInfo = [],
    links = [],
    shopCoords = [],
    linksAndNames = [],
    addressQuery,
    address,
    addrPostcodeName= [],
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
var baseUrl= 'http://www.unikulma.fi/myymalat/';
casper.start(baseUrl);

casper.then(function grabNamesAddressPostcode(){
    addrPostcodeName = casper.evaluate(function evaluateGNAP(){

      // fix array.prototype.map
      // someone has over written map! so the poly-fill must be used! 

      Array.prototype.map = function(callback, thisArg) {
      var T, A, k;
      if (this == null) {
      throw new TypeError(' this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
      T = thisArg;
      }
      A = new Array(len);
      // 7. Let k be 0
      k = 0;
      // 8. Repeat, while k < len
      while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
          kValue = O[k];
          mappedValue = callback.call(T, kValue, k, O);
          A[k] = mappedValue;
        }
        k++;
      }
      return A;
      };
      // end fixing array.prototype.map  




      var nameTags = document.querySelectorAll('div.card-header > h3');

      var addressTags = document.querySelectorAll('div:nth-child(1) > span:not([class])');

      var names = Array.prototype.map.call(nameTags, function(val){
          return val.textContent;
          });

      var addressPostcodes = Array.prototype.map.call(addressTags, function(val) {
          val = val.textContent;

          var re = /^([\wäöå]*[\s]+[\d]+)/i; 
          var str = val;
          var addressLine;

          if ((addressLine = re.exec(str)) !== null) {
          if (addressLine.index === re.lastIndex) {
          re.lastIndex++;
          }
          // View your result using the m-variable.
          // eg addressLine[0] etc.
          }


          var re2 = /([\d]{5})/; 
          var str = val;
          var postCode;

          if ((postCode = re2.exec(str)) !== null) {
            if (postCode.index === re2.lastIndex) {
              re2.lastIndex++;
            }
            // View your result using the m-variable.
            // eg postCode[0] etc.
          }



          return [addressLine[1], postCode[1]];

      });

      var addrPostcodeName = [];
      for (var j = 0; j < addressPostcodes.length; j++) {
        addrPostcodeName.push([addressPostcodes[j], names[j]]); 

      }
      
      return addrPostcodeName;


    });
});

casper.then(function askGoogle(){
  var k = -1;
  casper.repeat(addrPostcodeName.length, function(){
    casper.then(function(){
          var googleQuery= 'https://maps.googleapis.com/maps/api/geocode/json?address='+addrPostcodeName[k][0][0]+'&components=postal_code:'+addrPostcodeName[k][0][1]+'|country:FI&key=AIzaSyC9Jl9-s3AfgKTwdWBQV_PCwrCeWrWOvg8';
 
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
        addrPostcodeName[k][1]
        ]);
      }
      });
    k++;
});
});
casper.then(function saveLogBye(){
  saveToFile(shopInfo, 'unikulma');
  });

casper.run();

