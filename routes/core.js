var request = require('request-promise');
require("dotenv").config();
module.exports = 
    {core:core};

var github = {
    userid : null,

  getUser: function() {
    return request({
      "method":"GET", 
      "uri": "https://api.github.com/users/"+github.userid,
      "json": true,
      "headers": {
        'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64'),
        "User-Agent": "My little demo app"
      }
    });
  },
  
  getUserReposUrl: function(user) {
    return user.repos_url;
  },

  getPullsUrl: function(repo) {
    //console.log('getpullsurl'+repo.pulls_url);
    repo.pulls_url = repo.pulls_url.replace("{/number}","");
    return repo;
  },
  
  getUserRepos: function(uri, repos) {
    return request({
      "method": "GET",
      "uri": uri,
      "json": true,
      "resolveWithFullResponse": true,
      "headers": {
        'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64'),
        "User-Agent": "My little demo app"
      }
    }).then(function(response) {
      if (!repos) {
        repos = [];
      }
      repos = repos.concat(response.body);
      
      if(response.headers.link){
        if (response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) }).length > 0) {
        console.log("There is more.");
        var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) })[0])[1];
        return github.getUserRepos(next, repos);
      }
    }
      return repos;
    });
  },
  getOpenPullRequestsCount:function(repo){
    return request({
      "method": "GET",
      "uri": repo.pulls_url,
      "json": true,
      "resolveWithFullResponse": true,
      "headers": {
        'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64'),
        "User-Agent": "My little demo app"
      }
    }).then(function(response) {
      var opencount = response.body.length;
      repo["opencount"] = opencount;
      return repo;
    });
  },
}

function core(userid) {
  github.userid = userid;
  return github.getUser()
    .then(github.getUserReposUrl)
    .then(github.getUserRepos)
    .map(github.getPullsUrl)
    .map(github.getOpenPullRequestsCount);
    
}