var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });
var readlineSync = require('readline-sync');


//var pass = readlineSync.question('May I have your pass? ');
nightmare
  .goto('https://www.drupal.org/user/login')
  .type('form#user-login #edit-name', 'tedbow')
  .type('form#user-login #edit-pass', 'n3w00g13')
  .click('form#user-login [type=submit]')
  .wait('#user-user-full-group-profile-main')
  .evaluate(function () {
    console.log(document.querySelector('#page-title').textContent);


  })
  .end()
  .then(function (result) {
    //console.log(result)
    nightmare.goto('https://www.drupal.org/project/issues/search/drupal?project_issue_followers=&version%5B%5D=8.x&component%5B%5D=outside_in.module&issue_tags_op=%3D').wait('.bkdkd');
    setTimeout(function() {
      console.log('Blah blah blah blah extra-blah');
    }, 3000);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });

//nightmare.goto('https://www.drupal.org/project/issues/search/drupal?project_issue_followers=&version%5B%5D=8.x&component%5B%5D=outside_in.module&issue_tags_op=%3D');
