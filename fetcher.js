const Nightmare = require('nightmare');
const DrupalAPI = require('drupal-org-api');
var config = require('./pass.json');

const nightmare = Nightmare({ show: false });
const drupalapi = new DrupalAPI();

/**
 * Currently not using this file because the drupalapi.node results will be cached so you can't run the fetcher more than once.
 */
// Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
Promise.all([0]
  .map(index => drupalapi.node({
      field_project: 3060,
      type: 'project_issue',
      field_issue_component: 'outside_in.module',
      limit: 10,
      page: index,
    })
      .then(results => results.list.map(result => `https://www.drupal.org/node/${result.nid}`))
  ))
  .then(responsePages => Array.prototype.concat(...responsePages.map(page => page)))
  .then((urls) => {
    /*urls = [urls.pop()]; */
    nightmare
      .goto('https://www.drupal.org/user/login')
      .type('form#user-login #edit-name', config.username)
      .type('form#user-login #edit-pass', config.pass)
      .click('form#user-login [type=submit]')
      .wait('#user-user-full-group-profile-main');
    urls.reduce((accumulator, url) => (
      accumulator.then(results => (
        nightmare
          .goto(url)
          .wait('body')
          .select('#edit-field-issue-component-und', 'settings_tray.module')
          .type('#edit-nodechanges-comment-comment-body-und-0-value', 'Changing to new <strong>settings_tray.module</strong> component. @drpal thanks for script help!')
          .click('.form-actions [value=Save]')
          .title()
          .then((result) => {
            console.log("changed: " + result);
            results.push(result);
            return results;
          })
      ))
    ), Promise.resolve([])).then(console.log);
  });
