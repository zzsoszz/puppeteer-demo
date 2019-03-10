const puppeteer = require('puppeteer-core');

//https://blog.lovemily.me/a-deep-dive-guide-for-crawling-spa-with-puppeteer-and-troubleshooting/#crawl-a-spa-page
//https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md

(async () => {
	

  const browser = await puppeteer.launch({
    executablePath: './chromium/chrome.exe',
	headless: false,
	devtools: true,
	args: [
		//"-–disable-gpu",
		// "–disable-dev-shm-usage",
		// "–disable-setuid-sandbox",
		// "–no-first-run",
		// "–no-sandbox",
		// "–no-zygote",
		// "–single-process"
	]
	// args: [
    //  '--proxy-server=127.0.0.1:1080'
    // ]
  });


  async function login(url,username,password){
  	  const page = await browser.newPage();
	  page.setDefaultNavigationTimeout(30000);
	  await page.setCacheEnabled(false);
	  console.log('111111',new Date());
	  const timeout = 30000;
	  await page.goto('https://audiobookbay.nl/member/login.php',{
	  	waitUntil:"domcontentloaded"
	  });
	  var elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input');
	  await elementHandle.type(username);
	  elementHandle = await page.$('#content > div > div.entry > table > tbody > tr > td.login-right > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
	  await elementHandle.type(password);
	  await elementHandle.press('Enter');
	  console.log("22222",new Date());
	  await page.waitForNavigation();
	  console.log("url",page.url());
	  if(page.url()=="http://audiobookbay.nl/member/users/"){
	  	   return true;
	  }else{
	  	   return false;
	  }
  }

  async function getDetailUrls(){
  	  const page = await browser.newPage();
	  page.setDefaultNavigationTimeout(30000);
	  await page.setCacheEnabled(false);
	  console.log('111111',new Date());
	  const timeout = 30000;
	  await page.goto('http://audiobookbay.nl/page/9000/',{
	  	waitUntil:"domcontentloaded"
	  });
	  console.log("ffffff",new Date());
	  var items=await page.evaluate(()=>(
	       Array.from(document.querySelectorAll('#content > div > div > h2 > a'))
	      	.map(item=>item.href)
	  ));
	  return items;
  }


  async function getMag(url){
  	  const page = await browser.newPage();
	  page.setDefaultNavigationTimeout(30000);
	  await page.setCacheEnabled(false);
	  console.log('111111',new Date());
	  const timeout = 30000;
	  await page.goto(url,{
	  	waitUntil:"domcontentloaded"
	  });
	  console.log('22222',new Date());
	  await page.click("#magnetLink");
	  await page.waitFor("#magnetIcon[style='display: inline;']");
	  var items=await page.evaluate(()=>(
	       Array.from(document.querySelectorAll('#magnetIcon'))
	      	.map(item=>item.href)
	  ));
	  console.log("magnetIcon",items);
	  return items;
	  // var maglink=await page.$$eval("#magnetIcon",(link)=>{
	  // 		console.log("link",link);
	  //     	return link.href
	  // });
	  // return maglink;
	  //console.log("ffffff",new Date());
	  //return items;
  }
  
  
  var sucess=await login('https://audiobookbay.nl/member/login.php',"137573155@qq.com","491172625");
  if(sucess){
  	var maglink= await getMag("http://audiobookbay.nl/audio-books/the-road-to-serfdom/");
  	console.log(maglink);
  }
  

  //getDetailUrls(items).map(item=>getMag(item));
  
  //console.log("maglink",maglink);
  // var items=await page.$$eval('#content > div > div > h2 > a',function(links){
	 //  return links.map(item=>item.href);
  // });
  
  //console.log(items);
  //await page.close();
  //await browser.close();

})();



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