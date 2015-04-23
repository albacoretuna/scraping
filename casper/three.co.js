/* 
 * to scrape ee.co.uk! 
 */


var baseUrl = "http://www.three.co.uk/storelocator/locate?lat=50.5073509&lng=-0.12775829999998223&radius=100";


var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
    });
