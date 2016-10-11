/**
 * Created by pablo on 10/10/16.
 */
const fs = require('fs');
const ROOT_PATH = fs.realpathSync('.') + '/';
const http = require('http');
const parser = require('./parser.js');

var web = JSON.parse(fs.readFileSync(ROOT_PATH + 'web.json', 'utf8'));

var content = parser.parse(web);

console.log(content);

// console.log(web.hton.variables);