/* 
 * to scrape Stadium.fi
 - open page
 - loop and choose the city from drop down
 - regex to get addresses, and post codes
 - loop thrugh the addresses, to ask google for coords 
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
var baseUrl= 'http://www.stadium.fi/is-bin/INTERSHOP.enfinity/WFS/Stadium-FinlandB2C-Site/fi_FI/-/EUR/cc_ViewDepartments-ShowStadiumShops';
casper.start(baseUrl);

casper.then(function howManyCities(){
    cityQty = casper.evaluate(function evaluateHowManyCities(){
      var cityQty = document.querySelectorAll('option').length;
      return cityQty;
      });
    });
casper.then(function citiesRepeatWrapper(){
    casper.repeat(cityQty, function loopForCities(){
      // remember option 0 is useless! start from 1 

      casper.then(function selectCity(){
        casper.echo('i is now: '+ i);
        casper.evaluate(function evaluateSelectCity(indexCity){
          document.querySelector('select[name=CityUUID]').selectedIndex = parseInt(indexCity);
          document.querySelector('form.store_navigation').submit();

          }, {indexCity: i} );
        this.capture('screenshots/snapshot'+i+'.png');
        });
      casper.then(function grabAddresses(){
        address = casper.evaluate(function evaluateGrabAddress(){
          // start fixing map and filter, using polyfill from MDN! 
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
          k = 0;
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

          // for filter 
          Array.prototype.filter = function(fun/*, thisArg*/) {
            'use strict';
            if (this === void 0 || this === null) {
              throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== 'function') {
              throw new TypeError();
            }

            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
              if (i in t) {
                var val = t[i];
                if (fun.call(thisArg, val, i, t)) {
                  res.push(val);
                }
              }
            }

            return res;
          };

          // end of fixing map and filter! 
          var sel = document.querySelectorAll('div.store_info > div > p:nth-child(2) ');
          // read addresses, and trim them
          var addr = Array.prototype.map.call(sel, function(val) {
              return val.textContent.trim();
              }); 
          // remove opening times 
          var selected = addr.filter(function(el){ return ((el.indexOf('La') == -1))||((el.indexOf('Ma') == -1)) });
          var address = selected.map(function(val){

              // find post codes in 5 digit format
              var re2 = /([\d]{5})/; 
              var str = val;
              var postCode;
              if ((postCode = re2.exec(str)) !== null) {
              if (postCode.index === re2.lastIndex) {
              re2.lastIndex++;
              }
              }

              val = val.replace(postCode[1],'');

              // find main address line like lintukorventi 2
              var re = /^([\wäöå]*[\s]+[\d]*)/i; 
              var str = val;
              var addressLine;

              if ((addressLine = re.exec(str)) !== null) {
              if (addressLine.index === re.lastIndex) {
                re.lastIndex++;
              }
              }

              return [addressLine[1], postCode[1]];
          });
          return address;
        });

      });


      casper.then(function(){
          addressPostcode = addressPostcode.concat(address);
          casper.echo('address is now: '+ address);
          casper.echo('Number of addresses: '+ addressPostcode.length);
          casper.echo('addressPostcode is now: '+ JSON.stringify(addressPostcode));
          });
      i++;
    });
});
casper.then(function askGoogle(){
    casper.then(function(){
          var googleQuery= 'https://maps.googleapis.com/maps/api/geocode/json?address='+addressPostcode[1][0]+'&components=postal_code:'+addressPostcode[1][1]+'|country:FI&key=AIzaSyC9Jl9-s3AfgKTwdWBQV_PCwrCeWrWOvg8';
 
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
        shopLocation.lng
        ]);
      }
      });

});

casper.then(function saveLogBye(){
  casper.echo(shopInfo);
  });

casper.run();
