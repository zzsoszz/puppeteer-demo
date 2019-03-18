const puppeteer = require('puppeteer-core');
const { range } = require('rxjs');
const { map, filter,delay } = require('rxjs/operators');
		 


//https://blog.lovemily.me/a-deep-dive-guide-for-crawling-spa-with-puppeteer-and-troubleshooting/#crawl-a-spa-page
//https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md

(async () => {

  //https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#environment-variables
  //http://omahaproxy.appspot.com/
  //637110
  const browserFetcher = puppeteer.createBrowserFetcher();
  const revisionInfo = await browserFetcher.download('637110');
  const browser = await puppeteer.launch(
  {
	  executablePath: revisionInfo.executablePath,
	  headless:false,
	  args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  //https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/%d/%s.zip
 //  const browser = await puppeteer.launch({
 //    executablePath: './chromium/chrome.exe',
	// headless: false,
	// devtools: true,
	// args: [
	// 	//"-–disable-gpu",
	// 	// "–disable-dev-shm-usage",
	// 	// "–disable-setuid-sandbox",
	// 	// "–no-first-run",
	// 	// "–no-sandbox",
	// 	// "–no-zygote",
	// 	// "–single-process"
	// ]
	// // args: [
 //    //  '--proxy-server=127.0.0.1:1080'
 //    // ]
 //  });


  async function login(url,username,password){
  	  const page = await browser.newPage();
	  page.setDefaultNavigationTimeout(60000);
	  await page.setCacheEnabled(false);
	  console.log('111111',new Date());
	  const timeout = 30000;
	  await page.goto('https://audiobookbay.nl/member/login.php',{
	  	waitUntil:"domcontentloaded"
	  });
	  console.log('22222',new Date());
	  var elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input');
	  await elementHandle.type(username);
	  elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
	  await elementHandle.type(password);
	  await elementHandle.press('Enter');
	  console.log("3333",new Date());
	  await page.waitForNavigation();
	  var cururl=page.url();
	  await page.close();
	  console.log("login redirecturl",cururl);
	  if(cururl=="http://audiobookbay.nl/member/users/"){
	  	   return true;
	  }else{
	  	   return false;
	  }
  }
  
  

  async function getDetailUrls(url){
	  console.log('getDetailUrls.url',url);
  	  const page = await browser.newPage();
	  page.setDefaultNavigationTimeout(60000);
	  await page.setCacheEnabled(false);
	  console.log('getDetailUrls.111111',new Date());
	  await page.goto(url,{
	  	waitUntil:"domcontentloaded"
	  });
	  console.log('getDetailUrls.222222',new Date());
	  var items=await page.evaluate(()=>(
	       Array.from(document.querySelectorAll('#content > div > div > h2 > a'))
	      	.map(item=>item.href)
	  ));
	  await page.close();
	  console.log("getDetailUrls11111111111111111",items);
	  return items;
  }


  async function getMag(url){
  	  const page = await browser.newPage();
	  page.setDefaultNavigationTimeout(30000);
	  await page.setCacheEnabled(false);
	  const timeout = 30000;
	  await page.goto(url,{
	  	waitUntil:"domcontentloaded"
	  });
	  await page.click("#magnetLink");
	  await page.waitFor("#magnetIcon[style='display: inline;']");
	  const maglink = await page.$eval('#magnetIcon', el => el.href);
	  console.log("getMag",);
	  await page.close();
	  return maglink;
  }

  function getList(){
	   return range(1, 1)
	   .pipe(
		  map(x => "http://audiobookbay.nl/page/" + x)
	   );
  }


  async function run(){
	  var sucess=await login('https://audiobookbay.nl/member/login.php',"137573155@qq.com","491172625");
	  if(sucess){
		  getList().subscribe(async x => {
		      getDetailUrls(x).then(urls=>{
					var magItems=urls.map(getMag);
					console.log("magItems",magItems);
			  });
		  });
	  }
  }

  await run();

})();


  	// var maglink= await getMag("http://audiobookbay.nl/audio-books/the-road-to-serfdom/");
  	// console.log(maglink);

  	  //https://github.com/Reactive-Extensions/RxJS/issues/697


  // async function sleep(ms) {
  // 	return new Promise(resolve => setTimeout(resolve, ms))
  // }

	  // var items=await page.evaluate(()=>(
	  //      Array.from(document.querySelectorAll('#magnetIcon'))
	  //     	.map(item=>item.href)
	  // ));
	  // console.log("magnetIcon",items);
	  //console.log("maglink",maglink);
	  // return maglink;
	  //console.log("ffffff",new Date());
	  //return items;
  //getDetailUrls(items).map(item=>getMag(item));
  
  //console.log("maglink",maglink);
  // var items=await page.$$eval('#content > div > div > h2 > a',function(links){
	 //  return links.map(item=>item.href);
  // });
  
  //console.log(items);
  //await page.close();
  //await browser.close();

//return await page.content();
// var items=await page.evaluate(()=>(
//      Array.from(document.querySelectorAll('#content > div > div > h2 > a'))
//     	.map(item=>item.href)
// ));
// return items;

//   function logRequest(interceptedRequest) {
//   		console.log('A request was made:', interceptedRequest.url());
//   }
//   function getData(url) {
// 	  return new Promise(async (resolve, reject) => {
// 	    const page = await browser.newPage();
// 	    page.on('response',(res) => {
// 		 console.log("res",res.ok(),res.url());	      
// 	      // if(res) {
// 	      // 	return resolve("ok");
// 	      // }
// 	      // if(err) {
// 	      // 	return reject(err);
// 	      // }
// 	    });
// 		page.on('request', logRequest);

// 		page.once('load', () => console.log('Page loaded!'));

// 		page.on('console', msg => {
// 		  for (let i = 0; i < msg.args().length; ++i)
// 		    console.log(`${i}: ${msg.args()[i]}`);
// 		});
// 	    page.goto(url);
// 	});
//   };
  
//  getData("http://www.baidu.com").then(function(res){
// 	 console.log("getData.then",res);
//  }).catch(e=>console.log(e));
 
// })();

  // const page = await browser.newPage();
  // await page.goto('https://rutracker.org/forum/index.php');
  // var items=await page.$$eval(".sf_title > a",function(links){
	 //  return links.map(item=>item.href);
  // });
  // console.log(items);
  // for(var i=0;i<items.length;i++){
	  
	 //  var imagelink='https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Ftimgsa.baidu.com%2Ftimg%3Fimage%26quality%3D80%26size%3Db10000_10000%26sec%3D1547360367%26di%3D20e80ed7cb4cf0342a399550c2a878a1%26src%3Dhttp%3A%2F%2Fimg.ishuo.cn%2Fdoc%2F1608%2F830-160R5164642.jpg&thumburl=https%3A%2F%2Fss1.bdstatic.com%2F70cFvXSh_Q1YnxGkpoWK1HF6hhy%2Fit%2Fu%3D1220088451%2C761793735%26fm%3D27%26gp%3D0.jpg'; 
	 //  return fetch(imagelink, {
		// 		method: 'POST'
		//   })
		//  .then(response => response.text());

  // }

  

 // await page.goto('https://rutracker.org/forum/viewforum.php?f=1126');
	  
	  // var plinks=await page.$$eval(".torTopic.bold.tt-text",function(links){
		  // return links.map(item=>item.href);
	  // });
	  // console.log("plinks",plinks);
	  // await page.goto(plinks[0]);
	  // var plinks=await page.$$eval("#pagination a",function(links){
		  // return links.map(item=>item.href);
	  // });
	  
	  // var plinks=await page.$$eval(".magnet-link",function(links){
		  // return links.map(item=>item.href);
	  // });
	  
	  	  // const result = await page.evaluate(async () => {
		  // return fetch(plinks[0], {
			// method: 'POST'
		  // })
		  // .then(response => response.text());
	  // });
	  // console.log("result",result);
	  
  // await page.waitFor('#search-text-guest');
  // await page.type('#search-text-guest',"ddddd");
  // await page.click('#cse-search-btn-top');
  
  
  //await page.goto('https://rutracker.org/forum/index.php');
  //await page.screenshot({path: 'example.png'});
  //await page.type('#login_field',"ddddd");
  //await page.type('#password',"123456");
  //await page.waitFor(2000);
  //await page.waitFor('#search-text-guest');
  //await page.type('#search-text-guest',"new age");
  //await page.evaluate(() => console.log(`url is ${location.href}`));
  //await browser.close();