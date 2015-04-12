var baseUrl = 'http://www.bmstores.co.uk/stores?location=';
var cities = ["St. Albans, Hertfordshire ","Cambridge, Cambridgeshire","Chelmsford, Essex","Colchester, Essex","Enfield, Middlesex","Ilford and Barking, Essex","Ipswich, Suffolk","Luton, Bedfordshire","Milton Keynes, Buckinghamshire","Norwich, Norfolk","Peterborough, Cambridgeshire","Romford, Essex","Stevenage, Hertfordshire","Southend-on-Sea, Essex","Watford, Hertfordshire","Birmingham, West Midlands","Coventry, West Midlands","Derby, Derbyshire","Dudley, West Midlands","Leicester, Leicestershire","Nottingham, Nottinghamshire","Northampton, Northamptonshire","Stoke-on-Trent, Staffordshire","Walsall, West Midlands","Wolverhampton, West Midlands","Bradford, West Yorkshire","Durham, County Durham","Darlington, North Yorkshire","Doncaster, South Yorkshire","Huddersfield, West Yorkshire","Harrogate, North Yorkshire","Hull, North Humberside","Halifax, West Yorkshire","Lincoln, Lincolnshire","Leeds, West Yorkshire","Newcastle, Tyne and Wear","Sheffield, South Yorkshire","Sunderland, Tyne and Wear","Teesside, Cleveland","Wakefield, West Yorkshire","York, North Yorkshire","Blackburn, Lancashire","Blackpool, Lancashire","Carlisle, Cumbria","Crewe, Cheshire","Blackpool, Lancashire","Liverpool, Merseyside","Lancaster, Lancashire","Manchester, Lancashire","Oldham, Lancashire","Preston, Lancashire","Stockport, Cheshire","Shrewsbury, Shropshire","Telford, Shropshire","Warrington, Cheshire","Wigan, Lancashire","Chester, Cheshire","East London ","City of London","North London","North West London","South East London","South West London","West End, London","West Central London","Guildford, Surrey","Harrow, Middlesex","Hemel Hempstead, Hertfordshire","Oxford, Oxfordshire","Portsmouth, Hampshire","Reading, Berkshire","Slough, Buckinghamshire","Swindon, Wiltshire","Southampton, Hampshire","Salisbury, Wiltshire","Southall and Uxbridge, Middlesex","Brighton, East Sussex","Bromley, Kent","Croydon, Surrey","Canterbury, Kent","Dartford, Kent","Kingston-upon-Thames, Surrey","Medway, Kent","Redhill, Surrey","Sutton, Surrey","Tonbridge, Kent","Twickenham, Middlesex","Bath, Avon","Bournemouth, Dorset","Bristol, Avon","Dorchester, Dorset","Exeter, Devon","Gloucester, Gloucestershire","Hereford, Herefordshire","Plymouth, Devon","Taunton, Somerset","Torquay, Devon","Truro, Cornwall","Worcester, Worcestershire","Cardiff, South Glamorgan","Llandrindod Wells, Powys","Llandudno, Clwyd","Newport, Gwent","Swansea, West Glamorgan","Belfast","Aberdeen","Dundee, Angus","Dumfries and Galloway","Edinburgh, Midlothian","Falkirk, Stirlingshire","Glasgow, Lanarkshire","Isle Of Lewis, Outer Hebrides","Inverness","Kilmarnock and Ayr, Ayrshire","Kirkwall, Caithness","Kirkcaldy, Fife","Motherwell, Lanarkshire","Paisley, Renfrewshire","Perth, Perthshire","Galashiels, Selkirkshire","Shetland Islands","Guernsey, Channel Islands","Jersey, Channel Islands","Isle Of Man"];
var i = -1,
    shopInfo = [],
    shopNames = [],
    savePath, 
    fname = 'bandmUK.txt';
    shopNamesCollection = [],
    finalList=[];
var fs = require('fs');
var casper = require('casper').create({
    /*verbose: true,
    logLevel: 'debug',*/
    pageSettings: {
        loadImages:  false,
        loadPlugins: false
        }
});


function getShopNames() {
    var shopNames = document.querySelectorAll('th');

    return Array.prototype.map.call(shopNames, function(e) {

        // return all the names
        return e.textContent.replace(/\n/g,'');
    });
}


casper.start(baseUrl);

casper.then(function() {
    casper.each(cities, function() {
        i++;
        casper.thenOpen((baseUrl + cities[i]), function() {
            shopInfo[i] = casper.evaluate(function() {
                return aItems;
            });
            shopNamesCollection[i] = casper.evaluate(getShopNames);  
           if(shopInfo[i]) {
           for( var j = 0; j < shopInfo[i].length; j++) {
               finalList.push('['+shopInfo[i][j]['lat'],shopInfo[i][j]['lng'], JSON.stringify(shopNamesCollection[i][j]) + ']');
               
           }
            }
        });
    });
});

/*
casper.then(function() {
*/
casper.then(function() {
    savePath = fs.pathJoin(fs.workingDirectory, 'output',fname);
    fs.write(savePath, finalList, 'w');
});

casper.run(function() {
    //casper.echo(finalList);
    }); 
