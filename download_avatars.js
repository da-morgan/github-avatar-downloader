//Requirements
var request = require('request');
var fs = require('fs');
var secrets = require('./secrets.js');

//Welcome Message
console.log('Welcome to the GitHub Avatar Downloader!\n');

//Function that gets JSON Strings and parses them to objects. Passes them into a cb function.
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

//Function to download an image from its URL and save it to a file path.
function downloadImageByURL(url, filePath) {
  request(url)
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    //console.log('Status code ' + response);
  })
  .pipe(fs.createWriteStream(filePath));
}

//Checks to make sure user input is correct then runs code to download images from a repository given user input.
if(process.argv.length != 4) {
  console.log("Please enter a valid owner and a repository.");
  console.log("Desired format: <owner>, <repository>");
} else {
  getRepoContributors(process.argv[2], process.argv[3], function(err, result) {

    if(result.message == "Not Found"){
      console.log("Please enter a valid repository.");
      return;
    }
    //Notifies user of error
    if(err){
      //console.log("error: " + err);
      console.log("Whoops! Something went wrong.");
      return;
    }

    for(var i = 0; i < result.length; i++){
      //console.log("Result:", result[i].avatar_url);
      console.log("Downloading avatar #" + (i+1) + " now.");
      downloadImageByURL(result[i].avatar_url, "./avatars/" + result[i].login + ".jpeg");
    }

    console.log("\nSuccessfully downloaded " + result.length + " avatars from " +
      process.argv[2] + "'s " + process.argv[3] + " repository");
    console.log("Thanks for using Github Avatar Downloader!\n");

  });

}
