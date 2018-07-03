var express = require('express');
var router = express.Router();
var repos = require('./repos.js');


var title = 'HawkPR application'; 
var header='User Repository vs Pull Request Counts';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Please pick a user');
});

router.get('/prev', async(req, res, next) =>{
  try{
    var prevlink = req.query.prevlink;
    prevlink = decodeURI(prevlink);
    var userrepodata =  await repos.getPage('',prevlink);
    
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

router.get('/next', async(req, res, next)=> {
  try{
    var nextlink = req.query.nextlink;
    nextlink = decodeURI(nextlink);
    console.log(nextlink);
    var userrepodata =  await repos.getPage('',nextlink);
    
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

router.get('/:userid',  async (req, res, next) =>{
  try{
    var userrepodata =  await repos.getPage(req.params.userid);
    
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

function getData(userid, url){
  
}

module.exports = router;
