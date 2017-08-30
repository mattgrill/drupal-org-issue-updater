var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });



var config = require('./pass.json');


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
    //nightmare.goto('https://www.drupal.org/project/issues/search/drupal?project_issue_followers=&version%5B%5D=8.x&component%5B%5D=outside_in.module&issue_tags_op=%3D').wait('.bkdkd');


  })
  //.end()
  .then(function (result) {
    console.log(result)
    result.forEach(function (url) {
      nightmare.goto(url);

    });
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });

nightmare.goto('https://www.drupal.org/project/issues/search/drupal?project_issue_followers=&version%5B%5D=8.x&component%5B%5D=outside_in.module&issue_tags_op=%3D').wait('.bkdkd');;
