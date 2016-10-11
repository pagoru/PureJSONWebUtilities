/**
 * Created by pablo on 10/10/16.
 */
const ROOT_PATH = '/Users/pablo/Documents/i-workspace/php/nodeJsonToHtml/';
const http = require('http');
const parser = require('./parser.js');
var fs = require('fs');

var web = JSON.parse(fs.readFileSync(ROOT_PATH + 'web.json', 'utf8'));

var header = web.header['content-type'];
var content = parser.hton(web.hton);
var cssContent = parser.sson(web.sson);

console.log(header);
console.log(content);
console.log(cssContent);

// console.log(web.hton.variables);