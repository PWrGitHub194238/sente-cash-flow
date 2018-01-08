// load base Nightwatch API to write tests.
import { NightwatchAPI } from 'nightwatch';

var config = require('../../../nightwatch.conf.js');

// URL address of running node.js web server.
let baseURL = 'http://192.168.99.100:8081/';
let createOrderURL = baseURL + 'createorder/';

/* Tests a functionality of main ./index.html file:
 - is server is running,
 - is main site and all subsites are reachable,
 - is all links to these subsites are valid.

 The ./index.html file is an artificial site serves as web server's entry point.
*/
module.exports = {
    /* Chrcks a initial visibility of all elements that should be not visible on start.

    */
    '#1': function(browser: NightwatchAPI) {
        browser
            .url(createOrderURL)
            .waitForElementVisible('body');

        // Visibility of this element is toggled by #who-order-checkbox-id
        browser.expect.element("#who-order-select-div").to.be.not.visible;
        browser.expect.element("#who-order-select-label-div").to.be.not.visible;

        // Visibility of this element is toggled by #is-team-order-checkbox-id
        browser.expect.element("#is-team-order-select-div").to.be.not.visible;
        browser.expect.element("#is-team-order-select-label-div").to.be.not.visible;

        // Visibility of this element is toggled by #is-locale-order-checkbox-id
        browser.expect.element("#is-locale-order-select-div").to.be.not.visible;
        browser.expect.element("#is-locale-order-select-label-div").to.be.not.visible;

        // Visibility of this element is toggled by #is-from-hist-order-checkbox-id
        browser.expect.element("#is-from-hist-order-select-div").to.be.not.visible;
        browser.expect.element("#is-from-hist-order-select-label-div").to.be.not.visible;
    },

    /*

    */
    '#2': function(browser: NightwatchAPI) {
        browser
            .click("#who-order-checkbox-id");

        // Visibility of this element is toggled by #who-order-checkbox-id
        browser.expect.element("#who-order-select-div").to.be.visible;
        browser.expect.element("#who-order-select-label-div").to.be.visible;
    },

    /*

    */
    '#3': function(browser: NightwatchAPI) {
        browser
            .click("#who-order-checkbox-id");

        // Visibility of this element is toggled by #who-order-checkbox-id
        browser.expect.element("#who-order-select-div").to.be.not.visible;
        browser.expect.element("#who-order-select-label-div").to.be.not.visible;


        // end this test
        browser.end();
    }
};