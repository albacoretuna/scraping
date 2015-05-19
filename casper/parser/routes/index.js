"use strict";

var express = require("express");
var router = express.Router();
var http = require("http");
var https = require("https");
var htmlparser = require("htmlparser2");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// the fetch page
router.get("/fetch", function(req, res, next) {
  if(req.query){
    if(req.query.url === undefined){
        res.send({messsage: "url cannot be undefined"});
      }
      var urlPrefix = req.query.url.match(/.*?:\/\//g);
      req.query.url = req.query.url.replace(/.*?:\/\//g,"");
      var options = {
        hostname: req.query.url
      };
      
      
    }
});
module.exports = router;
