var express = require('express');
var router = express.Router();
var repos = require('./core.js');


var title = 'HawkPR application'; 
var header='User Repository vs Pull Request Counts';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Please pick a user');
});

router.get('/:userid',  async(req, res, next) =>{
  try{
    var userrepodata =   [];
    await repos.core(req.params.userid).then(function(results){
      userrepodata = results.sort(sortByOpenPullCount);
    });
    
    res.render("layout", {
        title: title,
        header: header,
        userrepodata:userrepodata
      });
  }catch (err){
    process.stdout.write(err);
    next(err);
  }  
});

module.exports = router;

function sortByOpenPullCount (repoA, repoB){
  return repoB['opencount'] - repoA['opencount'];
}