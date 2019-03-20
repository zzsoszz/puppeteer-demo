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
db.defaults({ posts: []}).write()

// Add a post
var posts=db.get('posts');


console.log("/images/I/51Lvqga-1zL.SX316.SY316.jpg".replace(/\//gi,path.sep));



function mkdirp(filepath) {
    var dirname = path.dirname(filepath);
    if (!fs.existsSync(dirname)) {
        mkdirp(dirname);
    }
    fs.mkdirSync(filepath);
}

async function downloadImage(imageUrl) {
  const myURL = url.parse(imageUrl);
  var fullPath=__dirname+(myURL.path.replace(/\//gi,path.sep));
  const savePath = path.dirname(fullPath);
  const fileName = path.basename(fullPath);
  console.log("savePath",savePath);
  console.log("fileName",fileName);
  fs.mkdirSync(savePath,{
	  recursive:true
  });
  console.log("savePath2",savePath);
  const writer = Fs.createWriteStream(fullPath)
  const response = await Axios({
    url:imageUrl,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}


downloadImage("https://images-na.ssl-images-amazon.com/images/I/51Lvqga-1zL.SX316.SY316.jpg").then(function(){
	console.log("finish");
});




// (async () => {
    // const browserFetcher = puppeteer.createBrowserFetcher();
    // const revisionInfo = await browserFetcher.download('637110');
    // const browser = await puppeteer.launch(
        // {
            // executablePath: revisionInfo.executablePath,
            // headless: true,
            // args: ['--no-sandbox', '--disable-setuid-sandbox']
        // });

    // async function login(url, username, password) {
        // const page = await browser.newPage();
        // page.setDefaultNavigationTimeout(60000);
        // await page.setCacheEnabled(false);
        // console.log('login.1', new Date());
        // const timeout = 30000;
        // await page.goto('https://audiobookbay.nl/member/login.php', {
            // waitUntil: "domcontentloaded"
        // });
        // console.log('login.2', new Date());
        // var elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input');
        // await elementHandle.type(username);
        // elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
        // await elementHandle.type(password);
        // await elementHandle.press('Enter');
        // console.log("login.3", new Date());
        // await page.waitForNavigation();
        // var cururl = page.url();
        // await page.close();
        // console.log("login redirecturl", cururl);
        // if (cururl == "http://audiobookbay.nl/member/users/") {
            // return true;
        // } else {
            // return false;
        // }
    // }

    // async function getDetailUrls(url) {
        // console.log('getDetailUrls.1', url);
        // const page = await browser.newPage();
        // page.setDefaultNavigationTimeout(60000);
        // await page.setCacheEnabled(false);
        // console.log('getDetailUrls.2', new Date());
        // await page.goto(url);
        // await page.waitForNavigation();
        // console.log('getDetailUrls.3', new Date());
        // var items = await page.evaluate(() => {
            // var result = Array.from(document.querySelectorAll('#content > div > div > h2 > a')).map(item => item.href + "");
            // console.log("result:", result);
            // return result;
        // });
        // await page.close();
        // console.log("getDetailUrls.4", items);
        // return items;
    // }

    // // async function getDetailUrls(url) {
    // //     console.log('getDetailUrls.1', url);
    // //     const page = await browser.newPage();
    // //     page.setDefaultNavigationTimeout(60000);
    // //     await page.setCacheEnabled(false);
    // //     console.log('getDetailUrls.2', new Date());
    // //     await page.goto(url);
    // //     await page.waitForNavigation();
    // //     console.log('getDetailUrls.3', new Date());
    // //     var items = await page.evaluate(() => {
    // //         var result = Array.from(document.querySelectorAll('#content > div > div > h2 > a')).map(item => item.href + "");
    // //         console.log("result:", result);
    // //         return result;
    // //     });
    // //     let $results = await page.$$("#content .post");
    // //     await page.close();
    // //     console.log("getDetailUrls.4", items);
    // //     return items;
    // // }



    // async function getMag(url,listPageUrl) {
        // const page = await browser.newPage();
        // page.setDefaultNavigationTimeout(30000);
        // await page.setCacheEnabled(false);
        // const timeout = 30000;
        // console.log("getMag.1",url);
        // await page.goto(url
            // , {
                // waitUntil: "networkidle0"
            // }
        // );
        // //await page.waitForFunction('document.querySelector("#content > div.post > div.postContent  img[itemprop=\'image\']").src != "http://audiobookbay.nl/images/default_cover.jpg"');
        // console.log("getMag.2",url);
        // await page.click("#magnetLink");
        // await page.waitFor("#magnetIcon[style='display: inline;']");
        // const maglink = await page.$eval('#magnetIcon', el => el.href);
        // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        // var item = await page.evaluate(() => {
            // var postTitle=document.querySelector("#content > div.post > div.postTitle").textContent;
            // //console.log("postTitle.............",postTitle);
            // //var title= document.querySelector("#content > div.post > div.postTitle > h1").textContent;
            // try{
                // var category = Array.from(document.querySelectorAll("#content > div.post > div.postInfo a[rel='category tag']")).map(item=>item.textContent);
                // var language = Array.from(document.querySelectorAll("#content > div.post > div.postInfo span[itemprop='inLanguage']")).map(item=>item.textContent);
                // var keywords = Array.from(document.querySelectorAll("#content > div.post > div.postInfo h2")).map(item=>item.textContent);
                // var coverUrl = document.querySelector("#content > div.post > div.postContent  img[itemprop='image']").src;
                // var descriptionEle = document.querySelector("#content > div.post > div.postContent  .desc");
                // var description =descriptionEle?descriptionEle.outerHTML:"";
                // var authorEle=document.querySelector("#content > div.post > div.postContent .author");
                // var author=authorEle?authorEle.textContent:"";
                // var narratorEle=document.querySelector("#content > div.post > div.postContent .narrator");
                // var narrator=narratorEle?narratorEle.textContent:"";
                // var formatEle=document.querySelector("#content > div.post > div.postContent .format");
                // var format= formatEle?formatEle.textContent:"";
                // var bitrateEle=document.querySelector("#content > div.post > div.postContent .bitrate");
                // var bitrate=bitrateEle?bitrateEle.textContent:"";
                // var is_abridgedEle=document.querySelector("#content > div.post > div.postContent .is_abridged");
                // var is_abridged=is_abridgedEle?is_abridgedEle.textContent:"";
                // var fileSizeEle=document.querySelector("#content > div.post > div.postContent > table > tbody > tr:nth-last-child(11) td:nth-child(2)");
                // var fileSize=fileSizeEle?(fileSizeEle.childNodes[0]?fileSizeEle.childNodes[0].textContent:""):"";
                // var fileSizeUnit=fileSizeEle?(fileSizeEle.childNodes[1]?fileSizeEle.childNodes[1].textContent:""):"";
                // return {
                    // title: postTitle,
                    // category:category,
                    // language:language,
                    // keywords:keywords,
                    // writeBy:author,
                    // readBy:narrator,
                    // format:format,
                    // bitrate:bitrate,
                    // is_abridged:is_abridged,
                    // coverUrl:coverUrl,
                    // descriptionHTML:description,
                    // fileSize:fileSize,
                    // fileSizeUnit:fileSizeUnit
                // };
            // }catch(e)
            // {
                // console.error(e.stack);
                // return {stack:e.stack};
            // }
            // return {};
        // });
        // await page.close();
        // return {...item,maglink:maglink,detailUrl:url,listUrl:listPageUrl};
    // }

    // function writeLine(item){
        // return new Promise((resolve,reject)=>{
            // try {
                // posts.push(item).write();
                // resolve(true);
            // } catch (err){
                // reject(err)
            // }
        // });
    // }

    // async function dealPage(page){
        // var urls=await getDetailUrls(page);
        // console.log("urls",urls);
        // var magItemsPromises = urls.map(url=>getMag(url,page));
        // var magItems=await Promise.all(magItemsPromises);
        // console.log("magItems",magItems);
        // var magItemsSavedStatusPromies=magItems.map(item=>writeLine(item));
        // var magItemsSavedStatus=await Promise.all(magItemsSavedStatusPromies);
        // console.log("magItemsSavedStatus",magItemsSavedStatus);
        // return magItemsSavedStatus;
    // }

    // async function run() {
        // var sucess = await login('https://audiobookbay.nl/member/login.php', "137573155@qq.com", "491172625");
        // if (sucess) {
            // var pages=R.range(2,1000)
                // .map(x => "http://audiobookbay.nl/page/" + x);
            // console.log("pages",pages);
            // for(var i=0;i<pages.length;i++){
                // try{
                    // await dealPage(pages[i]);
                // }catch (e) {
                    // console.error(e);
                // }
            // }
        // }
        // await  browser .close();
        // console.log("finished all task!");
    // }
    // await run();

// })();


// // fs.appendFile('./mag.txt',line+"\n",'utf8',function(err){
// // if(err)  {
// // console.log(err);
// // reject(err)
// // } else {
// // resolve(true);
// // }
// // });