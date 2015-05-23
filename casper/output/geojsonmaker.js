'use strict';


var fs = require('fs');
var shopsArr;


function toGeoJson(inputArr){
 var geoObj =
  {
    'type': 'FeatureCollection',
    'features': [
    ]
  };
  for(var i = 0; i < inputArr.length; i++) {
    geoObj.features.push(
    {
        'type': 'Feature',
        'properties': {
          'name': inputArr[i][2]
          },
        'geometry': {
          'type': 'Point',
          'coordinates': [
           inputArr[i][1],
           inputArr[i][0]
          ]
        }
    }
    );
    }
 return geoObj;
  }
function start(){
  function readAllFiles() {
    function contentsAdd(fileContent) {
        shopsArr = shopsArr.concat(JSON.parse(fileContent));
      }
    fs.readdir('./', function(dirReaderr, files){
      if(dirReaderr){
        throw dirReaderr;
        }
        files.filter(function(file){ return file.substr(-4) === '.txt'; })
          .forEach(function(file){ fs.readFile(file, 'utf-8', function(err, contents) {
            if(err){
              throw err;
              }
            contentsAdd(contents);
          }); });
      });
    }
  console.log(readAllFiles());
  if(process.argv[2] == null) {
    throw new Error('No file to process. Usage: node geojsonmaker.js inputfile');
    }
fs.readFile(process.argv[2], 'utf-8', function(err, data){
  if (err) {
    return console.log(err);
    }
    shopsArr = JSON.parse(data);
    fs.writeFile('geojson.json', JSON.stringify(toGeoJson(shopsArr)), function (erro) {
      if (erro) {
        throw erro;
      }
      console.log('\nInfo: GeoJSON saved in geojson.json \n');
    });
  });
}
start();




/*
Format for geJSON
{
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': [
          111.09374999999999,
          49.83798245308484
        ]
      }
    },
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': [
          122.87109375,
          -26.588527147308625
        ]
      }
    }
  ]
}

*/
