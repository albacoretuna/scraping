/* 
 * to scrape thorntons uk! 
 */


var i = 0,
    shopInfo = [],
    shopsOnPage = [],
    abortedPrefixes = [];

var startExecutionTime = new Date().getTime();

var casper = require('casper').create({
    verbose: true,
    logLevel: 'info',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
var baseUrl = 'http://www.thorntons.co.uk/custserv/locate_store.cmd';


casper.start();

casper.then(function() {
    
    
    });

