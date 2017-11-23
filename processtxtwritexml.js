var fs = require('fs');
var xmldom = require('xmldom').DOMParser;

var jsonObject = {};
var regex = /^(N[0-9]{8})\s\sDB UPDATED.*.\nReplaced TOEN ([0-9]{9}) with OEN/;
var jsonfile = 'spriden_oen.json';

var Q = require('q');

function processtextfile(txtdata, xmldata) {
    var deferred = Q.defer();
    var text = txtdata.toString(),
        lines = text.split(/\n\s*\n/),
        results = {}

    console.log('Number of lines read - ' + lines.length);
    lines.forEach(function (line) {
        results = regex.exec(line); //#2
        if (results && results.length > 0) {
            jsonObject[results[1]] = results[2];
        }
    });

    deferred.resolve(xmldata);

    return deferred.promise;
}

function readupdatexml(xmldata) {
    var deferred = Q.defer();
    var start = new Date().getTime();

    var doc = new xmldom().parseFromString(xmldata, 'text/xml');
    findoen(doc);

    var XMLSerializer = require('xmldom').XMLSerializer;
    var serializer = new XMLSerializer();
    serializer.serializeToString(doc);

    deferred.resolve(doc);
    return deferred.promise;
}

function writexmlfile(doc) {
    var deferred = Q.defer();
    fs.writeFile('oenated.xml', doc, 'utf8', function (err) {
        if (err) throw err;
        console.log('New XML created successfully.');

        deferred.resolve();

    });
    return deferred.promise;


}

function findoen(doc) {
    var spridens = doc.getElementsByTagName('STUDENT_ID');
    for (var i in spridens) {
        var thisspriden = spridens[i];
        if (thisspriden.firstChild) {
            var thisspridenvalue = thisspriden.firstChild.nodeValue;
            if (jsonObject[thisspridenvalue]) {
                thisspriden.parentNode.getElementsByTagName('STUDENT_OEN')[0].textContent = jsonObject[thisspridenvalue];
            }
        }
    }
}

exports.processtxtwritexml = function (txtdata, xmldata) {
    return processtextfile(txtdata, xmldata).then(readupdatexml).then(writexmlfile);

}