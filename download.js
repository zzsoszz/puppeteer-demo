const puppeteer = require('puppeteer-core');
const {range} = require('rxjs');
const {map, filter, delay} = require('rxjs/operators');
const R = require('ramda');
var fs = require('fs');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter);
const url = require('url');
const path = require('path');
const Fs = require('fs');
const Axios  = require('axios');

const Aria2 = require("aria2");
const aria2 = new Aria2({
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
});



(async () => {
	
	
const magnet = "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E&dn=bbb_sunflower_1080p_30fps_normal.mp4&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4";
const [guid] = await aria2.call("addUri", [magnet]);
console.log("guid",guid);


})();





