module.exports = gitmodule
var request = require("request");
require("dotenv").config();



function initialize(path) {
    // Setting URL and headers for request
    var options = {
        url: 'https://api.github.com/users/',
        headers: {
            'Accept': '*/*',
            'User-Agent' : 'Mithun Singh',
            'Authorization': 'Basic ' + new Buffer(process.env.username + ':' + process.env.password).toString('base64')
         },
         method: 'GET',
         port:443
    };
    options.url = options.url+ path;
    
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    });
}

function gitmodule(userid) {
    path = userid+'/repos';
    var initializePromise = initialize(path);
    return initializePromise;
}