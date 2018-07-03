var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HawkPR application' , 
                                  usage1:'This app lets people know how many pull requests are open on a given user\'s repositories.',
                                  usage2:'simply hit the url with /users/username'});
});

module.exports = router;