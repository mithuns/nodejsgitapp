module.exports = 
    {   getPage:getPage};

var request = require("request");
require("dotenv").config();
var parse = require('parse-link-header');

var userurl = 'https://api.github.com/users/';

var links;

async function initialize(path) {
    // Setting URL and headers for request
    var options = {
        url: '',
        headers: {
            'Accept': '*/*',
            'User-Agent' : 'Mithun Singh',
            'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64')
         },
         method: 'GET',
         port:443
    };
    options.url =  path;
    
    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        var res =  request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                if(resp.headers.link)
                {
                    links=resp.headers.link;
                }
                resolve(JSON.parse(body));
            }
        })
    });
}

function getUserRepos(username,url='') {
    var path=''
    if(url){
        path = url;
    }else{
        path = userurl+username+'/repos?per_page=10&page=1';
    }
    return initialize(path);
}

   async function getUserOpenPRCount(pullurl){
    return initialize(pullurl);
}

  async function getPage(username,url=''){
    var result = [];
    var promiseA =   await getUserRepos(username,url);
    setLinksInResponse(links, result);
    for(var i=0;i<promiseA.length;i++){
        result[i] = new Object();
        result[i]["name"]  = promiseA[i].name;
        result[i]["html_url"] = promiseA[i].html_url;
        var promiseB =  await getUserOpenPRCount(getPullUrl(promiseA[i].pulls_url));
        if(promiseB){
            result[i]["open_pull_count"] =  promiseB.length;   
        }else{
            result[i]["open_pull_count"] = 0;
        }
    }
    return result;
}

function getPullUrl(fullurl){
    var index = fullurl.search('{/number}');
    return fullurl.substring(0,index);
}

function setLinksInResponse(links, result){
    if(links){
        try{
            var parsed = parse(links);
            if(parsed.prev){
                result["prevlink"] = parsed.prev.url;
            }else{
                result["prevlink"] = '';
            }
            if(parsed.next){
                result["nextlink"] = parsed.next.url;
            }else{
                result["nextlink"] = '';
            }
        }catch(error){
            console.log(error);
        }
    }    
}
