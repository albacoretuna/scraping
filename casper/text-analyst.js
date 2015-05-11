var text = "KOKKOLA Chydenia Rantakatu 2 67100 Kokkola Puh. 075 7532 415Aukioloajat:maanantai-perjantai: 10-18 lauantai: 10-15 sunnuntai: suljettu KOUVOLA Kauppakeskus Veturi Tervasharjunkatu 1 45720 Kuusankoski Puh. 075 7532 427Aukioloajat:maanantai-perjantai: 10-20 lauantai: 10-18 sunnuntai: 12-18KUOPIO Kauppakeskus Matkus  Matkuksentie 6070800 Kuopio Puh. 075 7532 447Aukioloajat:maanantai-perjantai: 10-21 lauantai: 9-18 sunnuntai: 12-18LAHTIKauppakeskus Trio Aleksanterinkatu 18 15140 Lahti Puh. 075 7532 428Aukioloajat:maanantai-perjantai: 10-20 lauantai: 9-18sunnuntai: suljettu LAPPEENRANTA Kauppakeskus IsoKristiina Uusi sijainti Lappeenkatu 9 53100 Lappeenranta Puh. 050-555 8556Aukioloajat:maanantai-perjantai: 10-19 lauantai: 10-18sunnuntai: 12-16LEMPÄÄLÄ Ideapark Ideaparkinkatu 4 37570 Lempäälä Puh. 075 7532 437Aukioloajat:maanantai-perjantai: 10-20 lauantai: 10-18sunnuntai: 12-18 MIKKELI Kauppakeskus Akseli Hallituskatu 7-9 50100 Mikkeli Puh. 015-360 003Aukioloajat:maanantai-perjantai: 10-18 lauantai: 10-16 sunnuntai: suljettu OULU Kirkkokatu 10 90100 Oulu Puh. 075 7532 429Aukioloajat:maanantai-perjantai: 10-19 lauantai: 10-17 sunnuntai: suljettu PORI  Kauppakeskus Puuvilla Uusi sijaintiPohjoisranta 1128100 PoriPuh. 075 7532 430Aukioloajat:maanantai-perjantai: 10-20lauantai: 10-18sunnuntai: 12-18 RAISIO Kauppakeskus Mylly 21280 Raisio Puh. 075 7532 433Aukioloajat:maanantai-perjantai: 10-21 lauantai: 9-18sunnuntai: 12-18";


function removeTel(text){
  var noTel = text.replace(/(Puh.[\s]?[\d-\s]*)/ig,''); 
  return noTel;  
  }

function getPostCodes(text) {
  var re = /([\d]{4}[0])[\s]/img; 
  var matches = text.match(re);
  for (var i = 0; i < matches.length; i++){
    text = text.replace(matches[i],'');
    }
  return [matches, text];
  }

var textWoPhone = removeTel(text);
var postCodes = getPostCodes(textWoPhone);

console.log(postCodes);
