/* 
 * to scrape restamax fi (ravintola.fi)! 
   - First read all the names and links from page, put it in nameAndLinks.  
   - Then open the first link, read the google query from the page
   - send query to google, read back the lat and lng
   - push current, lat, lang, and name into shopInfo
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    linksAndNames = [],
    addressQuery,
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
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
casper.options.waitTimeout = 20000;
var baseUrl= 'http://www.ravintola.fi/';

casper.start(baseUrl);
casper.then(function grabLinks(){
    linksAndNames = casper.evaluate(function evaluateGrabLinks(){
        var anchors = document.querySelectorAll('.off-canvas-list-cities > div > ul > li > a ');

        var linksAndNames = Array.prototype.map.call(anchors, function(val){
            return [val.getAttribute('href'), val.textContent];
            
            });
        return linksAndNames;
        });
    });

casper.then(function openCurrLink() {
    casper.open(linksAndNames[i][0]);
    });
casper.then(function readGoogleQuery(){
   casper.waitForSelector('iframe', function(){ 
   
   
       
    addressQuery = casper.evaluate(function(){
    
    var mapFrame = document.querySelectorAll('iframe');

    var srcs = Array.prototype.map.call(mapFrame, function(val){
      return val.getAttribute('src');
    });
    var mapUrl = Array.prototype.filter.call(srcs, function(val){
        return val.indexOf('google.com') > 0;
        });
    mapUrl = mapUrl[0];


    var re = /q=(.+)$/; 
    var str = mapUrl;
    var m;
     
    if ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
    }



    return m[1];
   
   
   
   });
    });
    
});

casper.then(function(){
   casper.echo("1. adddressQuery is: " + addressQuery);
    });
casper.then(function askGoogle(){
    casper.then(function(){
    var googleQuery = 'https://maps.googleapis.com/maps/api/geocode/json?address='+addressQuery+'&key=AIzaSyC9Jl9-s3AfgKTwdWBQV_PCwrCeWrWOvg8';
    casper.open(googleQuery);
    
    });
    casper.then(function(){
    var googleResponse = casper.getPageContent();
    var jsonStr = JSON.parse(googleResponse);
    var shopLocation = jsonStr.results[0].geometry.location;
    casper.echo('2. shopLocationLat is: '+shopLocation.lat);
    shopInfo.push(shopLocation.lat, 
                  shopLocation.lng,
                  linksAndNames[i][1]);
    });
    });
casper.then(function saveLogBye(){
    casper.echo('3. shopInfo is: ' +JSON.stringify(shopInfo));
});



casper.run();
