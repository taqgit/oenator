'use strict';

var express = require('express');
var path = require('path');
var request = require('request');
var connect = require('connect');
var con = new connect();
var bodyParser = require('body-parser');

var func = require('../processtxtwritexml.js');

var txtdata, xmldata;

var fs = require('fs');

var app = express();

var Q = require('q');


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../public')));
app.set('appPath', path.join(__dirname, '../public'));

app.use(bodyParser.json({limit: '99mb'}));
app.use(bodyParser.urlencoded({limit: '99mb', extended: true}));

app.route('/oenator')
    .get(function (req, res) {
        res.sendFile(path.join(__dirname, '../public') + '/index.html');
    });

app.post('/oenator/handleTxtFile', function (req, res) {
//    console.log(' Request ----- > '+JSON.stringify(req.body) );

    /*fs.writeFile('_'+req.body.name, req.body.data.replace('data:text/plain;utf-8,', ''), 'utf-8', function(err) {
     console.log(err);
     });*/
    txtdata = req.body.data.replace('data:text/plain;utf-8,', '');
    res.end('post');

});

app.post('/oenator/handleXmlFile', function (req, res) {
    xmldata = req.body.data.replace('data:application/xml;utf-8,', '');
    func.processtxtwritexml(txtdata, xmldata).then(function () {
        res.status(200).send({done: true});
        res.end('post');
    });

});

app.get('/oenator/downloadOenFile', function (req, res) {
    console.log('File being transferred ');
    var file = path.join(__dirname, '../') + 'oenated.xml'
    console.log('File name on server ' + file);
    res.download(file, function () {
        console.log('Will delete this file ' + file);
        fs.unlink(file, function (err) {
            if (err)  console.log('File can\'t be downloaded ');
            console.log('File deleted ');
            res.end('get');
        });
    });
});


var server = require('http').createServer(app);

var port = process.env.PORT || 3000;
var ip = process.env.IP || 'localhost';


// Start server
server.listen(port, function () {
    console.log('Express server listening on %d, in %s mode', port, 'dev or prod');
});