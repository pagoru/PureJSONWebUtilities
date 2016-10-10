/**
 * Created by pablo on 10/10/16.
 */
const ROOT_PATH = '/Users/pablo/Documents/i-workspace/php/nodeJsonToHtml/';
const http = require('http');
const util = require('util');
const parser = require('./parser.js');
var fs = require('fs');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {

    var web = JSON.parse(fs.readFileSync(ROOT_PATH + 'web.json', 'utf8'));

    var header = web.header['content-type'];
    var content = parser.hton(web.content);
    var cssContent = parser.sson(web.stylesheet);

    res.statusCode = 200;
    if(req.url.includes("css")){
        res.setHeader('Content-Type', "text/css");
        res.write(cssContent);
        res.end();
        return;
    }
    res.setHeader('Content-Type', header);
    res.write(content);
    res.end();

    console.log(req.headers.host + " connected.");
});

server.listen(port, hostname, () => {
    console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});
