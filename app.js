const puppeteer = require('puppeteer');

(async () => {
	
  const browser = await puppeteer.launch({
	  headless: false,
	  args: [
	   '--proxy-server=127.0.0.1:1080'
	  ]
  });
  const page = await browser.newPage();

  // await page.goto('https://github.com/login');
  // await page.type('#login_field',"ddddd");
  // await page.type('#password',"123456");
  // await page.click('[name="commit"]');
  
  await page.goto('https://rutracker.org/forum/index.php');
  var items=await page.$$eval(".sf_title > a",function(links){
	  return links.map(item=>item.href);
  });
  console.log(items);
  for(var i=0;i<items.length;i++){
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
	  
	  
	  var imagelink='https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Ftimgsa.baidu.com%2Ftimg%3Fimage%26quality%3D80%26size%3Db10000_10000%26sec%3D1547360367%26di%3D20e80ed7cb4cf0342a399550c2a878a1%26src%3Dhttp%3A%2F%2Fimg.ishuo.cn%2Fdoc%2F1608%2F830-160R5164642.jpg&thumburl=https%3A%2F%2Fss1.bdstatic.com%2F70cFvXSh_Q1YnxGkpoWK1HF6hhy%2Fit%2Fu%3D1220088451%2C761793735%26fm%3D27%26gp%3D0.jpg'; 
	  return fetch(imagelink, {
				method: 'POST'
		  })
		 .then(response => response.text());
		
	  //return;
  }
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
})();