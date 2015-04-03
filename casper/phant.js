var webPage = require('webpage');
var page = webPage.create();

page.open('http://www.aleksi13.fi/myymalat/', function(status) {

  var title = page.evaluate(function() {
    return A13Shops;
    
  });

  console.log(title);
  phantom.exit();

});
