const Nightmare = require('nightmare');
const config = require('./config.json');

const nightmare = Nightmare({ show: config.show_browser, typeInterval: 25 });


var nodegit = require("nodegit");
const strPath = "/Users/ted.bowman/Sites/octo-www/d8_2_ux";
var pathToRepo = require("path").resolve(strPath);
exec = require('child_process').exec;

nightmare
  .goto('https://www.drupal.org/user/login')
  .type('form#user-login #edit-name', config.username)
  .type('form#user-login #edit-pass', config.pass)
  .click('form#user-login [type=submit]')
  .wait('#user-user-full-group-profile-main')
  .goto(config.reroll_listing_url)
  .evaluate(() => {
    const results = [];
    const elements = jQuery(
      '.view-project-issue-search-project-searchapi .project-issue tbody .views-field-title a'
    );
    elements.each((index, element) => {
      results.push(element.href);
    });
    return results;
  })
  .then(urls => {
    urls
      .reduce(
        (accumulator, url) =>
          accumulator.then(results =>
            nightmare
              .goto(url)
              .wait('body')
              .select(config.dropdown_selector, config.dropdown_value)
              .evaluate(() => {
                const elements = jQuery('#extended-file-field-table-field-issue-files .extended-file-field-table-filename a');
                const results = [];
                elements.each((index, element) => {

                  const href = element.getAttribute('href');
                  if (href.endsWith('.patch') && !href.includes('do-not-test')) {
                    results.push(element.href);
                  }
                });
                return results[0];
              }
          ).then(href => {
              console.log(`${url} href ${href}`);
              exec(`wgit-apply.sh ${href}`, {cwd: strPath}, (err, stdout, stderr) => {
                if (err) {
                  // node couldn't execute the command
                  if (`${err}`.includes('Command failed: wgit-apply.sh')) {
                    console.log(`${url} needs reroll`);
                    // @todo Automatically add "Needs reroll" tag
                    return;
                  }
                  else {
                    console.log(`unknow error applying ${href}`);
                    process.exit(1);
                  }

                }
                if (stderr) {
                  console.log("stderr");
                  return;
                }
                // the *entire* stdout and stderr (buffered)
                console.log(`applied cleanly: ${href}`);
                // Remove patch
                exec(`git clean -fd && git reset --h`, {cwd: strPath}, (err, stdout, stderr) => {
                  if (err) {
                    // node couldn't execute the command
                    console.log(`couldnot reset: ${err}`);
                    process.exit(1);
                  }
                  if (stderr) {
                    console.log(`couldnot reset stderr: ${err}`);
                    process.exit(1);
                  }

                });
              });
            }),
        Promise.resolve([])
      ),
        Promise.resolve([])
      )
      //.then(console.log)
  });


// This code shows working directory changes similar to git status

/*exec('wgit-apply.sh https://www.drupal.org/files/issues/2897272-7.patch', {cwd: strPath}, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(`err: ${err}`);
    return;
  }
  if (stderr) {
    console.log("stderr");
    return;
  }
  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
});
nodegit.Repository.open(pathToRepo)
  .then(function(repo) {
    repo.getStatus().then(function(statuses) {
      function statusToText(status) {
        var words = [];
        if (status.isNew()) { words.push("NEW"); }
        if (status.isModified()) { words.push("MODIFIED"); }
        if (status.isTypechange()) { words.push("TYPECHANGE"); }
        if (status.isRenamed()) { words.push("RENAMED"); }
        if (status.isIgnored()) { words.push("IGNORED"); }

        return words.join(" ");
      }

      if (statuses.length === 0) {
        console.log("Clean");
      }
      else {
        console.log("dirty");
      }

      statuses.forEach(function(file) {
        console.log(file.path() + " " + statusToText(file));
      });
    });
  }).then(function () {
    console.log("here.");
}

);*/

/*NodeGit.Repository.open(pathToRepo).then(function (repo) {
  // This is the first function of the then which contains the successfully
  // calculated result of the promise
  console.log(repo);
  NodeGit.Status.file(repo, '').then(status => {
    console.log(status);
  });


})
  .catch(function (reasonForFailure) {
    // failure is handled here
    console.log(reasonForFailure);
  });*/


