const Nightmare = require('nightmare');
const config = require('./config.json');

const nightmare = Nightmare({show: config.show_browser, typeInterval: 25});

nightmare
  .goto('https://www.drupal.org/user/login')
  .type('form#user-login #edit-name', config.username)
  .type('form#user-login #edit-pass', config.pass)
  .click('form#user-login [type=submit]')
  .wait('#user-user-full-group-profile-main')
  .goto(config.listing_url)
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
          .select(config.dropdown_selector, config.dropdown_value)
          .type('#edit-nodechanges-comment-comment-body-und-0-value', config.change_message)
          .click('.form-actions [value=Save]')
          .wait('.messages.status')
          .title()
          .then((result) => {
            console.log("changed: " + result);
            results.push(result);
            return results;
          })
      ))
    ), Promise.resolve([])).then(console.log);

  });
