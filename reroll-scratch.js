/**
 * Created by ted.bowman on 9/8/17.
 */

var nodegit = require("nodegit");
const strPath = "/Users/ted.bowman/Sites/octo-www/d8_2_ux";
var pathToRepo = require("path").resolve(strPath);
exec = require('child_process').exec;

// This code shows working directory changes similar to git status

exec('wgit-apply.sh https://www.drupal.org/files/issues/2897272-7.patch', {cwd: strPath}, (err, stdout, stderr) => {
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

);

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


