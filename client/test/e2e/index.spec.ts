// load base Nightwatch API to write tests.
import { NightwatchAPI } from 'nightwatch';

var config = require('../../nightwatch.conf.js');

// URL address of running node.js web server.
let baseURL = 'http://192.168.99.100:8081/';

/* Tests a functionality of main ./index.html file:
 - is server is running,
 - is main site and all subsites are reachable,
 - is all links to these subsites are valid.

 The ./index.html file is an artificial site serves as web server's entry point.
*/
module.exports = {
  'Checking connection to server': function(browser: NightwatchAPI) {
    browser
      .url(baseURL)
      .waitForElementVisible('body');

    // expect element <body> to be present in 1000ms
    browser.expect.element('body').to.be.present.before(1000);

    // make a screenshoot before leaving this site.
    browser.saveScreenshot(config.imgpath(browser) + 'index.jpg');
  },

  'Navigating to .\\createorder\\index.html site': function(browser: NightwatchAPI) {
    browser
      .url(baseURL)
      .waitForElementVisible('body')
      .click("body > a")
      .waitForElementVisible("#order-accept > button");

    // expect element that is unique for this site to be present in 1000ms
    browser.expect.element('#order-accept > button').to.be.present.before(1000);

    // make a screenshoot before leaving this site.
    browser.saveScreenshot(config.imgpath(browser) + 'createorder.jpg');

    // end this test
    browser.end();
  }
};