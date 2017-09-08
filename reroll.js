const config = require('./config.json');

const Nightmare = require('nightmare');
const exec = require('child_process').exec;

const nightmare = Nightmare({ show: config.show_browser, typeInterval: 25 });
const strPath = '/Users/ted.bowman/Sites/octo-www/d8_2_ux';

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
    urls.reduce(
      (accumulator, url) =>
        accumulator.then(
          () =>
            nightmare
              .goto(url)
              .wait('body')
              .select(config.dropdown_selector, config.dropdown_value)
              .evaluate(() => {
                const elements = jQuery(
                  '#extended-file-field-table-field-issue-files .extended-file-field-table-filename a'
                );
                const results = [];
                elements.each((index, element) => {
                  const href = element.getAttribute('href');
                  if (
                    href.endsWith('.patch') &&
                    !href.includes('do-not-test')
                  ) {
                    results.push(element.href);
                  }
                });
                return results[0];
              })
              .then(href => {
                console.log(`${url} href ${href}`);
                exec(
                  `wgit-apply.sh ${href}`,
                  { cwd: strPath },
                  (err, stdout, stderr) => {
                    if (err) {
                      // node couldn't execute the command
                      if (`${err}`.includes('Command failed: wgit-apply.sh')) {
                        console.log(`${url} needs reroll`);
                        // @todo Automatically add "Needs reroll" tag
                        // return;
                      } else {
                        console.log(`unknow error applying ${href}`);
                        process.exit(1);
                      }
                    }
                    if (stderr) {
                      console.log(stderr);
                      return;
                    }
                    // the *entire* stdout and stderr (buffered)
                    console.log(`applied cleanly: ${href}`);
                    // Remove patch
                    exec(
                      `git clean -fd && git reset --h`,
                      { cwd: strPath },
                      (err, stdout, stderr) => {
                        if (err) {
                          // node couldn't execute the command
                          console.log(`couldnot reset: ${err}`);
                          process.exit(1);
                        }
                        if (stderr) {
                          console.log(`couldnot reset stderr: ${err}`);
                          process.exit(1);
                        }
                      }
                    );
                  }
                );
              }),
          Promise.resolve([])
        ),
      Promise.resolve([])
    );
  });
