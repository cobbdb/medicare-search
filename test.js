const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { keyboard } = page;

  console.log('Navigating to medicare.gov ...');
  await page.goto('https://www.medicare.gov/find-a-plan/questions/home.aspx');

  console.log('\t... closing signin modal ...');
  await page.waitForSelector('.prefix-overlay-close', { timeout: 2000 });
  await page.click('.prefix-overlay-close');

  console.log('\t... basic search for zip 89129 ...');
  await page.click('input[id$=generalSearchZipCodeBox]');
  await keyboard.type('89129');
  await page.click('input[id$=GeneralSearchFindButton]');

  await page.waitForNavigation();

  console.log('\t... form step 1: skipping drugs ...');
  await page.click('input[id$=rbDontNO]');
  await page.click('input[id$=rbUnknownSubsidy]');
  await page.click('input[id$=DrugsNotNowButton]');
  await page.click('input[id$=btnContinuePlanResults]');

  await page.waitForNavigation();

  console.log('\t... form step 4: selecting PDP ...');
  await page.click('input[id$=PDPTypeCheckbox]');
  await page.click('input[id$=ContinuePlanButton]');

  await page.waitForNavigation();

  const planName = await page.$eval('h3', el => el.innerText);
  console.log(`\t... found plan ${planName} ...`);

  console.log('\t... saving screenshot ...');
  await page.screenshot({ path: 'basic-plan-search-results.png' });

  console.log('\t... DONE');
  await browser.close();
})();
