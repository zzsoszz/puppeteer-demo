const puppeteer = require('puppeteer-core');
const {range} = require('rxjs');
const {map, filter, delay} = require('rxjs/operators');
const R = require('ramda');
var fs = require('fs');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter);

db.defaults({ posts: []}).write()

// Add a post
var posts=db.get('posts');

	
(async () => {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('637110');
    const browser = await puppeteer.launch(
        {
            executablePath: revisionInfo.executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

    async function login(url, username, password) {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);
        console.log('login.1', new Date());
        const timeout = 30000;
        await page.goto('https://audiobookbay.nl/member/login.php', {
            waitUntil: "domcontentloaded"
        });
        console.log('login.2', new Date());
        var elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input');
        await elementHandle.type(username);
        elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
        await elementHandle.type(password);
        await elementHandle.press('Enter');
        console.log("login.3", new Date());
        await page.waitForNavigation();
        var cururl = page.url();
        await page.close();
        console.log("login redirecturl", cururl);
        if (cururl == "http://audiobookbay.nl/member/users/") {
            return true;
        } else {
            return false;
        }
    }


    async function getDetailUrls(url) {
        console.log('getDetailUrls.1', url);
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        await page.setCacheEnabled(false);
        console.log('getDetailUrls.2', new Date());
        await page.goto(url);
        await page.waitForNavigation();
        console.log('getDetailUrls.3', new Date());
        var items = await page.evaluate(() => {
            var result = Array.from(document.querySelectorAll('#content > div > div > h2 > a')).map(item => item.href + "");
            console.log("result:", result);
            return result;
        });
        await page.close();
        console.log("getDetailUrls.4", items);
        return items;
    }


    async function getMag(url) {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(30000);
        await page.setCacheEnabled(false);
        const timeout = 30000;
        console.log("getMag.1",url);
        await page.goto(url, {
            waitUntil: "domcontentloaded"
        });
        console.log("getMag.2",url);
        await page.click("#magnetLink");
        await page.waitFor("#magnetIcon[style='display: inline;']");
        const maglink = await page.$eval('#magnetIcon', el => el.href);
		
		// page.on('console', msg => {
			// console.log(msg.text())
			// //console.log(msg);
		  // // for (let i = 0; i < msg.args().length; ++i)
			// // console.log(`${i}: ${msg.args()[i]}`);
		// });
		
		page.on('console', (log) => console[log._type](log._text));
		
		var item = await page.evaluate(() => {
			var postTitle=document.querySelector("#content > div.post > div.postTitle").textContent;
			//console.log("postTitle.............",postTitle);
			//var title= document.querySelector("#content > div.post > div.postTitle > h1").textContent;
			try{
				var category = Array.from(document.querySelectorAll("#content > div.post > div.postInfo a[rel='category tag']")).map(item=>item.textContent);
				var language = Array.from(document.querySelectorAll("#content > div.post > div.postInfo span[itemprop='inLanguage']")).map(item=>item.textContent);
				var keywords = Array.from(document.querySelectorAll("#content > div.post > div.postInfo h2")).map(item=>item.textContent);
				var coverUrl = Array.from(document.querySelectorAll("#content > div.post > div.postContent  img[itemprop='image']")).map(item=>item.src);
				var description = document.querySelector("#content > div.post > div.postContent  .desc").outerHTML;
				var author=document.querySelector("#content > div.post > div.postContent .author").textContent;
				var narrator=document.querySelector("#content > div.post > div.postContent .narrator").textContent;
				var format=document.querySelector("#content > div.post > div.postContent .format").textContent;
				var bitrate=document.querySelector("#content > div.post > div.postContent .bitrate").textContent;
				var is_abridged=document.querySelector("#content > div.post > div.postContent .is_abridged").textContent;
				return {
					title: postTitle,
					category:category,
					language:language,
					keywords:keywords,
					writeBy:author,
					readBy:narrator,
					format:format,
					bitrate:bitrate,
					is_abridged:is_abridged,
					coverUrl:coverUrl,
					descriptionHTML:description
				};
			}catch(e)
			{
				console.log(e);
			}
			return {};
        });
        await page.close();
        return {...item,url:url};
    }



    function writeLine(item){
        return new Promise((resolve,reject)=>{
			try {
				posts.push(item).write();
				resolve(true);
			} catch (err){
				reject(err)
			}
            // fs.appendFile('./mag.txt',line+"\n",'utf8',function(err){
                // if(err)  {
                    // console.log(err);
                    // reject(err)
                // } else {
                    // resolve(true);
                // }
            // });
        });
    }


    async function dealPage(page){
        var urls=await getDetailUrls(page);
        console.log("urls",urls);
        var magItemsPromises = urls.map(getMag);
        var magItems=await Promise.all(magItemsPromises);
        console.log("magItems",magItems);
        var magItemsSavedStatusPromies=magItems.map(item=>writeLine(item));
        var magItemsSavedStatus=await Promise.all(magItemsSavedStatusPromies);
        console.log("magItemsSavedStatus",magItemsSavedStatus);
        return magItemsSavedStatus;
    }

    async function run() {
        var sucess = await login('https://audiobookbay.nl/member/login.php', "137573155@qq.com", "491172625");
        if (sucess) {
            var pages=R.range(100,101)
                .map(x => "http://audiobookbay.nl/page/" + x);
            console.log("pages",pages);
            for(var i=0;i<pages.length;i++){
                await dealPage(pages[i]);
            }
        }
    }

    await run();

})();


//var [first,...description] =Array.from(document.querySelectorAll("#content > div.post > div.postContent > div.desc > p"));
			