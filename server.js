var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {

    // web scraping in here! 
    url = 'http://www.aleksi13.fi/myymalat';

    request(url, function(error, respone, html) {
        if(!error) {
            var $ = cheerio.load(html);
            var title, release, rating;
            var json = { title: "", release : "", rating: ""};
           

            $('.header').filter(function(){
                var data = $(this);
                title = data.children().first().text();
                json.title = title;
            });
        }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

        console.log('File created chk proj dir');
    });
   // return A13Shops;
    res.send('Check your console!');
    });
});
app.listen('8081')

console.log('magic on 8081');

exports = module.exports = app;

