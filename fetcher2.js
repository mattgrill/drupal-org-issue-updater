const Nightmare = require('nightmare');
const DrupalAPI = require('drupal-org-api');
var config = require('./pass.json');

const nightmare = Nightmare({show: false});

nightmare
  .goto('https://www.drupal.org/user/login')
  .type('form#user-login #edit-name', config.username)
  .type('form#user-login #edit-pass', config.pass)
  .click('form#user-login [type=submit]')
  .wait('#user-user-full-group-profile-main')
  .goto('https://www.drupal.org/project/issues/search/drupal?project_issue_followers=&status%5B%5D=Open&version%5B%5D=8.x&component%5B%5D=outside_in.module&issue_tags_op=%3D')
  .evaluate(function () {
    var results = [];
    var elements = jQuery('.view-project-issue-search-project-searchapi .project-issue tbody .views-field-title a');
    elements.each(function (index, element) {
      results.push(element.href)
    });
    return results;
  })
  .then((urls) => {
    urls.reduce((accumulator, url) => (
      accumulator.then(results => (
        nightmare
          .goto(url)
          .wait('body')
          .select('#edit-field-issue-component-und', 'settings_tray.module')
          .type('#edit-nodechanges-comment-comment-body-und-0-value', 'Changing to new <strong>settings_tray.module</strong> component. @drpal thanks for script help! :)')
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
