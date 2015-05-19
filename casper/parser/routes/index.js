"use strict"
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
  res.render("index", { title: "Express" });
});
module.exports = router;
