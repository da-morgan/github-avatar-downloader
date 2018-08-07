
var request = require('request');
var fs = require('fs');
var secrets = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors (repoOwner, repoName, cb){
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request(url)
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    console.log('Status code ' + response);
  })
  .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  console.log("Errors:", err);

  for(var i = 0; i < result.length; i++){
    console.log("Result:", result[i].avatar_url);
    downloadImageByURL(result[i].avatar_url, "./avatars/" + result[i].login + ".jpeg");
  }

});